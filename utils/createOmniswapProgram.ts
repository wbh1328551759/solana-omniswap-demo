import OmniSwapIdl from "../constants/idl/omniswap-idl.json"
import {PublicKey} from '@solana/web3.js'
import {Idl, Program} from "@project-serum/anchor"
import { OMNISWAP_PROGRAM_ID } from '../constants/solana'

export const createOmniswapProgram = (): Program => {
  const programId = new PublicKey(OMNISWAP_PROGRAM_ID)
  return new Program(OmniSwapIdl as Idl, programId)
}