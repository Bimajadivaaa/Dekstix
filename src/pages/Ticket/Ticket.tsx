"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Loader2, 
  AlertTriangle, 
  Search,
  Ticket,
  Sparkles,
  Calendar,
  TrendingUp,
  Star,
  Inbox,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  EventCard,
  EventDetail,
  TicketCheckout,
} from "../../components/Ticket";
import { ticketTiers } from "../../dataTicket/ticketData";
import { events as fallbackEvents } from "../../dataTicket/ticketData";
import { Event, TicketTier } from "../../lib/type";
import { useGetAllEvents } from "@/lib/hooks/read/useGetAllEvents";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function TicketingSystem() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketTier | null>(null);
  const [formattedEvents, setFormattedEvents] = useState<Event[]>([]);
  const [useLocalData, setUseLocalData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { allEvents, isFetchingData } = useGetAllEvents();

  // Filter events based on search query
  const filteredEvents = formattedEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {

    if (allEvents && Array.isArray(allEvents) && allEvents.length > 0) {
      try {
        const events = allEvents.map((event: any, index: number) => {
          // Make sure we have all the required fields
          if (!event || !event.name || !event.eventId) {
            console.warn("Incomplete event data:", event);
            return null;
          }

          // Convert timestamp to Date object for display
          const eventDate = new Date(Number(event.date) * 1000);
          const formattedDate = eventDate.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          // Format times
          const startTime = new Date(Number(event.startTime) * 1000);
          const endTime = new Date(Number(event.endTime) * 1000);
          const timeRange = `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
          
          return {
            id: Number(event.eventId),
            title: event.name,
            description: event.description,
            date: formattedDate,
            time: timeRange,
            location: event.location,
            image: formatImageUri(event.imageURI),
            capacity: Number(event.totalTickets || 0),
            remaining: Number(event.remainingTickets || 0),
            categories: event.categories || []
          } as Event;
        }).filter((event): event is Event => event !== null);
        
        setFormattedEvents(events);
        setUseLocalData(false);
      } catch (err) {
        console.error("Error formatting events:", err);
        setFormattedEvents(fallbackEvents);
        setUseLocalData(true);
      }
    } else if (!isFetchingData) {
      // If we're not still loading but have no data, use fallback
      console.log("No blockchain events found, using fallback data");
      setFormattedEvents(fallbackEvents);
      setUseLocalData(true);
    }
  }, [allEvents, isFetchingData]);

  // Helper to format IPFS URIs for display
  const formatImageUri = (uri: string) => {
    if (!uri) return "";
    
    if (uri.startsWith('ipfs://')) {
      return `https://gateway.pinata.cloud/ipfs/${uri.replace('ipfs://', '')}`;
    }
    return uri;
  };

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

  // Buat komponen SkeletonCard
  const SkeletonCard = () => {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        {/* Image skeleton */}
        <Skeleton className="w-full h-48 bg-white/10" />
        
        <div className="p-4 space-y-4">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 bg-white/10" />
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-2/3 bg-white/10" />
          </div>
          
          {/* Details skeleton */}
          <div className="flex items-center gap-2 mt-4">
            <Skeleton className="h-4 w-24 bg-white/10" />
            <Skeleton className="h-4 w-24 bg-white/10" />
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-9 w-full bg-white/10 mt-4" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black bg-gradient-to-r from-white/10 to-white/20 text-white p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white flex items-center justify-center gap-2">
            Purchase Ticket
          </h1>
          <p className="text-white/70 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" /> Secure your spot at the best events
          </p>
        </header>

        {useLocalData && (
          <div className="bg-amber-500/20 border border-amber-500/50 rounded-md p-3 mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-200 text-sm flex items-center gap-2">
              <Info className="h-4 w-4" /> Using demo data: Blockchain connection unavailable
            </p>
          </div>
        )}

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
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
                <TabsList className="bg-white/10 border border-white/20">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" /> Upcoming Events
                  </TabsTrigger>
                  <TabsTrigger
                    value="trending"
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" /> Trending
                  </TabsTrigger>
                  <TabsTrigger
                    value="recommended"
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" /> Recommended
                  </TabsTrigger>
                </TabsList>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:ring-white/20"
                  />
                </div>
              </div>

              <TabsContent value="upcoming" className="space-y-4">
                {isFetchingData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents
                      .filter(event => event.isActive !== false)
                      .map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onSelect={handleSelectEvent}
                        />
                      ))
                    }
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 border border-white/20 bg-white/5 rounded-md">
                    <p className="text-white/50 flex items-center gap-2">
                      {searchQuery ? (
                        <>
                          <Search className="h-4 w-4" /> No events found matching your search
                        </>
                      ) : (
                        <>
                          <Inbox className="h-4 w-4" /> No events found
                        </>
                      )}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending">
                <div className="flex items-center justify-center h-40 border border-white/20 bg-white/5 rounded-md">
                  <p className="text-white/50 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Trending events will appear here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="recommended">
                <div className="flex items-center justify-center h-40 border border-white/20 bg-white/5 rounded-md">
                  <p className="text-white/50 flex items-center gap-2">
                    <Star className="h-4 w-4" /> Recommended events based on your preferences
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