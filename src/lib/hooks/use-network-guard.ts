import { useNetworkValidation } from "./use-network-validation";
import { useSwitchChain } from "wagmi";
import { toast } from "sonner";

/**
 * Hook to guard actions that require correct network
 * Returns disabled state and switch network function
 */
export function useNetworkGuard() {
  const { isWrongNetwork, isConnected, networkName, requiredChainId } = useNetworkValidation();
  const { switchChain, isPending } = useSwitchChain();

  const isDisabled = !isConnected || isWrongNetwork || isPending;

  const handleSwitchNetwork = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isWrongNetwork) return;

    try {
      await switchChain({ chainId: requiredChainId });
      toast.success(`Successfully switched to ${networkName}!`);
    } catch (err: any) {
      console.error("Network switch failed:", err);
      toast.error(err?.message || "Failed to switch network. Please try manually from your wallet.");
    }
  };

  const getDisabledReason = () => {
    if (!isConnected) return "Please connect your wallet";
    if (isWrongNetwork) return `Please switch to ${networkName} network`;
    if (isPending) return "Network switch in progress...";
    return null;
  };

  return {
    isDisabled,
    isWrongNetwork,
    isConnected,
    isPending,
    switchNetwork: handleSwitchNetwork,
    disabledReason: getDisabledReason(),
    networkName,
  };
}
