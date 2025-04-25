import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";

export const useGetStatusNFT = (tokenId?: bigint | number) => {
    
    // Convert tokenId to bigint if it's a number
    const normalizedTokenId = tokenId ? BigInt(tokenId) : undefined;

    // Check if ticket is used
    const {
        data: isUsed,
        isLoading: isLoadingStatus,
        error: statusError,
        refetch: refetchStatus
    } = useReadContract({
        address: TICKETING_ADDRESS,
        abi: TICKETING_ABI,
        functionName: "isTicketUsed",
        args: normalizedTokenId ? [normalizedTokenId] : [],
    });

    console.log('isUsed', isUsed);

    return {
        isUsed: isUsed as boolean | undefined,
        isLoading: isLoadingStatus,
        error: statusError,
        refetch: refetchStatus
    };
};