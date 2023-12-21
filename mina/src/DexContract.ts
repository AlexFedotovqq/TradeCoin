import {
  method,
  AccountUpdate,
  PublicKey,
  SmartContract,
  UInt64,
  Struct,
  State,
  state,
  Reducer,
  Field,
  Permissions,
  Provable,
  Bool,
} from "o1js";

import { BasicTokenContract } from "./BasicTokenContract.js";

export { Dex, DexTokenHolder };

class RedeemAction extends Struct({ address: PublicKey, dl: UInt64 }) {}

class Dex extends SmartContract {
  @state(PublicKey) tokenX = State<PublicKey>();
  @state(PublicKey) tokenY = State<PublicKey>();

  /**
   * state that keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
   *
   * total supply is initially zero; it increases when supplying liquidity and decreases when redeeming it
   */
  @state(UInt64) totalSupply = State<UInt64>();

  /**
   * redeeming liquidity is a 2-step process leveraging actions, to get past the account update limit
   */
  reducer = Reducer({ actionType: RedeemAction });
  supplyReducer = Reducer({ actionType: RedeemAction });

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
  }

  @method supplyTokenY(dy: UInt64) {
    let user = this.sender;
    let tokenY = new BasicTokenContract(this.tokenY.getAndRequireEquals());
    tokenY.transfer(user, this.address, dy);
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

    let { tokenX, tokenY } = this.initTokens();

    // calculate ratios
    tokenX.transfer(this.address, user, dl.div(2));
    tokenY.transfer(this.address, user, dl.div(2));

    this.token.burn({ address: this.sender, amount: dl });

    this.totalSupply.set(this.totalSupply.getAndRequireEquals().sub(dl));
  }

  @method swapXforY(tokenAmountIn: UInt64) {
    let user = this.sender;

    let { tokenX, tokenY } = this.initTokens();

    let { dexX, dexY } = this.dexTokensBalance(tokenX, tokenY);

    // check amm function to calculate outputs
    let dy = dexY.mul(tokenAmountIn).div(dexX.add(tokenAmountIn));
    dy.assertGreaterThanOrEqual(UInt64.from(1));

    tokenY.transfer(user, this.address, tokenAmountIn);

    tokenX.transfer(this.address, user, dy);
    // add balances?
  }

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

  /**
   * Helper for `DexTokenHolder.redeemFinalize()` which adds preconditions on
   * the current action state and token supply
   */
  @method assertActionsAndSupply(actionState: Field, totalSupply: UInt64) {
    this.account.actionState.requireEquals(actionState);
    this.totalSupply.requireEquals(totalSupply);
  }

  /**
   * Swap X tokens for Y tokens
   * @param dx input amount of X tokens
   * @return output amount Y tokens
   *
   * The transaction needs to be signed by the user's private key.
   *
   * Note: this is not a `@method`, since it doesn't do anything beyond
   * the called methods which requires proof authorization.
   */
  swapX(dx: UInt64): UInt64 {
    let tokenY = new BasicTokenContract(this.tokenY.getAndRequireEquals());
    let dexY = new DexTokenHolder(this.address, tokenY.token.id);
    let dy = dexY.swap(this.sender, dx, this.tokenX.getAndRequireEquals());
    tokenY.approveUpdateAndSend(dexY.self, this.sender, dy);
    return dy;
  }

  /**
   * Swap Y tokens for X tokens
   * @param dy input amount of Y tokens
   * @return output amount Y tokens
   *
   * The transaction needs to be signed by the user's private key.
   *
   * Note: this is not a `@method`, since it doesn't do anything beyond
   * the called methods which requires proof authorization.
   */
  swapY(dy: UInt64): UInt64 {
    let tokenX = new BasicTokenContract(this.tokenX.get());
    let dexX = new DexTokenHolder(this.address, tokenX.token.id);
    let dx = dexX.swap(this.sender, dy, this.tokenY.get());
    tokenX.approveUpdateAndSend(dexX.self, this.sender, dx);
    return dx;
  }
}

class DexTokenHolder extends SmartContract {
  @state(Field) supplyActionState = State<Field>();
  @state(Field) redeemActionState = State<Field>();
  static redeemActionBatchSize = 5;

  init() {
    super.init();
    this.supplyActionState.set(Reducer.initialActionState);
    this.redeemActionState.set(Reducer.initialActionState);
  }

  @method redeemLiquidityFinalize() {
    // get redeem actions
    let dex = new Dex(this.address);
    let fromActionState = this.redeemActionState.getAndRequireEquals();
    let actions = dex.reducer.getActions({ fromActionState });

    // get total supply of liquidity tokens _before_ applying these actions
    // (each redeem action _decreases_ the supply, so we increase it here)
    let l = Provable.witness(UInt64, (): UInt64 => {
      let l = dex.totalSupply.get().toBigInt();
      // dex.totalSupply.assertNothing();
      for (let [action] of actions) {
        l += action.dl.toBigInt();
      }
      return UInt64.from(l);
    });

    // get our token balance
    let x = this.account.balance.getAndRequireEquals();

    let redeemActionState = dex.reducer.forEach(
      actions,
      ({ address, dl }) => {
        // for every user that redeemed liquidity, we calculate the token output
        // and create a child account update which pays the user
        let dx = x.mul(dl).div(l);
        let receiver = this.send({ to: address, amount: dx });
        // note: this should just work when the reducer gives us dummy data

        // important: these child account updates inherit token permission from us
        receiver.body.mayUseToken = AccountUpdate.MayUseToken.InheritFromParent;

        // update l and x accordingly
        l = l.sub(dl);
        x = x.add(dx);
      },
      fromActionState,
      {
        maxTransactionsWithActions: DexTokenHolder.redeemActionBatchSize,
        // DEX contract doesn't allow setting preconditions from outside (= w/o proof)
        skipActionStatePrecondition: true,
      }
    );

    // update action state so these payments can't be triggered a 2nd time
    this.redeemActionState.set(redeemActionState);

    // precondition on the DEX contract, to prove we used the right actions & token supply
    dex.assertActionsAndSupply(redeemActionState, l);
  }

  // this works for both directions (in our case where both tokens use the same contract)
  @method swap(
    user: PublicKey,
    otherTokenAmount: UInt64,
    otherTokenAddress: PublicKey
  ): UInt64 {
    // we're writing this as if our token === y and other token === x
    let dx = otherTokenAmount;
    let tokenX = new BasicTokenContract(otherTokenAddress);

    // get balances of X and Y token
    let dexX = AccountUpdate.create(this.address, tokenX.token.id);
    let x = dexX.account.balance.getAndRequireEquals();
    let y = this.account.balance.getAndRequireEquals();

    // send x from user to us (i.e., to the same address as this but with the other token)
    tokenX.transfer(user, dexX, dx);

    // compute and send dy
    let dy = y.mul(dx).div(x.add(dx));
    // just subtract dy balance and let adding balance be handled one level higher
    this.balance.subInPlace(dy);
    return dy;
  }
}
