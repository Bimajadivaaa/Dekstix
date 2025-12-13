import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  // arbitrum,
  // base,
  // mainnet,
  // optimism,
  // polygon,
  baseSepolia,
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
    baseSepolia,
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: fallback([
      http('https://base-sepolia.g.alchemy.com/v2/6Re8Dr_EVOkbkkMAA4j6j'), // Alchemy RPC
      http('https://sepolia.base.org'), // Primary official RPC
      http('https://base-sepolia-rpc.publicnode.com'), // PublicNode fallback
      http('https://base-sepolia.blockpi.network/v1/rpc/public'), // BlockPI fallback
      http('https://base-sepolia.gateway.tenderly.co'), // Tenderly fallback
      http('https://rpc.notadegen.com/base/sepolia'), // NotADegen fallback
    ], {
      rank: true,
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
});