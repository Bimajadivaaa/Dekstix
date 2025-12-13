import { useGetTicketStockByType } from "./useGetTicketStockByType";
import { useGetEventTicketStock } from "./useGetEventTicketStock";

export const useGetTotalAvailableTickets = (eventId: number, eventRemaining: number) => {
  // Fetch stock for each ticket type (0=Standard, 1=Premium, 2=VIP)
  const standardStock = useGetTicketStockByType(eventId, 0);
  const premiumStock = useGetTicketStockByType(eventId, 1);
  const vipStock = useGetTicketStockByType(eventId, 2);
  
  // Get total event ticket stock for VIP (like in event-detail.tsx)
  const { remainingTickets: totalRemainingTickets } = useGetEventTicketStock(eventId);

  const totalAvailable = 
    standardStock.remainingTickets + 
    premiumStock.remainingTickets + 
    totalRemainingTickets; // Use totalRemainingTickets for VIP like in event-detail

  // Debug log
  // console.log("Debug - Total calculation:", {
  //   standard: standardStock.remainingTickets,
  //   premium: premiumStock.remainingTickets,
  //   totalRemainingTickets,
  //   eventRemaining,
  //   vipStock: vipStock.remainingTickets,
  //   total: totalAvailable
  // });

  const isLoading = 
    standardStock.isFetchingData || 
    premiumStock.isFetchingData || 
    vipStock.isFetchingData;

  return {
    totalAvailable,
    standardAvailable: standardStock.remainingTickets,
    premiumAvailable: premiumStock.remainingTickets,
    vipAvailable: totalRemainingTickets, // Use totalRemainingTickets for VIP like in event-detail
    isLoading,
    standardStock,
    premiumStock,
    vipStock,
  };
};