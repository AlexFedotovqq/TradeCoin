import { UInt64, PublicKey, Field, Struct, Poseidon } from "o1js";

export class TxTokenPairMintContract extends Struct({
  sender: PublicKey,
  dToken: UInt64,
  tokenPub: PublicKey,
}) {
  toFields(): Field[] {
    return TxTokenPairMintContract.toFields(this);
  }
  hash(): Field {
    return Poseidon.hash(TxTokenPairMintContract.toFields(this));
  }
}

export function getTxTokenPairMintContractStruct(
  userAddress: PublicKey,
  dl: UInt64,
  pairMintingAddress: PublicKey
) {
  const tokenPairMintTx = new TxTokenPairMintContract({
    sender: userAddress,
    tokenPub: pairMintingAddress,
    dToken: dl,
  });
  return tokenPairMintTx;
}
