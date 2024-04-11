import {
  Bool,
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

  transfer(from: PublicKey, to: PublicKey, amount: UInt64) {
    if (to instanceof PublicKey) {
      return this.transferToAddress(from, to, amount);
    }
  }

  @method transferToAddress(from: PublicKey, to: PublicKey, value: UInt64) {
    this.internal.send({ from, to, amount: value });
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
    const isAdmin: Bool = user.equals(admin);
    isAdmin.assertEquals(true, "not admin");
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

    transfer(from: PublicKey, to: PublicKey, amount: UInt64) {
      if (to instanceof PublicKey) {
        return this.transferToAddress(from, to, amount);
      }
    }

    @method transferToAddress(from: PublicKey, to: PublicKey, value: UInt64) {
      this.internal.send({ from, to, amount: value });
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
      const isAdmin: Bool = user.equals(admin);
      isAdmin.assertEquals(true, "not admin");
      const senderUpdate: AccountUpdate = AccountUpdate.create(admin);
      senderUpdate.requireSignature();
    }
  }
  return BasicTokenContract;
}
