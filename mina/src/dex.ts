import {
  Account,
  Bool,
  Circuit,
  DeployArgs,
  Field,
  Int64,
  isReady,
  method,
  Mina,
  AccountUpdate,
  Permissions,
  PrivateKey,
  PublicKey,
  SmartContract,
  UInt64,
  VerificationKey,
  Struct,
  State,
  state,
  UInt32,
  TokenId,
  Provable,
} from "o1js";

export { createDex, TokenContract, keys, addresses, tokenIds, randomAccounts };

class UInt64x2 extends Struct([UInt64, UInt64]) {}

function createDex({
  lockedLiquiditySlots,
}: { lockedLiquiditySlots?: number } = {}) {
  class Dex extends SmartContract {
    // addresses of token contracts are constants
    tokenX = addresses.tokenX;
    tokenY = addresses.tokenY;

    /**
     * state which keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
     *
     * total supply is zero initially; it increases when supplying liquidity and decreases when redeeming it
     */
    @state(UInt64) totalSupply = State<UInt64>();

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
      let tokenX = new TokenContract(this.tokenX);
      let tokenY = new TokenContract(this.tokenY);

      // get balances of X and Y token
      // TODO: this creates extra account updates. we need to reuse these by passing them to or returning them from transfer()
      // but for that, we need the @method argument generalization
      let dexXUpdate = AccountUpdate.create(this.address, tokenX.token.id);
      let dexXBalance = dexXUpdate.account.balance.getAndAssertEquals();

      let dexYUpdate = AccountUpdate.create(this.address, tokenY.token.id);
      let dexYBalance = dexYUpdate.account.balance.getAndAssertEquals();

      // // assert dy === [dx * y/x], or x === 0
      let isXZero = dexXBalance.equals(UInt64.zero);
      let xSafe = Provable.if(isXZero, UInt64.one, dexXBalance);
      let isDyCorrect = dy.equals(dx.mul(dexYBalance).div(xSafe));
      isDyCorrect.or(isXZero).assertTrue();

      tokenX.transfer(user, dexXUpdate, dx);
      tokenY.transfer(user, dexYUpdate, dy);

      // calculate liquidity token output simply as dl = dx + dx
      // => maintains ratio x/l, y/l
      let dl = dy.add(dx);
      let userUpdate = this.token.mint({ address: user, amount: dl });
      if (lockedLiquiditySlots !== undefined) {
        /**
         * exercise the "timing" (vesting) feature to lock the received liquidity tokens.
         *
         * THIS IS HERE FOR TESTING!
         *
         * In reality, the timing feature is a bit awkward to use for time-locking liquidity tokens.
         * That's because, if there is currently a vesting schedule on an account, we can't modify it.
         * Thus, a liquidity provider would need to wait for their current tokens to unlock before being able to
         * supply liquidity again (or, create another account to supply liquidity from).
         */
        let amountLocked = dl;
        userUpdate.account.timing.set({
          initialMinimumBalance: amountLocked,
          cliffAmount: amountLocked,
          cliffTime: UInt32.from(lockedLiquiditySlots),
          vestingIncrement: UInt64.zero,
          vestingPeriod: UInt32.one,
        });
        userUpdate.requireSignature();
      }

      // update l supply
      let l = this.totalSupply.get();
      this.totalSupply.assertEquals(l);
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
      let x = Account(this.address, TokenId.derive(this.tokenX)).balance.get();
      let y = Account(this.address, TokenId.derive(this.tokenY)).balance.get();
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
     * @return output amount of X and Y tokens, as a tuple [outputX, outputY]
     *
     * The transaction needs to be signed by the user's private key.
     *
     * Note: this is not a `@method` because there's nothing to prove which isn't already proven
     * by the called methods
     */
    redeemLiquidity(dl: UInt64) {
      // call the token X holder inside a token X-approved callback
      let tokenX = new TokenContract(this.tokenX);
      let dexX = new DexTokenHolder(this.address, tokenX.token.id);
      let dxdy = dexX.redeemLiquidity(this.sender, dl, this.tokenY);
      let dx = dxdy[0];
      tokenX.approveUpdateAndSend(dexX.self, this.sender, dx);
      return dxdy;
    }

    /**
     * Swap X tokens for Y tokens
     * @param dx input amount of X tokens
     * @return output amount Y tokens
     *
     * The transaction needs to be signed by the user's private key.
     */
    @method swapX(dx: UInt64): UInt64 {
      let tokenY = new TokenContract(this.tokenY);
      let dexY = new DexTokenHolder(this.address, tokenY.token.id);
      let dy = dexY.swap(this.sender, dx, this.tokenX);
      tokenY.approveUpdateAndSend(dexY.self, this.sender, dy);
      return dy;
    }

    /**
     * Swap Y tokens for X tokens
     * @param dy input amount of Y tokens
     * @return output amount Y tokens
     *
     * The transaction needs to be signed by the user's private key.
     */
    @method swapY(dy: UInt64): UInt64 {
      let tokenX = new TokenContract(this.tokenX);
      let dexX = new DexTokenHolder(this.address, tokenX.token.id);
      let dx = dexX.swap(this.sender, dy, this.tokenY);
      tokenX.approveUpdateAndSend(dexX.self, this.sender, dx);
      return dx;
    }

    /**
     * helper method to approve burning of user's liquidity.
     * this just burns user tokens, so there is no incentive to call this directly.
     * instead, the dex token holders call this and in turn pay back tokens.
     *
     * @param user caller address
     * @param dl input amount of lq tokens
     * @returns total supply of lq tokens _before_ burning dl, so that caller can calculate how much dx / dx to returns
     *
     * The transaction needs to be signed by the user's private key.
     */
    @method burnLiquidity(user: PublicKey, dl: UInt64): UInt64 {
      // this makes sure there is enough l to burn (user balance stays >= 0), so l stays >= 0, so l was >0 before
      this.token.burn({ address: user, amount: dl });
      let l = this.totalSupply.get();
      this.totalSupply.assertEquals(l);
      this.totalSupply.set(l.sub(dl));
      return l;
    }

    @method transfer(from: PublicKey, to: PublicKey, amount: UInt64) {
      this.token.send({ from, to, amount });
    }
  }

  class ModifiedDex extends Dex {
    @method swapX(dx: UInt64): UInt64 {
      let tokenY = new TokenContract(this.tokenY);
      let dexY = new ModifiedDexTokenHolder(this.address, tokenY.token.id);
      let dy = dexY.swap(this.sender, dx, this.tokenX);
      tokenY.approveUpdateAndSend(dexY.self, this.sender, dy);
      return dy;
    }
  }

  class DexTokenHolder extends SmartContract {
    // simpler circuit for redeeming liquidity -- direct trade between our token and lq token
    // it's incomplete, as it gives the user only the Y part for an lqXY token; but doesn't matter as there's no incentive to call it directly
    // see the more complicated method `redeemLiquidity` below which gives back both tokens, by calling this method,
    // for the other token, in a callback
    @method redeemLiquidityPartial(user: PublicKey, dl: UInt64): UInt64x2 {
      // user burns dl, approved by the Dex main contract
      let dex = new Dex(addresses.dex);
      let l = dex.burnLiquidity(user, dl);

      // in return, we give dy back
      let y = this.account.balance.get();
      this.account.balance.assertEquals(y);
      // we can safely divide by l here because the Dex contract logic wouldn't allow burnLiquidity if not l>0
      let dy = y.mul(dl).div(l);
      // just subtract the balance, user gets their part one level higher
      this.balance.subInPlace(dy);

      // be approved by the token owner parent
      this.self.body.mayUseToken = AccountUpdate.MayUseToken.ParentsOwnToken;

      // return l, dy so callers don't have to walk their child account updates to get it
      return [l, dy];
    }

    // more complicated circuit, where we trigger the Y(other)-lqXY trade in our child account updates and then add the X(our) part
    @method redeemLiquidity(
      user: PublicKey,
      dl: UInt64,
      otherTokenAddress: PublicKey
    ): UInt64x2 {
      // first call the Y token holder, approved by the Y token contract; this makes sure we get dl, the user's lqXY
      let tokenY = new TokenContract(otherTokenAddress);
      let dexY = new DexTokenHolder(this.address, tokenY.token.id);
      let result = dexY.redeemLiquidityPartial(user, dl);
      let l = result[0];
      let dy = result[1];
      tokenY.approveUpdateAndSend(dexY.self, user, dy);

      // in return for dl, we give back dx, the X token part
      let x = this.account.balance.get();
      this.account.balance.assertEquals(x);
      let dx = x.mul(dl).div(l);
      // just subtract the balance, user gets their part one level higher
      this.balance.subInPlace(dx);

      return [dx, dy];
    }

    // this works for both directions (in our case where both tokens use the same contract)
    @method swap(
      user: PublicKey,
      otherTokenAmount: UInt64,
      otherTokenAddress: PublicKey
    ): UInt64 {
      // we're writing this as if our token === y and other token === x
      let dx = otherTokenAmount;
      let tokenX = new TokenContract(otherTokenAddress);
      // get balances
      let x = tokenX.getBalance(this.address);
      let y = this.account.balance.get();
      this.account.balance.assertEquals(y);
      // send x from user to us (i.e., to the same address as this but with the other token)
      tokenX.transfer(user, this.address, dx);
      // compute and send dy
      let dy = y.mul(dx).div(x.add(dx));
      // just subtract dy balance and let adding balance be handled one level higher
      this.balance.subInPlace(dy);
      return dy;
    }
  }

  class ModifiedDexTokenHolder extends DexTokenHolder {
    /**
     * This swap method has a slightly changed formula
     */
    @method swap(
      user: PublicKey,
      otherTokenAmount: UInt64,
      otherTokenAddress: PublicKey
    ): UInt64 {
      let dx = otherTokenAmount;
      let tokenX = new TokenContract(otherTokenAddress);
      let x = tokenX.getBalance(this.address);
      let y = this.account.balance.get();
      this.account.balance.assertEquals(y);
      tokenX.transfer(user, this.address, dx);

      // this formula has been changed - we just give the user an additional 15 token
      let dy = y.mul(dx).div(x.add(dx)).add(15);

      this.balance.subInPlace(dy);
      return dy;
    }
  }

  /**
   * Helper to get the various token balances for checks in tests
   */
  function getTokenBalances() {
    let balances = {
      user: { MINA: 0n, X: 0n, Y: 0n, lqXY: 0n },
      user2: { MINA: 0n, X: 0n, Y: 0n, lqXY: 0n },
      dex: { X: 0n, Y: 0n },
      tokenContract: { X: 0n, Y: 0n },
      total: { lqXY: 0n },
    };
    for (let user of ["user", "user2"] as const) {
      try {
        balances[user].MINA =
          Mina.getBalance(addresses[user]).toBigInt() / 1_000_000_000n;
      } catch {}
      for (let token of ["X", "Y", "lqXY"] as const) {
        try {
          balances[user][token] = Mina.getBalance(
            addresses[user],
            tokenIds[token]
          ).toBigInt();
        } catch {}
      }
    }
    try {
      balances.dex.X = Mina.getBalance(addresses.dex, tokenIds.X).toBigInt();
    } catch {}
    try {
      balances.dex.Y = Mina.getBalance(addresses.dex, tokenIds.Y).toBigInt();
    } catch {}
    try {
      balances.tokenContract.X = Mina.getBalance(
        addresses.tokenX,
        tokenIds.X
      ).toBigInt();
    } catch {}
    try {
      balances.tokenContract.Y = Mina.getBalance(
        addresses.tokenY,
        tokenIds.Y
      ).toBigInt();
    } catch {}
    try {
      let dex = new Dex(addresses.dex);
      balances.total.lqXY = dex.totalSupply.get().toBigInt();
    } catch {}
    return balances;
  }

  return {
    Dex,
    DexTokenHolder,
    ModifiedDexTokenHolder,
    ModifiedDex,
    getTokenBalances,
  };
}

