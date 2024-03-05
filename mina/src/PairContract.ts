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

import { BasicTokenContract } from "./BasicTokenContract.js";
import { PairMintContract } from "./PairContractMint.js";

export class PersonalPairBalance extends Struct({
  owner: PublicKey,
  id: Field,
  tokenXAmount: UInt64,
  tokenYAmount: UInt64,
}) {}

export class PairContract extends SmartContract {
  @state(Field) treeRoot = State<Field>();

  @state(PublicKey) tokenX = State<PublicKey>();
  @state(PublicKey) tokenY = State<PublicKey>();

  @state(UInt64) reservesX = State<UInt64>();
  @state(UInt64) reservesY = State<UInt64>();

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
  }

  /**
   * Initialize Token Addresses
   * @param _tokenX X token public key
   * @param _tokenY Y token public key
   */
  @method initTokenAddresses(_tokenX: PublicKey, _tokenY: PublicKey) {
    this.checkNotInitialized();
    this.checkThisSignature();

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

    // compute the root after incrementing
    const [rootAfter, keyAfter] = keyWitness.computeRootAndKey(
      Poseidon.hash(PersonalPairBalance.toFields(Balance))
    );
    key.assertEquals(keyAfter);

    this.userId.set(currentId.add(1));
    this.treeRoot.set(rootAfter);
  }

  @method supplyTokenX(
    dx: UInt64,
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance,
    balanceAfter: PersonalPairBalance
  ) {
    this.checkInitialized();
    const user = this.checkUserSignature();

    const tokenXPub = this.tokenX.getAndRequireEquals();
    const tokenX = new BasicTokenContract(tokenXPub);

    const rootAfter = this.checkMerkleMap(
      keyWitness,
      balanceBefore,
      balanceAfter
    );

    const dXbalance = balanceAfter.tokenXAmount.sub(balanceBefore.tokenXAmount);
    dXbalance.assertEquals(dx);

    tokenX.transfer(user, this.address, dx);

    const reservesX = this.reservesX.getAndRequireEquals();
    reservesX.add(dx);

    this.treeRoot.set(rootAfter);
  }

  @method supplyTokenY(
    dy: UInt64,
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance,
    balanceAfter: PersonalPairBalance
  ) {
    this.checkInitialized();
    const user = this.checkUserSignature();

    const tokenYPub = this.tokenX.getAndRequireEquals();
    const tokenY = new BasicTokenContract(tokenYPub);

    const rootAfter = this.checkMerkleMap(
      keyWitness,
      balanceBefore,
      balanceAfter
    );

    const dYbalance = balanceAfter.tokenYAmount.sub(balanceBefore.tokenYAmount);
    dYbalance.assertEquals(dy);

    tokenY.transfer(user, this.address, dy);

    const reservesY = this.reservesY.getAndRequireEquals();
    this.reservesY.set(reservesY.add(dy));

    this.treeRoot.set(rootAfter);
  }

  @method mintLiquidityToken(
    dl: UInt64,
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance,
    balanceAfter: PersonalPairBalance,
    tokenPub: PublicKey
  ) {
    this.checkInitialized();
    const user = this.checkUserSignature();

    const rootAfter = this.checkMerkleMap(
      keyWitness,
      balanceBefore,
      balanceAfter
    );

    const dYbalance = balanceBefore.tokenYAmount.sub(balanceAfter.tokenYAmount);
    dYbalance.assertEquals(dl);
    const dXbalance = balanceBefore.tokenXAmount.sub(balanceAfter.tokenXAmount);
    dXbalance.assertEquals(dl);

    const pairMintContract = new PairMintContract(tokenPub);
    pairMintContract.mintLiquidityToken(dl, user);

    this.treeRoot.set(rootAfter);
  }

  checkMerkleMap(
    keyWitness: MerkleMapWitness,
    balanceBefore: PersonalPairBalance,
    balanceAfter: PersonalPairBalance
  ) {
    const initialRoot = this.treeRoot.getAndRequireEquals();
    const [rootBefore, key] = keyWitness.computeRootAndKey(
      Poseidon.hash(PersonalPairBalance.toFields(balanceBefore))
    );
    rootBefore.assertEquals(initialRoot);
    key.assertEquals(balanceBefore.id);

    // compute the root after incrementing
    const [rootAfter, keyAfter] = keyWitness.computeRootAndKey(
      Poseidon.hash(PersonalPairBalance.toFields(balanceAfter))
    );
    key.assertEquals(keyAfter);
    return rootAfter;
  }

  checkUserSignature() {
    const user = this.sender;
    const senderUpdate = AccountUpdate.create(user);
    senderUpdate.requireSignature();
    return user;
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
