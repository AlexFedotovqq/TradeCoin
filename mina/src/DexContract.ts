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
  Poseidon,
  MerkleWitness,
  MerkleTree,
  DeployArgs,
  AccountUpdate,
  Signature,
  Bool,
} from "o1js";

export class PoolId extends Struct({
  PairAddress: PublicKey,
  PairMintingAddress: PublicKey,
  id: Field,
}) {
  toFields(): Field[] {
    return PoolId.toFields(this);
  }
  hash(): Field {
    return Poseidon.hash(PoolId.toFields(this));
  }
}

const Height = 6;

export class MyMerkleWitness extends MerkleWitness(Height) {}

export class Dex extends SmartContract {
  @state(Field) root = State<Field>();
  @state(PublicKey) admin = State<PublicKey>();
  @state(UInt64) poolsTotal = State<UInt64>();
  // 4 states empty

  deploy(args?: DeployArgs) {
    super.deploy(args);
    const proof = Permissions.proof();
    this.account.permissions.set({
      ...Permissions.default(),
      access: proof,
      editState: proof,
      editActionState: proof,
      send: proof,
      incrementNonce: proof,
    });
  }

  init() {
    super.init();
    const sender: PublicKey = this.checkUserSignature();
    this.admin.set(sender);
    const map: Field = new MerkleTree(Height).getRoot();
    this.root.set(map);
  }

  @method createPool(
    adminSignature: Signature,
    keyWitness: MyMerkleWitness,
    balance: PoolId
  ) {
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(admin, balance.toFields());
    isAdmin.assertTrue("not admin");

    const poolsTotal: UInt64 = this.poolsTotal.getAndRequireEquals();
    const initialRoot: Field = this.root.getAndRequireEquals();

    const value: Field = Field(0);
    const key: Field = keyWitness.calculateIndex();
    const rootBefore: Field = keyWitness.calculateRoot(value);
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balance.id);

    const rootAfter: Field = keyWitness.calculateRoot(balance.hash());
    this.root.set(rootAfter);
    this.poolsTotal.set(poolsTotal.add(1));
  }

  @method deletePool(
    adminSignature: Signature,
    keyWitness: MyMerkleWitness,
    balance: PoolId
  ) {
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(admin, balance.toFields());
    isAdmin.assertTrue("not admin");

    const poolsTotal: UInt64 = this.poolsTotal.getAndRequireEquals();
    poolsTotal.assertGreaterThanOrEqual(UInt64.one);

    const initialRoot: Field = this.root.getAndRequireEquals();
    const key: Field = keyWitness.calculateIndex();
    const rootBefore: Field = keyWitness.calculateRoot(balance.hash());
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balance.id);

    const rootAfter: Field = keyWitness.calculateRoot(Field(0));
    this.root.set(rootAfter);
    this.poolsTotal.set(poolsTotal.sub(1));
  }

  checkUserSignature() {
    const user: PublicKey = this.sender;
    const senderUpdate: AccountUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
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
