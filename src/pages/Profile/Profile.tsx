"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  LogOut,
  Check,
  Loader2,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import nftImage from "../../public/Images/nft-ticket.png";
import { useGetMyTicket } from "@/lib/hooks/read/useGetMyTicket";
import { useGetHistoryPurchase } from "@/lib/hooks/read/useGetHistoryPurchase";
import { useWallet } from "@/lib/hooks/use-wallet";
import { toast } from "sonner";
import { useGetStatusNFT } from "@/lib/hooks/read/useGetStatusNFT";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCode } from "@/components/ui/qr-code";
import { useGetTicketCode } from "@/lib/hooks/read/useGetTicketCode";
import { TICKETING_ADDRESS } from "@/config/const";

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";

export default function Profile() {
  const { address } = useWallet();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedTicketForQR, setSelectedTicketForQR] = useState<bigint | null>(
    null
  );
  const [visibleTicketCodes, setVisibleTicketCodes] = useState<{ [key: string]: boolean }>({});
  const [nftMetadata, setNftMetadata] = useState<{ [key: string]: any }>({});

  // Use the hooks to get ticket and purchase history data
  const {
    tickets = [],
    isLoading: isLoadingTickets,
    refetch: refetchTickets,
  } = useGetMyTicket();

  const {
    purchaseHistory = [],
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
    hasHistory,
  } = useGetHistoryPurchase();

  // Get ticket code for QR display
  const { ticketCode: qrTicketCode, isLoading: isLoadingQRCode } =
    useGetTicketCode(selectedTicketForQR || undefined);

  // Set mounted state once client is ready
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data when wallet is connected
  useEffect(() => {
    if (mounted && address) {
      refetchTickets();
      refetchHistory();
    }
  }, [mounted, address, refetchTickets, refetchHistory]);

  // Function to fetch NFT metadata from IPFS
  const fetchNFTMetadata = async (tokenURI: string, tokenId: string) => {
    try {
      // Convert IPFS URI to HTTP URL
      const ipfsUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await fetch(ipfsUrl);
      const metadata = await response.json();
      
      setNftMetadata(prev => ({
        ...prev,
        [tokenId]: metadata
      }));
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
    }
  };

  // Fetch metadata for each ticket
  useEffect(() => {
    if (tickets.length > 0) {
      tickets.forEach((ticket) => {
        if (ticket.tokenURI) {
          fetchNFTMetadata(ticket.tokenURI, ticket.tokenId.toString());
        }
      });
    }
  }, [tickets]);

  // Function to get image URL
  const getImageUrl = (ticket: any) => {
    const metadata = nftMetadata[ticket.tokenId.toString()];
    if (metadata?.image) {
      return metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return nftImage.src;
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const truncateAddress = (address: string | undefined) => {
    if (!address) return "Not Connected";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get ticket status based on event date and current time
  const getTicketStatus = (eventDate: number) => {
    const now = Math.floor(Date.now() / 1000);
    if (eventDate < now) return "past";
    if (eventDate - now < 86400) return "active"; // Less than 24 hours
    return "upcoming";
  };

  // Map ticket types to their names
  const TICKET_TYPES = ["Standard Ticket", "Premium Ticket", "VIP Ticket"];

  // Get ticket status for each ticket
  const getTicketValidationStatus = (tokenId: bigint) => {
    const { isUsed } = useGetStatusNFT(tokenId);
    return isUsed;
  };

  // Function to format ticket code
  const formatTicketCode = (code: string | undefined) => {
    if (!code) return "No code generated";
    return code;
  };

  // Function to toggle ticket code visibility
  const toggleTicketCodeVisibility = (tokenId: string) => {
    setVisibleTicketCodes(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }));
  };

  // Function to check if ticket code should be shown
  const shouldShowTicketCode = (purchase: any) => {
    if (!purchase) return false;
    return purchase.isUsed || purchase.isExpired;
  };

  // Function to check if ticket code exists
  const hasTicketCode = (tokenId: bigint) => {
    const purchase = purchaseHistory.find(p => p.tokenId === tokenId);
    return purchase?.ticketCode ? true : false;
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
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
              <Avatar className="h-24 w-24 ring-2 ring-white/20 relative">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 text-white font-bold text-xl">
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-full"></div>
                  <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-full">
                    {mounted ? (
                      address ? (
                        <div className="flex flex-col items-center justify-center">
                          {/* <span className="text-2xl">{address.substring(2, 4).toUpperCase()}</span> */}
                          {/* <div className="w-8 h-0.5 bg-white/30 rounded-full mt-1"></div> */}
                        </div>
                      ) : (
                        <User className="w-12 h-12 text-white/70" />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="text-center md:text-left mt-6">
            <div
              className="flex items-center justify-center md:justify-start gap-2 text-white/70 bg-gradient-to-r from-white/10 to-white/5 rounded-full px-4 py-2 w-fit mx-auto md:mx-0 cursor-pointer hover:from-white/20 hover:to-white/10 transition-all duration-300 border border-white/10 backdrop-blur-sm"
              onClick={handleCopyAddress}
            >
              <Wallet className="h-4 w-4 text-white/50" />
              <span className="text-sm font-mono font-medium text-white">
                {mounted ? truncateAddress(address) : ""}
              </span>
              {mounted &&
                (copiedAddress ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-white/30 hover:text-white/50" />
                ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-white mt-8">
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-lg px-6 py-4 backdrop-blur-sm border border-white/10 hover:from-white/20 hover:to-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <Ticket className="h-5 w-5 text-white/50" />
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                    {tickets.length}
                  </div>
                  <div className="text-sm text-white/50">NFT Tickets</div>
                </div>
              </div>
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
                    <CardTitle className="text-white text-4xl font-mono">
                      My NFT Ticket Collection
                    </CardTitle>
                    <CardDescription className="text-white/70 mt-4 text-md font-mono">
                      Manage and validate your NFT tickets
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {isLoadingTickets ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="h-12 w-12 mx-auto mb-4 text-white/30" />
                    <h3 className="text-xl font-semibold text-white/70 mb-2">
                      No NFT Tickets Found
                    </h3>
                    <p className="text-white/50">
                      You don't have any NFT tickets yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => {
                      const status = getTicketStatus(Number(ticket.eventId));
                      return (
                        <motion.div
                          key={ticket.tokenId.toString()}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <Card className="overflow-hidden border border-white/10 bg-[#1a1a1a] hover:shadow-xl hover:shadow-white/10 transition-shadow">
                            <div className="relative">
                              <div className="h-36 bg-white/5 border border-white/10 flex justify-center items-center">
                                <Image
                                  src={getImageUrl(ticket)}
                                  alt={ticket.eventName}
                                  width={100}
                                  height={100}
                                  className="w-[30%] h-full object-contain z-10 transform hover:scale-105 transition-transform filter brightness-90"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = nftImage.src;
                                  }}
                                />
                              </div>

                              <div className="absolute top-3 right-3">
                                <Badge
                                  className={
                                    status === "upcoming"
                                      ? "bg-white/10 text-white/70 border border-white/20"
                                      : status === "active"
                                      ? "bg-green-500/20 text-green-400 border border-green-500/20"
                                      : "bg-white/5 text-white/50 border border-white/10"
                                  }
                                >
                                  {status === "upcoming" && "Upcoming"}
                                  {status === "active" && "Active"}
                                  {status === "past" && "Past"}
                                </Badge>
                              </div>

                              <div className="absolute top-3 left-3">
                                <div className="bg-white/10 backdrop-blur-sm text-white/70 text-xs py-1 px-2 rounded border border-white/20">
                                  Token ID: {Number(ticket.tokenId)}
                                </div>
                              </div>
                            </div>

                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg text-white">
                                {ticket.eventName}
                              </CardTitle>
                            </CardHeader>

                            <CardContent className="pb-0">
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4 text-white/50" />
                                  <span className="text-white/70">
                                    {formatDate(Number(ticket.eventId))}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Ticket className="h-4 w-4 text-white/50" />
                                  <span className="text-white/70">
                                    {TICKET_TYPES[ticket.ticketType] ||
                                      "Standard"}
                                  </span>
                                </div>
                              </div>
                            </CardContent>

                            <CardFooter className="pt-4 pb-4 flex gap-2">
                              {/* Ticket Action Button */}
                              {status === "past" ? (
                                <Button
                                  className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                  onClick={() => setSelectedTicketForQR(ticket.tokenId)}
                                  disabled={!hasTicketCode(ticket.tokenId)}
                                >
                                  <QrCode className="h-4 w-4 mr-2" />
                                  {hasTicketCode(ticket.tokenId) ? "Show QR Code" : "Code Not Generated"}
                                </Button>
                              ) : getTicketValidationStatus(ticket.tokenId) ? (
                                <Button
                                  className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                  onClick={() => setSelectedTicketForQR(ticket.tokenId)}
                                  disabled={!hasTicketCode(ticket.tokenId)}
                                >
                                  <QrCode className="h-4 w-4 mr-2" />
                                  {hasTicketCode(ticket.tokenId) ? "Show QR Code" : "Code Not Generated"}
                                </Button>
                              ) : (
                                <Button
                                  className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                  asChild
                                >
                                  <Link href={`/validation?tokenId=${ticket.tokenId}`}>
                                    <QrCode className="h-4 w-4 mr-2" />
                                    Validate Ticket
                                  </Link>
                                </Button>
                              )}

                              {/* QR Code Dialog */}
                              <Dialog
                                open={selectedTicketForQR === ticket.tokenId}
                                onOpenChange={() =>
                                  setSelectedTicketForQR(null)
                                }
                              >
                                <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
                                  <DialogHeader>
                                    <DialogTitle>Ticket QR Code</DialogTitle>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center gap-4 p-4">
                                    {isLoadingQRCode ? (
                                      <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                                    ) : (
                                      <>
                                        <QRCode value={qrTicketCode || ""} />
                                        <div className="text-center">
                                          <p className="text-sm text-white/70 mb-2">
                                            Ticket Code:
                                          </p>
                                          <code className="font-mono text-lg font-bold text-white bg-white/5 px-3 py-1 rounded">
                                            {formatTicketCode(qrTicketCode)}
                                          </code>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>

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
                                  <DropdownMenuLabel className="text-white/70">
                                    Token ID: {Number(ticket.tokenId)}
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-white/10" />
                                  <DropdownMenuItem
                                    className="text-white/70 hover:bg-white/10 cursor-pointer"
                                    onClick={() => {
                                      window.open(
                                        `https://testnets.opensea.io/assets/sepolia/${TICKETING_ADDRESS}/${ticket.tokenId}`,
                                        "_blank"
                                      );
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    <span>View on OpenSea Testnet</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
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
                </div>
              </CardHeader>

              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                  </div>
                ) : !hasHistory ? (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto mb-4 text-white/30" />
                    <h3 className="text-xl font-semibold text-white/70 mb-2">
                      No Purchase History
                    </h3>
                    <p className="text-white/50">
                      You haven't purchased any tickets yet.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption className="text-white/50">
                      A list of your recent ticket purchases.
                    </TableCaption>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/70">
                          Event Name
                        </TableHead>
                        <TableHead className="text-white/70">
                          Event Date
                        </TableHead>
                        <TableHead className="text-white/70">
                          Ticket Code
                        </TableHead>
                        <TableHead className="text-white/70">Type</TableHead>
                        <TableHead className="text-white/70">Status</TableHead>
                        <TableHead className="text-right text-white/70">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseHistory.map((purchase) => (
                        <TableRow
                          key={purchase.tokenId.toString()}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell className="font-medium text-white/70">
                            {purchase.eventName}
                          </TableCell>
                          <TableCell className="text-white/70">
                            {formatDate(Number(purchase.eventDate))}
                          </TableCell>
                          <TableCell className="font-mono text-white/70">
                            <div className="flex items-center gap-2">
                              {!shouldShowTicketCode(purchase) ? (
                                <span className="text-white/50">Not generated yet</span>
                              ) : purchase.ticketCode ? (
                                <>
                                  <span>
                                    {visibleTicketCodes[purchase.tokenId.toString()] 
                                      ? purchase.ticketCode 
                                      : "••••••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-white/50 hover:text-white hover:bg-white/10"
                                    onClick={() => toggleTicketCodeVisibility(purchase.tokenId.toString())}
                                  >
                                    {visibleTicketCodes[purchase.tokenId.toString()] ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                </>
                              ) : (
                                "Not Generated"
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-white/70">
                            {TICKET_TYPES[purchase.ticketType] || "Standard"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                purchase.isUsed
                                  ? "bg-green-500/20 text-green-400 border-green-500/20"
                                  : purchase.isExpired
                                  ? "bg-red-500/20 text-red-400 border-red-500/20"
                                  : "bg-white/10 text-white/70 border-white/20"
                              }
                            >
                              {purchase.isUsed
                                ? "Ticket code generated"
                                : purchase.isExpired
                                ? "Expired"
                                : "Valid"}
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
                                <DropdownMenuItem
                                  className="text-white/70 hover:bg-white/10 cursor-pointer"
                                  onClick={() => {
                                    if (purchase.ticketCode && shouldShowTicketCode(purchase)) {
                                      navigator.clipboard.writeText(purchase.ticketCode);
                                      toast.success("Ticket code copied to clipboard");
                                      // Show the code briefly when copying
                                      toggleTicketCodeVisibility(purchase.tokenId.toString());
                                      setTimeout(() => {
                                        toggleTicketCodeVisibility(purchase.tokenId.toString());
                                      }, 2000);
                                    }
                                  }}
                                  disabled={!purchase.ticketCode || !shouldShowTicketCode(purchase)}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  <span>Copy Ticket Code</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-white/70 hover:bg-white/10 cursor-pointer"
                                  onClick={() => setSelectedTicketForQR(purchase.tokenId)}
                                  disabled={!shouldShowTicketCode(purchase)}
                                >
                                  <QrCode className="h-4 w-4 mr-2" />
                                  <span>Show QR Code</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                  className="text-white/70 hover:bg-white/10 cursor-pointer"
                                  onClick={() => {
                                    window.open(
                                      `${SEPOLIA_EXPLORER}/nft/${TICKETING_ADDRESS}/${purchase.tokenId}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  <span>View on Explorer</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-white/70 hover:bg-white/10 cursor-pointer"
                                  onClick={() => {
                                    window.open(
                                      `https://testnets.opensea.io/assets/sepolia/${TICKETING_ADDRESS}/${purchase.tokenId}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  <span>View on OpenSea Testnet</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* QR Code Dialog for Purchase History */}
                <Dialog
                  open={selectedTicketForQR !== null}
                  onOpenChange={() => setSelectedTicketForQR(null)}
                >
                  <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Ticket QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 p-4">
                      {!shouldShowTicketCode(purchaseHistory.find(p => p.tokenId === selectedTicketForQR)) ? (
                        <div className="text-center">
                          <span className="text-white/50">Ticket Not generated yet</span>
                        </div>
                      ) : isLoadingQRCode ? (
                        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                      ) : (
                        <>
                          <QRCode value={qrTicketCode || ""} />
                          <div className="text-center">
                            <p className="text-sm text-white/70 mb-2">
                              Ticket Code:
                            </p>
                            <code className="font-mono text-lg font-bold text-white bg-white/5 px-3 py-1 rounded">
                              {formatTicketCode(qrTicketCode)}
                            </code>
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
