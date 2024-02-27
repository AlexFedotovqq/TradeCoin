import {
  SmartContract,
  state,
  State,
  Field,
  method,
  DeployArgs,
  Permissions,
  UInt64,
  PublicKey,
  AccountUpdate,
  Signature,
  Provable,
} from "o1js";

import { BasicTokenContract } from "./BasicTokenContract.js";

export class PairContract extends SmartContract {
  @state(Field) treeRoot = State<Field>();
  /**
   * state that keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
   *
   * total supply is initially zero; it increases when supplying liquidity and decreases when redeeming it
   */
  @state(UInt64) totalSupply = State<UInt64>();

  @state(PublicKey) tokenX = State<PublicKey>();
  @state(PublicKey) tokenY = State<PublicKey>();

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
  }

  /**
   * Initialize Token Addresses
   * @param _tokenX X token public key
   * @param _tokenY Y token public key
   */
  @method initTokenAddresses(
    _tokenX: PublicKey,
    _tokenY: PublicKey
    //adminSignature: Signature
  ) {
    this.account.provedState.requireEquals(this.account.provedState.get());
    this.account.provedState.get().assertFalse();

    //adminSignature.verify(this.address, this.address.toFields()).assertTrue();

    this.tokenX.getAndRequireEquals();
    this.tokenY.getAndRequireEquals();

    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
  }

  @method supplyTokenX(dx: UInt64) {
    const tokenXPub = this.tokenX.getAndRequireEquals();
    const tokenX = new BasicTokenContract(tokenXPub);

    const user = this.sender;
    const senderUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();

    tokenX.transfer(user, this.address, dx);
  }

  @method supplyTokenY(dy: UInt64) {
    const tokenYPub = this.tokenX.getAndRequireEquals();
    const tokenY = new BasicTokenContract(tokenYPub);

    const user = this.sender;
    const senderUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();

    tokenY.transfer(user, this.address, dy);
  }

  @method mintLiquidityToken(dl: UInt64) {
    const liquidity = this.totalSupply.getAndRequireEquals();

    const user = this.sender;
    const senderUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();

    this.token.mint({ address: user, amount: dl });

    // update liquidity supply

    this.totalSupply.set(liquidity.add(dl));
  }

  /**
   * Helper which queries app balances of tokenX and tokenY
   */
  dexTokensBalance(
    tokenX: BasicTokenContract,
    tokenY: BasicTokenContract
  ): { dexX: UInt64; dexY: UInt64 } {
    let dexX = tokenX.balanceOf(this.address);
    let dexY = tokenY.balanceOf(this.address);
    return { dexX, dexY };
  }
}
