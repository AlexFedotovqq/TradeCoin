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
    "created-balance": Field,
    "updated-root": Field,
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

  @method initContract(_tokenX: PublicKey, _tokenY: PublicKey): boolean {
    this.checkAdminSignature();

    const tokenX: PublicKey = this.tokenX.getAndRequireEquals();
    const tokenY: PublicKey = this.tokenY.getAndRequireEquals();

    const tokenXIsEmpty: Bool = tokenX.isEmpty();
    tokenXIsEmpty.assertTrue("tokenX is initialised");

    const tokenYIsEmpty: Bool = tokenY.isEmpty();
    tokenYIsEmpty.assertTrue("tokenY is initialised");

    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
    return true;
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
    rootBefore.assertEquals(initialRoot, "root not matches");
    key.assertEquals(currentId, "key not matches");

    const BalanceHash: Field = Balance.hash();
    const [rootAfter] = keyWitness.computeRootAndKey(BalanceHash);

    this.userId.set(currentId.add(1));
    this.root.set(rootAfter);
    this.emitEvent("created-balance", BalanceHash);
    this.emitEvent("updated-root", rootAfter);
    return Balance;
  }

  @method supplyTokenX(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTokenPairTxSignature(tokenPairTx);

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);

    const tokenXPub: PublicKey = this.tokenX.getAndRequireEquals();
    const dToken: UInt64 = tokenPairTx.dToken;
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: UInt64 = pairMintContract.supplyTokenX(adminSignature, tokenTx);
    const isCorrect: Bool = res.equals(dToken);
    isCorrect.assertTrue("tokenX amount not supplied correctly");

    tokenPairTx.balance.increaseX(dToken);
    const BalanceHash: Field = tokenPairTx.balance.hash();
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(BalanceHash);
    this.root.set(rootAfter);
    this.emitEvent("created-balance", BalanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method supplyTokenY(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTokenPairTxSignature(tokenPairTx);

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);

    const tokenYPub: PublicKey = this.tokenY.getAndRequireEquals();
    const dToken: UInt64 = tokenPairTx.dToken;
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: UInt64 = pairMintContract.supplyTokenY(adminSignature, tokenTx);
    const isCorrect: Bool = res.equals(dToken);
    isCorrect.assertTrue("tokenY amount not supplied correctly");

    tokenPairTx.balance.increaseY(dToken);

    const BalanceHash: Field = tokenPairTx.balance.hash();
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(BalanceHash);
    this.root.set(rootAfter);
    this.emitEvent("created-balance", BalanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method swapXforY(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTokenPairTxSignature(tokenPairTx);

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);

    const tokenXPub: PublicKey = this.tokenX.getAndRequireEquals();
    const dToken: UInt64 = tokenPairTx.dToken;
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: UInt64 = pairMintContract.swapXforY(adminSignature, tokenTx);
    const isCorrect: Bool = res.equals(dToken);
    isCorrect.assertTrue("swapped not correct amount");

    tokenPairTx.balance.increaseY(dToken);
    tokenPairTx.balance.decreaseX(dToken);

    const BalanceHash: Field = tokenPairTx.balance.hash();
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(BalanceHash);
    this.root.set(rootAfter);
    this.emitEvent("created-balance", BalanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method swapYforX(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTokenPairTxSignature(tokenPairTx);

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);

    const tokenYPub: PublicKey = this.tokenY.getAndRequireEquals();
    const dToken: UInt64 = tokenPairTx.dToken;
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: UInt64 = pairMintContract.swapYforX(adminSignature, tokenTx);
    const isCorrect: Bool = res.equals(dToken);
    isCorrect.assertTrue("swapped not correct amount");

    tokenPairTx.balance.increaseX(dToken);
    tokenPairTx.balance.decreaseY(dToken);

    const BalanceHash: Field = tokenPairTx.balance.hash();
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(BalanceHash);
    this.root.set(rootAfter);
    this.emitEvent("created-balance", BalanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method mintLiquidityToken(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTokenPairTxSignature(tokenPairTx);

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);

    const dToken: UInt64 = tokenPairTx.dToken;
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenPairTx.tokenPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );

    const res: UInt64 = pairMintContract.mintLiquidityToken(
      adminSignature,
      tokenTx
    );
    const isCorrect: Bool = res.equals(dToken);
    isCorrect.assertTrue("minted correct LP token amount");

    tokenPairTx.balance.supply(dToken);

    const BalanceHash: Field = tokenPairTx.balance.hash();
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(BalanceHash);
    this.root.set(rootAfter);
    this.emitEvent("created-balance", BalanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method burnLiquidityToken(
    tokenPairTx: TokenPairTx,
    adminSignature: Signature
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTokenPairTxSignature(tokenPairTx);

    this.checkMerkleMap(tokenPairTx.keyWitness, tokenPairTx.balance);

    const dToken: UInt64 = tokenPairTx.dToken;
    const tokenTx: TokenPairMintTx = new TokenPairMintTx({
      sender: sender,
      tokenPub: tokenPairTx.tokenPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      tokenPairTx.tokenPub
    );
    const res: UInt64 = pairMintContract.burnLiquidityToken(
      adminSignature,
      tokenTx
    );
    const isCorrect: Bool = res.equals(dToken);
    isCorrect.assertTrue("burned not correct LP amount");

    tokenPairTx.balance.burn(dToken);

    const BalanceHash: Field = tokenPairTx.balance.hash();
    const [rootAfter] = tokenPairTx.keyWitness.computeRootAndKey(BalanceHash);
    this.root.set(rootAfter);
    this.emitEvent("created-balance", BalanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  private verifyAdminTokenPairTxSignature(tokenPairTx: TokenPairTx) {
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = tokenPairTx.pairAdminSignature.verify(
      admin,
      tokenPairTx.balance.toFields()
    );
    isAdmin.assertTrue("not admin");
  }

  private checkMerkleMap(
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance
  ) {
    const initialRoot: Field = this.root.getAndRequireEquals();
    const [rootBefore, key] = keyWitness.computeRootAndKey(
      balanceBefore.hash()
    );
    rootBefore.assertEquals(initialRoot, "root not matching");
    key.assertEquals(balanceBefore.id, "key not matching");
  }

  private checkUserSignature(): PublicKey {
    const user: PublicKey = this.sender;
    const senderUpdate: AccountUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
  }

  private checkAdminSignature() {
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const sender: PublicKey = this.sender;
    const isAdmin: Bool = sender.equals(admin);
    isAdmin.assertTrue("not admin");
    const senderUpdate: AccountUpdate = AccountUpdate.create(sender);
    senderUpdate.requireSignature();
  }
}
