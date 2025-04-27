import nftTicket from "../public/Images/nft-ticket.png"

export const events = [
  {
    id: 1,
    title: "Music Festival 2025",
    description: "Experience the ultimate music festival with top artists",
    image: nftTicket,
    date: "March 20, 2025",
    location: "Surakarta, Jawa Tengah",
    time: "12:00 PM - 10:00 PM",
    capacity: 5000,
    remaining: 1243,
    categories: ["Music", "Festival", "Live"],
    speaker: "John Doe"
  },
  {
    id: 2,
    title: "Tech Conference 2025",
    description: "Join industry leaders for cutting-edge technology insights",
    image: nftTicket,
    date: "April 15, 2025",
    location: "Convention Center, San Francisco",
    time: "9:00 AM - 6:00 PM",
    capacity: 3000,
    remaining: 876,
    categories: ["Technology", "Conference", "Networking"],
    speaker: "Jane Smith"
  },
  {
    id: 3,
    title: "Art Exhibition Opening",
    description: "Exclusive first look at the new contemporary art collection",
    image: nftTicket,
    date: "May 5, 2025",
    location: "Modern Art Gallery, Chicago",
    time: "7:00 PM - 10:00 PM",
    capacity: 1000,
    remaining: 452,
    categories: ["Art", "Exhibition", "Culture"]
  },
]

export const ticketTiers = [
  { 
    id: "standard", 
    name: "Standard Ticket", 
    price: "0.1 IDR", 
    description: "General admission with access to all main areas",
    benefits: ["Main event access", "Food area access", "General seating, Tour guide"]
  },
  { 
    id: "premium", 
    name: "Premium Ticket", 
    price: "0.2 IDR", 
    description: "Enhanced experience with premium benefits",
    benefits: ["Standard benefits", "Premium seating", "Exclusive lounge access", "Event goodie bag, Tour guide"]
  },
  { 
    id: "vip", 
    name: "VIP Ticket", 
    price: "1 IDR", 
    description: "Ultimate experience with all exclusive perks",
    benefits: ["Premium benefits", "Meet & greet with artists", "Complimentary food & drinks", "VIP entrance", "Front row seating, Tour guide"]
  },
]