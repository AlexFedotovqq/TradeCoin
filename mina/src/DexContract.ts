import {
  method,
  PublicKey,
  SmartContract,
  UInt64,
  State,
  state,
  Field,
  Permissions,
  Bool,
} from "o1js";

import { BasicTokenContract } from "./BasicTokenContract.js";

export { Dex };

class Dex extends SmartContract {
  @state(PublicKey) tokenX = State<PublicKey>();
  @state(PublicKey) tokenY = State<PublicKey>();

  /**
   * state that keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
   *
   * total supply is initially zero; it increases when supplying liquidity and decreases when redeeming it
   */
  @state(UInt64) totalSupply = State<UInt64>();

  @state(UInt64) Xbalance = State<UInt64>();
  @state(UInt64) Ybalance = State<UInt64>();

  /**
   * redeeming liquidity is a 2-step process leveraging actions, to get past the account update limit
   */
  //reducer = Reducer({ actionType: RedeemAction });
  //supplyReducer = Reducer({ actionType: RedeemAction });

  /**
   * Initialization. _All_ permissions are set to impossible except the explicitly required permissions.
   */
  init() {
    super.init();

    let proof = Permissions.proof();

    this.account.permissions.set({
      ...Permissions.default(),
      access: proof,
      editState: proof,
      editActionState: proof,
      send: proof,
      incrementNonce: proof,
    });
  }

  /**
   * Initialize Token Addresses
   * @param _tokenX X token public key
   * @param _tokenY Y token public key
   */
  @method initTokenAddresses(_tokenX: PublicKey, _tokenY: PublicKey) {
    this.tokenX.requireEquals(
      PublicKey.from({ x: Field.from(""), isOdd: new Bool(false) })
    );
    this.tokenY.requireEquals(
      PublicKey.from({ x: Field.from(""), isOdd: new Bool(false) })
    );
    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
  }

  @method supplyTokenX(dx: UInt64) {
    let user = this.sender;
    let tokenX = new BasicTokenContract(this.tokenX.getAndRequireEquals());
    tokenX.transfer(user, this.address, dx);

    let Xbalance = this.Xbalance.getAndRequireEquals();
    Xbalance = Xbalance.add(dx);
    this.Xbalance.set(Xbalance);
  }

  @method supplyTokenY(dy: UInt64) {
    let user = this.sender;
    let tokenY = new BasicTokenContract(this.tokenY.getAndRequireEquals());
    tokenY.transfer(user, this.address, dy);

    let Ybalance = this.Ybalance.getAndRequireEquals();
    Ybalance = Ybalance.add(dy);
    this.Ybalance.set(Ybalance);
  }

  // change to user address *mapping*
  // probably something like a merkle map
  @method mintLiquidityToken(dl: UInt64) {
    // more checks
    // access balances
    // change balances for a user
    let user = this.sender;

    let { tokenX, tokenY } = this.initTokens();

    let { dexX, dexY } = this.dexTokensBalance(tokenX, tokenY);

    dexX.assertGreaterThan(UInt64.zero);
    dexY.assertGreaterThan(UInt64.zero);

    let liquidity = this.totalSupply.getAndRequireEquals();

    // how do we verify that user sent tokens?
    // we update merkle tree balances in x and y supplies
    // essentially, reedeming the balances here
    // potentially available for sandwitch attacks )))
    // we should supply merkle leaf associated with index being user's address
    // also store merkle map root

    this.token.mint({ address: user, amount: dl });

    // update liquidity supply

    this.totalSupply.set(liquidity.add(dl));
  }

  /**
   * Burn liquidity tokens to get back X and Y tokens
   * @param dl input amount of lqXY token
   *
   * The transaction needs to be signed by the user's private key.
   * Works with ZK app pk only atm
   *
   **/
  @method redeem(dl: UInt64) {
    // add checks
    let user = this.sender;

    let Xbalance = this.Xbalance.getAndRequireEquals();
    let Ybalance = this.Ybalance.getAndRequireEquals();

    let { tokenX, tokenY } = this.initTokens();

    // calculate ratios
    tokenX.transfer(this.address, user, dl.div(2));
    tokenY.transfer(this.address, user, dl.div(2));

    Xbalance = Xbalance.sub(dl.div(2));
    this.Xbalance.set(Xbalance);

    Ybalance = Ybalance.sub(dl.div(2));
    this.Ybalance.set(Ybalance);

    this.token.burn({ address: this.sender, amount: dl });

    this.totalSupply.set(this.totalSupply.getAndRequireEquals().sub(dl));
  }

  @method swapXforY(dx: UInt64) {
    let user = this.sender;

    let tokenX = new BasicTokenContract(this.tokenX.getAndRequireEquals());

    let Xbalance = this.Xbalance.getAndRequireEquals();
    let Ybalance = this.Ybalance.getAndRequireEquals();

    let dy = dx.mul(Xbalance).div(Xbalance.add(dx));
    dy.assertGreaterThanOrEqual(UInt64.from(1));

    tokenX.transfer(user, this.address, dx);

    Xbalance = Xbalance.add(dx);
    this.Xbalance.set(Xbalance);

    // add merkle map

    //tokenY.transfer(this.address, user, dy);
    Ybalance = Ybalance.sub(dy);
    this.Ybalance.set(Ybalance);
  }

  // add Y for X

  /**
   * Helper which creates instances of tokenX and tokenY
   */
  initTokens(): {
    tokenX: BasicTokenContract;
    tokenY: BasicTokenContract;
  } {
    let tokenX = new BasicTokenContract(this.tokenX.getAndRequireEquals());
    let tokenY = new BasicTokenContract(this.tokenY.getAndRequireEquals());
    return { tokenX, tokenY };
  }

  /**
   * Helper which queries app balances of tokenX and tokenY
   */
  dexTokensBalance(
    tokenX: BasicTokenContract,
    tokenY: BasicTokenContract
  ): { dexX: UInt64; dexY: UInt64 } {
    let dexX = tokenX.balanceOf(this.address);
    let dexY = tokenY.balanceOf(this.address);
    return { dexX, dexY };
  }
}
