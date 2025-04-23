import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";

export const useGetTicketCode = (tokenId?: bigint | number) => {
  const {
    data: ticketCode,
    error,
    isLoading,
    isSuccess,
    refetch,
  } = useReadContract({
    address: TICKETING_ADDRESS,
    abi: TICKETING_ABI,
    functionName: "getTicketCode",
    args: [tokenId],
  });

  return {
    ticketCode: ticketCode as string | undefined,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};