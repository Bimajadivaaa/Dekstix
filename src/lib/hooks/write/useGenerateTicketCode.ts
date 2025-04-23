import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi";
import React from "react";
import { toast } from "sonner";

export const useGenerateTicketCode = () => {
  const {
    writeContract,
    isPending: isGenerating,
    isSuccess: isSubmitted,
    error: generateError,
    data: txHash,
    reset: resetWriteContract,
  } = useWriteContract();

  const { 
    isLoading: isConfirming,
    isSuccess: isGenerateSuccess,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const generateTicketCode = async (tokenId: number) => {
    try {
    writeContract({
        address: TICKETING_ADDRESS,
        abi: TICKETING_ABI,
        functionName: "useTicket",
        args: [tokenId],
      });
    } catch (error) {
      console.error("Failed to generate ticket code:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    if (isGenerating) {
      toast.loading("Generating ticket code...", { id: "generate-loading" });
    }

    if (isConfirming && !isGenerating) {
      toast.loading("Confirming transaction...", { id: "generate-confirming" });
    }

    if (isGenerateSuccess) {
      toast.dismiss("generate-loading");
      toast.dismiss("generate-confirming");
      toast.success("Ticket code generated successfully!", {
        id: "generate-success",
      });
      resetWriteContract();
    }

    if ((generateError || isConfirmError) && !isGenerateSuccess) {
      toast.dismiss("generate-loading");
      toast.dismiss("generate-confirming");
      toast.error("Failed to generate code", {
        id: "generate-error",
        description: (generateError || confirmError)?.message || "Unknown error occurred",
      });
    }

    return () => {
      toast.dismiss("generate-loading");
      toast.dismiss("generate-confirming");
    };
  }, [
    isGenerating,
    isConfirming,
    isGenerateSuccess,
    isConfirmError,
    generateError,
    confirmError,
    resetWriteContract,
  ]);

  return {
    generateTicketCode,
    isGenerating,
    isConfirming,
    isSubmitted,
    isGenerateSuccess,
    error: generateError || confirmError,
    txHash,
  };
};