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
} from "o1js";

import { BasicTokenContract } from "./BasicTokenContract.js";

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

    const sender = this.checkUserSignature();
    this.admin.set(sender);
  }

  @method initOwner(owner: PublicKey): Bool {
    this.checkNotInitialized();
    this.checkThisSignature();

    super.init();

    this.owner.getAndRequireEquals();
    this.owner.set(owner);
    return Bool(true);
  }

  @method mintLiquidityToken(dl: UInt64, recipient: PublicKey): Bool {
    this.checkInitialized();
    this.checkAdminSignature();
    this.checkUserSignature();

    const liquidity = this.totalSupply.getAndRequireEquals();
    this.token.mint({ address: recipient, amount: dl });

    this.totalSupply.set(liquidity.add(dl));
    return Bool(true);
  }

  @method supplyTokenX(tokenXPub: PublicKey, dx: UInt64): Bool {
    this.checkInitialized();
    this.checkAdminSignature();
    const sender = this.checkUserSignature();

    const tokenX = new BasicTokenContract(tokenXPub);

    tokenX.transfer(sender, this.address, dx);

    const reservesX = this.reservesX.getAndRequireEquals();
    this.reservesX.set(reservesX.add(dx));
    return Bool(true);
  }

  @method supplyTokenY(tokenYPub: PublicKey, dy: UInt64): Bool {
    this.checkInitialized();
    this.checkAdminSignature();
    const sender = this.checkUserSignature();

    const tokenY = new BasicTokenContract(tokenYPub);
    tokenY.transfer(sender, this.address, dy);

    const reservesY = this.reservesY.getAndRequireEquals();
    this.reservesY.set(reservesY.add(dy));
    return Bool(true);
  }

  checkUserSignature() {
    const user = this.sender;
    const senderUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
  }

  checkAdminSignature() {
    const admin = this.admin.getAndRequireEquals();
    const senderUpdate = AccountUpdate.create(admin);
    senderUpdate.requireSignature();
  }

  checkOwnerSignature() {
    const owner = this.owner.getAndRequireEquals();
    const senderUpdate = AccountUpdate.create(owner);
    senderUpdate.requireSignature();
  }

  checkThisSignature() {
    const address = this.address;
    const senderUpdate = AccountUpdate.create(address);
    senderUpdate.requireSignature();
  }

  checkInitialized() {
    this.account.provedState.requireEquals(this.account.provedState.get());
    this.account.provedState.get().assertTrue();
  }

  checkNotInitialized() {
    this.account.provedState.requireEquals(this.account.provedState.get());
    this.account.provedState.get().assertFalse();
  }
}
