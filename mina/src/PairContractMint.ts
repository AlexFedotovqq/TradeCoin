import {
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  UInt64,
  PublicKey,
  AccountUpdate,
  Bool,
  Signature,
  TokenContract,
} from "o1js";

import { TxTokenPairMintContract } from "./pair/TxTokenPairMintContract.js";
import { BasicTokenContract } from "./BasicTokenContract.js";

export class PairMintContract extends TokenContract {
  events = {
    "burned-lp": UInt64,
    "minted-lp": UInt64,
    "supplied-token-x": UInt64,
    "supplied-token-y": UInt64,
    "swapped-x-for-y": UInt64,
    "swapped-y-for-x": UInt64,
    "updated-fee": UInt64,
    "withdrawn-token-x": UInt64,
    "withdrawn-token-y": UInt64,
  };
  @state(PublicKey) admin = State<PublicKey>();
  @state(UInt64) reservesX = State<UInt64>();
  @state(UInt64) reservesY = State<UInt64>();
  @state(UInt64) reservesLPX = State<UInt64>();
  @state(UInt64) reservesLPY = State<UInt64>();
  @state(UInt64) totalSupplyLP = State<UInt64>();
  @state(UInt64) fee = State<UInt64>();

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

  @method public setFee(newFeeAmount: UInt64): Bool {
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const sender: PublicKey = this.sender;
    const isAdmin: Bool = sender.equals(admin);
    isAdmin.assertTrue("sender: not an admin");
    const senderUpdate: AccountUpdate = AccountUpdate.create(admin);
    senderUpdate.requireSignature();

    this.fee.getAndRequireEquals();
    this.fee.set(newFeeAmount);
    this.emitEvent("updated-fee", newFeeAmount);
    return Bool(true);
  }

  @method mintLiquidityToken(
    adminSignature: Signature,
    tokenTxDetails: TxTokenPairMintContract
  ): UInt64 {
    const isAdmin: Bool = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("mint LP: not admin signature");

    const dToken: UInt64 = tokenTxDetails.dToken;
    const totalSupplyLP: UInt64 = this.totalSupplyLP.getAndRequireEquals();
    const reservesLPX: UInt64 = this.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 = this.reservesLPY.getAndRequireEquals();

    this.internal.mint({
      address: tokenTxDetails.sender,
      amount: dToken,
    });

    const updatedTotalSupplyLP: UInt64 = totalSupplyLP.add(dToken);
    const updatedReservesX: UInt64 = reservesLPX.add(dToken);
    const updatedReservesY: UInt64 = reservesLPY.add(dToken);

    this.totalSupplyLP.set(updatedTotalSupplyLP);
    this.reservesLPX.set(updatedReservesX);
    this.reservesLPY.set(updatedReservesY);

    this.emitEvent("minted-lp", dToken);
    return updatedTotalSupplyLP;
  }

  @method burnLiquidityToken(
    adminSignature: Signature,
    tokenTxDetails: TxTokenPairMintContract
  ): UInt64 {
    const isAdmin: Bool = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("burn LP: not admin signature");

    const dToken: UInt64 = tokenTxDetails.dToken;
    const totalSupplyLP: UInt64 = this.totalSupplyLP.getAndRequireEquals();
    const reservesLPX: UInt64 = this.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 = this.reservesLPY.getAndRequireEquals();

    this.internal.burn({
      address: tokenTxDetails.sender,
      amount: tokenTxDetails.dToken,
    });

    const updatedTotalSupplyLP: UInt64 = totalSupplyLP.sub(dToken);
    const updatedReservesX: UInt64 = reservesLPX.sub(dToken);
    const updatedReservesY: UInt64 = reservesLPY.sub(dToken);

    this.totalSupplyLP.set(updatedTotalSupplyLP);
    this.reservesLPX.set(updatedReservesX);
    this.reservesLPY.set(updatedReservesY);
    this.emitEvent("burned-lp", dToken);
    return updatedTotalSupplyLP;
  }