/**
 * Simple token with API flexible enough to handle all our use cases
 */
class TokenContract extends SmartContract {
  deploy(args?: DeployArgs) {
    super.deploy(args);
    this.account.permissions.set({
      ...Permissions.default(),
      access: Permissions.proofOrSignature(),
    });
  }
  @method init() {
    super.init();
    // mint the entire supply to the token account with the same address as this contract
    /**
     * DUMB STUFF FOR TESTING (change in real app)
     *
     * we mint the max uint64 of tokens here, so that we can overflow it in tests if we just mint a bit more
     */
    let receiver = this.token.mint({
      address: this.address,
      amount: UInt64.MAXINT(),
    });
    // assert that the receiving account is new, so this can be only done once
    receiver.account.isNew.assertEquals(Bool(true));
    // pay fees for opened account
    this.balance.subInPlace(Mina.accountCreationFee());
  }

  /**
   * DUMB STUFF FOR TESTING (delete in real app)
   *
   * mint additional tokens to some user, so we can overflow token balances
   */
  @method init2() {
    let receiver = this.token.mint({
      address: addresses.user,
      amount: UInt64.from(10n ** 6n),
    });
    // assert that the receiving account is new, so this can be only done once
    receiver.account.isNew.assertEquals(Bool(true));
    // pay fees for opened account
    this.balance.subInPlace(Mina.accountCreationFee());
  }

