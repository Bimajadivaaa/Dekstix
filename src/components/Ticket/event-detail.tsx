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
        <Card className="overflow-hidden sticky top-4">
          <div className="relative h-48 flex items-center justify-center">
            <Image 
              src={event.image} 
              alt={event.title} 
              className="w-[50%] h-full object-cover"
              width={300}
              height={200}
            />
          </div>

          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{event.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{event.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span>{event.remaining} tickets remaining</span>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {event.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">{category}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Select your ticket</CardTitle>
            <CardDescription>Choose the ticket type that best suits your needs</CardDescription>
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