  @method supplyTokenX(
    adminSignature: Signature,
    tokenTxDetails: TxTokenPairMintContract
  ): UInt64 {
    const isAdmin: Bool = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("supply X: not admin signature");

    const dToken: UInt64 = tokenTxDetails.dToken;
    const reservesX: UInt64 = this.reservesX.getAndRequireEquals();

    const tokenX: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenX.transfer(tokenTxDetails.sender, this.address, dToken);

    this.reservesX.set(reservesX.add(dToken));
    this.emitEvent("supplied-token-x", dToken);
    return dToken;
  }

  @method withdrawTokenX(
    adminSignature: Signature,
    tokenTxDetails: TxTokenPairMintContract
  ): UInt64 {
    const isAdmin: Bool = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("withdraw X: not admin signature");

    const dToken: UInt64 = tokenTxDetails.dToken;
    const reservesX: UInt64 = this.reservesX.getAndRequireEquals();

    const tokenX: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenX.transfer(this.address, tokenTxDetails.sender, dToken);

    this.reservesX.set(reservesX.sub(dToken));
    this.emitEvent("withdrawn-token-x", dToken);
    return dToken;
  }

  @method supplyTokenY(
    adminSignature: Signature,
    tokenTxDetails: TxTokenPairMintContract
  ): UInt64 {
    const isAdmin: Bool = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("supply X: not admin signature");

    const dToken: UInt64 = tokenTxDetails.dToken;
    const reservesY: UInt64 = this.reservesY.getAndRequireEquals();

    const tokenY: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenY.transfer(tokenTxDetails.sender, this.address, dToken);

    this.reservesY.set(reservesY.add(dToken));
    this.emitEvent("supplied-token-y", dToken);
    return dToken;
  }

  @method withdrawTokenY(
    adminSignature: Signature,
    tokenTxDetails: TxTokenPairMintContract
  ): UInt64 {
    const isAdmin: Bool = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("withdraw Y: not admin signature");

    const dToken: UInt64 = tokenTxDetails.dToken;
    const reservesY: UInt64 = this.reservesY.getAndRequireEquals();

    const tokenY: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenY.transfer(this.address, tokenTxDetails.sender, dToken);

    this.reservesY.set(reservesY.sub(dToken));
    this.emitEvent("withdrawn-token-y", dToken);
    return dToken;
  }

  @method swapXforY(
    adminSignature: Signature,
    tokenTxDetails: TxTokenPairMintContract
  ): UInt64 {
    const isAdmin: Bool = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("swap XY: not admin signature");

    const dToken: UInt64 = tokenTxDetails.dToken;
    const reservesLPX: UInt64 = this.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 = this.reservesLPY.getAndRequireEquals();

    const bNumerator: UInt64 = reservesLPY.mul(dToken);
    const bDenominator: UInt64 = reservesLPX.add(dToken);
    const b: UInt64 = bNumerator.div(bDenominator);
    b.assertGreaterThan(UInt64.zero, "swap amount is 0");

    this.reservesLPX.set(reservesLPX.sub(b));
    this.reservesLPY.set(reservesLPY.add(b));
    this.emitEvent("swapped-x-for-y", b);
    return b;
  }

  @method swapYforX(
    adminSignature: Signature,
    tokenTxDetails: TxTokenPairMintContract
  ): UInt64 {
    const isAdmin: Bool = this.checkSignatures(adminSignature, tokenTxDetails);
    isAdmin.assertTrue("swap YX: not admin signature");

    const dToken: UInt64 = tokenTxDetails.dToken;
    const reservesLPX: UInt64 = this.reservesLPX.getAndRequireEquals();
    const reservesLPY: UInt64 = this.reservesLPY.getAndRequireEquals();

    const bNumerator: UInt64 = reservesLPX.mul(dToken);
    const bDenominator: UInt64 = reservesLPY.add(dToken);
    const b: UInt64 = bNumerator.div(bDenominator);
    b.assertGreaterThan(UInt64.zero, "swap amount is 0");

    this.reservesLPY.set(reservesLPY.sub(b));
    this.reservesLPX.set(reservesLPX.add(b));
    this.emitEvent("swapped-y-for-x", b);
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
    tokenTxDetails: TxTokenPairMintContract
  ): Bool {
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(
      admin,
      tokenTxDetails.toFields()
    );
    return isAdmin;
  }

  @method approveBase() {}
}
