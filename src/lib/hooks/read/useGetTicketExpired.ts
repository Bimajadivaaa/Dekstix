import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";

export const useGetTicketExpired = (tokenId?: bigint | number) => {
    // Convert tokenId to bigint if it's a number
    const normalizedTokenId = tokenId ? BigInt(tokenId) : undefined;

    // Use the query object to control when the hook runs
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
        query: {
            enabled: !!normalizedTokenId
        }
    });

    return {
        isExpired: isExpired as boolean | undefined,
        isLoading: isLoadingStatus,
        error: statusError,
        refetch: refetchStatus
    };
};