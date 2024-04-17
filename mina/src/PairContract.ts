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
  MerkleMapWitness,
  MerkleMap,
  Signature,
  Bool,
  Provable,
} from "o1js";

import { PersonalPairBalance } from "./pair/PersonalPairBalance.js";
import { TxTokenPairContract } from "./pair/TxTokenPair.js";
import { TxTokenPairMintContract } from "./pair/TxTokenPairMintContract.js";
import { PairMintContract } from "./PairContractMint.js";

export class PairContract extends SmartContract {
  events = {
    "created-balance": Field,
    "updated-balance": Field,
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

    const balanceHash: Field = Balance.hash();
    const [rootAfter] = keyWitness.computeRootAndKey(balanceHash);

    this.userId.set(currentId.add(1));
    this.root.set(rootAfter);
    this.emitEvent("created-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return Balance;
  }

  @method supplyTokenX(
    adminPairMintContractSignature: Signature,
    txTokenPairContract: TxTokenPairContract
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTxTokenPairContractSignature(txTokenPairContract);

    this.checkMerkleMap(
      txTokenPairContract.keyWitness,
      txTokenPairContract.userBalance
    );

    const tokenXPub: PublicKey = this.tokenX.getAndRequireEquals();
    const dToken: UInt64 = txTokenPairContract.dToken;
    const txTokenX: TxTokenPairMintContract = new TxTokenPairMintContract({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      txTokenPairContract.tokenPub
    );
    const res: UInt64 = pairMintContract.supplyTokenX(
      adminPairMintContractSignature,
      txTokenX
    );
    const isTxCorrect: Bool = res.equals(dToken);
    isTxCorrect.assertTrue("tokenX amount supplied incorrectly");

    txTokenPairContract.userBalance.increaseX(dToken);
    const balanceHash: Field = txTokenPairContract.userBalance.hash();
    const [rootAfter] =
      txTokenPairContract.keyWitness.computeRootAndKey(balanceHash);
    this.root.set(rootAfter);

    this.emitEvent("updated-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method withdrawTokenX(
    adminPairMintContractSignature: Signature,
    txTokenPairContract: TxTokenPairContract
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTxTokenPairContractSignature(txTokenPairContract);

    this.checkMerkleMap(
      txTokenPairContract.keyWitness,
      txTokenPairContract.userBalance
    );

    const tokenXPub: PublicKey = this.tokenX.getAndRequireEquals();
    const dToken: UInt64 = txTokenPairContract.dToken;

    const pairMintContract: PairMintContract = new PairMintContract(
      txTokenPairContract.tokenPub
    );
    const txTokenX: TxTokenPairMintContract = new TxTokenPairMintContract({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: dToken,
    });
    const res: UInt64 = pairMintContract.withdrawTokenX(
      adminPairMintContractSignature,
      txTokenX
    );
    const isTxCorrect: Bool = res.equals(dToken);
    isTxCorrect.assertTrue("tokenX amount supplied incorrectly");

    txTokenPairContract.userBalance.decreaseX(dToken);
    const balanceHash: Field = txTokenPairContract.userBalance.hash();
    const [rootAfter] =
      txTokenPairContract.keyWitness.computeRootAndKey(balanceHash);
    this.root.set(rootAfter);
    this.emitEvent("updated-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method supplyTokenY(
    adminPairMintContractSignature: Signature,
    txTokenPairContract: TxTokenPairContract
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTxTokenPairContractSignature(txTokenPairContract);

    this.checkMerkleMap(
      txTokenPairContract.keyWitness,
      txTokenPairContract.userBalance
    );

    const tokenYPub: PublicKey = this.tokenY.getAndRequireEquals();
    const dToken: UInt64 = txTokenPairContract.dToken;
    const txTokenY: TxTokenPairMintContract = new TxTokenPairMintContract({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      txTokenPairContract.tokenPub
    );
    const res: UInt64 = pairMintContract.supplyTokenY(
      adminPairMintContractSignature,
      txTokenY
    );
    const isTxCorrect: Bool = res.equals(dToken);
    isTxCorrect.assertTrue("tokenY amount supplied incorrectly");

    txTokenPairContract.userBalance.increaseY(dToken);

    const balanceHash: Field = txTokenPairContract.userBalance.hash();
    const [rootAfter] =
      txTokenPairContract.keyWitness.computeRootAndKey(balanceHash);
    this.root.set(rootAfter);

    this.emitEvent("updated-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method withdrawTokenY(
    adminPairMintContractSignature: Signature,
    txTokenPairContract: TxTokenPairContract
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTxTokenPairContractSignature(txTokenPairContract);

    this.checkMerkleMap(
      txTokenPairContract.keyWitness,
      txTokenPairContract.userBalance
    );

    const tokenYPub: PublicKey = this.tokenY.getAndRequireEquals();
    const dToken: UInt64 = txTokenPairContract.dToken;

    const pairMintContract: PairMintContract = new PairMintContract(
      txTokenPairContract.tokenPub
    );
    const txTokenY: TxTokenPairMintContract = new TxTokenPairMintContract({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: dToken,
    });
    const res: UInt64 = pairMintContract.withdrawTokenX(
      adminPairMintContractSignature,
      txTokenY
    );
    const isTxCorrect: Bool = res.equals(dToken);
    isTxCorrect.assertTrue("tokenX amount supplied incorrectly");

    txTokenPairContract.userBalance.decreaseY(dToken);
    const balanceHash: Field = txTokenPairContract.userBalance.hash();
    const [rootAfter] =
      txTokenPairContract.keyWitness.computeRootAndKey(balanceHash);
    this.root.set(rootAfter);
    this.emitEvent("updated-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method swapXforY(
    adminPairMintContractSignature: Signature,
    txTokenPairContract: TxTokenPairContract
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTxTokenPairContractSignature(txTokenPairContract);

    this.checkMerkleMap(
      txTokenPairContract.keyWitness,
      txTokenPairContract.userBalance
    );

    const tokenXPub: PublicKey = this.tokenX.getAndRequireEquals();
    const dToken: UInt64 = txTokenPairContract.dToken;
    const txSwapXforY: TxTokenPairMintContract = new TxTokenPairMintContract({
      sender: sender,
      tokenPub: tokenXPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      txTokenPairContract.tokenPub
    );
    const res: UInt64 = pairMintContract.swapXforY(
      adminPairMintContractSignature,
      txSwapXforY
    );
    const isTxCorrect: Bool = res.equals(dToken);
    isTxCorrect.assertTrue("swaps incorrect amount");

    txTokenPairContract.userBalance.increaseY(dToken);
    txTokenPairContract.userBalance.decreaseX(dToken);

    const balanceHash: Field = txTokenPairContract.userBalance.hash();
    const [rootAfter] =
      txTokenPairContract.keyWitness.computeRootAndKey(balanceHash);
    this.root.set(rootAfter);

    this.emitEvent("updated-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method swapYforX(
    adminPairMintContractSignature: Signature,
    txTokenPairContract: TxTokenPairContract
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTxTokenPairContractSignature(txTokenPairContract);

    this.checkMerkleMap(
      txTokenPairContract.keyWitness,
      txTokenPairContract.userBalance
    );

    const tokenYPub: PublicKey = this.tokenY.getAndRequireEquals();
    const dToken: UInt64 = txTokenPairContract.dToken;
    const txSwapYforX: TxTokenPairMintContract = new TxTokenPairMintContract({
      sender: sender,
      tokenPub: tokenYPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      txTokenPairContract.tokenPub
    );
    const res: UInt64 = pairMintContract.swapYforX(
      adminPairMintContractSignature,
      txSwapYforX
    );
    const isTxCorrect: Bool = res.equals(dToken);
    isTxCorrect.assertTrue("swaps incorrect amount");

    txTokenPairContract.userBalance.increaseX(dToken);
    txTokenPairContract.userBalance.decreaseY(dToken);

    const balanceHash: Field = txTokenPairContract.userBalance.hash();
    const [rootAfter] =
      txTokenPairContract.keyWitness.computeRootAndKey(balanceHash);
    this.root.set(rootAfter);

    this.emitEvent("updated-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method mintLiquidityToken(
    adminPairMintContractSignature: Signature,
    txTokenPairContract: TxTokenPairContract
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTxTokenPairContractSignature(txTokenPairContract);

    this.checkMerkleMap(
      txTokenPairContract.keyWitness,
      txTokenPairContract.userBalance
    );

    const dToken: UInt64 = txTokenPairContract.dToken;
    const txLPMint: TxTokenPairMintContract = new TxTokenPairMintContract({
      sender: sender,
      tokenPub: txTokenPairContract.tokenPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      txTokenPairContract.tokenPub
    );

    const totalSupplyLP: UInt64 =
      pairMintContract.totalSupplyLP.getAndRequireEquals();

    const reservesLPX: UInt64 =
      pairMintContract.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 =
      pairMintContract.reservesLPY.getAndRequireEquals();

    const dx: UInt64 = Provable.if(
      totalSupplyLP.equals(UInt64.zero),
      dToken,
      this.calculateYtokensToPairMintReserves(dToken, reservesLPX)
    );
    dx.assertGreaterThan(UInt64.zero, "dx is 0");
    const dy: UInt64 = Provable.if(
      totalSupplyLP.equals(UInt64.zero),
      dToken,
      this.calculateXtokensToPairMintReserves(dToken, reservesLPY)
    );
    dy.assertGreaterThan(UInt64.zero, "dy is 0");

    txTokenPairContract.userBalance.tokenXAmount.assertGreaterThanOrEqual(
      dx,
      "not enough x tokens"
    );
    txTokenPairContract.userBalance.tokenYAmount.assertGreaterThanOrEqual(
      dy,
      "not enough y tokens"
    );

    const updatedTotalSupplyLP: UInt64 = pairMintContract.mintLiquidityToken(
      adminPairMintContractSignature,
      txLPMint
    );

    const isTotalSupplyLPCorrect: Bool = updatedTotalSupplyLP.equals(
      totalSupplyLP.add(dToken)
    );
    isTotalSupplyLPCorrect.assertTrue("mints incorrect LP token amount");

    txTokenPairContract.userBalance.supply(dx, dy);

    const balanceHash: Field = txTokenPairContract.userBalance.hash();
    const [rootAfter] =
      txTokenPairContract.keyWitness.computeRootAndKey(balanceHash);
    this.root.set(rootAfter);

    this.emitEvent("updated-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  @method burnLiquidityToken(
    adminPairMintContractSignature: Signature,
    txTokenPairContract: TxTokenPairContract
  ): UInt64 {
    const sender: PublicKey = this.checkUserSignature();
    this.verifyAdminTxTokenPairContractSignature(txTokenPairContract);

    this.checkMerkleMap(
      txTokenPairContract.keyWitness,
      txTokenPairContract.userBalance
    );

    const dToken: UInt64 = txTokenPairContract.dToken;
    const txLPBurn: TxTokenPairMintContract = new TxTokenPairMintContract({
      sender: sender,
      tokenPub: txTokenPairContract.tokenPub,
      dToken: dToken,
    });

    const pairMintContract: PairMintContract = new PairMintContract(
      txTokenPairContract.tokenPub
    );

    const totalSupplyLP: UInt64 =
      pairMintContract.totalSupplyLP.getAndRequireEquals();
    totalSupplyLP.assertGreaterThan(UInt64.zero, "LP token amount is 0");

    const reservesLPX: UInt64 =
      pairMintContract.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 =
      pairMintContract.reservesLPY.getAndRequireEquals();

    const dx: UInt64 = totalSupplyLP.mul(reservesLPX).div(dToken);
    const dy: UInt64 = totalSupplyLP.mul(reservesLPY).div(dToken);

    const isXAmountSifficient: Bool = dx.equals(UInt64.zero);
    isXAmountSifficient.assertFalse("insufficient tokenX amount");
    const isYAmountSifficient: Bool = dy.equals(UInt64.zero);
    isYAmountSifficient.assertFalse("insufficient tokenY amount");

    const updatedTotalSupplyLP: UInt64 = pairMintContract.burnLiquidityToken(
      adminPairMintContractSignature,
      txLPBurn
    );
    const isTotalSupplyLPCorrect: Bool = updatedTotalSupplyLP.equals(
      totalSupplyLP.sub(dToken)
    );
    isTotalSupplyLPCorrect.assertTrue("burns not correct LP amount");

    txTokenPairContract.userBalance.burn(dx, dy);

    const balanceHash: Field = txTokenPairContract.userBalance.hash();
    const [rootAfter] =
      txTokenPairContract.keyWitness.computeRootAndKey(balanceHash);
    this.root.set(rootAfter);

    this.emitEvent("updated-balance", balanceHash);
    this.emitEvent("updated-root", rootAfter);
    return dToken;
  }

  private calculateXtokensToPairMintReserves(
    dToken: UInt64,
    reservesLPX: UInt64
  ): UInt64 {
    return reservesLPX.mul(dToken);
  }

  private calculateYtokensToPairMintReserves(
    dToken: UInt64,
    reservesLPY: UInt64
  ): UInt64 {
    return reservesLPY.mul(dToken);
  }

  private verifyAdminTxTokenPairContractSignature(
    txTokenPairContract: TxTokenPairContract
  ): void {
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = txTokenPairContract.signatureAdminPairContract.verify(
      admin,
      txTokenPairContract.userBalance.toFields()
    );
    isAdmin.assertTrue("not admin");
  }

  private checkMerkleMap(
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance
  ): void {
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

  private checkAdminSignature(): void {
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const sender: PublicKey = this.sender;
    const isAdmin: Bool = sender.equals(admin);
    isAdmin.assertTrue("not admin");
    const senderUpdate: AccountUpdate = AccountUpdate.create(sender);
    senderUpdate.requireSignature();
  }
}
