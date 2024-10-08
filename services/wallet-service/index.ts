import { ethers, InfuraProvider } from 'ethers';
import 'dotenv/config';


export const getWalletBalance = async (address: string): Promise<string> => {
  try {
    const projectId = process.env.INFURA_PROJECT_ID;
    const projectSecret = process.env.INFRA_SECRET;

    // Connect to mainnet with a Project ID and Project Secret
    const provider = new InfuraProvider("homestead", projectId, projectSecret);
    
    // Fetch the wallet balance
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Failed to get wallet balance:', (error as Error).message);
    throw new Error(`Failed to get wallet balance: ${(error as Error).message}`);
  }
};

/* 
Supported Networks
homestead - Homestead (Mainnet)
goerli - Görli (clique testnet)
sepolia - Sepolia (proof-of-authority testnet)
arbitrum - Arbitrum Optimistic L2
arbitrum-goerli - Arbitrum Optimistic L2 testnet
matic - Polgon mainnet
maticmum - Polgon testnet
optimism - Optimism Optimistic L2
optimism-goerli - Optimism Optimistic L2 testnet
*/