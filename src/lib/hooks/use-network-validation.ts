import { useAccount, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";

/**
 * Custom hook for network validation
 * Checks if the user is connected to the correct network (Sepolia)
 * @returns Object containing network validation status and chain info
 */
export function useNetworkValidation() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const isWrongNetwork = isConnected && chainId !== sepolia.id;
  const isCorrectNetwork = isConnected && chainId === sepolia.id;
  const requiredNetwork = sepolia;

  return {
    isConnected,
    isWrongNetwork,
    isCorrectNetwork,
    currentChainId: chainId,
    requiredChainId: sepolia.id,
    requiredNetwork,
    networkName: sepolia.name,
  };
}
