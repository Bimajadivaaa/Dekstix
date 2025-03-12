import { CalendarCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TicketTier } from "../../lib/type";

interface TicketTierCardProps {
  ticket: TicketTier;
  onSelect: (ticket: TicketTier) => void;
}

export function TicketTierCard({ ticket, onSelect }: TicketTierCardProps) {
  const isVIP = ticket.id === "vip";

  return (
    <Card
      className={`cursor-pointer transition hover:shadow-md ${
        isVIP ? "border-2 border-primary" : ""
      }`}
      onClick={() => onSelect(ticket)}
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{ticket.name}</CardTitle>
              {isVIP && (
                <Badge variant="default" className="bg-primary text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Custom NFT
                </Badge>
              )}
            </div>
            <CardDescription>{ticket.description}</CardDescription>
          </div>
          <div className="text-xl font-bold">{ticket.price}</div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">What's included:</h4>
          <ul className="space-y-1.5 text-sm">
            {ticket.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <CalendarCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}

            {isVIP && (
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <span className="font-medium text-primary">
                  Generate custom NFT ticket artwork
                </span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant={isVIP ? "default" : "outline"}
          className="w-full"
          onClick={() => onSelect(ticket)}
        >
          Select {ticket.name} Ticket
        </Button>
      </CardFooter>
    </Card>
  );
}
