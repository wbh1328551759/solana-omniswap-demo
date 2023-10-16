
import React, { ReactNode, useMemo } from 'react'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {
  BraveWalletAdapter,
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js'
import {SOLANA_RPC_URL} from '../constants/solana'


/** include: SolanaWalletConnectionProvider SolanaWalletAdaptorsProvider SolanaWalletModalProvider */
export function SolanaWalletProvider({ children }: { children?: ReactNode }) {
  // Set to 'devnet' | 'testnet' | 'mainnet-beta' or provide a custom RPC endpoint

  const endpoint = useMemo(() => SOLANA_RPC_URL, []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // new SolflareWalletAdapter(),
    ],
    [endpoint]
  )


  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect
      >
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
