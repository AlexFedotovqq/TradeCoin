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
  Bool,
} from "o1js";

import { PairMintContract, TokenPairMintTx } from "./PairContractMint.js";

export class PersonalPairBalance extends Struct({
  owner: PublicKey,
  id: Field,
  tokenXAmount: UInt64,
  tokenYAmount: UInt64,
}) {
  increaseX(dx: UInt64) {
    this.tokenXAmount = this.tokenXAmount.add(dx);
  }
  decreaseX(dx: UInt64) {
    this.tokenXAmount = this.tokenXAmount.sub(dx);
  }
  increaseY(dy: UInt64) {
    this.tokenYAmount = this.tokenYAmount.add(dy);
  }
  decreaseY(dx: UInt64) {
    this.tokenYAmount = this.tokenYAmount.sub(dx);
  }
  supply(dl: UInt64) {
    this.tokenXAmount = this.tokenXAmount.sub(dl);
    this.tokenYAmount = this.tokenYAmount.sub(dl);
  }
  burn(dl: UInt64) {
    this.tokenXAmount = this.tokenXAmount.add(dl);
    this.tokenYAmount = this.tokenYAmount.add(dl);
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
  events = {
    "token-X": PublicKey,
    "token-Y": PublicKey,
  };
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
    const map: Field = new MerkleMap().getRoot();
    this.root.set(map);
    const sender: PublicKey = this.checkUserSignature();
    this.admin.set(sender);
  }

  @method initContract(_tokenX: PublicKey, _tokenY: PublicKey) {
    this.checkAdminSignature();
    this.tokenX.getAndRequireEquals();
    this.tokenY.getAndRequireEquals();
    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
    this.emitEvent("token-X", _tokenX);
    this.emitEvent("token-Y", _tokenY);
  }

  @method createPersonalBalance(
    adminSignature: Signature,
    keyWitness: MerkleMapWitness
  ): PersonalPairBalance {
    const user: PublicKey = this.checkUserSignature();

    const currentId: Field = this.userId.getAndRequireEquals();
    const Balance: PersonalPairBalance = new PersonalPairBalance({
      owner: user,
      id: currentId,
      tokenXAmount: UInt64.zero,
      tokenYAmount: UInt64.zero,
    });
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(admin, Balance.toFields());
    isAdmin.assertTrue("not admin");

    const initialRoot: Field = this.root.getAndRequireEquals();
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
    const sender: PublicKey = this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenXPub: PublicKey = this.tokenX.getAndRequireEquals();
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: Bool = pairMintContract.supplyTokenX(adminSignature, tokenTx);
    res.assertTrue();

    tokenPairTx.balance.increaseX(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
    this.root.set(rootAfter);
  }

  @method supplyTokenY(tokenPairTx: TokenPairTx, adminSignature: Signature) {
    const sender: PublicKey = this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");
    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenYPub: PublicKey = this.tokenY.getAndRequireEquals();
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: Bool = pairMintContract.supplyTokenY(adminSignature, tokenTx);
    res.assertTrue();
    tokenPairTx.balance.increaseY(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
    this.root.set(rootAfter);
  }

  @method swapXforY(tokenPairTx: TokenPairTx, adminSignature: Signature) {
    const sender: PublicKey = this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenXPub: PublicKey = this.tokenX.getAndRequireEquals();
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: UInt64 = pairMintContract.swapXforY(adminSignature, tokenTx);

    tokenPairTx.balance.increaseY(res);
    tokenPairTx.balance.decreaseX(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
    this.root.set(rootAfter);
  }

  @method swapYforX(tokenPairTx: TokenPairTx, adminSignature: Signature) {
    const sender: PublicKey = this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenYPub: PublicKey = this.tokenY.getAndRequireEquals();
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: UInt64 = pairMintContract.swapYforX(adminSignature, tokenTx);

    tokenPairTx.balance.increaseX(res);
    tokenPairTx.balance.decreaseY(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
    this.root.set(rootAfter);
  }

  @method mintLiquidityToken(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ) {
    const sender: PublicKey = this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");
    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenPairTx.tokenPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: Bool = pairMintContract.mintLiquidityToken(
      adminSignature,
      tokenTx
    );
    res.assertTrue();
    tokenPairTx.balance.supply(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
    this.root.set(rootAfter);
  }

  @method burnLiquidityToken(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ) {
    const sender: PublicKey = this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");
    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenPairTx.tokenPub,
      dToken: tokenPairTx.dToken,
    });
    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: Bool = pairMintContract.burnLiquidityToken(
      adminSignature,
      tokenTx
    );
    res.assertTrue();
    tokenPairTx.balance.burn(tokenPairTx.dToken);
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(
      tokenPairTx.balance.hash()
    );
    this.root.set(rootAfter);
  }

  private checkMerkleMap(
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance
  ) {
    const initialRoot: Field = this.root.getAndRequireEquals();
    const [rootBefore, key] = keyWitness.computeRootAndKey(
      balanceBefore.hash()
    );
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balanceBefore.id);
  }

  private checkUserSignature() {
    const user: PublicKey = this.sender;
    const senderUpdate: AccountUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
  }

  private checkAdminSignature() {
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const sender: PublicKey = this.sender;
    sender.assertEquals(admin);
    const senderUpdate: AccountUpdate = AccountUpdate.create(sender);
    senderUpdate.requireSignature();
  }
}
