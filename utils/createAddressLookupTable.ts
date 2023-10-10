import {
  AddressLookupTableProgram,
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

/**
 * 1. Creates an Address Lookup Table Instruction
 * 2. Signs and sends it in a transactionV0
 *
 * @param   {String}      publicKey  a public key
 * @param   {Connection}  connection an RPC connection
 * @param   {String}  blockhash recent blockhash
 * @returns {[VersionedTransaction, String]} array of transaction
 *          signature and lookup table address
 */
const createAddressLookupTable = async (
  publicKey: PublicKey,
  connection: Connection,
  blockhash: string
): Promise<[string, PublicKey]> => {

  // get current `slot`
  let slot = await connection.getSlot();

  // create an Address Lookup Table
  const [lookupTableInst, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
    authority: publicKey,
    payer: publicKey,
    recentSlot: slot,
  });

  console.log('lookup table address:', lookupTableAddress.toBase58());

  // To create the Address Lookup Table on chain:
  // send the `lookupTableInst` instruction in a transaction
  const lookupMessage = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: blockhash,
    instructions: [lookupTableInst],
  }).compileToV0Message();

  const lookupTransaction = new VersionedTransaction(lookupMessage);

};

export default createAddressLookupTable;