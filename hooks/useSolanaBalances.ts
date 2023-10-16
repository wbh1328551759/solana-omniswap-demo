import {useState, useEffect} from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import {createParsedTokenInfo} from '../utils/createParsedTokenInfo'
import { useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react'
import {SOL_TOKEN_INFO, SOLANA_RPC_URL} from '../constants/solana'
import { formatUnits } from 'ethers'
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {ParsedTokenInfo} from '../constants/token/types'
import {useSolanaTokenList} from './useSolanaTokenList'


export const useSolanaBalances = (): { data: ParsedTokenInfo[], isLoading: boolean } => {
  const { publicKey: solanaAddress } = useSolanaWallet()
  const [nativeTokenBalance, setNativeTokenBalance] = useState<ParsedTokenInfo>(null)
  const [solTokens, setSolTokens] = useState<ParsedTokenInfo[]>([])
  const {data: solAllTokenList} = useSolanaTokenList()
  const [loading, setLoading] = useState<boolean>(true)
  const { connection } = useConnection();

  useEffect(() => {
    const getNativeTokenBalance = async () => {
      const accountsTokens = await connection.getMultipleAccountsInfo([new PublicKey(solanaAddress)], 'confirmed');
      const formatToken = createParsedTokenInfo({
        owner: String(solanaAddress),
        decimals: SOL_TOKEN_INFO.decimals,
        symbol: 'SOL',
        amount: accountsTokens[0].lamports.toString(),
        uiAmount: parseFloat(formatUnits(accountsTokens[0].lamports, SOL_TOKEN_INFO.decimals)),
        uiAmountString: formatUnits(accountsTokens[0].lamports, SOL_TOKEN_INFO.decimals).toString(),
        isNativeAsset: true,
        address: SOL_TOKEN_INFO.address,
      })
      setNativeTokenBalance(formatToken)
      setSolTokens(solTokens => [formatToken])
    }
    connection && solanaAddress && getNativeTokenBalance()
  }, [solanaAddress, connection])

  useEffect(() => {
    const getSolTokenBalance = async () => {
      const res = await connection.getParsedTokenAccountsByOwner(new PublicKey(solanaAddress), {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      });

      const formatRes: ParsedTokenInfo[] = (res.value).map(i => {
        return createParsedTokenInfo({
          owner: String(solanaAddress),
          address: i.account.data.parsed?.info?.mint?.toString(),
          amount: i.account.data.parsed?.info?.tokenAmount?.amount,
          uiAmountString: i.account.data.parsed?.info?.tokenAmount?.uiAmountString,
          uiAmount: i.account.data.parsed?.info?.tokenAmount?.uiAmount,
          symbol: '',
          decimals: i.account.data.parsed?.info?.tokenAmount?.decimals,
          isNativeAsset: false,
          logo: '',
          mintAccount: i.pubkey
        })
      })
      const allTokens: ParsedTokenInfo[] = [...solTokens, ...formatRes].map(i => {
        const token = solAllTokenList.find(token => token.address === i.address)
        return {
          ...i,
          symbol: token?.symbol || 'unknown',
          logo: token?.logoURI || '',
        }
      })
      const uniqueObj: Record<string, ParsedTokenInfo> = {}
      const result: ParsedTokenInfo[] = []
      for(let i = 0; i < allTokens.length; i ++) {
        const token = allTokens[i]
        if (!uniqueObj[token.address]) {
          uniqueObj[token.address] = token

          result.push(token)
        }
      }

      setLoading(false)
      setSolTokens(solTokens => ([...result]))
    }

    connection && solanaAddress && solAllTokenList.length > 0 && nativeTokenBalance && getSolTokenBalance()
  }, [solanaAddress, connection, solAllTokenList.length, nativeTokenBalance])

  return { isLoading: loading, data: solTokens }
}