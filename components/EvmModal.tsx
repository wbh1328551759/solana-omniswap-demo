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
import { useAccount as useEvmAccount } from 'wagmi'
import { useConnect as useEvmConnect } from 'wagmi'
import { useDisconnect as useEvmDisconnect } from 'wagmi'
import {useState} from 'react'

export const EvmModal = () => {
  const [evmOpen, setEvmOpen] = useState(false)

  const { address: evmAddress, isConnected: evmConnected } = useEvmAccount()
  const { connect: evmConnect, connectors: evmConnectors } = useEvmConnect()
  const { disconnect: evmDisconnect } = useEvmDisconnect()
  return (
    <>
      {evmConnected ? (
        <Flex align={'center'}>
          <Text mr={'20px'}>{evmAddress}</Text>
          <Button onClick={evmDisconnect}>Disconnect Evm Wallet</Button>
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