import {
  SmartContract,
  state,
  State,
  Field,
  method,
  DeployArgs,
  Permissions,
  UInt64,
  PublicKey,
  Signature,
  Provable,
} from "o1js";

import { BasicTokenContract } from "./BasicTokenContract.js";

export class PairContract extends SmartContract {
  @state(Field) treeRoot = State<Field>();
  /**
   * state that keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
   *
   * total supply is initially zero; it increases when supplying liquidity and decreases when redeeming it
   */
  @state(UInt64) totalSupply = State<UInt64>();

  @state(PublicKey) tokenX = State<PublicKey>();
  @state(PublicKey) tokenY = State<PublicKey>();

  deploy(args?: DeployArgs) {
    super.deploy(args);

    const permissionToEdit = Permissions.proof();

    this.account.permissions.set({
      ...Permissions.default(),
      editState: permissionToEdit,
      setTokenSymbol: permissionToEdit,
      send: permissionToEdit,
      receive: permissionToEdit,
    });
  }

  init() {
    super.init();
    this.totalSupply.set(UInt64.zero);
  }

  /**
   * Initialize Token Addresses
   * @param _tokenX X token public key
   * @param _tokenY Y token public key
   */
  @method initTokenAddresses(
    _tokenX: PublicKey,
    _tokenY: PublicKey
    //adminSignature: Signature
  ) {
    this.account.provedState.requireEquals(this.account.provedState.get());
    this.account.provedState.get().assertFalse();

    //adminSignature.verify(this.address, this.address.toFields()).assertTrue();

    this.tokenX.getAndRequireEquals();
    this.tokenY.getAndRequireEquals();

    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
  }

  // change to user address *mapping*
  // probably something like a merkle map
  @method mintLiquidityToken(dl: UInt64) {
    // access balances
    // change balances for a user
    // implement admin check
    let { tokenX, tokenY } = this.initTokens();

    let { dexX, dexY } = this.dexTokensBalance(tokenX, tokenY);

    dexX.assertGreaterThan(UInt64.zero);
    dexY.assertGreaterThan(UInt64.zero);

    let liquidity = this.totalSupply.getAndRequireEquals();
    let user = this.sender;

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
   * Helper which creates instances of tokenX and tokenY
   */
  initTokens(): {
    tokenX: BasicTokenContract;
    tokenY: BasicTokenContract;
  } {
    const tokenXPub = this.tokenX.getAndRequireEquals();
    const tokenYPub = this.tokenY.getAndRequireEquals();

    let tokenX = new BasicTokenContract(tokenXPub);
    let tokenY = new BasicTokenContract(tokenYPub);
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
