import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { useWallet } from "../use-wallet";

type Ticket = {
  tokenId: bigint;
  eventId: bigint;
  eventName: string;
  ticketType: number;
  tokenURI: string;
};

export const useGetMyTicket = () => {
    const { address } = useWallet();
    
    const { 
        data: tickets, 
        isLoading, 
        isError, 
        error, 
        refetch 
    } = useReadContract({
        address: TICKETING_ADDRESS,
        abi: TICKETING_ABI,
        functionName: 'getMyNFTs',
        account: address,
    });
    
    return {
        tickets: tickets as Ticket[] | undefined,
        isLoading,
        isError,
        error,
        refetch
    };
};