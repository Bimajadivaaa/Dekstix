import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";

export const useGetTicketExpired = (tokenId?: bigint | number) => {
    // Convert tokenId to bigint if it's a number
    const normalizedTokenId = tokenId ? BigInt(tokenId) : undefined;

    // Check if ticket is expired
    const {
        data: isExpired,
        isLoading: isLoadingStatus,
        error: statusError,
        refetch: refetchStatus
    } = useReadContract({
        address: TICKETING_ADDRESS,
        abi: TICKETING_ABI,
        functionName: "isTicketCodeExpired",
        args: normalizedTokenId ? [normalizedTokenId] : [],
    });

    return {
        isExpired: isExpired as boolean | undefined,
        isLoading: isLoadingStatus,
        error: statusError,
        refetch: refetchStatus
    };
};