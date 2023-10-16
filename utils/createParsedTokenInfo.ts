import {ParsedTokenInfo} from '../constants/token/types'

export function createParsedTokenInfo({
  owner,
  address,
  amount,
  decimals,
  uiAmount,
  uiAmountString,
  symbol,
  isNativeAsset,
  mintAccount,
  logo = '',
  name = 'Solana'
}: ParsedTokenInfo): ParsedTokenInfo {
  return {
    owner,
    address,
    amount,
    decimals,
    uiAmount,
    uiAmountString,
    symbol,
    name,
    logo,
    isNativeAsset,
    mintAccount,
  };
}