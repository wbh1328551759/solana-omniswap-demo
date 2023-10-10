import { Connection, PublicKey } from '@solana/web3.js'
import {TOKEN_PROGRAM_ID} from '@solana/spl-token'

type TokenAccountItem = {
  tokenAddress: string,
  tokenAccount: PublicKey,
}

export const getTokenAccounts = async (connection: Connection, account: PublicKey): Promise<TokenAccountItem[]> => {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(account, { programId: TOKEN_PROGRAM_ID }, 'confirmed');

  return tokenAccounts.value.map(i => {
    return {
      tokenAddress: i.account.data.parsed.info.mint,
      tokenAccount: i.pubkey,
    }
  })
}