  // this is a very standardized deploy method. instead, we could also take the account update from a callback
  // => need callbacks for signatures
  @method deployZkapp(address: PublicKey, verificationKey: VerificationKey) {
    let tokenId = this.token.id;
    let zkapp = AccountUpdate.create(address, tokenId);
    zkapp.account.permissions.set(Permissions.default());
    zkapp.account.verificationKey.set(verificationKey);
    zkapp.requireSignature();
  }

  @method approveUpdate(zkappUpdate: AccountUpdate) {
    this.approve(zkappUpdate);
    let balanceChange = Int64.fromObject(zkappUpdate.body.balanceChange);
    balanceChange.assertEquals(Int64.from(0));
  }

  // FIXME: remove this
  @method approveAny(zkappUpdate: AccountUpdate) {
    this.approve(zkappUpdate, AccountUpdate.Layout.AnyChildren);
  }

  // let a zkapp send tokens to someone, provided the token supply stays constant
  @method approveUpdateAndSend(
    zkappUpdate: AccountUpdate,
    to: PublicKey,
    amount: UInt64
  ) {
    // TODO: THIS IS INSECURE. The proper version has a prover error (compile != prove) that must be fixed
    this.approve(zkappUpdate, AccountUpdate.Layout.AnyChildren);

    // THIS IS HOW IT SHOULD BE DONE:
    // // approve a layout of two grandchildren, both of which can't inherit the token permission
    // let { StaticChildren, AnyChildren } = AccountUpdate.Layout;
    // this.approve(zkappUpdate, StaticChildren(AnyChildren, AnyChildren));
    // zkappUpdate.body.mayUseToken.parentsOwnToken.assertTrue();
    // let [grandchild1, grandchild2] = zkappUpdate.children.accountUpdates;
    // grandchild1.body.mayUseToken.inheritFromParent.assertFalse();
    // grandchild2.body.mayUseToken.inheritFromParent.assertFalse();

    // see if balance change cancels the amount sent
    let balanceChange = Int64.fromObject(zkappUpdate.body.balanceChange);
    balanceChange.assertEquals(Int64.from(amount).neg());
    // add same amount of tokens to the receiving address
    this.token.mint({ address: to, amount });
  }

