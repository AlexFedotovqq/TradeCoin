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
  AccountUpdate,
  Struct,
  MerkleMapWitness,
  MerkleMap,
  Poseidon,
  Signature,
} from "o1js";

import { PairMintContract, TokenTx } from "./PairContractMint.js";

export class PersonalPairBalance extends Struct({
  owner: PublicKey,
  id: Field,
  tokenXAmount: UInt64,
  tokenYAmount: UInt64,
}) {
  increaseX(dx: UInt64) {
    this.tokenXAmount = this.tokenXAmount.add(dx);
  }
  increaseY(dy: UInt64) {
    this.tokenYAmount = this.tokenYAmount.add(dy);
  }
  supply(dl: UInt64) {
    this.tokenXAmount = this.tokenXAmount.sub(dl);
    this.tokenYAmount = this.tokenYAmount.sub(dl);
  }
  toFields(): Field[] {
    return PersonalPairBalance.toFields(this);
  }
  hash(): Field {
    return Poseidon.hash(PersonalPairBalance.toFields(this));
  }
}

export class PairContract extends SmartContract {
  @state(PublicKey) admin = State<PublicKey>();
  @state(PublicKey) tokenX = State<PublicKey>();
  @state(PublicKey) tokenY = State<PublicKey>();

  @state(Field) root = State<Field>();
  @state(Field) userId = State<Field>();

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

  @method initContract(
    _tokenX: PublicKey,
    _tokenY: PublicKey,
    admin: PublicKey
  ) {
    this.checkNotInitialized();
    this.checkThisSignature();
    super.init();
    const map = new MerkleMap().getRoot();
    this.root.set(map);
    this.tokenX.getAndRequireEquals();
    this.tokenY.getAndRequireEquals();
    this.admin.getAndRequireEquals();
    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
    this.admin.set(admin);
  }

  @method createPersonalBalance(
    adminSignature: Signature,
    keyWitness: MerkleMapWitness
  ) {
    this.checkInitialized();
    const user = this.checkUserSignature();

    const currentId = this.userId.getAndRequireEquals();
    const Balance = new PersonalPairBalance({
      owner: user,
      id: currentId,
      tokenXAmount: UInt64.zero,
      tokenYAmount: UInt64.zero,
    });
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = adminSignature.verify(admin, Balance.toFields());
    isAdmin.assertTrue("not admin");

    const initialRoot = this.root.getAndRequireEquals();
    const [rootBefore, key] = keyWitness.computeRootAndKey(Field(0));
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(currentId);
    const [rootAfter, keyAfter] = keyWitness.computeRootAndKey(Balance.hash());
    key.assertEquals(keyAfter);

    this.userId.set(currentId.add(1));
    this.root.set(rootAfter);
  }

  @method supplyTokenX(
    dx: UInt64,
    adminSignature: Signature,
    localAdminSignature: Signature,
    keyWitness: MerkleMapWitness,
    balance: PersonalPairBalance,
    tokenPub: PublicKey
  ) {
    this.checkInitialized();
    const sender = this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = localAdminSignature.verify(admin, balance.toFields());
    isAdmin.assertTrue("not admin");
    this.checkMerkleMap(keyWitness, balance);
    const tokenXPub = this.tokenX.getAndRequireEquals();
    const tokenTx = new TokenTx({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: dx,
    });
    const pairMintContract = new PairMintContract(tokenPub);
    const res = pairMintContract.supplyTokenX(adminSignature, tokenTx);
    res.assertTrue();
    balance.increaseX(dx);
    const [rootAfter] = keyWitness.computeRootAndKey(balance.hash());
    this.root.set(rootAfter);
  }

  @method supplyTokenY(
    dy: UInt64,
    adminSignature: Signature,
    localAdminSignature: Signature,
    keyWitness: MerkleMapWitness,
    balance: PersonalPairBalance,
    tokenPub: PublicKey
  ) {
    this.checkInitialized();
    const sender = this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = localAdminSignature.verify(admin, balance.toFields());
    isAdmin.assertTrue("not admin");
    this.checkMerkleMap(keyWitness, balance);
    const tokenYPub = this.tokenY.getAndRequireEquals();
    const tokenTx = new TokenTx({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: dy,
    });
    const pairMintContract = new PairMintContract(tokenPub);
    const res = pairMintContract.supplyTokenY(adminSignature, tokenTx);
    res.assertTrue();
    balance.increaseY(dy);
    const [rootAfter] = keyWitness.computeRootAndKey(balance.hash());
    this.root.set(rootAfter);
  }

  @method mintLiquidityToken(
    dl: UInt64,
    adminSignature: Signature,
    localAdminSignature: Signature,
    keyWitness: MerkleMapWitness,
    balance: PersonalPairBalance,
    tokenPub: PublicKey
  ) {
    this.checkInitialized();
    const sender = this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = localAdminSignature.verify(admin, balance.toFields());
    isAdmin.assertTrue("not admin");
    this.checkMerkleMap(keyWitness, balance);
    const tokenTx = new TokenTx({
      sender: sender,
      tokenPub: tokenPub,
      dToken: dl,
    });
    const pairMintContract = new PairMintContract(tokenPub);
    const res = pairMintContract.mintLiquidityToken(adminSignature, tokenTx);
    res.assertTrue();
    balance.supply(dl);
    const [rootAfter] = keyWitness.computeRootAndKey(balance.hash());
    this.root.set(rootAfter);
  }

  private checkMerkleMap(
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance
  ) {
    const initialRoot = this.root.getAndRequireEquals();
    const [rootBefore, key] = keyWitness.computeRootAndKey(
      balanceBefore.hash()
    );
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balanceBefore.id);
  }

  private checkUserSignature() {
    const user = this.sender;
    const senderUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
  }

  private checkThisSignature() {
    const address = this.address;
    const sender = this.sender;
    sender.assertEquals(address);
    const senderUpdate = AccountUpdate.create(address);
    senderUpdate.requireSignature();
  }

  private checkInitialized() {
    this.account.provedState.requireEquals(this.account.provedState.get());
    this.account.provedState.get().assertTrue();
  }

  private checkNotInitialized() {
    this.account.provedState.requireEquals(this.account.provedState.get());
    this.account.provedState.get().assertFalse();
  }
}
