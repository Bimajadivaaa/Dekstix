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
import { events, ticketTiers } from "./data/ticketData";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Purchase Ticket</h1>
          <p className="text-gray-600">Secure your spot at the best events</p>
        </header>

        {selectedTicket && selectedEvent && (
          <div>
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4 flex items-center gap-2"
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
              variant="ghost"
              onClick={handleBack}
              className="mb-4 flex items-center gap-2"
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
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
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
                <div className="flex items-center justify-center h-40 border rounded-md">
                  <p className="text-gray-500">
                    Trending events will appear here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="recommended">
                <div className="flex items-center justify-center h-40 border rounded-md">
                  <p className="text-gray-500">
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



