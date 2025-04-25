import { useState, useEffect } from "react";
import { Event, TicketTier } from "../lib/type";
import { useGenerateTicketVIPImage } from "@/lib/hooks/write/useGenerateTicketVIP";
import Image from "next/image";
import { Sparkles, Loader2 } from "lucide-react";

interface NFTArtDisplayProps {
  event: Event;
  ticketTier: TicketTier;
}

export function NFTArtDisplay({ event, ticketTier }: NFTArtDisplayProps) {
  const { 
    artworkUrl, 
    isGenerating, 
    error, 
    generateArtwork 
  } = useGenerateTicketVIPImage();

  // Generate artwork on component mount
  useEffect(() => {
    const generateInitialArtwork = async () => {
      await generateArtwork({
        eventName: event.title,
        ticketId: ticketTier.id,
        seed: `vip-${event.id}-${ticketTier.id}`
      });
    };

    generateInitialArtwork();
  }, [event, ticketTier, generateArtwork]);

  if (isGenerating) {
    return (
      <div className="aspect-square bg-black/30 rounded-lg flex flex-col items-center justify-center p-6">
        <Loader2 className="h-10 w-10 text-white/70 animate-spin mb-3" />
        <p className="text-white/70 text-sm text-center">Generating your unique VIP ticket artwork...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-square bg-red-900/20 rounded-lg flex flex-col items-center justify-center p-6">
        <p className="text-white/70 text-sm text-center">
          Error generating artwork. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-square rounded-lg overflow-hidden border border-white/20 bg-black/40">
        {artworkUrl ? (
          <img 
            src={artworkUrl} 
            alt="VIP Ticket NFT" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white/30" />
          </div>
        )}
      </div>
      
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
        <div className="flex items-center">
          <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
          <span className="text-xs font-medium text-white/90">VIP Ticket</span>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <p className="text-white font-medium text-sm">{event.title}</p>
        <p className="text-white/70 text-xs">{event.date}</p>
      </div>
    </div>
  );
}