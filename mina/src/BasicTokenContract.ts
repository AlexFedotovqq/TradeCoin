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
  Account,
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

    const sender = this.checkUserSignature();
    this.admin.set(sender);
  }

  init() {
    super.init();
    this.totalSupply.set(UInt64.zero);
    this.account.tokenSymbol.set(tokenSymbol);
    this.account.zkappUri.set(URI);
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

  @method transferToUpdate(from: PublicKey, to: AccountUpdate, value: UInt64) {
    this.token.send({ from, to, amount: value });
  }

  transfer(from: PublicKey, to: PublicKey | AccountUpdate, amount: UInt64) {
    if (to instanceof PublicKey)
      return this.transferToAddress(from, to, amount);
    if (to instanceof SmartContract)
      return this.transferToUpdate(from, to, amount);
  }

  @method balanceOf(owner: PublicKey): UInt64 {
    let account = Account(owner, this.token.id);
    let balance = account.balance.getAndRequireEquals();
    return balance;
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

      const sender = this.checkUserSignature();
      this.admin.set(sender);
    }

    init() {
      super.init();
      this.totalSupply.set(UInt64.zero);
      this.account.tokenSymbol.set(tokenSymbol);
      this.account.zkappUri.set(URI);
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

    @method balanceOf(owner: PublicKey): UInt64 {
      let account = Account(owner, this.token.id);
      let balance = account.balance.getAndRequireEquals();
      return balance;
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
  }
  return BasicTokenContract;
}
