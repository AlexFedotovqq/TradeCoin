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
  Int64,
  Account,
} from "o1js";

export class BasicTokenContract extends SmartContract {
  @state(UInt64) totalAmountInCirculation = State<UInt64>();

  deploy(args?: DeployArgs) {
    super.deploy(args);

    const permissionToEdit = Permissions.proof();
    //let none = Permissions.none();

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
      this.totalAmountInCirculation.getAndAssertEquals();

    let newTotalAmountInCirculation = totalAmountInCirculation.add(amount);

    adminSignature
      .verify(
        this.address,
        amount.toFields().concat(receiverAddress.toFields())
      )
      .assertTrue();

    this.token.mint({
      address: receiverAddress,
      amount,
    });

    this.totalAmountInCirculation.set(newTotalAmountInCirculation);
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
    if (to instanceof AccountUpdate)
      return this.transferToUpdate(from, to, amount);
  }

  @method balanceOf(owner: PublicKey): UInt64 {
    let account = Account(owner, this.token.id);
    let balance = account.balance.getAndAssertEquals();
    return balance;
  }

  @method approveUpdateAndSend(
    zkappUpdate: AccountUpdate,
    to: PublicKey,
    amount: UInt64
  ) {
    // TODO: THIS IS INSECURE. The proper version has a prover error (compile != prove) that must be fixed
    //this.approve(zkappUpdate, AccountUpdate.Layout.AnyChildren);

    // THIS IS HOW IT SHOULD BE DONE:
    // // approve a layout of two grandchildren, both of which can't inherit the token permission
    let { StaticChildren, AnyChildren } = AccountUpdate.Layout;
    this.approve(zkappUpdate, StaticChildren(AnyChildren, AnyChildren));
    zkappUpdate.body.mayUseToken.parentsOwnToken.assertTrue();
    let [grandchild1, grandchild2] = zkappUpdate.children.accountUpdates;
    grandchild1.body.mayUseToken.inheritFromParent.assertFalse();
    grandchild2.body.mayUseToken.inheritFromParent.assertFalse();

    // see if balance change cancels the amount sent
    let balanceChange = Int64.fromObject(zkappUpdate.body.balanceChange);
    balanceChange.assertEquals(Int64.from(amount).neg());
    // add same amount of tokens to the receiving address
    this.token.mint({ address: to, amount });
  }
}
