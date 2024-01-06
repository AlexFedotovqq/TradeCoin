import {
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  UInt64,
  PublicKey,
  Signature,
  AccountUpdate,
  Account,
} from "o1js";

export class BasicTokenContract extends SmartContract {
  @state(UInt64) totalAmountInCirculation = State<UInt64>();

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

  @method init() {
    super.init();
    this.totalAmountInCirculation.set(UInt64.zero);
  }

  @method mint(
    receiverAddress: PublicKey,
    amount: UInt64,
    adminSignature: Signature
  ) {
    let totalAmountInCirculation =
      this.totalAmountInCirculation.getAndRequireEquals();

    let newTotalAmountInCirculation = totalAmountInCirculation.add(amount);

    adminSignature
      .verify(
        this.address,
        amount.toFields().concat(receiverAddress.toFields())
      )
      .assertTrue();

    this.token.mint({
      address: receiverAddress,
      amount: amount,
    });

    this.totalAmountInCirculation.set(newTotalAmountInCirculation);
  }

  /*   @method tokenInit(receiverAddress: PublicKey) {
    const amount = UInt64.zero;
    this.transfer(this.address, receiverAddress, amount);
  } */

  @method transferToAddress(from: PublicKey, to: PublicKey, value: UInt64) {
    this.token.send({ from, to, amount: value });
  }

  @method transferToUpdate(from: PublicKey, to: AccountUpdate, value: UInt64) {
    this.token.send({ from, to, amount: value });
  }

  transfer(from: PublicKey, to: PublicKey | AccountUpdate, amount: UInt64) {
    if (to instanceof PublicKey)
      return this.transferToAddress(from, to, amount);
    if (to instanceof AccountUpdate)
      return this.transferToUpdate(from, to, amount);
  }

  @method balanceOf(owner: PublicKey): UInt64 {
    let account = Account(owner, this.token.id);
    let balance = account.balance.getAndRequireEquals();
    return balance;
  }
}
