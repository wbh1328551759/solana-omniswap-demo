const SOL_TOKEN_INFO = {
  decimals: 9,
  address: 'So11111111111111111111111111111111111111112'
}

// const SOLANA_RPC_URL = 'https://rpc.helius.xyz/?api-key=2de0b0f3-629e-48a4-b896-e0d120611aab'; // 👈 Replace with your QuickNode Endpoint OR clusterApiUrl('mainnet-beta')
const SOLANA_RPC_URL = 'https://devnet.helius-rpc.com/?api-key=2de0b0f3-629e-48a4-b896-e0d120611aab'; // 👈 Replace with your QuickNode Endpoint OR clusterApiUrl('mainnet-beta')

const OMNISWAP_PROGRAM_ID = '9YYGvVLZJ9XmKM2A1RNv1Dx3oUnHWgtXWt8V3HU5MtXU'

const WORMHOLE_PROGRAM_ID = '3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5'
const TOKEN_BRIDGE_PROGRAM_ID = 'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe'

const CONTRACT_PROGRAM_ID = {
  omniswap: '9YYGvVLZJ9XmKM2A1RNv1Dx3oUnHWgtXWt8V3HU5MtXU',
  wormhole: '3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5',
  tokenBridge: 'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe'
}

const USDC_TOKEN_ADDRESS = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'

const USDC_TOKEN_ADDRESS_BSC = '0x51a3cc54eA30Da607974C5D07B8502599801AC08'

const dstSoDiamondPaddingHex = '00000000000000000000000084b7ca95ac91f8903acb08b27f5b41a4de2dc0fc'

const dstSoDiamondPadding = Buffer.from(dstSoDiamondPaddingHex, "hex")

const BATCH_ID = 0

const wormholeDataParams = {
  dstWormholeChainId: 4,
  dstMaxGasPriceInWeiForRelayer: 100000,
  wormholeFee: 0,
}

const recipientChainId = 4

export {
  SOL_TOKEN_INFO,
  SOLANA_RPC_URL,
  OMNISWAP_PROGRAM_ID,
  TOKEN_BRIDGE_PROGRAM_ID,
  WORMHOLE_PROGRAM_ID,
  CONTRACT_PROGRAM_ID,
  USDC_TOKEN_ADDRESS,
  dstSoDiamondPaddingHex,
  dstSoDiamondPadding,
  BATCH_ID,
  wormholeDataParams,
  recipientChainId,
  USDC_TOKEN_ADDRESS_BSC,
}