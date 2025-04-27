"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Ticket,
  AlertCircle,
  Wallet,
  ChevronDown,
  Copy,
  QrCode,
  Eye,
  EyeOff,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import nftImageFallback from "../../public/Images/nft-ticket.png";
import { useWallet } from "../../lib/hooks/use-wallet";
import { useGetMyTicket } from "@/lib/hooks/read/useGetMyTicket";
import { useGenerateTicketCode } from "@/lib/hooks/write/useGenerateTicketCode";
import { useGetTicketCode } from "@/lib/hooks/read/useGetTicketCode";
import { toast } from "sonner";
import { useGetStatusNFT } from "@/lib/hooks/read/useGetStatusNFT";
import { cn } from "@/lib/utils";
import { QRCode } from "@/components/ui/qr-code";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useDisconnect } from "wagmi";

// Define the ticket type based on the contract's TicketWithNFT struct
type Ticket = {
  tokenId: bigint;
  eventId: bigint;
  eventName: string;
  ticketType: number;
  tokenURI: string;
};

// Define NFT metadata type
type NFTMetadata = {
  name: string;
  description: string;
  image: string;
};

// Map for ticket types
const TICKET_TYPES = ["Standard Ticket", "Premium Ticket", "VIP Ticket"];

export default function EnhancedValidation() {
  // Add mounted state to handle hydration
  const [mounted, setMounted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showTicketCode, setShowTicketCode] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const searchParams = useSearchParams();
  const { disconnect } = useDisconnect();

  // Use the get ticket code hook with proper conversion
  const {
    ticketCode: fetchedTicketCode,
    isLoading: isLoadingCode,
    refetch: refetchCode,
    error: ticketCodeError,
  } = useGetTicketCode(
    selectedTicket?.tokenId ? BigInt(selectedTicket.tokenId) : undefined
  );

  // Set mounted state once client is ready
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the wallet hook to get connection status and address
  const { address, isConnected } = useWallet();

  // Use the ticket hook to get NFT tickets
  const {
    tickets = [],
    isLoading: isLoadingTickets,
    refetch: refetchTickets,
  } = useGetMyTicket();

  // Use the generate ticket code hook
  const {
    generateTicketCode,
    isGenerating,
    isConfirming,
    isGenerateSuccess,
    error: generateError,
    txHash,
  } = useGenerateTicketCode();

  console.log("txHash", txHash);

  // Add status check hook
  const {
    isUsed,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = useGetStatusNFT(
    selectedTicket?.tokenId ? BigInt(selectedTicket.tokenId) : undefined
  );

  // Combined loading state for the validation process
  const isProcessing = isValidating || isGenerating || isConfirming;

  // Fetch NFT tickets when wallet is connected
  useEffect(() => {
    if (mounted && isConnected && address) {
      refetchTickets();
    }
  }, [mounted, isConnected, address, refetchTickets]);

  // Determine if user has any NFT tickets
  const hasNFTs = tickets.length > 0;

  // If tickets are available, select the first one by default
  useEffect(() => {
    if (mounted && hasNFTs && !selectedTicket) {
      setSelectedTicket(tickets[0] as Ticket);
    }
  }, [mounted, tickets, hasNFTs, selectedTicket]);

  // Function to fetch NFT metadata
  const fetchNFTMetadata = async (tokenURI: string) => {
    if (!mounted) return;

    try {
      // If the tokenURI is an IPFS URL, convert it to use a public gateway
      const ipfsUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await fetch(ipfsUrl);
      const metadata = await response.json();
      setNftMetadata(metadata);
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      setNftMetadata(null);
    }
  };

  // Fetch metadata when selected ticket changes
  useEffect(() => {
    if (mounted && selectedTicket?.tokenURI) {
      fetchNFTMetadata(selectedTicket.tokenURI);
    }
  }, [mounted, selectedTicket]);

  // Update progress during validation
  useEffect(() => {
    if (!mounted) return;

    let progressInterval: NodeJS.Timeout;

    if (isConfirming) {
      // Start progress animation only after transaction is confirmed
      setIsValidating(true);
      setProgress(0); // Reset progress when confirmation starts

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) return prev + 2;
          if (prev < 60) return prev + 1;
          return Math.min(prev + 0.5, 95);
        });
      }, 100);
    }

    // Clean up interval
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [mounted, isConfirming]);

  // Effect to handle successful ticket code generation
  useEffect(() => {
    if (!mounted) return;

    if (isGenerateSuccess) {
      console.log("Generate Success, Hash:", txHash);
      setProgress(100);
      setIsLoadingDetails(true);

      // Wait a bit for the transaction to be mined and then fetch the code
      setTimeout(async () => {
        setIsValidating(false);
        setValidationComplete(true);
        await refetchCode();
        // Show QR code and ticket code after loading
        setShowQRCode(true);
        setShowTicketCode(true);
        setIsLoadingDetails(false);
      }, 2000);
    }
  }, [mounted, isGenerateSuccess, txHash, refetchCode]);

  // Effect to check status after validation
  useEffect(() => {
    if (validationComplete) {
      refetchStatus();
    }
  }, [validationComplete, refetchStatus]);

  // Debug logs
  useEffect(() => {
    if (selectedTicket) {
      console.log("Selected Ticket ID:", selectedTicket.tokenId);
      console.log("Fetched Ticket Code:", fetchedTicketCode);
      console.log("Ticket Code Error:", ticketCodeError);
    }
  }, [selectedTicket, fetchedTicketCode, ticketCodeError]);

  // Handle errors
  useEffect(() => {
    if (!mounted) return;

    if (generateError && isValidating) {
      setIsValidating(false);
      setProgress(0);
      toast.error("Validation failed", {
        description:
          "There was an error validating your ticket. Please try again.",
      });
    }
  }, [mounted, generateError, isValidating]);

  // Function to validate ticket on the blockchain
  const handleValidate = async () => {
    if (!mounted || !selectedTicket) return;

    try {
      // Call the function from our hook without setting loading state
      await generateTicketCode(Number(selectedTicket.tokenId));
    } catch (error) {
      console.error("Error initiating ticket validation:", error);
      setIsValidating(false);
      setProgress(0);
    }
  };

  // Handle ticket selection
  const handleTicketSelect = (tokenId: string) => {
    const selected = tickets.find(
      (ticket) => ticket.tokenId.toString() === tokenId
    );
    if (selected) {
      setSelectedTicket(selected);
    }
  };

  // Function to get status message and style
  const getStatusDisplay = () => {
    if (isLoadingStatus) {
      return {
        message: "Checking ticket status...",
        className: "bg-white/10 text-white/70 border-white/20",
      };
    }
    if (statusError) {
      return {
        message: "Error checking status",
        className: "bg-red-500/20 text-red-400 border-red-500/20",
      };
    }
    if (isUsed) {
      return {
        message: "Ticket code generated",
        className: "bg-green-500/20 text-green-400 border-green-500/20",
      };
    }
    return {
      message: "Valid Ticket",
      className: "bg-white/10 text-white/70 border-white/20",
    };
  };

  // Function to check if validation should be disabled
  const isValidationDisabled = () => {
    if (!selectedTicket) return true;
    if (isUsed) return true;

    return false;
  };

  // Function to get validation button text
  const getValidationButtonText = () => {
    if (isUsed) return "Ticket Already Generated";
    return "Generate Ticket Code";
  };

  // Function to format ticket code
  const formatTicketCode = (code: string | undefined) => {
    if (!code) return "No code generated";
    return code;
  };

  // Set QR code visibility based on URL parameter
  useEffect(() => {
    if (mounted && searchParams.get("showQR") === "true") {
      setShowQRCode(true);
    }
  }, [mounted, searchParams]);

  // Function to check if ticket code should be shown
  const shouldShowTicketCode = () => {
    return isUsed || validationComplete || fetchedTicketCode;
  };

  // Return null or loading state during server-side rendering
  if (!mounted) {
    return (
      <div className="relative py-16 px-4 min-h-screen overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black text-white">
        <div className="container mx-auto max-w-4xl flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-10 w-10 text-white/70 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-16 px-4 min-h-screen overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black text-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-white/20 animate-gradient-x"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-white/30 mix-blend-overlay animate-gradient-y"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full mix-blend-screen filter blur-xl opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full mix-blend-screen filter blur-xl opacity-20"></div>

      <div className="container relative mx-auto max-w-4xl">
        <div className="flex flex-col items-center mb-12 text-center">
          <Badge className="mb-4 px-3 py-1 bg-white/10 text-white/70 rounded-full border border-white/20">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-white/70" /> Secure
            Verification
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Generate your NFT Ticket Code
          </h1>

          <p className="text-lg text-white/70 max-w-2xl">
            Generate your{" "}
            <span className="text-white/90 font-semibold">NFT</span> ticket to
            receive a unique access code for event entry
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <Card className="bg-[#1a1a1a] border border-white/10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl text-white">
                Wallet Detection
              </CardTitle>
              <CardDescription className="text-white/70">
                Connect your wallet to automatically detect your NFT tickets
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pb-4">
              {isConnected && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 text-white/60 mr-2" />
                    <span className="text-sm text-white/80">
                      Connected: {address?.substring(0, 6)}...
                      {address?.substring(address.length - 4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-7 px-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 bg-transparent border border-red-400/20 rounded-md"
                      onClick={() => disconnect()}
                    >
                      Disconnect
                    </Button>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white/80"
                  >
                    {isLoadingTickets ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Ticket className="h-3 w-3 mr-1" />
                    )}
                    {isLoadingTickets
                      ? "Loading..."
                      : `${tickets.length} Tickets`}
                  </Badge>
                </div>
              )}

              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-white/20">
                  {/* Show NFT image from the selected ticket if available */}
                  {selectedTicket ? (
                    <Image
                      src={
                        nftMetadata?.image
                          ? nftMetadata.image.replace(
                              "ipfs://",
                              "https://ipfs.io/ipfs/"
                            )
                          : nftImageFallback
                      }
                      alt={nftMetadata?.name || "NFT Ticket"}
                      fill
                      className="object-cover filter brightness-90"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = nftImageFallback.src;
                      }}
                    />
                  ) : (
                    <Image
                      src={nftImageFallback}
                      alt="NFT Ticket Placeholder"
                      fill
                      className="object-cover filter brightness-90"
                    />
                  )}

                  {!isConnected && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-white/70" />
                    </div>
                  )}

                  {isConnected && !hasNFTs && !isLoadingTickets && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center p-3">
                        <AlertCircle className="h-10 w-10 text-amber-400/70 mx-auto mb-2" />
                        <p className="text-sm text-white/80">
                          No tickets found
                        </p>
                      </div>
                    </div>
                  )}

                  {validationComplete && (
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-4">
                      <div className="bg-white/10 rounded-full p-2 shadow-lg">
                        <CheckCircle2 className="h-10 w-10 text-green-400" />
                      </div>
                      <div
                        className="flex items-center justify-center text-white bg-green-500/10
                      text-center border border-green-400/20 rounded-xl  p-2 text-sm font-bold"
                      >
                        Success Generated Ticket Code
                      </div>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="absolute inset-0 bg-emerald-900/30 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                      <div className="w-full space-y-4">
                        <div className="relative">
                          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="absolute -bottom-6 left-0 w-full">
                            <div className="flex justify-between text-xs text-white/70">
                              <span>Generating...</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                          </div>
                        </div>

                        {/* {progress > 50 && fetchedTicketCode && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-4 space-y-2"
                          >
                            <div className="text-center">
                              <p className="text-sm text-white/90 mb-1">
                                Your Ticket Code:
                              </p>
                              <code className="font-mono text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-lg flex items-center justify-center">
                                {fetchedTicketCode}
                              </code>
                            </div>
                          </motion.div>
                        )} */}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedTicket && (
                <div className="flex items-center justify-center gap-2">
                  <Ticket className="h-5 w-5 mr-1 text-white" />
                  <p className="text-sm text-white/80 text-center font-bold">
                    {TICKET_TYPES[selectedTicket.ticketType] ||
                      "Standard Ticket"}{" "}
                    NFT
                  </p>
                </div>
              )}

              {validationComplete && fetchedTicketCode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-6"
                >
                  <div className="bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col items-center gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <QRCode value={fetchedTicketCode} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-white/70 p-2">
                        Your Ticket Code:
                      </p>
                      <div className="flex items-center gap-2 justify-center">
                        <code className="font-mono text-base font-bold text-white bg-white/10 px-2 py-2 rounded-lg">
                          {fetchedTicketCode}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-white/50 hover:text-white hover:bg-white/10"
                          onClick={() => {
                            navigator.clipboard.writeText(fetchedTicketCode);
                            toast.success("Ticket code copied to clipboard");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      {txHash && (
                        <div className="mt-6 text-sm border-t border-white/10 pt-4">
                          <p className="text-white/70 mb-2">
                            Transaction Details:
                          </p>
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center justify-center gap-2">
                              <code className="font-mono text-xs text-white/90 bg-white/10 px-2 py-1 rounded">
                                {txHash.slice(0, 10)}...{txHash.slice(-8)}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10"
                                onClick={() => {
                                  navigator.clipboard.writeText(txHash);
                                  toast.success(
                                    "Transaction hash copied to clipboard"
                                  );
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors mt-2"
                            >
                              View on Sepolia Explorer
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center w-full">
                    <Button
                      variant="outline"
                      className="w-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border-white/10"
                      onClick={() => {
                        setValidationComplete(false);
                        setShowQRCode(false);
                        setShowTicketCode(false);
                        setProgress(0);
                      }}
                    >
                      Back to Validation
                    </Button>
                  </div>
                </motion.div>
              )}

              {isConnected &&
                hasNFTs &&
                !validationComplete &&
                !isValidating && (
                  <div className="space-y-4">
                    {tickets.length > 1 && (
                      <div className="space-y-2">
                        <label className="text-sm text-white/70">
                          Select Ticket to Validate
                        </label>
                        <Select
                          value={selectedTicket?.tokenId.toString()}
                          onValueChange={handleTicketSelect}
                        >
                          <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select a ticket" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10">
                            {tickets.map((ticket) => (
                              <SelectItem
                                key={ticket.tokenId.toString()}
                                value={ticket.tokenId.toString()}
                                className="text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Ticket className="h-4 w-4 text-white" />
                                  <span className="text-sm font-mono font-medium text-white">
                                    {ticket.eventName} Ticket
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="ml-auto bg-white/20 border-white/20 text-white/80 hover:bg-transparent"
                                  >
                                    <span className="text-xs font-medium text-white">
                                      {TICKET_TYPES[ticket.ticketType] ||
                                        "Standard Ticket"}
                                    </span>
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedTicket && (
                      <div className="text-center space-y-2">
                        <h3 className="font-medium text-white">
                          {selectedTicket.eventName || "NFT Ticket Found"}
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                          <Badge
                            variant="outline"
                            className={getStatusDisplay().className}
                          >
                            {isLoadingStatus && (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            )}
                            {getStatusDisplay().message}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-white/10 text-white/70 border-white/20"
                          >
                            {TICKET_TYPES[selectedTicket.ticketType] ||
                              "Standard"}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/70">
                          Token ID: #{Number(selectedTicket.tokenId)}
                        </p>
                        <div className="text-sm text-white/70 mt-1">
                          <div className="flex items-center gap-2 justify-center">
                            <span>Ticket Code:</span>
                            {!shouldShowTicketCode() ? (
                              <span className="text-white/50">
                                Not generated yet
                              </span>
                            ) : isLoadingCode ? (
                              <Loader2 className="h-3 w-3 animate-spin inline" />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-mono">
                                  {showTicketCode ? (
                                    <span className="font-bold">
                                      {formatTicketCode(fetchedTicketCode)}
                                    </span>
                                  ) : (
                                    "••••••••••••"
                                  )}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-white/50 hover:text-white hover:bg-white/10"
                                    onClick={() =>
                                      setShowTicketCode(!showTicketCode)
                                    }
                                  >
                                    {showTicketCode ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                  {showTicketCode && fetchedTicketCode && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 text-white/50 hover:text-white hover:bg-white/10"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          fetchedTicketCode
                                        );
                                        toast.success(
                                          "Ticket code copied to clipboard"
                                        );
                                      }}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {shouldShowTicketCode() && (
                          <>
                            <div className="flex items-center gap-2 justify-center">
                              <Button
                                variant="ghost"
                                className="h-7 px-2 text-white/50 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1"
                                onClick={() => setShowQRCode(!showQRCode)}
                              >
                                <QrCode className="h-3 w-3" />
                                {showQRCode ? "Hide QR Code" : "Show QR Code"}
                              </Button>
                            </div>

                            {showQRCode && fetchedTicketCode && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 flex flex-col items-center gap-4"
                              >
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                  <QRCode value={fetchedTicketCode} />
                                </div>
                                {fetchedTicketCode && (
                                  <div className="text-center">
                                    <p className="text-sm text-white/90 font-medium mb-2">
                                      Ticket Code:
                                    </p>
                                    <code className="font-mono text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
                                      {fetchedTicketCode}
                                    </code>
                                  </div>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border-white/10"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      fetchedTicketCode
                                    );
                                    toast.success(
                                      "Ticket code copied to clipboard"
                                    );
                                  }}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Ticket Code
                                </Button>
                              </motion.div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
            </CardContent>

            <Separator className="bg-white/10 mb-4" />

            <CardFooter className="flex justify-center pt-0 pb-6">
              {!isConnected ? (
                <div className="w-full max-w-xs">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openConnectModal,
                      mounted: rainbowKitMounted,
                    }) => {
                      const ready = rainbowKitMounted;
                      const connected = ready && account && chain;

                      return (
                        <div
                          {...(!ready && {
                            "aria-hidden": true,
                            style: {
                              opacity: 0,
                              pointerEvents: "none",
                              userSelect: "none",
                            },
                          })}
                          className="w-full"
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <Button
                                  onClick={openConnectModal}
                                  className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                >
                                  Connect Wallet
                                </Button>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                  <p className="text-xs text-white/70 text-center mt-5">
                    Please connect your wallet to generate your ticket code!
                  </p>
                </div>
              ) : isLoadingTickets ? (
                <Button
                  disabled
                  className="w-full max-w-xs bg-white/10 text-white"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading tickets...
                </Button>
              ) : !hasNFTs ? (
                <Button
                  disabled
                  className="w-full max-w-xs bg-white/10 text-white/70 border border-white/10"
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  No NFT tickets found
                </Button>
              ) : isProcessing ? (
                <div className="flex items-center justify-center flex-col">
                  <p className="text-white/70 text-sm mb-2">
                    Please Wait for your code ticket is generating...
                  </p>
                  <Button
                    disabled
                    className="w-full max-w-xs bg-white/10 text-white"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isConfirming ? "Confirming..." : "Generating..."}
                  </Button>
                </div>
              ) : (
                !validationComplete && (
                  <Button
                    onClick={handleValidate}
                    className={cn(
                      "w-full max-w-xs border border-white/20",
                      isValidationDisabled()
                        ? "bg-white/5 text-white/50 cursor-not-allowed"
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                    disabled={isValidationDisabled()}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {getValidationButtonText()}
                  </Button>
                )
              )}

              {validationComplete && (
                <Button
                  variant="outline"
                  className="w-full max-w-xs bg-white/10 text-green-400 border-green-400/20 hover:bg-white/20"
                  disabled
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Ticket Validated
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center text-white/70 max-w-lg mx-auto">
          <h3 className="font-semibold text-white mb-2">
            How Validation Works
          </h3>
          <p className="text-sm">
            Our secure verification system checks the blockchain to confirm your
            ticket NFT ownership. Once validated, you'll receive a unique access
            code that can be shown at the event entrance. This process ensures
            that only valid ticket holders can gain access.
          </p>
        </div>
      </div>
    </div>
  );
}
