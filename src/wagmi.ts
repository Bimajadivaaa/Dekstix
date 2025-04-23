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
      http('https://ethereum-sepolia-rpc.publicnode.com'), // Primary RPC
      http('https://rpc.sepolia.org'), // Fallback RPC (public)
    ]),
  },
});