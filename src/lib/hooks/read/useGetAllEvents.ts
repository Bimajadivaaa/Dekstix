import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";

export const useGetAllEvents = () => {
  const { data: allEvents, isPending: isFetchingData } = useReadContract({
    address: TICKETING_ADDRESS,
    abi: TICKETING_ABI,
    functionName: "getAllEvents",
  });
  console.log("allEvents", allEvents);

  return {
    allEvents,
    isFetchingData,
  };
};
