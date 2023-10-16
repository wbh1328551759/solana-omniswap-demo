import { PublicKey } from '@solana/web3.js'

export interface ParsedTokenInfo {
  owner: string;
  address: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
  isNativeAsset: boolean;
  mintAccount?: PublicKey
  symbol: string;
  name?: string;
  logo?: string;
}