import {OMNISWAP_PROGRAM_ID, TOKEN_BRIDGE_PROGRAM_ID, WORMHOLE_PROGRAM_ID} from '../constants/solana'
import { PublicKey } from '@solana/web3.js'
import {
  SEED_PREFIX_AUTHORITY_SIGNER,
  SEED_PREFIX_BRIDGE,
  SEED_PREFIX_CONFIG,
  SEED_PREFIX_CUSTODY_SIGNER,
  SEED_PREFIX_EMITTER,
  SEED_PREFIX_FEE_BRIDGED,
  SEED_PREFIX_FEE_COLLECTOR,
  SEED_PREFIX_FOREIGN_CONTRACT,
  SEED_PREFIX_SENDER,
  SEED_PREFIX_SEQUENCE,
  SEED_PREFIX_TMP
} from '../constants/seedPrefix'

function deriveSenderConfigKey(programId: PublicKey): PublicKey {
  const [programAddress] = PublicKey.findProgramAddressSync([Buffer.from(SEED_PREFIX_SENDER)], programId);
  return programAddress
}

function deriveForeignContractKey(programId: PublicKey, chain: number): PublicKey {
  const seed = [Buffer.from(SEED_PREFIX_FOREIGN_CONTRACT)];
  const chainBuffer = Buffer.alloc(2);
  chainBuffer.writeUInt16LE(chain, 0);
  seed.push(chainBuffer);

  const [programAddress] = PublicKey.findProgramAddressSync(seed, programId);
  return programAddress
}

function deriveTmpTokenAccountKey(programId: PublicKey, wrappedMint: PublicKey): PublicKey {
  const seed = [Buffer.from(SEED_PREFIX_TMP)];
  const wrappedMintBuffer = wrappedMint.toBuffer(); // 转换为 Buffer
  seed.push(wrappedMintBuffer);

  const [programAddress] = PublicKey.findProgramAddressSync(seed, programId);
  return programAddress
}

function deriveTokenBridgeConfigKey(programId: PublicKey): PublicKey {
  const [programAddress] = PublicKey.findProgramAddressSync([Buffer.from(SEED_PREFIX_CONFIG)], programId);
  return programAddress
}

function deriveCustodyKey(programId: PublicKey, wrappedMint: PublicKey): PublicKey {
  const nativeMintBuffer = wrappedMint.toBuffer(); // 转换为 Buffer

  const [programAddress] = PublicKey.findProgramAddressSync(
    [nativeMintBuffer],
    programId
  );
  return programAddress;
}

function deriveAuthoritySignerKey(programId: PublicKey): PublicKey {
  const [programAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_PREFIX_AUTHORITY_SIGNER)],
    programId
  );
  return programAddress;
}

function deriveCustodySignerKey(programId: PublicKey): PublicKey {
  const [programAddress, _nonce] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_PREFIX_CUSTODY_SIGNER)],
    programId
  );
  return programAddress
}

function deriveWormholeBridgeDataKey(programId: PublicKey): PublicKey {
  const [programAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_PREFIX_BRIDGE)],
    programId
  );
  return programAddress
}

function deriveWormholeEmitterKey(programId: PublicKey): PublicKey {
  const [programAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_PREFIX_EMITTER)],
    programId
  );
  return programAddress
}

function deriveEmitterSequenceKey(emitter: PublicKey, wormholeProgramId: PublicKey): PublicKey {
  const seed = [Buffer.from(SEED_PREFIX_SEQUENCE), Buffer.from(emitter.toBuffer())];

  const [programAddress] = PublicKey.findProgramAddressSync(
    seed,
    wormholeProgramId
  );
  return programAddress
}

function getEmitterKeys(tokenBridgeProgramId: PublicKey, wormholeProgramId: PublicKey): [PublicKey, PublicKey] {
  const emitter = deriveWormholeEmitterKey(tokenBridgeProgramId);
  const sequence = deriveEmitterSequenceKey(emitter, wormholeProgramId);

  return [emitter, sequence];
}

function deriveFeeCollectorKey(programId: PublicKey): PublicKey {
  const [programAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_PREFIX_FEE_COLLECTOR)],
    programId
  );
  return programAddress;
}

export function deriveTokenTransferMessageKey(programId: PublicKey, nextSeq: number): PublicKey {
  const nextSeqBuffer = Buffer.alloc(8); // 创建一个包含 8 个字节的 Buffer
  nextSeqBuffer.writeUIntLE(nextSeq, 0, 8);

  const seed = [Buffer.from(SEED_PREFIX_FEE_BRIDGED)];
  seed.push(nextSeqBuffer);

  const [programAddress] = PublicKey.findProgramAddressSync(seed, programId);
  return programAddress
}


export const getSendNativeTransferAccounts = (
  recipientChainId: number,
  nativeMintKey: PublicKey
): {
  sendConfig: PublicKey,
  foreignContract: PublicKey,
  tmpTokenAccount: PublicKey,
  wormholeProgram: PublicKey,
  tokenBridgeProgram: PublicKey,
  tokenBridgeConfig: PublicKey,
  tokenBridgeCustody: PublicKey,
  tokenBridgeAuthoritySigner: PublicKey,
  tokenBridgeCustodySigner: PublicKey,
  wormholeBridge: PublicKey,
  tokenBridgeEmitter: PublicKey,
  tokenBridgeSequence: PublicKey,
  wormholeFeeCollector: PublicKey,
} => {

  const omniSwapProgramId = new PublicKey(OMNISWAP_PROGRAM_ID)
  const tokenBridgeProgramId = new PublicKey(TOKEN_BRIDGE_PROGRAM_ID)
  const wormholeProgramId = new PublicKey(WORMHOLE_PROGRAM_ID)

  const [tokenBridgeEmitter, tokenBridgeSequence] = getEmitterKeys(tokenBridgeProgramId, wormholeProgramId)
  return {
    sendConfig: deriveSenderConfigKey(omniSwapProgramId),
    foreignContract: deriveForeignContractKey(omniSwapProgramId, recipientChainId),
    tmpTokenAccount: deriveTmpTokenAccountKey(omniSwapProgramId, nativeMintKey),
    wormholeProgram: new PublicKey(WORMHOLE_PROGRAM_ID),
    tokenBridgeProgram: new PublicKey(TOKEN_BRIDGE_PROGRAM_ID),
    tokenBridgeConfig: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
    tokenBridgeCustody: deriveCustodyKey(tokenBridgeProgramId, nativeMintKey),
    tokenBridgeAuthoritySigner: deriveAuthoritySignerKey(tokenBridgeProgramId),
    tokenBridgeCustodySigner: deriveCustodySignerKey(tokenBridgeProgramId),
    wormholeBridge: deriveWormholeBridgeDataKey(wormholeProgramId),
    tokenBridgeEmitter: tokenBridgeEmitter,
    // tokenBridgeEmitter: '',
    // tokenBridgeSequence: '',
    tokenBridgeSequence: tokenBridgeSequence,
    wormholeFeeCollector: deriveFeeCollectorKey(wormholeProgramId),
  }
}