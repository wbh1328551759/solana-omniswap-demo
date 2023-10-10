import CounterIdl from "../constants/idl/counter.json"
import {PublicKey} from '@solana/web3.js'
import {Idl, Program} from "@project-serum/anchor"

export const createExchangeProgram = (): Program => {
  const programId = new PublicKey("9pbyP2VX8Rc7v4nR5n5Kf5azmnw5hHfkJcZKPHXW98mf")
  return new Program(CounterIdl as Idl, programId)
}