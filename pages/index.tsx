import {
  Flex,
} from '@chakra-ui/react'
import {SolanaModal} from '../components/SolanaModal'
import {EvmModal} from '../components/EvmModal'

export default function Home() {
  return (
    <Flex direction={'column'} gap={'10px'} align={'center'}>
      <SolanaModal />
      <EvmModal />
    </Flex>
  )
}
