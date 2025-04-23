import { StaticImageData } from "next/image";

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string | StaticImageData;
  date: string;
  location: string;
  time: string;
  capacity: number;
  remaining: number;
  categories: string[];
  isActive?: boolean; 
}

export interface TicketTier {
  id: string;
  name: string;
  price: number | string; // Using number type for price
  description: string;
  benefits?: string[];
  availableTickets?: number; // Make it optional
  eventId?: string;
  features?: {
    customNFT?: boolean;
    vipAccess?: boolean;
    transferable?: boolean;
  };
  loading?: boolean; // Add loading state
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}
