import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import {SolanaWalletProvider} from '../hooks/SolanaWalletProvider'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { polygon } from '@wagmi/core/chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <SolanaWalletProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </SolanaWalletProvider>
    </WagmiConfig>
  )
}
