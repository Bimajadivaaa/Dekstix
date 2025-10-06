import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import React from "react";
import { toast } from "sonner";

const BASE_SEPOLIA_EXPLORER = "https://sepolia.basescan.org/tx/";

export const useBuyVIPTicket = () => {
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
    isSuccess: isBuyVIPSuccess,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const buyVIPTicket = async ({
    eventId,
    metadata,
    payableAmount,
  }: {
    eventId: number;
    metadata: { uri: string };
    payableAmount: string; // ether, e.g. "0.1"
  }) => {
    writeContract({
      address: TICKETING_ADDRESS,
      abi: TICKETING_ABI,
      functionName: "mintAndBuyVIPTicket",
      args: [eventId, metadata.uri],
      value: BigInt(Number(payableAmount) * 1e18),
    });
  };

  React.useEffect(() => {
    if (isMinting) {
      toast.loading("Processing VIP ticket transaction...", { id: "vip-tx-loading" });
    }

    if (isConfirming && !isMinting) {
      toast.loading("Waiting for confirmation...", { id: "vip-tx-confirming" });
    }

    if (isBuyVIPSuccess && txHash) {
      toast.dismiss("vip-tx-loading");
      toast.dismiss("vip-tx-confirming");
      toast.success("VIP Ticket purchased successfully!", {
        id: "vip-tx-success",
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

    if ((mintError || isConfirmError) && !isBuyVIPSuccess) {
      toast.dismiss("vip-tx-loading");
      toast.dismiss("vip-tx-confirming");
      toast.error("VIP Ticket transaction failed", {
        id: "vip-tx-error",
        description:
          (mintError || confirmError)?.message || "Unknown error occurred",
      });
    }

    return () => {
      toast.dismiss("vip-tx-loading");
      toast.dismiss("vip-tx-confirming");
    };
  }, [
    isMinting,
    isConfirming,
    isBuyVIPSuccess,
    isConfirmError,
    txHash,
    mintError,
    confirmError,
    resetWriteContract,
  ]);

  return {
    buyVIPTicket,
    isMinting,
    isConfirming,
    isSubmitted,
    isBuyVIPSuccess,
    mintError: mintError || confirmError,
    txHash,
  };
};