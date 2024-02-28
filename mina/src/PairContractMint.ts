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

export class PairMintContract extends SmartContract {
  @state(PublicKey) owner = State<PublicKey>();

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

  @method initOwner(owner: PublicKey) {
    this.account.provedState.requireEquals(this.account.provedState.get());
    this.account.provedState.get().assertFalse();

    this.owner.getAndRequireEquals();
    this.owner.set(owner);

    this.checkThisSignature();
  }

  @method mintLiquidityToken(dl: UInt64, recipient: PublicKey) {
    this.checkOwnerSignature();

    const liquidity = this.totalSupply.getAndRequireEquals();
    this.token.mint({ address: recipient, amount: dl });

    this.totalSupply.set(liquidity.add(dl));
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
}
