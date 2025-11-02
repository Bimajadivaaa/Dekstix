import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";

export const useGetTicketStockByType = (eventId: number, ticketType: number) => {
  const { data, isPending: isFetchingData } = useReadContract({
    address: TICKETING_ADDRESS,
    abi: TICKETING_ABI,
    functionName: "getEventTicketStockByType",
    args: [eventId, ticketType],
  });

  return {
    totalTickets: data && Array.isArray(data) ? Number(data[0]) : 0,
    remainingTickets: data && Array.isArray(data) ? Number(data[1]) : 0,
    soldTickets: data && Array.isArray(data) ? Number(data[2]) : 0,
    isFetchingData,
  };
};