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
  events = {
    "created-pool": Field,
    "deleted-pool": Field,
  };
  @state(PublicKey) admin = State<PublicKey>();
  @state(Field) root = State<Field>();
  @state(UInt64) poolsTotal = State<UInt64>();

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

    const balanceHash: Field = balance.hash();
    const rootAfter: Field = keyWitness.calculateRoot(balanceHash);
    this.root.set(rootAfter);
    this.poolsTotal.set(poolsTotal.add(1));
    this.emitEvent("created-pool", balanceHash);
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

    const balanceHash: Field = balance.hash();
    const rootBefore: Field = keyWitness.calculateRoot(balanceHash);
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balance.id);

    const rootAfter: Field = keyWitness.calculateRoot(Field(0));
    this.root.set(rootAfter);
    this.poolsTotal.set(poolsTotal.sub(1));
    this.emitEvent("deleted-pool", balanceHash);
  }

  checkUserSignature() {
    const user: PublicKey = this.sender;
    const senderUpdate: AccountUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
  }
}
