"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  Ticket,
  Clock,
  CalendarDays,
  QrCode,
  MoreHorizontal,
  Copy,
  ExternalLink,
  History,
  User,
  Settings,
  LogOut,
  Check,
  Filter,
  Download,
  Loader2,
  HelpCircle,
} from "lucide-react";
import nftImage from "../../public/Images/nft-ticket.png";

export default function EnhancedProfile() {
  const { address } = useAccount();
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Simulate NFT collection with more details
  const tickets = [
    {
      id: "T1001",
      title: "Music Festival 2025",
      image: nftImage,
      date: "March 20, 2025",
      location: "Surakarta, Jawa Tengah",
      status: "upcoming", // upcoming, past, active
      tokenId: "3742",
    },
    {
      id: "T1002",
      title: "Tech Conference 2025",
      image: nftImage,
      date: "April 15, 2025",
      location: "Convention Center, San Francisco",
      status: "upcoming",
      tokenId: "5126",
    },
    {
      id: "T1003",
      title: "Art Exhibition Opening",
      image: nftImage,
      date: "February 5, 2025",
      location: "Modern Art Gallery, Chicago",
      status: "active",
      tokenId: "8302",
    },
    {
      id: "T1004",
      title: "Tech Summit 2024",
      image: nftImage,
      date: "December 10, 2024",
      location: "Tech Hub, Austin",
      status: "past",
      tokenId: "2451",
    },
    {
      id: "T1005",
      title: "Music Festival 2024",
      image: nftImage,
      date: "August 15, 2024",
      location: "Surakarta, Jawa Tengah",
      status: "past",
      tokenId: "1735",
    },
    {
      id: "T1006",
      title: "Blockchain Conference",
      image: nftImage,
      date: "May 25, 2025",
      location: "Crypto Center, Miami",
      status: "upcoming",
      tokenId: "4217",
    },
  ];

  // Purchase history data
  const purchaseHistory = [
    {
      id: "P10024",
      event: "Music Festival 2025",
      date: "January 15, 2025",
      price: "0.05 ETH",
      status: "Completed",
      txHash: "0x3f7a...4e92",
    },
    {
      id: "P10023",
      event: "Tech Conference 2025",
      date: "January 10, 2025",
      price: "0.03 ETH",
      status: "Completed",
      txHash: "0x8c9d...1a3b",
    },
    {
      id: "P10022",
      event: "Art Exhibition Opening",
      date: "December 28, 2024",
      price: "0.02 ETH",
      status: "Completed",
      txHash: "0x7d2e...9c4f",
    },
    {
      id: "P10021",
      event: "Tech Summit 2024",
      date: "November 30, 2024",
      price: "0.04 ETH",
      status: "Completed",
      txHash: "0x2a5b...6d7e",
    },
    {
      id: "P10020",
      event: "Blockchain Conference",
      date: "December 5, 2024",
      price: "0.06 ETH",
      status: "Completed",
      txHash: "0x1e3f...8a2c",
    },
  ];

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const truncateAddress = (address: any) => {
    if (!address) return "Not Connected";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black text-white pb-16">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-white/10 to-white/20 pt-12 pb-24 px-4 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full transform translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute left-0 top-0 w-80 h-80 bg-white/5 rounded-full transform -translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute right-1/4 top-0 w-40 h-40 bg-white/5 rounded-full"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-4 border-white/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-white/10 text-white/70 text-xl">
                {address ? address.substring(2, 4).toUpperCase() : "NC"}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">
                  Crypto Collector
                </h1>
                <Badge className="bg-white/10 text-white/70 border-0 self-center hover:bg-white/20">
                  <Ticket className="h-3 w-3 mr-1" /> NFT Enthusiast
                </Badge>
              </div>

              <div
                className="flex items-center justify-center md:justify-start gap-2 text-white/70 bg-white/10 rounded-full px-3 py-1.5 w-fit mx-auto md:mx-0 cursor-pointer hover:bg-white/20 transition"
                onClick={handleCopyAddress}
              >
                <Wallet className="h-3.5 w-3.5" />
                <span className="text-sm font-mono">
                  {truncateAddress(address)}
                </span>
                {copiedAddress ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 opacity-70" />
                )}
              </div>
            </div>

            <div className="ml-auto hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    <span>Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#1a1a1a] border-white/10"
                >
                  <DropdownMenuLabel className="text-white/70">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer text-white/70 hover:bg-white/10">
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-white/70 hover:bg-white/10">
                    <Wallet className="h-4 w-4 mr-2" />
                    <span>Wallet Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-white/70 hover:bg-white/10">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Help Center</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-white/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Disconnect Wallet</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-white mt-8">
            <div className="bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{tickets.length}</div>
              <div className="text-xs text-white/70">NFT Tickets</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-white/70">Upcoming Events</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">2</div>
              <div className="text-xs text-white/70">Past Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <Tabs defaultValue="collection" className="space-y-6">
          <TabsList className="bg-white/10 border border-white/20 rounded-lg p-1 mb-8 w-full sm:w-auto">
            <TabsTrigger
              value="collection"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Ticket className="h-4 w-4 mr-2" />
              <span>NFT Collection</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <History className="h-4 w-4 mr-2" />
              <span>Purchase History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="collection"
            className="space-y-8 focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="bg-[#1a1a1a] border border-white/10">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">
                      My NFT Ticket Collection
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Manage and validate your NFT tickets
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 bg-white/10 text-white border-white/20 hover:bg-white/20"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          <span>Filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#1a1a1a] border-white/10"
                      >
                        <DropdownMenuItem className="cursor-pointer text-white/70 hover:bg-white/10">
                          All tickets
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-white/70 hover:bg-white/10">
                          Upcoming
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-white/70 hover:bg-white/10">
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-white/70 hover:bg-white/10">
                          Past
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      <span>Export</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card className="overflow-hidden border border-white/10 bg-[#1a1a1a] hover:shadow-xl hover:shadow-white/10 transition-shadow">
                        <div className="relative">
                          <div className="h-36 bg-white/5 border border-white/10 flex justify-center items-center">
                            <Image
                              src={ticket.image}
                              alt={ticket.title}
                              width={100}
                              height={100}
                              className="object-contain z-10 transform hover:scale-105 transition-transform filter brightness-90"
                            />
                          </div>

                          <div className="absolute top-3 right-3">
                            <Badge
                              className={
                                ticket.status === "upcoming"
                                  ? "bg-white/10 text-white/70 border border-white/20"
                                  : ticket.status === "active"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/20"
                                  : "bg-white/5 text-white/50 border border-white/10"
                              }
                            >
                              {ticket.status === "upcoming" && "Upcoming"}
                              {ticket.status === "active" && "Active"}
                              {ticket.status === "past" && "Past"}
                            </Badge>
                          </div>

                          <div className="absolute top-3 left-3">
                            <div className="bg-white/10 backdrop-blur-sm text-white/70 text-xs py-1 px-2 rounded border border-white/20">
                              #{ticket.tokenId}
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-white">
                            {ticket.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="pb-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-white/50" />
                              <span className="text-white/70">
                                {ticket.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-white/50" />
                              <span className="text-white/70">
                                {ticket.location}
                              </span>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-4 pb-4 flex gap-2">
                          <Button
                            className={
                              ticket.status === "past"
                                ? "w-full bg-white/5 text-white/50 cursor-not-allowed border border-white/10"
                                : "w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                            }
                            disabled={ticket.status === "past"}
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            {ticket.status === "active"
                              ? "Show QR Code"
                              : "Validate Ticket"}
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 bg-white/5 text-white/70 border-white/20 hover:bg-white/10"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[#1a1a1a] border-white/10"
                            >
                              <DropdownMenuItem className="text-white/70 hover:bg-white/10 cursor-pointer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                <span>View on Explorer</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white/70 hover:bg-white/10 cursor-pointer">
                                <Download className="h-4 w-4 mr-2" />
                                <span>Download</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="text-white/70 hover:bg-white/10 cursor-pointer">
                                <Copy className="h-4 w-4 mr-2" />
                                <span>Copy Token ID</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="history"
            className="space-y-8 focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="bg-[#1a1a1a] border border-white/10">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">
                      Purchase History
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Track all your ticket purchases
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      <span>Export CSV</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableCaption className="text-white/50">
                    A list of your recent ticket purchases.
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70">ID</TableHead>
                      <TableHead className="text-white/70">Event</TableHead>
                      <TableHead className="text-white/70">Date</TableHead>
                      <TableHead className="text-white/70">Price</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                      <TableHead className="text-right text-white/70">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseHistory.map((purchase) => (
                      <TableRow
                        key={purchase.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="font-medium text-white/70">
                          {purchase.id}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {purchase.event}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {purchase.date}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {purchase.price}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-500/20 text-green-400 border-green-500/20"
                          >
                            {purchase.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/70 hover:bg-white/10"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[#1a1a1a] border-white/10"
                            >
                              <DropdownMenuItem className="text-white/70 hover:bg-white/10 cursor-pointer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                <span>View Transaction</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white/70 hover:bg-white/10 cursor-pointer">
                                <Copy className="h-4 w-4 mr-2" />
                                <span>Copy Tx Hash</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white/70 hover:bg-white/10 cursor-pointer">
                                <Download className="h-4 w-4 mr-2" />
                                <span>Download Receipt</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

              <CardFooter className="flex justify-center pt-2">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <span>Showing 5 of 12 transactions</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    Load More
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
