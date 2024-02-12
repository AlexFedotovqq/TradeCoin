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
  Struct,
  MerkleMap,
  MerkleMapWitness,
  Poseidon,
} from "o1js";

import { BasicTokenContract } from "./BasicTokenContract.js";
import { BaseMerkleWitness } from "o1js/dist/node/lib/merkle_tree.js";

export { Dex };

export class Balances extends Struct({
  owner: PublicKey,
  id: Field,
  tokenX: UInt64,
  tokenY: UInt64,
}) {
  incrementX(amount: UInt64) {
    this.tokenX = this.tokenX.add(amount);
  }
  decrementX(amount: UInt64) {
    this.tokenX = this.tokenX.sub(amount);
  }
  incrementY(amount: UInt64) {
    this.tokenY = this.tokenY.add(amount);
  }
  decrementY(amount: UInt64) {
    this.tokenY = this.tokenY.sub(amount);
  }
  // add method to delete a leaf for a user
}

class Dex extends SmartContract {
  @state(PublicKey) tokenX = State<PublicKey>();
  @state(PublicKey) tokenY = State<PublicKey>();

  // state to store maximum number of total users in a merkle tree
  @state(UInt64) usersTotal = State<UInt64>();

  /**
   * state that keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
   *
   * total supply is initially zero; it increases when supplying liquidity and decreases when redeeming it
   */
  @state(UInt64) totalSupply = State<UInt64>();

  @state(UInt64) Xbalance = State<UInt64>();
  @state(UInt64) Ybalance = State<UInt64>();

  // this is where we store data
  @state(Field) treeRoot = State<Field>();

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

  @method supplyTokenX(
    dx: UInt64,
    keyWitness: MerkleMapWitness,
    balance: Balances
  ) {
    const initialRoot = this.treeRoot.getAndRequireEquals();
    let user = this.sender;

    let tokenX = new BasicTokenContract(this.tokenX.getAndRequireEquals());
    tokenX.transfer(user, this.address, dx);

    const [rootBefore, key] = keyWitness.computeRootAndKey(
      Poseidon.hash(Balances.toFields(balance))
    );
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balance.id);

    balance.incrementX(dx);
    const [rootAfter, _] = keyWitness.computeRootAndKey(
      Poseidon.hash(Balances.toFields(balance))
    );
    this.treeRoot.set(rootAfter);

    let Xbalance = this.Xbalance.getAndRequireEquals();
    Xbalance = Xbalance.add(dx);
    this.Xbalance.set(Xbalance);
  }

  @method supplyTokenY(dy: UInt64) {
    let user = this.sender;
    let tokenY = new BasicTokenContract(this.tokenY.getAndRequireEquals());
    tokenY.transfer(user, this.address, dy);

    // set merkle tree here
    // add ratio at which entered

    let Ybalance = this.Ybalance.getAndRequireEquals();
    Ybalance = Ybalance.add(dy);
    this.Ybalance.set(Ybalance);
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
    // add scenario for when one supply is 0
    // UInt64.from(100).mul
    // consider saving values after the .
    // use (1-x) ?

    let totalLPShares = Xbalance.add(Ybalance);

    let XOut = dl.mul(Xbalance).div(totalLPShares);
    let YOut = dl.mul(Xbalance).div(totalLPShares);

    tokenX.transfer(this.address, user, XOut);
    tokenY.transfer(this.address, user, YOut);

    Xbalance = Xbalance.sub(XOut);
    this.Xbalance.set(Xbalance);

    Ybalance = Ybalance.sub(YOut);
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

    Ybalance = Ybalance.sub(dy);
    this.Ybalance.set(Ybalance);
  }

  @method reedemY(dy: UInt64) {
    let user = this.sender;
    let tokenY = new BasicTokenContract(this.tokenY.getAndRequireEquals());
    // add merkle map
    tokenY.transfer(this.address, user, dy);
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

// some ideas: add ability to withdraw using a key
