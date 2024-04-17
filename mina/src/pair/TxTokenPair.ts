import { UInt64, PublicKey, Struct, Signature, MerkleMapWitness } from "o1js";

import { PersonalPairBalance } from "./PersonalPairBalance";

export class TxTokenPairContract extends Struct({
  signatureAdminPairContract: Signature,
  keyWitness: MerkleMapWitness,
  userBalance: PersonalPairBalance,
  dToken: UInt64,
  tokenPub: PublicKey,
}) {}

export function getTxTokenPairContractStruct(
  signatureAdminPairContract: Signature,
  keyWitness: MerkleMapWitness,
  userBalance: PersonalPairBalance,
  dl: UInt64,
  pairMintingAddress: PublicKey
) {
  const txTokenPairContract: TxTokenPairContract = new TxTokenPairContract({
    signatureAdminPairContract: signatureAdminPairContract,
    keyWitness: keyWitness,
    userBalance: userBalance,
    dToken: dl,
    tokenPub: pairMintingAddress,
  });
  return txTokenPairContract;
}
