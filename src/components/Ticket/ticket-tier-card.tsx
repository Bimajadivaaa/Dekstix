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
      className={`cursor-pointer transition-all duration-300 
        bg-[#1a1a1a] border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-white/10
        ${isVIP ? "border-2 border-white/30" : ""}`}
      onClick={() => onSelect(ticket)}
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg text-white">{ticket.name}</CardTitle>
              {isVIP && (
                <Badge 
                  variant="outline" 
                  className="bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                >
                  <Sparkles className="h-3 w-3 mr-1 text-white/70" />
                  Custom NFT
                </Badge>
              )}
            </div>
            <CardDescription className="text-white/70">{ticket.description}</CardDescription>
          </div>
          <div className="text-xl font-bold text-white">{ticket.price}</div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/70">What's included:</h4>
          <ul className="space-y-1.5 text-sm">
            {ticket.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <CalendarCheck className="h-4 w-4 text-white/50 shrink-0 mt-0.5" />
                <span className="text-white/70">{benefit}</span>
              </li>
            ))}

            {isVIP && (
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-white/70 shrink-0 mt-0.5" />
                <span className="font-medium text-white/70">
                  Generate custom NFT ticket artwork
                </span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className={`w-full 
            ${isVIP 
              ? "bg-white/10 text-white border-white/20 hover:bg-white/20" 
              : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
            }`}
          onClick={() => onSelect(ticket)}
        >
          Select {ticket.name} Ticket
        </Button>
      </CardFooter>
    </Card>
  );
}