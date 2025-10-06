import { useAccount, useChainId, usePublicClient } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useEffect, useState } from "react";

/**
 * Custom hook for network validation
 * Checks if the user is connected to the correct network (Base Sepolia)
 * @returns Object containing network validation status and chain info
 */
export function useNetworkValidation() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [isRpcHealthy, setIsRpcHealthy] = useState(true);

  const isWrongNetwork = isConnected && chainId !== baseSepolia.id;
  const isCorrectNetwork = isConnected && chainId === baseSepolia.id && isRpcHealthy;
  const requiredNetwork = baseSepolia;

  // Check RPC health when connected to Base Sepolia
  useEffect(() => {
    const checkRpcHealth = async () => {
      if (isConnected && chainId === baseSepolia.id && publicClient) {
        try {
          // Test the connection by getting the latest block number
          await publicClient.getBlockNumber();
          setIsRpcHealthy(true);
        } catch (error) {
          console.error("RPC health check failed:", error);
          setIsRpcHealthy(false);
        }
      }
    };

    if (isConnected && chainId === baseSepolia.id) {
      checkRpcHealth();
      // Check every 30 seconds
      const interval = setInterval(checkRpcHealth, 30000);
      return () => clearInterval(interval);
    } else {
      setIsRpcHealthy(true);
    }
  }, [isConnected, chainId, publicClient]);

  return {
    isConnected,
    isWrongNetwork: isWrongNetwork || (isConnected && chainId === baseSepolia.id && !isRpcHealthy),
    isCorrectNetwork,
    currentChainId: chainId,
    requiredChainId: baseSepolia.id,
    requiredNetwork,
    networkName: baseSepolia.name,
    isRpcHealthy,
  };
}
