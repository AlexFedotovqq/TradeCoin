import {
  method,
  PublicKey,
  SmartContract,
  UInt64,
  State,
  state,
  Field,
  Permissions,
  Struct,
  MerkleMapWitness,
  Poseidon,
  MerkleMap,
  Provable,
} from "o1js";

export class PersonalBalance extends Struct({
  owner: PublicKey,
  id: Field,
}) {}

export class Dex extends SmartContract {
  @state(Field) treeRoot = State<Field>();

  // state to store maximum number of total users in a merkle tree
  @state(UInt64) usersTotal = State<UInt64>();

  init() {
    super.init();

    const proof = Permissions.proof();

    this.account.permissions.set({
      ...Permissions.default(),
      access: proof,
      editState: proof,
      editActionState: proof,
      send: proof,
      incrementNonce: proof,
    });

    const map = new MerkleMap().getRoot();
    this.treeRoot.set(map);
  }

  @method createUser(keyWitness: MerkleMapWitness, balance: PersonalBalance) {
    const usersTotal = this.usersTotal.getAndRequireEquals();
    const initialRoot = this.treeRoot.getAndRequireEquals();

    const [rootBefore, key] = keyWitness.computeRootAndKey(Field(0));
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balance.id);

    // compute the root after incrementing
    const [rootAfter, keyAfter] = keyWitness.computeRootAndKey(
      Poseidon.hash(PersonalBalance.toFields(balance))
    );
    key.assertEquals(keyAfter);

    // set the new root
    this.treeRoot.set(rootAfter);

    // update user count
    this.usersTotal.set(usersTotal.add(1));
  }

  @method deleteUser(keyWitness: MerkleMapWitness, balance: PersonalBalance) {
    const usersTotal = this.usersTotal.getAndRequireEquals();
    usersTotal.assertGreaterThanOrEqual(UInt64.one);

    const initialRoot = this.treeRoot.getAndRequireEquals();
    const [rootBefore, key] = keyWitness.computeRootAndKey(
      Poseidon.hash(PersonalBalance.toFields(balance))
    );
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balance.id);

    // compute the root after incrementing
    const [rootAfter, keyAfter] = keyWitness.computeRootAndKey(Field(0));
    key.assertEquals(keyAfter);

    // set the new root
    this.treeRoot.set(rootAfter);

    // update user count
    this.usersTotal.set(usersTotal.sub(1));
  }

  /*   @method supplyToken(
    dx: UInt64,
    balance: PersonalBalance,
    keyWitness: MerkleMapWitness
  ) {
    const initialRoot = this.treeRoot.getAndRequireEquals();
    // const Xbalance = this.Xbalance.getAndRequireEquals();

    //const tokenXPub = PublicKey.fromFields(this.tokenX.getAndRequireEquals());

    // const tokenX = new BasicTokenContract(tokenXPub);
    // tokenX.transfer(user, this.address, dx);

    const [rootBefore, key] = keyWitness.computeRootAndKey(
      Poseidon.hash(PersonalBalance.toFields(balance))
    );
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balance.id);

    balance.incrementX(dx);

    const [rootAfter, keyAfter] = keyWitness.computeRootAndKey(
      Poseidon.hash(PersonalBalance.toFields(balance))
    );
    key.assertEquals(keyAfter);

    this.treeRoot.set(rootAfter);

    // this.Xbalance.set(Xbalance.add(dx));

    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balance.id);
  } */

  /**
   * Burn liquidity tokens to get back X and Y tokens
   * @param dl input amount of lqXY token
   *
   * The transaction needs to be signed by the user's private key.
   * Works with ZK app pk only atm
   *
   **/
  /*   @method redeem(dl: UInt64) {
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
  } */

  /*   @method swapXforY(dx: UInt64) {
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
  } */

  /*   @method reedemY(dy: UInt64) {
    let user = this.sender;

    const tokenYPub = PublicKey.fromFields(this.tokenY.getAndRequireEquals());

    let tokenY = new BasicTokenContract(tokenYPub);
    // add merkle map
    tokenY.transfer(this.address, user, dy);
  }
 */
  // add Y for X
}

// some ideas: add ability to withdraw using a key
