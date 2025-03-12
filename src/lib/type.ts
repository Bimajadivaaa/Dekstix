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
}

export interface TicketTier {
  id: string;
  name: string;
  price: string;
  description: string;
  benefits: string[];
  features?: {
    customNFT?: boolean;
    vipAccess?: boolean;
    transferable?: boolean;
  };
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