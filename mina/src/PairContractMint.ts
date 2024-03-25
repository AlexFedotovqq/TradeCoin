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

export class TokenTx extends Struct({
  sender: PublicKey,
  tokenPub: PublicKey,
  dToken: UInt64,
}) {
  toFields(): Field[] {
    return TokenTx.toFields(this);
  }
  hash(): Field {
    return Poseidon.hash(TokenTx.toFields(this));
  }
}

export class PairMintContract extends SmartContract {
  @state(PublicKey) owner = State<PublicKey>();
  @state(PublicKey) admin = State<PublicKey>();
  @state(UInt64) reservesX = State<UInt64>();
  @state(UInt64) reservesY = State<UInt64>();
  @state(UInt64) totalSupply = State<UInt64>();

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

  @method initOwner(owner: PublicKey): Bool {
    this.checkNotInitialized();
    this.checkThisSignature();
    super.init();
    this.owner.getAndRequireEquals();
    this.owner.set(owner);
    return Bool(true);
  }

  @method setAdmin(admin: PublicKey): Bool {
    this.checkInitialized();
    this.checkOwnerSignature();
    this.admin.getAndRequireEquals();
    this.admin.set(admin);
    return Bool(true);
  }

  @method mintLiquidityToken(
    adminSignature: Signature,
    tokenTxDetails: TokenTx
  ): Bool {
    this.checkInitialized();
    this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = adminSignature.verify(admin, tokenTxDetails.toFields());
    isAdmin.assertTrue("not admin signature");
    const liquidity = this.totalSupply.getAndRequireEquals();
    this.token.mint({
      address: tokenTxDetails.sender,
      amount: tokenTxDetails.dToken,
    });
    this.totalSupply.set(liquidity.add(tokenTxDetails.dToken));
    return Bool(true);
  }

  @method supplyTokenX(
    adminSignature: Signature,
    tokenTxDetails: TokenTx
  ): Bool {
    this.checkInitialized();
    this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = adminSignature.verify(admin, tokenTxDetails.toFields());
    isAdmin.assertTrue("not admin signature");
    const tokenX = new BasicTokenContract(tokenTxDetails.tokenPub);
    tokenX.transfer(tokenTxDetails.sender, this.address, tokenTxDetails.dToken);
    const reservesX = this.reservesX.getAndRequireEquals();
    this.reservesX.set(reservesX.add(tokenTxDetails.dToken));
    return Bool(true);
  }

  @method supplyTokenY(
    adminSignature: Signature,
    tokenTxDetails: TokenTx
  ): Bool {
    this.checkInitialized();
    this.checkUserSignature();
    const admin = this.admin.getAndRequireEquals();
    const isAdmin = adminSignature.verify(admin, tokenTxDetails.toFields());
    isAdmin.assertTrue("not admin signature");
    const tokenY = new BasicTokenContract(tokenTxDetails.tokenPub);
    tokenY.transfer(tokenTxDetails.sender, this.address, tokenTxDetails.dToken);
    const reservesY = this.reservesY.getAndRequireEquals();
    this.reservesY.set(reservesY.add(tokenTxDetails.dToken));
    return Bool(true);
  }

  private checkUserSignature() {
    const user = this.sender;
    const senderUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
  }

  private checkOwnerSignature() {
    const owner = this.owner.getAndRequireEquals();
    const sender = this.sender;
    sender.assertEquals(owner);
    const senderUpdate = AccountUpdate.create(owner);
    senderUpdate.requireSignature();
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
