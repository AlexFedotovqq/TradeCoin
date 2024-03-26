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

  init() {
    super.init();
    this.totalSupply.set(UInt64.zero);
    this.reservesX.set(UInt64.zero);
    this.reservesY.set(UInt64.zero);
    const sender: PublicKey = this.checkUserSignature();
    this.admin.set(sender);
  }

  @method setOwner(owner: PublicKey): Bool {
    this.checkAdminSignature();
    this.owner.getAndRequireEquals();
    this.owner.set(owner);
    return Bool(true);
  }

  @method mintLiquidityToken(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(
      admin,
      tokenTxDetails.toFields()
    );
    isAdmin.assertTrue("not admin signature");
    const liquidity: UInt64 = this.totalSupply.getAndRequireEquals();
    this.token.mint({
      address: tokenTxDetails.sender,
      amount: tokenTxDetails.dToken,
    });
    this.totalSupply.set(liquidity.add(tokenTxDetails.dToken));
    return Bool(true);
  }

  @method burnLiquidityToken(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(
      admin,
      tokenTxDetails.toFields()
    );
    isAdmin.assertTrue("not admin signature");
    const liquidity: UInt64 = this.totalSupply.getAndRequireEquals();
    this.token.burn({
      address: tokenTxDetails.sender,
      amount: tokenTxDetails.dToken,
    });
    this.totalSupply.set(liquidity.sub(tokenTxDetails.dToken));
    return Bool(true);
  }

  @method supplyTokenX(
    adminSignature: Signature,
    tokenTxDetails: TokenPairMintTx
  ): Bool {
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(
      admin,
      tokenTxDetails.toFields()
    );
    isAdmin.assertTrue("not admin signature");
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
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(
      admin,
      tokenTxDetails.toFields()
    );
    isAdmin.assertTrue("not admin signature");
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
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(
      admin,
      tokenTxDetails.toFields()
    );
    isAdmin.assertTrue("not admin signature");
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
    this.checkUserSignature();
    const admin: PublicKey = this.admin.getAndRequireEquals();
    const isAdmin: Bool = adminSignature.verify(
      admin,
      tokenTxDetails.toFields()
    );
    isAdmin.assertTrue("not admin signature");
    const tokenY: BasicTokenContract = new BasicTokenContract(
      tokenTxDetails.tokenPub
    );
    tokenY.transfer(this.address, tokenTxDetails.sender, tokenTxDetails.dToken);
    const reservesY: UInt64 = this.reservesY.getAndRequireEquals();
    this.reservesY.set(reservesY.sub(tokenTxDetails.dToken));
    return Bool(true);
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
    sender.assertEquals(admin);
    const senderUpdate: AccountUpdate = AccountUpdate.create(admin);
    senderUpdate.requireSignature();
  }
}
