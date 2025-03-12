import { MapPin, Clock, Ticket, Info, CalendarCheck, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import { Event, TicketTier } from "../../lib/type";
import { NFTArtDisplay } from "./nft-art-display";

interface TicketCheckoutProps {
  selectedEvent: Event;
  selectedTicket: TicketTier;
}

export function TicketCheckout({ selectedEvent, selectedTicket }: TicketCheckoutProps) {
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
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <CardTitle className="text-2xl">{selectedEvent.title}</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {selectedEvent.date} • {selectedEvent.time}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {isVIP && !nftArtGenerated && !generatingArt && (
            <div className="mb-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary rounded-lg">
              <Sparkles className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-lg font-medium mb-2">Create Your VIP Ticket NFT</h3>
              <p className="text-sm text-center text-gray-500 mb-4">
                As a VIP ticket holder, you can generate a unique NFT artwork for your ticket.
              </p>
              <Button onClick={handleGenerateArt} className="mt-2">
                <Sparkles className="h-4 w-4 mr-2" /> Generate NFT Artwork
              </Button>
            </div>
          )}

          {generatingArt && (
            <div className="mb-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary rounded-lg">
              <RefreshCw className="h-10 w-10 text-primary mb-3 animate-spin" />
              <h3 className="text-lg font-medium mb-2">Generating Your Unique NFT...</h3>
              <p className="text-sm text-center text-gray-500 mb-4">
                Please wait while we create your one-of-a-kind ticket artwork.
              </p>
            </div>
          )}

          {nftArtGenerated && isVIP && (
            <div className="mb-6">
              <NFTArtDisplay event={selectedEvent} ticketTier={selectedTicket} />
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={handleRegenerateArt}>
                  <RefreshCw className="h-3 w-3 mr-2" /> Generate New Design
                </Button>
              </div>
            </div>
          )}

          {(!isVIP || (!nftArtGenerated && !generatingArt)) && (
            <div className="mb-6 flex items-start">
              <Image 
                src={selectedEvent.image} 
                alt={selectedEvent.title} 
                className="w-[30%] h-full object-cover rounded-md"
                width={80}
                height={80}
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span>{selectedEvent.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>{selectedEvent.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-gray-500" />
              <span>{selectedTicket.name} Ticket - {selectedTicket.price}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Complete your purchase</CardTitle>
            <CardDescription>Selected ticket: {selectedTicket.name} ({selectedTicket.price})</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Your ticket includes:</h3>
                <ul className="space-y-2">
                  {selectedTicket.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CalendarCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                  
                  {isVIP && (
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                      <span className="font-medium">Custom NFT ticket artwork</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button className="w-full">Proceed to Checkout</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                <span>Tickets are non-refundable and non-transferable</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                <span>Please arrive at least 30 minutes before the event</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                <span>Your e-ticket will be sent to your email after purchase</span>
              </div>
              {isVIP && (
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                  <span>Your NFT will be minted and transferred to your wallet after payment</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}