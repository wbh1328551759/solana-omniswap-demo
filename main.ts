import { ethers } from 'ethers';
import { MULTICALL_ADDRESS, MULTICALL_ABI } from './constants';  // Replace with actual Multicall address and ABI

// Connect to the Ethereum network
const provider = new ethers.providers.JsonRpcProvider();  // Replace with your Ethereum RPC URL
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);  // Replace with your private key

// Get Multicall contract instance
const multicall = new ethers.Contract(MULTICALL_ADDRESS, MULTICALL_ABI, wallet);

// Prepare the batch of transactions
const transactions = [
  {
    to: 'REWARD_POOL_ADDRESS',  // Replace with actual Reward Pool address
    data: ethers.utils.defaultAbiCoder.encode(
      ['bytes', 'bytes', 'bytes', 'uint16', 'uint16', 'uint8', 'uint256'],
      ['0x...', '0x...', '0x...', 1, 1, 0, 0]  // Replace with actual parameters
    ),
  },
  // ... repeat for other 5 reward claims
];

// Encode the transactions for Multicall
const calls = transactions.map(tx => ({
  target: tx.to,
  callData: tx.data,
}));

// Execute the batch of transactions
multicall.aggregate(calls)
  .then(response => {
    console.log('Batch transaction successful:', response);
  })
  .catch(error => {
    console.error('Batch transaction failed:', error);
  });