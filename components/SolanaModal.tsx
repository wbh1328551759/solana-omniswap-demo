import { useWallet as useSolanaWallet, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import {useState, useEffect} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Container,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react'
import { Connection, PublicKey, TransactionMessage, VersionedTransaction, AddressLookupTableProgram, SystemProgram, SYSVAR_RENT_PUBKEY, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js'
import { ethers, formatUnits } from 'ethers'
import {useSolanaTokenList} from '../hooks/useSolanaTokenList'
import {createParsedTokenInfo} from '../utils/createParsedTokenInfo'
import {useSolanaBalances} from '../hooks/useSolanaBalances'
import {OMNISWAP_PROGRAM_ID, SOL_TOKEN_INFO} from '../constants/solana'
import { AnchorProvider, setProvider } from "@project-serum/anchor"
import {createExchangeProgram} from '../utils/createExchangeProgram'
import { Program, web3, BN } from "@project-serum/anchor"
import {createOmniswapProgram} from '../utils/createOmniswapProgram'
import {encodeSoData, encodeWormholeData} from '../utils/encodeData'
import {generateRandomBytes32} from '../utils/helper'
import {deriveTokenTransferMessageKey, getSendNativeTransferAccounts} from '../utils/getSendNativeTransferAccounts'
import {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from "@solana/spl-token"
import {getTokenAccounts} from '../utils/getTokenAccounts'

const recipientAddress = '0x0E40519aF01985208114fFac4441b9b13218572F'

const USDC_ADDRESS_SOLANA = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
const USDC_ADDRESS_BSC_TEST = '0x51a3cc54eA30Da607974C5D07B8502599801AC08'


const USDC_PUBLIC_KEY = new PublicKey(USDC_ADDRESS_SOLANA)

export const SolanaModal = () => {
  const [solanaOpen, setSolanaOpen] = useState(false)
  const [balanceOpen, setBalanceOpen] = useState(false)
  const [balance, setBalance] = useState('0')
  const {data: solTokens, isLoading: loadingSolTokens} = useSolanaBalances()
  const { connection } = useConnection()
  const anchorWallet = useAnchorWallet()
  const [omniswapProgram, setOmniswapProgram] = useState<null | Program>(null)

  useEffect(() => {
    if (anchorWallet) {
      const provider = new AnchorProvider(connection, anchorWallet, {})
      setProvider(provider)
      const program = createOmniswapProgram()
      setOmniswapProgram(omniswapProgram => program)
    }
  }, [anchorWallet])

  const { wallets, publicKey: solanaAddress, connected: solanaConnected, disconnect: disconnectSolana, select: connectSolana, sendTransaction } = useSolanaWallet()
  const installedWallets = wallets.filter(
    (w) => w.readyState !== WalletReadyState.NotDetected && w.adapter.name !== 'Sollet'
  )

  const callByProgram = async () => {
    const newAccount = web3.Keypair.generate()
    // console.log('connection', connection)
    // const latestBlockhash = await connection.getLatestBlockhash()
    // console.log('latestBlockhash', latestBlockhash)
    const dstSoDiamondPaddingHex = "00000000000000000000000084b7ca95ac91f8903acb08b27f5b41a4de2dc0fc";
    const dstSoDiamondPadding = Buffer.from(dstSoDiamondPaddingHex, "hex");

    const amount = Math.pow(10, 4)
    const batchId = 0
    const wormholeData = encodeWormholeData(
      4,
      100000,
      0,
      dstSoDiamondPadding,
    )
    const soData = encodeSoData(
      generateRandomBytes32(),
      Buffer.from(recipientAddress.slice(2), "hex"),
      1,
      Buffer.from(USDC_ADDRESS_SOLANA, "hex"),
      4,
      Buffer.from(USDC_ADDRESS_BSC_TEST.slice(2), "hex"),
      amount,
    )
    const swapData = Buffer.from([])

    const {
      sendConfig,
      foreignContract,
      tmpTokenAccount,
      wormholeProgram,
      tokenBridgeProgram,
      tokenBridgeConfig,
      tokenBridgeCustody,
      tokenBridgeAuthoritySigner,
      tokenBridgeCustodySigner,
      wormholeBridge,
      tokenBridgeEmitter,
      tokenBridgeSequence,
      wormholeFeeCollector,
    } = getSendNativeTransferAccounts(
      4,
      USDC_PUBLIC_KEY,
    )

    const currentSeqAccountInfo = await connection.getAccountInfo(tokenBridgeSequence);
    const currentSeqBytes = currentSeqAccountInfo.data;
    const currentSeq = currentSeqBytes.readUIntLE(0, currentSeqBytes.length);

    const nextSeq = currentSeq + 1

    const wormholeMessage = deriveTokenTransferMessageKey(
      new PublicKey(OMNISWAP_PROGRAM_ID),
      nextSeq
    )

    // const tokenAccounts = await getTokenAccounts(connection, solanaAddress)

    const fromTokenAccount = solTokens.find(i => i.address.toLowerCase() === USDC_ADDRESS_SOLANA.toLowerCase())

    const transaction = await omniswapProgram.methods
      .sendNativeTokensWithPayload(
        new BN(batchId),
        new BN(amount),
        wormholeData,
        soData,
        swapData,
      )
      .accounts({
        payer: solanaAddress,
        config: sendConfig,
        foreignContract: foreignContract,
        mint: USDC_PUBLIC_KEY,
        fromTokenAccount: fromTokenAccount?.mintAccount,
        tmpTokenAccount: tmpTokenAccount,
        wormholeProgram: wormholeProgram,
        tokenBridgeProgram: tokenBridgeProgram,
        tokenBridgeConfig: tokenBridgeConfig,
        tokenBridgeCustody: tokenBridgeCustody,
        tokenBridgeAuthoritySigner: tokenBridgeAuthoritySigner,
        tokenBridgeCustodySigner: tokenBridgeCustodySigner,
        wormholeBridge: wormholeBridge,
        wormholeMessage: wormholeMessage,
        tokenBridgeEmitter: tokenBridgeEmitter,
        tokenBridgeSequence: tokenBridgeSequence,
        wormholeFeeCollector: wormholeFeeCollector,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      })
      // .transaction()
      .rpc()
    // const tx = await sendTransaction(transaction, connection)

    console.log('tx', transaction)
    // console.log('transaction', transaction)
    // await connection.confirmTransaction({ transaction, ...latestBlockhash }, 'confirmed');
    // console.log('success!----');

    // const txId = await sendTransaction(transaction, connection)
    // console.log('txId', txId)

  }

  return (
    <>
      {solanaConnected ? (
        <Flex align={'center'} py={'24px'} direction={'column'}>
          <Text mr={'20px'}>{String(solanaAddress)}</Text>
          <Button my={'20px'} onClick={() => setBalanceOpen(true)}>open token list</Button>

          {/*<Button mb={'20px'} onClick={handleTransfer}>Transfer Transaction</Button>*/}
          {/*<Button mb={'20px'} onClick={handleCallContract}>Call Contract</Button>*/}
          <Button mb={'20px'} onClick={callByProgram}>callByProgram</Button>
          <Button onClick={disconnectSolana}>Disconnect Solana wallet</Button>
        </Flex>
      ) : <Button onClick={() => setSolanaOpen(true)}>Connect Solana Wallet</Button>}
      <Modal isOpen={solanaOpen} onClose={() => setSolanaOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Select Wallet
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody p={'20px'}>
            <Flex wrap={'wrap'}>
              {installedWallets.map(wallet => {
                return (
                  <Button key={wallet.adapter.name} onClick={async () => {
                    connectSolana(wallet.adapter.name)
                    setSolanaOpen(false)
                  }} display={'flex'} mr={'12px'} mb={'12px'} p={'12px'}>
                    <img width={28} height={28} src={wallet.adapter.icon} alt={''} />
                    <Container>{wallet.adapter.name}</Container>
                  </Button>
                )
              })}
            </Flex>

          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={balanceOpen} onClose={() => setBalanceOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Token List
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody p={'20px'}>
            {loadingSolTokens ? <Text>loading...</Text> : (
              <Flex wrap={'wrap'} direction={'column'}>
                {solTokens.map(token => (
                  <Flex border={'1px solid black'} borderRadius={'8px'} mb={'6px'} align={'center'} key={token.address} p={'8px 6px'}>
                    <img width={24} height={24} src={token.logo} alt=""/>
                    <Text px={'8px'}>{token.uiAmountString}</Text>
                    <Text>{token.symbol}</Text>
                  </Flex>
                ))}
              </Flex>
            )}

          </ModalBody>
        </ModalContent>
      </Modal>

    </>
  )
}