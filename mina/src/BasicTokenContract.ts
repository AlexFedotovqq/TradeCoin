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
  TokenContract,
} from "o1js";

const tokenSymbol: string = "ABC";
const URI: string = "https//tradecoin.dev/uri/uri.json";

export class BasicTokenContract extends TokenContract {
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
    this.internal.mint({
      address: receiverAddress,
      amount: amount,
    });
    this.totalSupply.set(newTotalSupply);
  }

  @method burn(address: PublicKey, amount: UInt64) {
    this.checkAdminSignature();
    const totalSupply: UInt64 = this.totalSupply.getAndRequireEquals();
    const newTotalSupply: UInt64 = totalSupply.sub(amount);
    this.internal.burn({
      address: address,
      amount: amount,
    });
    this.totalSupply.set(newTotalSupply);
  }

  @method transferToAddress(from: PublicKey, to: PublicKey, value: UInt64) {
    this.internal.send({ from, to, amount: value });
  }

  @method transferToUpdate(from: PublicKey, to: AccountUpdate, value: UInt64) {
    this.internal.send({ from, to, amount: value });
  }

  transfer(from: PublicKey, to: PublicKey | AccountUpdate, amount: UInt64) {
    if (to instanceof PublicKey)
      return this.transferToAddress(from, to, amount);
    if (to instanceof SmartContract)
      return this.transferToUpdate(from, to, amount);
  }

  @method approveBase() {}

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
  class BasicTokenContract extends TokenContract {
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
      this.internal.mint({
        address: receiverAddress,
        amount: amount,
      });
      this.totalSupply.set(newTotalSupply);
    }

    @method burn(address: PublicKey, amount: UInt64) {
      this.checkAdminSignature();
      const totalSupply: UInt64 = this.totalSupply.getAndRequireEquals();
      const newTotalSupply: UInt64 = totalSupply.sub(amount);
      this.internal.burn({
        address: address,
        amount: amount,
      });
      this.totalSupply.set(newTotalSupply);
    }

    @method transferToAddress(from: PublicKey, to: PublicKey, value: UInt64) {
      this.internal.send({ from, to, amount: value });
    }

    @method transferToUpdate(
      from: PublicKey,
      to: AccountUpdate,
      value: UInt64
    ) {
      this.internal.send({ from, to, amount: value });
    }

    transfer(from: PublicKey, to: PublicKey | AccountUpdate, amount: UInt64) {
      if (to instanceof PublicKey)
        return this.transferToAddress(from, to, amount);
      if (to instanceof SmartContract)
        return this.transferToUpdate(from, to, amount);
    }

    @method approveBase() {}

    checkUserSignature() {
      const user: PublicKey = this.sender;
      const senderUpdate: AccountUpdate = AccountUpdate.create(user);
      senderUpdate.requireSignature();
      return user;
    }

    checkAdminSignature() {
      const user: PublicKey = this.sender;
      const admin: PublicKey = this.admin.getAndRequireEquals();
      user.assertEquals(admin);
      const senderUpdate: AccountUpdate = AccountUpdate.create(admin);
      senderUpdate.requireSignature();
    }
  }
  return BasicTokenContract;
}
