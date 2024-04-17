import { Field, UInt64, PublicKey, Struct, Poseidon } from "o1js";

export class PersonalPairBalance extends Struct({
  id: Field,
  owner: PublicKey,
  tokenXAmount: UInt64,
  tokenYAmount: UInt64,
}) {
  increaseX(dx: UInt64) {
    this.tokenXAmount = this.tokenXAmount.add(dx);
  }
  decreaseX(dx: UInt64) {
    this.tokenXAmount = this.tokenXAmount.sub(dx);
  }
  increaseY(dy: UInt64) {
    this.tokenYAmount = this.tokenYAmount.add(dy);
  }
  decreaseY(dx: UInt64) {
    this.tokenYAmount = this.tokenYAmount.sub(dx);
  }
  supply(dx: UInt64, dy: UInt64) {
    this.decreaseX(dx);
    this.decreaseY(dy);
  }
  burn(dx: UInt64, dy: UInt64) {
    this.increaseX(dx);
    this.increaseY(dy);
  }
  toFields(): Field[] {
    return PersonalPairBalance.toFields(this);
  }
  hash(): Field {
    return Poseidon.hash(PersonalPairBalance.toFields(this));
  }
}
