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

export class TokenPairTx extends Struct({
  pairAdminSignature: Signature,
  balance: PersonalPairBalance,
  keyWitness: MerkleMapWitness,
  tokenPub: PublicKey,
  dToken: UInt64,
}) {}

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

  init() {
    super.init();
    const map = new MerkleMap().getRoot();
    this.root.set(map);
    const sender = this.checkUserSignature();
    this.admin.set(sender);
  }

  @method initContract(_tokenX: PublicKey, _tokenY: PublicKey) {
    this.checkAdminSignature();
    this.tokenX.getAndRequireEquals();
    this.tokenY.getAndRequireEquals();
    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
  }

  @method createPersonalBalance(
    adminSignature: Signature,
    keyWitness: MerkleMapWitness
  ): PersonalPairBalance {
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
    return Balance;
  }

  @method supplyTokenX(tokenPairTx: TokenPairTx, adminSignature: Signature) {
    const sender = this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenXPub = this.tokenX.getAndRequireEquals();
    const tokenTx = new TokenTx({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract = new PairMintContract(tokenPairTx.tokenPub);
    const res = pairMintContract.supplyTokenX(adminSignature, tokenTx);
    res.assertTrue();

    tokenPairTx.balance.increaseX(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
    this.root.set(rootAfter);
  }

  @method supplyTokenY(tokenPairTx: TokenPairTx, adminSignature: Signature) {
    const sender = this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");
    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenYPub = this.tokenY.getAndRequireEquals();
    const tokenTx = new TokenTx({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract = new PairMintContract(tokenPairTx.tokenPub);
    const res = pairMintContract.supplyTokenY(adminSignature, tokenTx);
    res.assertTrue();
    tokenPairTx.balance.increaseY(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
    this.root.set(rootAfter);
  }

  @method mintLiquidityToken(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ) {
    const sender = this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");
    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenTx = new TokenTx({
      sender: sender,
      tokenPub: tokenPairTx.tokenPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract = new PairMintContract(tokenPairTx.tokenPub);
    const res = pairMintContract.mintLiquidityToken(adminSignature, tokenTx);
    res.assertTrue();
    tokenPairTx.balance.supply(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
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

  private checkAdminSignature() {
    const admin = this.admin.getAndRequireEquals();
    const sender = this.sender;
    sender.assertEquals(admin);
    const senderUpdate = AccountUpdate.create(sender);
    senderUpdate.requireSignature();
  }
}
