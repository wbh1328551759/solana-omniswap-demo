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

const DappPage = () => {
  return (
    <div>dapp</div>
  )
}

export default DappPage