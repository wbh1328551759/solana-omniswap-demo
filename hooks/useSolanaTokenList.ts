import { ENV, TokenInfo, TokenListProvider } from "@solana/spl-token-registry";
import { useEffect, useState } from 'react'
import {useIsMounted} from './useIsMounted'

type State = {
  data: TokenInfo[]
  isLoading: boolean
}

export const useSolanaTokenList = (): State => {
  const [state, setState] = useState<State>({
    data: [],
    isLoading: false
  })
  const isMounted = useIsMounted()

  useEffect(() => {
    const fetchSqlTokens = async () => {
      const tokenProvider = new TokenListProvider()

      setState(state => ({ ...state, isLoading: true }))
      const tokens = await tokenProvider.resolve()
      const tokenList = tokens.filterByChainId(ENV.Devnet).getList()
      setState(state => ({ data: tokenList, isLoading: false }))
    }
    isMounted && fetchSqlTokens()
  }, [isMounted])

  return state
}