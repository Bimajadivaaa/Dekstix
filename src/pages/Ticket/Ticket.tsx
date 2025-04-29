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
  Info,
  ChevronLeft,
  ChevronRight
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
import { useWallet } from "@/lib/hooks/use-wallet";

export default function TicketingSystem() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketTier | null>(null);
  const [formattedEvents, setFormattedEvents] = useState<Event[]>([]);
  const [useLocalData, setUseLocalData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 3;
  
  const { allEvents, isFetchingData } = useGetAllEvents();
  const { address } = useWallet();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter events based on search query
  const filteredEvents = formattedEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  // Reset to page 1 if searchQuery changes or filteredEvents changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filteredEvents.length]);

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
            categories: event.categories || [],
            speakers: event.speakers || ""
          } as Event;
        }).filter((event): event is Event => event !== null);
        
        setFormattedEvents(events);
        setUseLocalData(false);
      } catch (err) {
        console.error("Error formatting events:", err);
        setFormattedEvents(fallbackEvents as Event[]);
        setUseLocalData(true);
      }
    } else if (!isFetchingData) {
      // If we're not still loading but have no data, use fallback
      console.log("No blockchain events found, using fallback data");
      setFormattedEvents(fallbackEvents as Event[]);
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

  if (!isMounted) {
    // Bisa return null, atau skeleton loader jika mau
    return null;
  }

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

        {!address ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Ticket className="h-12 w-12 mb-4 text-white/30" />
            <h2 className="text-2xl font-semibold text-white/80 mb-2">
              Please connect your wallet to view events
            </h2>
            <p className="text-white/60 mb-4">
              Connect your wallet to browse and purchase event tickets.
            </p>
          </div>
        ) : (
          <>
            {selectedTicket && selectedEvent ? (
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
            ) : selectedEvent ? (
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
            ) : (
              <div>
                <div className="relative w-full sm:w-64 mb-6">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:ring-white/20"
                  />
                </div>

                {isFetchingData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(EVENTS_PER_PAGE)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedEvents
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
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-white/80 text-sm mx-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}