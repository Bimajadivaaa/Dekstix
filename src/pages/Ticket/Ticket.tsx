"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import {
  EventCard,
  EventDetail,
  TicketCheckout,
} from "../../components/Ticket";
import { events, ticketTiers } from "../../dataTicket/ticketData";
import { Event, TicketTier } from "../../lib/type";

export default function TicketingSystem() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketTier | null>(null);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setSelectedTicket(null);
  };

  const handleSelectTicket = (ticket: TicketTier) => {
    setSelectedTicket(ticket);
  };

  const handleBack = () => {
    if (selectedTicket) {
      setSelectedTicket(null);
    } else if (selectedEvent) {
      setSelectedEvent(null);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-gradient-to-r from-white/10 to-white/20 text-white p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {/* <div className=" top-0 left-0  w-full h-full bg-gradient-to-r from-white/10 to-white/20 animate-gradient-x"></div> */}
        {/* <div className="absolute w-full h-full bg-gradient-to-tr from-white/20 to-white/30 mix-blend-overlay animate-gradient-y p-20"></div> */}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Purchase Ticket
          </h1>
          <p className="text-white/70">Secure your spot at the best events</p>
        </header>

        {selectedTicket && selectedEvent && (
          <div>
            <Button
              variant="outline"
              onClick={handleBack}
              className="mb-4 flex items-center gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" /> Back to tickets
            </Button>

            <TicketCheckout
              selectedEvent={selectedEvent}
              selectedTicket={selectedTicket}
            />
          </div>
        )}

        {selectedEvent && !selectedTicket && (
          <div>
            <Button
              variant="outline"
              onClick={handleBack}
              className="mb-4 flex items-center gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" /> Back to events
            </Button>

            <EventDetail
              event={selectedEvent}
              ticketTiers={ticketTiers}
              onSelectTicket={handleSelectTicket}
            />
          </div>
        )}

        {!selectedEvent && (
          <div>
            <Tabs defaultValue="upcoming" className="mb-8">
              <TabsList className="mb-4 bg-white/10 border border-white/20">
                <TabsTrigger
                  value="upcoming"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold"
                >
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold"
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger
                  value="recommended"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold"
                >
                  Recommended
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onSelect={handleSelectEvent}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending">
                <div className="flex items-center justify-center h-40 border border-white/20 bg-white/5 rounded-md">
                  <p className="text-white/50">
                    Trending events will appear here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="recommended">
                <div className="flex items-center justify-center h-40 border border-white/20 bg-white/5 rounded-md">
                  <p className="text-white/50">
                    Recommended events based on your preferences
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
