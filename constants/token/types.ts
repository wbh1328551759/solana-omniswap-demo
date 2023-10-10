export interface ParsedTokenInfo {
  owner: string;
  address: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
  isNativeAsset: boolean;
  symbol: string;
  name?: string;
  logo?: string;
}