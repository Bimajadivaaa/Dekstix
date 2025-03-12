import { Calendar, MapPin, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Event } from "../../lib/type";

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 flex justify-center items-center">
        <Image 
          src={event.image} 
          alt={event.title} 
          className="w-[50%] h-full object-cover"
          width={200}
          height={200}
        />
        <div className="absolute bottom-3 left-3 flex gap-2">
          {event.categories.slice(0, 2).map((category, index) => (
            <Badge key={index} variant="secondary" className="bg-black/70 text-white hover:bg-black/70">
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{event.remaining} tickets remaining</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => onSelect(event)}
        >
          View Tickets
        </Button>
      </CardFooter>
    </Card>
  )
}