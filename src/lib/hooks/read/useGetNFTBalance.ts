import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { type Address } from "viem";
import { useWallet } from "../use-wallet";

export const useGetNFTBalance = () => {
  const { address } = useWallet();

  const {
    data: balance,
    error,
    isLoading,
    isSuccess,
    refetch,
  } = useReadContract({
    address: TICKETING_ADDRESS as Address,
    abi: TICKETING_ABI,
    functionName: "balanceOf",
    args: [address || "0x"],
    query: {
      enabled: !!address, // Only query when address exists
      select: (data) => Number(data) || 0, // Convert BigInt to number
    },
  });

  return {
    balance,
    isLoading,
    isSuccess,
    error,
    refetch,
    hasNFTs: balance ? balance > 0 : false, 
  };
};