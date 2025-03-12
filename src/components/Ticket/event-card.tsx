import { Calendar, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Event } from "../../lib/type";

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  return (
    <Card className="overflow-hidden bg-[#1a1a1a] border border-white/10 hover:shadow-xl hover:shadow-white/10 transition-all duration-300">
      <div className="relative h-48 flex justify-center items-center bg-white/5 border-b border-white/10">
        <Image
          src={event.image}
          alt={event.title}
          className="w-[50%] h-full object-cover filter brightness-90 contrast-125"
          width={200}
          height={200}
        />
      </div>

      <CardHeader>
        <div className="flex gap-2 mb-3">
          {event.categories.slice(0, 2).map((category, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-white/10 text-white/50 border-white/20 hover:bg-white/20"
            >
              {category}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-white">{event.title}</CardTitle>
        <CardDescription className="text-white/70">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/50" />
            <span className="text-sm text-white/70">{event.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-white/50" />
            <span className="text-sm text-white/70">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-white/50" />
            <span className="text-sm text-white/70">
              {event.remaining} tickets remaining
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => onSelect(event)}
        >
          View Tickets
        </Button>
      </CardFooter>
    </Card>
  );
}
