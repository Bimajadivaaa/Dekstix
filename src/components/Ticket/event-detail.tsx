import { Calendar, Clock, MapPin, Users, CalendarCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { TicketTierCard } from "./ticket-tier-card";
import { Event, TicketTier } from "../../lib/type";

interface EventDetailProps {
  event: Event;
  ticketTiers: TicketTier[];
  onSelectTicket: (ticket: TicketTier) => void;
}

export function EventDetail({ event, ticketTiers, onSelectTicket }: EventDetailProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card className="overflow-hidden sticky top-4 bg-[#1a1a1a] border border-white/10">
          <div className="relative h-48 flex items-center justify-center bg-white/5 border-b border-white/10">
            <Image 
              src={event.image} 
              alt={event.title} 
              className="w-[50%] h-full object-cover filter brightness-90 contrast-125"
              width={300}
              height={200}
            />
          </div>

          <CardHeader>
            <CardTitle className="text-white">{event.title}</CardTitle>
            <CardDescription className="text-white/70">{event.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-white/50" />
                <span className="text-white/70">{event.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-white/50" />
                <span className="text-white/70">{event.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-white/50" />
                <span className="text-white/70">{event.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-white/50" />
                <span className="text-white/70">{event.remaining} tickets remaining</span>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {event.categories.map((category, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="bg-[#1a1a1a] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Select your ticket</CardTitle>
            <CardDescription className="text-white/70">Choose the ticket type that best suits your needs</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {ticketTiers.map((ticket) => (
              <TicketTierCard
                key={ticket.id}
                ticket={ticket}
                onSelect={onSelectTicket}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}