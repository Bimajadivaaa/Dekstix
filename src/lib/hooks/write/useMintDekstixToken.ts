import { DEKSTIX_TOKEN_ADDRESS, DEKSTIX_TOKEN_ABI } from "@/config/const";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import React from "react";
import { toast } from "sonner";

const BASE_SEPOLIA_EXPLORER = "https://sepolia.basescan.org/tx/";

export const useMintDekstixToken = () => {
  const {
    writeContract,
    isPending: isMinting,
    isSuccess: isSubmitted,
    error: mintError,
    data: txHash,
    reset: resetWriteContract,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isMintSuccess,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleMintTokens = async (recipientAddress: string, amount: string) => {
    try {
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Number(amount) * 1e18);

      writeContract({
        address: DEKSTIX_TOKEN_ADDRESS,
        abi: DEKSTIX_TOKEN_ABI,
        functionName: "mint",
        args: [recipientAddress, amountInWei],
      });
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    if (isMinting) {
      toast.loading("Processing token claim...", { id: "token-mint-loading" });
    }

    if (isConfirming && !isMinting) {
      toast.loading("Waiting for confirmation...", { id: "token-mint-confirming" });
    }

    if (isMintSuccess && txHash) {
      toast.dismiss("token-mint-loading");
      toast.dismiss("token-mint-confirming");
      toast.success("DEKSTIX tokens claimed successfully!", {
        id: "token-mint-success",
        description: React.createElement(
          "a",
          {
            href: `${BASE_SEPOLIA_EXPLORER}${txHash}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 underline",
          },
          "View Transaction on Base Sepolia Explorer"
        ),
      });
      resetWriteContract();
    }

    if ((mintError || isConfirmError) && !isMintSuccess) {
      toast.dismiss("token-mint-loading");
      toast.dismiss("token-mint-confirming");
      toast.error("Token mint failed", {
        id: "token-mint-error",
        description:
          (mintError || confirmError)?.message || "Unknown error occurred",
      });
    }

    return () => {
      toast.dismiss("token-mint-loading");
      toast.dismiss("token-mint-confirming");
    };
  }, [
    isMinting,
    isConfirming,
    isMintSuccess,
    isConfirmError,
    txHash,
    mintError,
    confirmError,
    resetWriteContract,
  ]);

  return {
    handleMintTokens,
    isMinting,
    isConfirming,
    isSubmitted,
    isMintSuccess,
    mintError: mintError || confirmError,
    txHash,
  };
};