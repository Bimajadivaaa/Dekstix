"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event, TicketTier } from "@/lib/type";
import { Loader2, AlertTriangle } from "lucide-react";
import { useGetTicketPrice } from "@/lib/hooks/read/useGetTicketPrice";
import { useNetworkGuard } from "@/lib/hooks/use-network-guard";
import Image from "next/image";
import { useEthPrice } from "@/lib/hooks/use-eth-price";

interface EventDetailProps {
  event: Event;
  ticketTiers: TicketTier[];
  onSelectTicket: (ticket: TicketTier) => void;
}

export function EventDetail({
  event,
  ticketTiers,
  onSelectTicket,
}: EventDetailProps) {
  const { isDisabled, isWrongNetwork, switchNetwork, disabledReason } = useNetworkGuard();
  
  const { formattedPrice: standardPrice, isFetchingData: loadingStandard } =
    useGetTicketPrice(event.id, 0);
  const { formattedPrice: premiumPrice, isFetchingData: loadingPremium } =
    useGetTicketPrice(event.id, 1);
  const { formattedPrice: vipPrice, isFetchingData: loadingVip } =
    useGetTicketPrice(event.id, 2);

  const { convertEthToIdr, isLoading: isLoadingPrice } = useEthPrice();

  console.log("event id", event.id);
  console.log("available tickets", event.remaining);

  // Create local ticket tiers with blockchain prices
  const updatedTicketTiers = ticketTiers.map((tier) => {
    let currentPrice = tier.price;
    let loading = false;

    // Match tier name with blockchain prices
    if (tier.name.toLowerCase().includes("standard")) {
      currentPrice = standardPrice ? Number(standardPrice) : tier.price;
      loading = loadingStandard;
    } else if (tier.name.toLowerCase().includes("premium")) {
      currentPrice = premiumPrice ? Number(premiumPrice) : tier.price;
      loading = loadingPremium;
    } else if (tier.name.toLowerCase().includes("vip")) {
      currentPrice = vipPrice ? Number(vipPrice) : tier.price;
      loading = loadingVip;
    }

    // Make sure to preserve all original properties including availableTickets
    return {
      ...tier,
      price: currentPrice,
      loading,
    } as TicketTier; // Explicit type cast to TicketTier
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Event Details */}
      <div>
        <div className="overflow-hidden rounded-lg bg-white/5">
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={event.image || "/placeholder-event.jpg"}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 brightness-75"
              aria-hidden="true"
              width={500}
              height={500}
            />
            <Image
              src={event.image || "/placeholder-event.jpg"}
              alt={event.title}
              className="relative w-full h-full object-contain z-10"
              width={500}
              height={500}
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p className="text-white/70 mb-4">{event.description}</p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-white/50 mb-1">
                  Date & Time
                </h3>
                <p className="text-white">
                  {event.date} • {event.time}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-white/50 mb-1">
                  Location
                </h3>
                <p className="text-white">{event.location}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-white/50 mb-1">
                  Availability
                </h3>
                {/* <p className="text-white">
                  {event.remaining} of {event.capacity} NFT tickets Available
                </p> */}
                 <p className="text-white">
                  {event.capacity} NFT tickets Available
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-white/50 mb-1">
                  Speaker
                </h3>
                <p className="text-white">{event.speakers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Ticket Type</h2>
        <div className="space-y-4">
          {updatedTicketTiers.map((ticket) => (
            <Card
              key={ticket.id}
              className="p-5 bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-white">{ticket.name}</h3>
                <div className="text-right">
                  {ticket.loading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {ticket.price} ETH
                    </span>
                  )}

                  <div className="text-sm text-white/70">
                    {isLoadingPrice ? (
                      <span>Loading price...</span>
                    ) : (
                      <span>~ {convertEthToIdr(ticket.price)}</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-white/70 text-sm mb-4">{ticket.description}</p>

              {ticket.benefits && ticket.benefits.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold mb-2 text-white">
                    Benefits:
                  </h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    {ticket.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.remaining > 0 ? (
                <Button
                  onClick={() => onSelectTicket(ticket)}
                  disabled={
                    ticket.loading ||
                    ("availableTickets" in ticket &&
                      ticket.availableTickets !== undefined &&
                      ticket.availableTickets <= 0)
                  }
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  {ticket.loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Price
                    </>
                  ) : "availableTickets" in ticket &&
                    ticket.availableTickets !== undefined &&
                    ticket.availableTickets <= 0 ? (
                    "Sold Out"
                  ) : (
                    `Buy for ${ticket.price} ETH`
                  )}
                </Button>
              ) : (
                <Button disabled className="w-full bg-white/50 text-white">
                  Sold Out
                </Button>
              )}
              
              {/* Show network warning but don't disable purchase buttons */}
              {isWrongNetwork && (
                <p className="text-amber-400 text-xs mt-2 text-center">
                  ⚠️ Wrong network detected. Please ensure you're on Sepolia before purchasing.
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
