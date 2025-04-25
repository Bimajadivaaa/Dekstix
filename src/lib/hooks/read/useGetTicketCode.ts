import { useReadContract } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { useWallet } from "../use-wallet";

export const useGetTicketCode = (tokenId?: bigint | number) => {
  // Get the connected wallet address
  const { address } = useWallet();

  // Convert tokenId to bigint if it's a number
  const normalizedTokenId = tokenId ? BigInt(tokenId) : undefined;
  
  // console.log('Wallet Address:', address);
  // console.log('TokenId:', tokenId);

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
    args: normalizedTokenId ? [normalizedTokenId] : [],
    account: address, 
  });

  // console.log('Ticket Code Response:', ticketCode);
  // console.log('Contract Error:', error);

  // If we have an error or no tokenId or no address, return undefined
  if (error || !normalizedTokenId || !address) {
    return {
      ticketCode: undefined,
      isLoading,
      isSuccess: false,
      error,
      refetch,
    };
  }

  return {
    ticketCode: typeof ticketCode === 'string' ? ticketCode : undefined,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};