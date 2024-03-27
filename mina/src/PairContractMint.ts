import {
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  UInt64,
  PublicKey,
  AccountUpdate,
  Bool,
  Field,
  Struct,
  Signature,
  Poseidon,
} from "o1js";

import { BasicTokenContract } from "./BasicTokenContract.js";

export class TokenPairMintTx extends Struct({
  sender: PublicKey,
  tokenPub: PublicKey,
  dToken: UInt64,
}) {
  toFields(): Field[] {
    return TokenPairMintTx.toFields(this);
  }
  hash(): Field {
    return Poseidon.hash(TokenPairMintTx.toFields(this));
  }
}

export class PairMintContract extends SmartContract {
  @state(PublicKey) admin = State<PublicKey>();
  @state(UInt64) reservesX = State<UInt64>();
  @state(UInt64) reservesY = State<UInt64>();
  @state(UInt64) reservesLPX = State<UInt64>();
  @state(UInt64) reservesLPY = State<UInt64>();
  @state(UInt64) totalSupplyLP = State<UInt64>();

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
    this.totalSupplyLP.set(UInt64.zero);
    this.reservesX.set(UInt64.zero);
    this.reservesY.set(UInt64.zero);
    const sender: PublicKey = this.checkUserSignature();
    this.admin.set(sender);
  }

  @method mintLiquidityToken(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    const isAdmin = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("mint LP: not admin signature");
    const dToken = tokenTxDetails.dToken;
    const liquidity: UInt64 = this.totalSupplyLP.getAndRequireEquals();
    const reservesLPX: UInt64 = this.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 = this.reservesLPY.getAndRequireEquals();
    this.token.mint({
      address: tokenTxDetails.sender,
      amount: dToken,
    });
    this.reservesLPX.set(reservesLPX.add(dToken));
    this.reservesLPY.set(reservesLPY.add(dToken));
    this.totalSupplyLP.set(liquidity.add(dToken));
    return Bool(true);
  }

  @method burnLiquidityToken(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    const isAdmin = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("burn LP: not admin signature");
    const dToken = tokenTxDetails.dToken;
    const liquidity: UInt64 = this.totalSupplyLP.getAndRequireEquals();
    const reservesLPX: UInt64 = this.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 = this.reservesLPY.getAndRequireEquals();
    this.token.burn({
      address: tokenTxDetails.sender,
      amount: tokenTxDetails.dToken,
    });
    this.reservesLPX.set(reservesLPX.sub(dToken));
    this.reservesLPY.set(reservesLPY.sub(dToken));
    this.totalSupplyLP.set(liquidity.sub(dToken));
    return Bool(true);
  }

  @method supplyTokenX(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    const isAdmin = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("supply X: not admin signature");
    const tokenX: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenX.transfer(tokenTxDetails.sender, this.address, tokenTxDetails.dToken);
    const reservesX: UInt64 = this.reservesX.getAndRequireEquals();
    this.reservesX.set(reservesX.add(tokenTxDetails.dToken));
    return Bool(true);
  }

  @method withdrawTokenX(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    const isAdmin = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("withdraw X: not admin signature");
    const tokenX: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenX.transfer(this.address, tokenTxDetails.sender, tokenTxDetails.dToken);
    const reservesX: UInt64 = this.reservesX.getAndRequireEquals();
    this.reservesX.set(reservesX.sub(tokenTxDetails.dToken));
    return Bool(true);
  }

  @method supplyTokenY(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    const isAdmin = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("supply X: not admin signature");
    const tokenY: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenY.transfer(tokenTxDetails.sender, this.address, tokenTxDetails.dToken);
    const reservesY: UInt64 = this.reservesY.getAndRequireEquals();
    this.reservesY.set(reservesY.add(tokenTxDetails.dToken));
    return Bool(true);
  }

  @method withdrawTokenY(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    const isAdmin = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("withdraw Y: not admin signature");
    const tokenY: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenY.transfer(this.address, tokenTxDetails.sender, tokenTxDetails.dToken);
    const reservesY: UInt64 = this.reservesY.getAndRequireEquals();
    this.reservesY.set(reservesY.sub(tokenTxDetails.dToken));
    return Bool(true);
  }

  @method swapXforY(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ) {
    const isAdmin = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("swap XY: not admin signature");
    const dToken = tokenTxDetails.dToken;
    const reservesLPX: UInt64 = this.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 = this.reservesLPY.getAndRequireEquals();
    const bNumerator: UInt64 = reservesLPY.mul(dToken);
    const bDenominator: UInt64 = reservesLPX.add(dToken);
    const b = bNumerator.div(bDenominator);
    b.assertGreaterThan(UInt64.zero, "swap amount is 0");
    this.reservesLPX.set(reservesLPX.sub(b));
    this.reservesLPY.set(reservesLPY.add(b));
    return b;
  }

  @method swapYforX(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ) {
    const isAdmin = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("swap YX: not admin signature");
    const dToken = tokenTxDetails.dToken;
    const reservesLPX: UInt64 = this.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 = this.reservesLPY.getAndRequireEquals();
    const bNumerator: UInt64 = reservesLPX.mul(dToken);
    const bDenominator: UInt64 = reservesLPY.add(dToken);
    const b = bNumerator.div(bDenominator);
    b.assertGreaterThan(UInt64.zero, "swap amount is 0");
    this.reservesLPY.set(reservesLPY.sub(b));
    this.reservesLPX.set(reservesLPX.add(b));
    return b;
  }

  private checkUserSignature(): PublicKey {
    const user: PublicKey = this.sender;
    const senderUpdate: AccountUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
  }

  private checkSignatures(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(
      admin,
      tokenTxDetails.toFields()
    );
    return isAdmin;
  }
}
