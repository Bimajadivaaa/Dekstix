import { AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetworkValidation } from "@/lib/hooks/use-network-validation";
import { useSwitchChain } from "wagmi";
import { toast } from "sonner";

interface NetworkWarningProps {
  showFullWarning?: boolean;
  className?: string;
  showSwitchButton?: boolean;
}

export function NetworkWarning({ showFullWarning = false, className = "", showSwitchButton = true }: NetworkWarningProps) {
  const { isWrongNetwork, networkName, requiredChainId, isRpcHealthy, currentChainId } = useNetworkValidation();
  const { switchChain, isPending, error } = useSwitchChain();

  if (!isWrongNetwork) return null;
  
  const isRpcIssue = currentChainId === requiredChainId && !isRpcHealthy;

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: requiredChainId });
      toast.success(`Successfully switched to ${networkName}!`);
    } catch (err) {
      console.error("Network switch failed:", err);
      toast.error("Failed to switch network. Please try manually from your wallet.");
    }
  };

  if (showFullWarning) {
    return (
      <div className={`bg-red-600/10 border border-red-600/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-red-400 font-semibold text-sm">
              {isRpcIssue ? "Network Connection Issue" : "Wrong Network Detected"}
            </h3>
            <p className="text-red-300/80 text-sm mt-1">
              {isRpcIssue 
                ? `You're connected to ${networkName} but there's a connectivity issue with the network. Please try refreshing the page or switching to a different RPC endpoint.`
                : `You're connected to an unsupported network. This application only works on ${networkName}. Please switch your network to continue using the platform.`
              }
            </p>
            <div className="flex items-center gap-2 mt-3">
              {showSwitchButton && (
                <Button
                  onClick={handleSwitchNetwork}
                  disabled={isPending}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Switching...
                    </>
                  ) : (
                    `Switch to ${networkName}`
                  )}
                </Button>
              )}
              <a
                href="https://chainlist.org/chain/84532"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-300 hover:text-red-200 text-sm underline"
              >
                Add Base Sepolia to Wallet
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-red-600/10 border-b border-red-600/20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 text-red-400">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              {isRpcIssue 
                ? `Network Connection Issue! Unable to connect to ${networkName}.`
                : `Wrong Network! Please switch to ${networkName} network to use this application.`
              }
            </span>
          </div>
          {showSwitchButton && (
            <Button
              onClick={handleSwitchNetwork}
              disabled={isPending}
              size="sm"
              variant="outline"
              className="ml-4 border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Switching...
                </>
              ) : (
                `Switch to ${networkName}`
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
