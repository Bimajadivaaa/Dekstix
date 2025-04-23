import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";

export const useGetTokenIDbyType = (eventId?: number, ticketType?: number) => {
  const {
    data: tokenIds,
    error,
    isLoading,
    isSuccess,
    refetch,
  } = useReadContract({
    address: TICKETING_ADDRESS,
    abi: TICKETING_ABI,
    functionName: "getTicketsByTypeAndEvent",
    args: [eventId, ticketType],
  });

  // console.log('token id', tokenIds)

  return {
    tokenIds: tokenIds as number[] | undefined,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};