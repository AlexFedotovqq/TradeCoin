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
  Struct,
  MerkleMapWitness,
  MerkleMap,
  Poseidon,
} from "o1js";

import { PairMintContract } from "./PairContractMint.js";

export class PersonalPairBalance extends Struct({
  owner: PublicKey,
  id: Field,
  tokenXAmount: UInt64,
  tokenYAmount: UInt64,
}) {
  increaseX(dx: UInt64) {
    this.tokenXAmount = this.tokenXAmount.add(dx);
  }
  increaseY(dy: UInt64) {
    this.tokenYAmount = this.tokenYAmount.add(dy);
  }
  supply(dl: UInt64) {
    this.tokenXAmount = this.tokenXAmount.sub(dl);
    this.tokenYAmount = this.tokenYAmount.sub(dl);
  }
  hash(): Field {
    return Poseidon.hash(PersonalPairBalance.toFields(this));
  }
}

export class PairContract extends SmartContract {
  @state(PublicKey) admin = State<PublicKey>();
  @state(PublicKey) tokenX = State<PublicKey>();
  @state(PublicKey) tokenY = State<PublicKey>();

  @state(Field) treeRoot = State<Field>();
  @state(Field) userId = State<Field>();

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

  /**
   * Initialize Token Addresses
   * @param _tokenX X token public key
   * @param _tokenY Y token public key
   */
  @method initTokenAddresses(_tokenX: PublicKey, _tokenY: PublicKey) {
    this.checkNotInitialized();
    this.checkAdminSignature();

    super.init();

    const map = new MerkleMap().getRoot();
    this.treeRoot.set(map);

    this.tokenX.getAndRequireEquals();
    this.tokenY.getAndRequireEquals();

    this.tokenX.set(_tokenX);
    this.tokenY.set(_tokenY);
  }

  @method createPersonalBalance(keyWitness: MerkleMapWitness) {
    this.checkInitialized();
    this.checkAdminSignature();
    const user = this.checkUserSignature();

    const currentId = this.userId.getAndRequireEquals();
    const initialRoot = this.treeRoot.getAndRequireEquals();

    const [rootBefore, key] = keyWitness.computeRootAndKey(Field(0));
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(currentId);

    const Balance = new PersonalPairBalance({
      owner: user,
      id: currentId,
      tokenXAmount: UInt64.zero,
      tokenYAmount: UInt64.zero,
    });

    const [rootAfter, keyAfter] = keyWitness.computeRootAndKey(Balance.hash());
    key.assertEquals(keyAfter);

    this.userId.set(currentId.add(1));
    this.treeRoot.set(rootAfter);
  }

  @method supplyTokenX(
    dx: UInt64,
    keyWitness: MerkleMapWitness,
    balance: PersonalPairBalance,
    tokenPub: PublicKey
  ) {
    this.checkInitialized();
    this.checkAdminSignature();
    this.checkUserSignature();

    const tokenXPub = this.tokenX.getAndRequireEquals();

    this.checkMerkleMap(keyWitness, balance);

    const pairMintContract = new PairMintContract(tokenPub);
    const res = pairMintContract.supplyTokenX(tokenXPub, dx);
    res.assertTrue();

    balance.increaseX(dx);
    const [rootAfter] = keyWitness.computeRootAndKey(balance.hash());

    this.treeRoot.set(rootAfter);
  }

  @method supplyTokenY(
    dy: UInt64,
    keyWitness: MerkleMapWitness,
    balance: PersonalPairBalance,
    tokenPub: PublicKey
  ) {
    this.checkInitialized();
    this.checkAdminSignature();
    this.checkUserSignature();

    const tokenYPub = this.tokenX.getAndRequireEquals();

    this.checkMerkleMap(keyWitness, balance);

    const pairMintContract = new PairMintContract(tokenPub);
    const res = pairMintContract.supplyTokenY(tokenYPub, dy);
    res.assertTrue();

    balance.increaseY(dy);
    const [rootAfter] = keyWitness.computeRootAndKey(balance.hash());

    this.treeRoot.set(rootAfter);
  }

  @method mintLiquidityToken(
    dl: UInt64,
    keyWitness: MerkleMapWitness,
    balance: PersonalPairBalance,
    tokenPub: PublicKey
  ) {
    this.checkInitialized();
    this.checkAdminSignature();
    const user = this.checkUserSignature();

    this.checkMerkleMap(keyWitness, balance);

    const pairMintContract = new PairMintContract(tokenPub);
    const res = pairMintContract.mintLiquidityToken(dl, user);
    res.assertTrue();

    balance.supply(dl);
    const [rootAfter] = keyWitness.computeRootAndKey(balance.hash());

    this.treeRoot.set(rootAfter);
  }

  checkMerkleMap(
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance
  ) {
    const initialRoot = this.treeRoot.getAndRequireEquals();
    const [rootBefore, key] = keyWitness.computeRootAndKey(
      balanceBefore.hash()
    );
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balanceBefore.id);
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
