import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { useWallet } from "../use-wallet";

// Define the type for the purchase history item
type PurchaseHistoryItem = {
    tokenId: bigint;
    eventId: bigint;
    eventName: string;
    eventDate: bigint;
    isExpired: boolean;
    isUsed: boolean;
    ticketType: number;
    ticketCode: string;
    tokenURI: string;
};

export const useGetHistoryPurchase = () => {
    const { address } = useWallet();
    
    const { 
        data: rawPurchaseHistory, 
        isLoading, 
        isError, 
        error, 
        refetch 
    } = useReadContract({
        address: TICKETING_ADDRESS,
        abi: TICKETING_ABI,
        functionName: 'getMyPurchaseHistory',
        account: address,
    });

    // Parse the raw blockchain response into a more usable format
    const formattedHistory = Array.isArray(rawPurchaseHistory) 
        ? rawPurchaseHistory.map((item) => {
            // Check if item is an array and has the expected properties
            if (Array.isArray(item)) {
                return {
                    tokenId: BigInt(item[0] || 0),
                    eventId: BigInt(item[1] || 0),
                    eventName: item[2] || '',
                    eventDate: BigInt(item[3] || 0),
                    isExpired: item[4] || false,
                    isUsed: item[5] || false,
                    ticketType: Number(item[6] || 0),
                    ticketCode: item[7] || '',
                    tokenURI: item[8] || '',
                };
            }
            // If item is an object, access properties directly
            return {
                tokenId: BigInt(item.tokenId || 0),
                eventId: BigInt(item.eventId || 0),
                eventName: item.eventName || '',
                eventDate: BigInt(item.eventDate || 0),
                isExpired: item.isExpired || false,
                isUsed: item.isUsed || false,
                ticketType: Number(item.ticketType || 0),
                ticketCode: item.ticketCode || '',
                tokenURI: item.tokenURI || '',
            };
        })
        : [];

    // Debug logs
    console.log('Raw Purchase History:', rawPurchaseHistory);
    console.log('Formatted History:', formattedHistory);
    
    return {
        purchaseHistory: formattedHistory as PurchaseHistoryItem[],
        isLoading,
        isError,
        error,
        refetch,
        hasHistory: formattedHistory.length > 0
    };
};