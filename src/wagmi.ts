import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  // arbitrum,
  // base,
  // mainnet,
  // optimism,
  // polygon,
  sepolia,
} from 'wagmi/chains';
import { env } from './env';
import { http, fallback } from 'viem';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [
    // mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // base,
    sepolia,
  ],
  ssr: true,
  transports: {
    // Define custom RPCs for each chain
    [sepolia.id]: fallback([
      http('https://eth-sepolia.public.blastapi.io'), // Primary RPC (lebih stabil)
      http('https://ethereum-sepolia.blockpi.network/v1/rpc/public'), // Fallback RPC 1
      http('https://sepolia.gateway.tenderly.co'), // Fallback RPC 2
      http('https://rpc.sepolia.org'), // Fallback RPC 3
    ]),
  },
});