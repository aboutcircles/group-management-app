import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

// Function to get the BrowserProvider for Ethereum
export function getBrowserProvider() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('No Ethereum provider found');
  }
  return new ethers.BrowserProvider(window.ethereum);
}

// Function to get a signer using the current account address
export function getSigner() {
  const { address } = useAccount();

  const provider = getBrowserProvider();
  const signer = provider.getSigner(address);

  if (!address) throw new Error('Account address not available');

  return provider.getSigner(address);
  console.log(signer)
 
}

export async function getChainId(): Promise<bigint> {
  const provider = getBrowserProvider();
  try {
    const network = await provider.getNetwork();
    return network.chainId;
  } catch (error) {
    console.error('Failed to retrieve network information:', error);
    throw error;
  }
}

getChainId().then((chainId) => {
  console.log('Chain ID:', chainId);
}).catch((error) => {
  console.error('Error fetching chain ID:', error);
});