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
import { useAccount as useEvmAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { useConnect as useEvmConnect, useWalletClient } from 'wagmi'
import { useDisconnect as useEvmDisconnect } from 'wagmi'
import {useState, useEffect} from 'react'
import { multicall } from '@wagmi/core'
import {POLYGON_LENDING_ADDRESS, LendingPortalABI} from '../constants/evm'
import { MULTICALL_ADDRESS, MulticallABI } from '../constants/evm';
import { ethers, JsonRpcProvider, Interface } from 'ethers'
import { getContract } from 'wagmi/actions'
import { polygon } from '@wagmi/core/chains'
import { useContractWrite } from 'wagmi'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import OpGrantClaimAbi from '../constants/abi/opGrantClaimAbi.json'


function findKeysInRange(obj: Record<string, unknown>, address: string) {
  if (!obj) return
  const keys = Object.keys(obj).sort() // 获取并排序对象的键数组
  const normalizedAddress = address.toLowerCase()

  for (let i = 1; i < keys.length; i++) {
    const keyA = keys[i - 1]
    const keyB = keys[i]

    if (i === keys.length - 1 && normalizedAddress > keyB.toLowerCase()) {
      return ['', keyB]
    }
    if (normalizedAddress >= keyA.toLowerCase() && normalizedAddress <= keyB.toLowerCase()) {
      return [keyA, keyB] // 返回满足条件的两个键
    }
  }

  return null // 如果没有找到满足条件的键，则返回null或其他适当的值
}

const POLYGON_CHAIN_ID = 137

export const EvmModal = () => {
  const [evmOpen, setEvmOpen] = useState(false)

  const { address: evmAddress, isConnected: evmConnected } = useEvmAccount()
  const { connect: evmConnect, connectors: evmConnectors } = useEvmConnect()
  const { disconnect: evmDisconnect } = useEvmDisconnect()
  const [targetAccountInfo, setTargetAccountInfo] = useState(null)
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()

  const { data: walletClient } = useWalletClient({
    chainId: 137,
  })
  const multicallInterface = new Interface(MulticallABI);


  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: '0x71Cd07e42c00ef30280edb0D0b7E715AFc68f8C8' as `0x${string}`,
    abi: OpGrantClaimAbi,
    chainId: POLYGON_CHAIN_ID,
    functionName: 'claim',
    args: targetAccountInfo
      ? [targetAccountInfo?.index, new BigNumber(targetAccountInfo?.amount).toString(), targetAccountInfo?.proof]
      : undefined,
  })

  const onWithdrawMulticall = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner()
    console.log('signer', signer)
    const multicallContract = new ethers.Contract(MULTICALL_ADDRESS, MulticallABI, signer);

    const calls = [
      {
        target: POLYGON_LENDING_ADDRESS,
        value: '0',
        callData: (new Interface(LendingPortalABI)).encodeFunctionData('withdraw',
            [
              "0x0000000000000000000000000000000000000000",
              evmAddress,
              "5",
              "100",
              "0"
            ]
        ),
      },
      {
        target: POLYGON_LENDING_ADDRESS,
        value: '0',
        callData: (new Interface(LendingPortalABI)).encodeFunctionData('withdraw',
          [
            "0x0000000000000000000000000000000000000000",
            "0x0e40519af01985208114ffac4441b9b13218572f",
            "6",
            "100",
            "0"
          ]
        ),
      }
    ];
    console.log('calls', calls)
    console.log('multicallContract', multicallContract)

    const results = await multicallContract.aggregate(calls);

    console.log('results', results)
    // const contracts = [1, 2, 3].map(i => {
    //   return {
    //     address: POLYGON_LENDING_ADDRESS as `0x${string}`,
    //     abi: LendingPortalABI,
    //     functionName: 'withdraw',
    //     args: [
    //       "0x0000000000000000000000000000000000000000",
    //       evmAddress,
    //       "5",
    //       "1000000",
    //       "0"
    //     ],
    //   }
    // })
    // window.multicallContract = contract
    // console.log('contracts', contracts)
    // console.log('aggregate3', contract.aggregate3)
    // const data = await multicall({
    //   chainId: 137,
    //   contracts: contracts,
    //   allowFailure: true,
    //   // account: evmAddress,
    //   overrides: {
    //     payable: {
    //       from: evmAddress as `0x${string}`,
    //       value: '0',
    //     }
    //   },
    // })
    // console.log('data', data)
  }

  const onClaim = async () => {
    try {
      if (chain?.id !== POLYGON_CHAIN_ID) {
        await switchNetworkAsync?.(POLYGON_CHAIN_ID)
      }
      const tx = await writeAsync?.()
      console.log('tx', tx)
      const res = await tx?.wait()
      console.log('res', res)
    } catch (e) {
      console.log('error', e)
    }

  }
  useEffect(() => {
    const getTargetAccountInfo = async (airDropUrl: string) => {
      const { data: allAddressesMap } = await axios.get(`${airDropUrl}/mapping.json`)
      const addresses = findKeysInRange(allAddressesMap, evmAddress)

      let addressesA = []
      let addressesB = []
      if (addresses[0]) {
        const { data } = await axios.get(`${airDropUrl}/${addresses[0]}.json`)
        addressesA = data
      }
      if (addresses[1]) {
        const { data } = await axios.get(`${airDropUrl}/${addresses[1]}.json`)
        addressesB = data
      }
      const allAddresses = {
        ...addressesA,
        ...addressesB,
      }
      const targetAddress = Object.keys(allAddresses || {}).find(i => i.toLowerCase() === evmAddress.toLowerCase())
      const targetAccountInfo = targetAddress ? (allAddresses as any)[targetAddress] : null

      setTargetAccountInfo(targetAccountInfo)
    }

    //todo
    evmAddress && getTargetAccountInfo('https://raw.githubusercontent.com/OmniBTC/AirdropData/main/op/20231020/chunks')
  }, [evmAddress])

  return (
    <>
      {evmConnected ? (
        <Flex align={'center'}>
          <Text mr={'20px'}>{evmAddress}</Text>
          <Button onClick={evmDisconnect}>Disconnect Evm Wallet</Button>
          <Button onClick={onWithdrawMulticall}>onWithdrawMulticall</Button>
          <div>
            <Button onClick={onClaim}>Claim Claim</Button>
          </div>
        </Flex>
      ) : <Button onClick={() => setEvmOpen(true)}>Connect Evm Wallet</Button>}
      <Modal isOpen={evmOpen} onClose={() => setEvmOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Select Wallet
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody p={'20px'}>
            <Flex wrap={'wrap'}>
              {evmConnectors.map((connector) => (
                <Button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => {
                    evmConnect({ connector })
                    setEvmOpen(false)
                  }}
                >
                  {connector.name}
                </Button>
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}