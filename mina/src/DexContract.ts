import {
  Account,
  method,
  AccountUpdate,
  PublicKey,
  SmartContract,
  UInt64,
  Struct,
  State,
  state,
  TokenId,
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

  /**
   * Initialization. _All_ permissions are set to impossible except the explicitly required permissions.
   */
  init() {
    super.init();

    let proof = Permissions.proof();
    this.account.permissions.set({
      ...Permissions.allImpossible(),
      access: proof,
      editState: proof,
      editActionState: proof,
      send: proof,
    });
  }

  @method initTokenAddresses(_tokenX: PublicKey, _tokenY: PublicKey) {
    this.tokenX.assertEquals(
      PublicKey.from({ x: Field.from(""), isOdd: new Bool(false) })
    );
    this.tokenY.assertEquals(
      PublicKey.from({ x: Field.from(""), isOdd: new Bool(false) })
    );
    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
  }

  /**
   * Mint liquidity tokens in exchange for X and Y tokens
   * @param dx input amount of X tokens
   * @param dy input amount of Y tokens
   * @return output amount of lqXY tokens
   *
   * This function fails if the X and Y token amounts don't match the current X/Y ratio in the pool.
   * This can also be used if the pool is empty. In that case, there is no check on X/Y;
   * instead, the input X and Y amounts determine the initial ratio.
   */
  @method supplyLiquidityBase(dx: UInt64, dy: UInt64): UInt64 {
    let user = this.sender;

    let tokenX = new BasicTokenContract(this.tokenX.getAndAssertEquals());
    let tokenY = new BasicTokenContract(this.tokenY.getAndAssertEquals());

    // get balances of X and Y token

    let dexX = tokenX.balanceOf(this.address);
    let dexY = tokenY.balanceOf(this.address);

    // // assert dy === [dx * y/x], or x === 0
    let isXZero = dexX.equals(UInt64.zero);
    let xSafe = Provable.if(isXZero, UInt64.one, dexX);

    let isDyCorrect = dy.equals(dx.mul(dexY).div(xSafe));
    isDyCorrect.or(isXZero).assertTrue();

    tokenX.transfer(user, this.address, dx);
    tokenY.transfer(user, this.address, dy);

    // calculate liquidity token output simply as dl = dx + dy
    // => maintains ratio x/l, y/l

    let dl = dy.add(dx);
    this.token.mint({ address: user, amount: dl });

    // update l supply
    let l = this.totalSupply.getAndAssertEquals();
    this.totalSupply.set(l.add(dl));

    return dl;
  }

  /**
   * Mint liquidity tokens in exchange for X and Y tokens
   * @param dx input amount of X tokens
   * @return output amount of lqXY tokens
   *
   * This uses supplyLiquidityBase as the circuit, but for convenience,
   * the input amount of Y tokens is calculated automatically from the X tokens.
   * Fails if the liquidity pool is empty, so can't be used for the first deposit.
   */
  supplyLiquidity(dx: UInt64): UInt64 {
    // calculate dy outside circuit
    let x = Account(
      this.address,
      TokenId.derive(this.tokenX.get())
    ).balance.get();
    let y = Account(
      this.address,
      TokenId.derive(this.tokenY.get())
    ).balance.get();
    if (x.value.isConstant() && x.value.isZero().toBoolean()) {
      throw Error(
        "Cannot call `supplyLiquidity` when reserves are zero. Use `supplyLiquidityBase`."
      );
    }
    let dy = dx.mul(y).div(x);
    return this.supplyLiquidityBase(dx, dy);
  }

  /**
   * Burn liquidity tokens to get back X and Y tokens
   * @param dl input amount of lqXY token
   *
   * The transaction needs to be signed by the user's private key.
   *
   * NOTE: this does not give back tokens in return for liquidity right away.
   * to get back the tokens, you have to call {@link DexTokenHolder}.redeemFinalize()
   * on both token holder contracts, after `redeemInitialize()` has been accepted into a block.
   *
   * @emits RedeemAction - action on the Dex account that will make the token holder
   * contracts pay you tokens when reducing the action.
   */
  @method redeemInitialize(dl: UInt64) {
    this.reducer.dispatch(new RedeemAction({ address: this.sender, dl }));
    this.token.burn({ address: this.sender, amount: dl });
    // TODO: preconditioning on the state here ruins concurrent interactions,
    // there should be another `finalize` DEX method which reduces actions & updates state
    this.totalSupply.set(this.totalSupply.getAndAssertEquals().sub(dl));
  }

  /**
   * Helper for `DexTokenHolder.redeemFinalize()` which adds preconditions on
   * the current action state and token supply
   */
  @method assertActionsAndSupply(actionState: Field, totalSupply: UInt64) {
    this.account.actionState.assertEquals(actionState);
    this.totalSupply.assertEquals(totalSupply);
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
    let tokenY = new BasicTokenContract(this.tokenY.getAndAssertEquals());
    let dexY = new DexTokenHolder(this.address, tokenY.token.id);
    let dy = dexY.swap(this.sender, dx, this.tokenX.getAndAssertEquals());
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
  @state(Field) redeemActionState = State<Field>();
  static redeemActionBatchSize = 5;

  init() {
    super.init();
    this.redeemActionState.set(Reducer.initialActionState);
  }

  @method redeemLiquidityFinalize() {
    // get redeem actions
    let dex = new Dex(this.address);
    let fromActionState = this.redeemActionState.getAndAssertEquals();
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
    let x = this.account.balance.getAndAssertEquals();

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
    let x = dexX.account.balance.getAndAssertEquals();
    let y = this.account.balance.getAndAssertEquals();

    // send x from user to us (i.e., to the same address as this but with the other token)
    tokenX.transfer(user, dexX, dx);

    // compute and send dy
    let dy = y.mul(dx).div(x.add(dx));
    // just subtract dy balance and let adding balance be handled one level higher
    this.balance.subInPlace(dy);
    return dy;
  }
}
