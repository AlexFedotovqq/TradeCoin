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
} from "o1js";

const tokenSymbol = "ABC";
const URI = "https//tradecoin.dev/uri/uri.json";

export class BasicTokenContract extends SmartContract {
  @state(PublicKey) admin = State<PublicKey>();
  @state(UInt64) totalSupply = State<UInt64>();

  deploy(args?: DeployArgs) {
    super.deploy(args);
    const permissionToEdit = Permissions.proof();
    this.account.permissions.set({
      ...Permissions.default(),
      editState: permissionToEdit,
      setTokenSymbol: permissionToEdit,
      setZkappUri: permissionToEdit,
      send: permissionToEdit,
      receive: permissionToEdit,
    });
  }

  init() {
    super.init();
    this.totalSupply.set(UInt64.zero);
    this.account.tokenSymbol.set(tokenSymbol);
    this.account.zkappUri.set(URI);
    const sender: PublicKey = this.checkUserSignature();
    this.admin.set(sender);
  }

  @method mint(receiverAddress: PublicKey, amount: UInt64) {
    this.checkAdminSignature();
    const totalSupply: UInt64 = this.totalSupply.getAndRequireEquals();
    const newTotalSupply: UInt64 = totalSupply.add(amount);
    this.token.mint({
      address: receiverAddress,
      amount: amount,
    });
    this.totalSupply.set(newTotalSupply);
  }

  @method transferToAddress(from: PublicKey, to: PublicKey, value: UInt64) {
    this.token.send({ from, to, amount: value });
  }

  @method transferToUpdate(from: PublicKey, to: AccountUpdate, value: UInt64) {
    this.token.send({ from, to, amount: value });
  }

  transfer(from: PublicKey, to: PublicKey | AccountUpdate, amount: UInt64) {
    if (to instanceof PublicKey)
      return this.transferToAddress(from, to, amount);
    if (to instanceof SmartContract)
      return this.transferToUpdate(from, to, amount);
  }

  private checkUserSignature() {
    const user: PublicKey = this.sender;
    const senderUpdate: AccountUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
  }

  private checkAdminSignature() {
    const user: PublicKey = this.sender;
    const admin: PublicKey = this.admin.getAndRequireEquals();
    user.assertEquals(admin);
    const senderUpdate: AccountUpdate = AccountUpdate.create(admin);
    senderUpdate.requireSignature();
  }
}

export function createCustomToken(tokenSymbol: string, URI: string) {
  class BasicTokenContract extends SmartContract {
    @state(PublicKey) admin = State<PublicKey>();
    @state(UInt64) totalSupply = State<UInt64>();

    deploy(args?: DeployArgs) {
      super.deploy(args);
      const permissionToEdit = Permissions.proof();
      this.account.permissions.set({
        ...Permissions.default(),
        editState: permissionToEdit,
        setTokenSymbol: permissionToEdit,
        setZkappUri: permissionToEdit,
        send: permissionToEdit,
        receive: permissionToEdit,
      });
    }

    init() {
      super.init();
      this.totalSupply.set(UInt64.zero);
      this.account.tokenSymbol.set(tokenSymbol);
      this.account.zkappUri.set(URI);
      const sender = this.checkUserSignature();
      this.admin.set(sender);
    }

    @method mint(receiverAddress: PublicKey, amount: UInt64) {
      this.checkAdminSignature();
      const totalSupply = this.totalSupply.getAndRequireEquals();
      const newTotalSupply = totalSupply.add(amount);
      this.token.mint({
        address: receiverAddress,
        amount: amount,
      });
      this.totalSupply.set(newTotalSupply);
    }

    @method transferToAddress(from: PublicKey, to: PublicKey, value: UInt64) {
      this.token.send({ from, to, amount: value });
    }

    @method transferToUpdate(
      from: PublicKey,
      to: AccountUpdate,
      value: UInt64
    ) {
      this.token.send({ from, to, amount: value });
    }

    transfer(from: PublicKey, to: PublicKey | AccountUpdate, amount: UInt64) {
      if (to instanceof PublicKey)
        return this.transferToAddress(from, to, amount);
      if (to instanceof SmartContract)
        return this.transferToUpdate(from, to, amount);
    }

    checkUserSignature() {
      const user = this.sender;
      const senderUpdate = AccountUpdate.create(user);
      senderUpdate.requireSignature();
      return user;
    }

    checkAdminSignature() {
      const user = this.sender;
      const admin = this.admin.getAndRequireEquals();
      user.assertEquals(admin);
      const senderUpdate = AccountUpdate.create(admin);
      senderUpdate.requireSignature();
    }
  }
  return BasicTokenContract;
}
