import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ethers } from "ethers";
import React from "react";
import { toast } from "sonner";

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io/tx/";

export const useBuyTicket = () => {
  const {
    writeContract,
    isPending: isBuying,
    isSuccess: isSubmitted,
    error: buyError,
    data: txHash,
    reset: resetWriteContract,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isBuyTicketSuccess,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleBuyTicket = async (tokenId: number, valueInEther: string) => {
    try {
      const valueInWei = ethers.parseEther(valueInEther);

      writeContract({
        address: TICKETING_ADDRESS,
        abi: TICKETING_ABI,
        functionName: "buyTicket",
        args: [tokenId],
        value: valueInWei,
      });
    } catch (error) {
      console.error("Failed to buy ticket:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    if (isBuying) {
      toast.loading("Processing transaction...", { id: "tx-loading" });
    }

    if (isConfirming && !isBuying) {
      toast.loading("Waiting for confirmation...", { id: "tx-confirming" });
    }

    if (isBuyTicketSuccess && txHash) {
      toast.dismiss("tx-loading");
      toast.dismiss("tx-confirming");
      toast.success("Ticket purchased successfully!", {
        id: "tx-success",
        description: React.createElement(
          "a",
          {
            href: `${SEPOLIA_EXPLORER}${txHash}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 underline",
          },
          "View Transaction on Sepolia Explorer"
        ),
      });
      resetWriteContract();
    }

    if ((buyError || isConfirmError) && !isBuyTicketSuccess) {
      toast.dismiss("tx-loading");
      toast.dismiss("tx-confirming");
      toast.error("Transaction failed", {
        id: "tx-error",
        description:
          (buyError || confirmError)?.message || "Unknown error occurred",
      });
    }

    return () => {
      toast.dismiss("tx-loading");
      toast.dismiss("tx-confirming");
    };
  }, [
    isBuying,
    isConfirming,
    isBuyTicketSuccess,
    isConfirmError,
    txHash,
    buyError,
    confirmError,
    resetWriteContract,
  ]);

  return {
    handleBuyTicket,
    isBuying,
    isConfirming,
    isSubmitted,
    isBuyTicketSuccess,
    buyError: buyError || confirmError,
    txHash,
  };
};