  transfer(from: PublicKey, to: PublicKey | AccountUpdate, amount: UInt64) {
    if (to instanceof PublicKey)
      return this.transferToAddress(from, to, amount);
    if (to instanceof AccountUpdate)
      return this.transferToUpdate(from, to, amount);
  }
  @method transferToAddress(from: PublicKey, to: PublicKey, value: UInt64) {
    this.token.send({ from, to, amount: value });
  }
  @method transferToUpdate(from: PublicKey, to: AccountUpdate, value: UInt64) {
    this.token.send({ from, to, amount: value });
  }

  @method getBalance(publicKey: PublicKey): UInt64 {
    let accountUpdate = AccountUpdate.create(publicKey, this.token.id);
    let balance = accountUpdate.account.balance.get();
    accountUpdate.account.balance.assertEquals(
      accountUpdate.account.balance.get()
    );
    return balance;
  }
}

const savedKeys = [
  "EKFcUu4FLygkyZR8Ch4F8hxuJps97GCfiMRSWXDP55sgvjcmNGHc",
  "EKENfq7tEdTf5dnNxUgVo9dUnAqrEaB9syTgFyuRWinR5gPuZtbG",
  "EKEPVj2PDzQUrMwL2yeUikoQYXvh4qrkSxsDa7gegVcDvNjAteS5",
  "EKDm7SHWHEP5xiSbu52M1Z4rTFZ5Wx7YMzeaC27BQdPvvGvF42VH",
  "EKEuJJmmHNVHD1W2qmwExDyGbkSoKdKmKNPZn8QbqybVfd2Sd4hs",
  "EKEyPVU37EGw8CdGtUYnfDcBT2Eu7B6rSdy64R68UHYbrYbVJett",
];

await isReady;
let { keys, addresses } = randomAccounts(
  false,
  "tokenX",
  "tokenY",
  "dex",
  "user",
  "user2",
  "user3"
);
let tokenIds = {
  X: TokenId.derive(addresses.tokenX),
  Y: TokenId.derive(addresses.tokenY),
  lqXY: TokenId.derive(addresses.dex),
};

/**
 * Sum of balances of the account update and all its descendants
 */
function balanceSum(accountUpdate: AccountUpdate, tokenId: Field) {
  let myTokenId = accountUpdate.body.tokenId;
  let myBalance = Int64.fromObject(accountUpdate.body.balanceChange);
  let balance = Provable.if(myTokenId.equals(tokenId), myBalance, Int64.zero);
  for (let child of accountUpdate.children.accountUpdates) {
    balance = balance.add(balanceSum(child, tokenId));
  }
  return balance;
}

/**
 * Predefined accounts keys, labeled by the input strings. Useful for testing/debugging with consistent keys.
 */
function randomAccounts<K extends string>(
  createNewAccounts: boolean,
  ...names: [K, ...K[]]
): { keys: Record<K, PrivateKey>; addresses: Record<K, PublicKey> } {
  let base58Keys = createNewAccounts
    ? Array(6)
        .fill("")
        .map(() => PrivateKey.random().toBase58())
    : savedKeys;
  let keys = Object.fromEntries(
    names.map((name, idx) => [name, PrivateKey.fromBase58(base58Keys[idx])])
  ) as Record<K, PrivateKey>;
  let addresses = Object.fromEntries(
    names.map((name) => [name, keys[name].toPublicKey()])
  ) as Record<K, PublicKey>;
  return { keys, addresses };
}
