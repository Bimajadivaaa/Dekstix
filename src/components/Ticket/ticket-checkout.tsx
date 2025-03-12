import {
    MapPin,
    Clock,
    Ticket,
    Info,
    CalendarCheck,
    Sparkles,
    RefreshCw,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import Image from "next/image";
  import { useState } from "react";
  import { Event, TicketTier } from "../../lib/type";
  import { NFTArtDisplay } from "./nft-art-display";
  
  interface TicketCheckoutProps {
    selectedEvent: Event;
    selectedTicket: TicketTier;
  }
  
  export function TicketCheckout({
    selectedEvent,
    selectedTicket,
  }: TicketCheckoutProps) {
    const [generatingArt, setGeneratingArt] = useState(false);
    const [nftArtGenerated, setNftArtGenerated] = useState(false);
    const isVIP = selectedTicket.id === "vip";
  
    const handleGenerateArt = () => {
      setGeneratingArt(true);
      // Simulate generation
      setTimeout(() => {
        setGeneratingArt(false);
        setNftArtGenerated(true);
      }, 2000);
    };
  
    const handleRegenerateArt = () => {
      setGeneratingArt(true);
      setNftArtGenerated(false);
      // Simulate generation
      setTimeout(() => {
        setGeneratingArt(false);
        setNftArtGenerated(true);
      }, 2000);
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden bg-[#1a1a1a] border border-white/10">
          <CardHeader className="bg-white/10 text-white p-6 border-b border-white/10">
            <CardTitle className="text-2xl text-white">{selectedEvent.title}</CardTitle>
            <CardDescription className="text-white/70">
              {selectedEvent.date} • {selectedEvent.time}
            </CardDescription>
          </CardHeader>
  
          <CardContent className="p-6">
            {isVIP && !nftArtGenerated && !generatingArt && (
              <div className="mb-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-lg">
                <Sparkles className="h-10 w-10 text-white/70 mb-3" />
                <h3 className="text-lg font-medium mb-2 text-white">
                  Create Your VIP Ticket NFT
                </h3>
                <p className="text-sm text-center text-white/50 mb-4">
                  As a VIP ticket holder, you can generate a unique NFT artwork
                  for your ticket.
                </p>
                <Button 
                  onClick={handleGenerateArt} 
                  className="mt-2 bg-white/10 text-white hover:bg-white/20 border border-white/20"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-white/70" /> Generate NFT Artwork
                </Button>
              </div>
            )}
  
            {generatingArt && (
              <div className="mb-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-lg">
                <RefreshCw className="h-10 w-10 text-white/70 mb-3 animate-spin" />
                <h3 className="text-lg font-medium mb-2 text-white">
                  Generating Your Unique NFT...
                </h3>
                <p className="text-sm text-center text-white/50 mb-4">
                  Please wait while we create your one-of-a-kind ticket artwork.
                </p>
              </div>
            )}
  
            {nftArtGenerated && isVIP && (
              <div className="mb-6">
                <NFTArtDisplay
                  event={selectedEvent}
                  ticketTier={selectedTicket}
                />
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateArt}
                    className="bg-white/5 text-white/70 border-white/20 hover:bg-white/10"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" /> Generate New Design
                  </Button>
                </div>
              </div>
            )}
  
            {isVIP ? (
              <div className="flex items-start"></div>
            ) : (
              <div className="mb-6 flex items-start">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-[30%] h-full object-cover rounded-md filter brightness-90"
                  width={80}
                  height={80}
                />
              </div>
            )}
  
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-white/50" />
                <span className="text-white/70">{selectedEvent.location}</span>
              </div>
  
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-white/50" />
                <span className="text-white/70">{selectedEvent.time}</span>
              </div>
  
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-white/50" />
                <span className="text-white/70">
                  {selectedTicket.name} Ticket - {selectedTicket.price}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
  
        <div className="space-y-6">
          <Card className="bg-[#1a1a1a] border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Complete your purchase</CardTitle>
              <CardDescription className="text-white/70">
                Selected ticket: {selectedTicket.name} ({selectedTicket.price})
              </CardDescription>
            </CardHeader>
  
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-white">Your ticket includes:</h3>
                  <ul className="space-y-2">
                    {selectedTicket.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CalendarCheck className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                        <span className="text-white/70">{benefit}</span>
                      </li>
                    ))}
  
                    {isVIP && (
                      <li className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 text-white/70 shrink-0 mt-0.5" />
                        <span className="font-medium text-white/70">
                          Custom NFT ticket artwork
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
  
            <CardFooter>
              <Button className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20">
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
  
          <Card className="bg-[#1a1a1a] border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Important Information</CardTitle>
            </CardHeader>
  
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                  <span className="text-white/70">Tickets are non-refundable and non-transferable</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                  <span className="text-white/70">Please arrive at least 30 minutes before the event</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                  <span className="text-white/70">
                    Your e-ticket will be sent to your email after purchase
                  </span>
                </div>
                {isVIP && (
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                    <span className="text-white/70">
                      Your NFT will be minted and transferred to your wallet after
                      payment
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }