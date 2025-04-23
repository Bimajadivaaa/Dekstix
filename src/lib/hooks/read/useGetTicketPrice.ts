import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { useState, useEffect } from "react";
import { formatEther } from "viem";

export const useGetTicketPrice = (eventId: number | string, ticketType: number) => {
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  
  const { data: ticketPrice, isPending: isFetchingData } = useReadContract({
    address: TICKETING_ADDRESS,
    abi: TICKETING_ABI,
    functionName: "getTicketPrice",
    args: [Number(eventId), ticketType],
  });

  useEffect(() => {
    if (ticketPrice) {
      const price = formatEther(ticketPrice as bigint);
      setFormattedPrice(price);
    }
  }, [ticketPrice]);

  return {
    ticketPrice,
    formattedPrice,
    isFetchingData,
  };
};