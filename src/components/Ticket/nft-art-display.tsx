import { Event, TicketTier } from "../../lib/type";
import { Badge } from "@/components/ui/badge";

interface NFTArtDisplayProps {
  event: Event;
  ticketTier: TicketTier;
}

export function NFTArtDisplay({ event, ticketTier }: NFTArtDisplayProps) {
  // This is a hardcoded SVG NFT ticket for demo purposes
  // In a real application, this would be generated dynamically or fetched from an API
  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-xs">
        <svg
          viewBox="0 0 300 400"
          className="w-full h-auto border rounded-lg shadow-lg"
        >
          {/* Background */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <pattern
              id="pattern1"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="2" height="20" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>
          <rect width="300" height="400" fill="url(#bgGradient)" />
          <rect width="300" height="400" fill="url(#pattern1)" />

          {/* Event Logo */}
          <g transform="translate(150, 80)">
            <polygon
              points="0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
            />
            <polygon
              points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
              fill="#fff"
              opacity="0.6"
            />
          </g>

          {/* Event Details */}
          <g transform="translate(150, 160)" textAnchor="middle">
            <text
              fill="#fff"
              fontSize="22"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {event.title}
            </text>
            <text
              y="30"
              fill="#fff"
              fontSize="14"
              fontFamily="sans-serif"
              opacity="0.8"
            >
              {event.date} - {event.time}
            </text>
            <text
              y="50"
              fill="#fff"
              fontSize="14"
              fontFamily="sans-serif"
              opacity="0.8"
            >
              {event.location}
            </text>
          </g>

          {/* Ticket Type */}
          <g transform="translate(150, 230)" textAnchor="middle">
            <rect
              x="-80"
              y="-20"
              width="160"
              height="40"
              rx="20"
              fill="#fff"
              opacity="0.2"
            />
            <text
              y="6"
              fill="#fff"
              fontSize="18"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {ticketTier.name} TICKET
            </text>
          </g>

          {/* Barcode/QR Placeholder */}
          <g transform="translate(150, 310)">
            <rect
              x="-60"
              y="-30"
              width="120"
              height="60"
              fill="#fff"
              opacity="0.9"
            />
            {/* Simulated barcode */}
            {Array.from({ length: 20 }).map((_, i) => (
              <rect
                key={i}
                x={-55 + i * 6}
                y={-25}
                width={Math.random() * 2 + 2}
                height="50"
                fill="#000"
              />
            ))}
          </g>

          {/* NFT ID */}
          <g transform="translate(150, 355)" textAnchor="middle">
            <text
              fill="#fff"
              fontSize="10"
              fontFamily="monospace"
              opacity="0.7"
            >
              NFT ID: 0x3F7A...4E92
            </text>
          </g>

          {/* VIP Badge */}
          <g transform="translate(245, 35)">
            <circle cx="0" cy="0" r="25" fill="#FFD700" />
            <text
              textAnchor="middle"
              y="5"
              fill="#000"
              fontSize="16"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              VIP
            </text>
          </g>
        </svg>

        {/* Extra details that appear outside the SVG */}
        <div className="mt-4 text-center">
          <Badge variant="outline" className="bg-primary text-white font-bold">
            VIP NFT TICKET
          </Badge>
          <p className="text-xs mt-2 text-gray-500">
            This unique NFT ticket will be minted on the blockchain after purchase
          </p>
        </div>
      </div>
    </div>
  );
}