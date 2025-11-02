import { useGetTicketStockByType } from "./useGetTicketStockByType";

export const useGetTotalAvailableTickets = (eventId: number, eventRemaining: number) => {
  // Fetch stock for each ticket type (0=Standard, 1=Premium, 2=VIP)
  const standardStock = useGetTicketStockByType(eventId, 0);
  const premiumStock = useGetTicketStockByType(eventId, 1);
  const vipStock = useGetTicketStockByType(eventId, 2);

  const totalAvailable = 
    standardStock.remainingTickets + 
    premiumStock.remainingTickets + 
    eventRemaining; // Use event.remaining for VIP

  const isLoading = 
    standardStock.isFetchingData || 
    premiumStock.isFetchingData || 
    vipStock.isFetchingData;

  return {
    totalAvailable,
    standardAvailable: standardStock.remainingTickets,
    premiumAvailable: premiumStock.remainingTickets,
    vipAvailable: eventRemaining, // Use event.remaining for VIP
    isLoading,
    standardStock,
    premiumStock,
    vipStock,
  };
};