import {
  MapPin,
  Clock,
  Ticket,
  Info,
  CalendarCheck,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Event, TicketTier } from "../../lib/type";
import { useGetTokenIDbyType } from "@/lib/hooks/read/useGetTokenIDbyType";
import { useBuyTicket } from "@/lib/hooks/write/useBuyTicket";
import { useGenerateTicketVIPImage } from "@/lib/hooks/write/useGenerateTicketVIP";
import { toast } from "sonner";
import { useEthPrice } from "@/lib/hooks/use-eth-price";
import { useBuyVIPTicket } from "@/lib/hooks/write/useBuyVIPTicket";
import { PurchaseConfirmationDialog } from "./purchase-confirmation-dialog";
import { uploadFileToPinata } from "@/lib/hooks/pinata";
import { uploadJSONToPinata } from "@/lib/hooks/pinata";

interface TicketCheckoutProps {
  selectedEvent: Event;
  selectedTicket: TicketTier;
}

export function TicketCheckout({
  selectedEvent,
  selectedTicket,
}: TicketCheckoutProps) {
  const [nftArtGenerated, setNftArtGenerated] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<
    bigint | number | null
  >(null);
  const [isMintingVIP, setIsMintingVIP] = useState(false);
  const [imageIpfsUrl, setImageIpfsUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [metadataIpfsUrl, setMetadataIpfsUrl] = useState<string | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  // Get ticket type index
  const getTicketTypeIndex = (): number => {
    const name = selectedTicket.name.toLowerCase();
    if (name.includes("standard")) return 0;
    if (name.includes("premium")) return 1;
    if (name.includes("vip")) return 2;
    return 0;
  };

  // Use the VIP NFT image generator hook
  const { artworkUrl, isGenerating, generateArtwork } =
    useGenerateTicketVIPImage();

  // Fetch token IDs
  const {
    tokenIds,
    isLoading: loadingTokenIds,
    error: tokenError,
    refetch: refetchTokenIds,
  } = useGetTokenIDbyType(
    typeof selectedEvent.id === "string"
      ? parseInt(selectedEvent.id)
      : selectedEvent.id,
    getTicketTypeIndex()
  );

  // Buy ticket hook
  const {
    handleBuyTicket,
    isBuying,
    isConfirming,
    isBuyTicketSuccess,
    buyError,
    txHash,
  } = useBuyTicket();

  const { convertEthToIdr, isLoading: isLoadingPrice } = useEthPrice();

  // Auto-select first token
  useEffect(() => {
    if (tokenIds && tokenIds.length > 0 && !selectedTokenId) {
      setSelectedTokenId(Number(tokenIds[0]));
    }
  }, [tokenIds, selectedTokenId]);

  // Refetch tokens after successful purchase
  useEffect(() => {
    if (isBuyTicketSuccess && txHash) {
      setTimeout(() => {
        refetchTokenIds();
      }, 2000); // Give the blockchain some time to update
    }
  }, [isBuyTicketSuccess, txHash, refetchTokenIds]);

  const {
    buyVIPTicket,
    isMinting,
    isSubmitted,
    mintError,
    txHash: vipTxHash,
    isConfirming: isTxLoading,
  } = useBuyVIPTicket();

  const handleGenerateArt = async () => {
    try {
      await generateArtwork({
        eventName: selectedEvent.title,
        ticketId: selectedTokenId?.toString() || selectedTicket.id,
        seed: `vip-${selectedEvent.id}-${selectedTicket.id}-${Date.now()}`,
      });
      setNftArtGenerated(true);
    } catch (error) {
      console.error("Error generating artwork:", error);
      toast.error("Failed to generate NFT artwork");
    }
  };

  const handleRegenerateArt = async () => {
    setNftArtGenerated(false);
    try {
      // Add current timestamp to ensure different seed
      await generateArtwork({
        eventName: selectedEvent.title,
        ticketId: selectedTokenId?.toString() || selectedTicket.id,
        seed: `vip-${selectedEvent.id}-${selectedTicket.id}-${Date.now()}`,
      });
      setNftArtGenerated(true);
    } catch (error) {
      console.error("Error regenerating artwork:", error);
      toast.error("Failed to regenerate NFT artwork");
    }
  };

  const handleTokenIdChange = (tokenId: bigint | number) => {
    setSelectedTokenId(tokenId);
  };

  const handlePurchase = async () => {
    if (!selectedTokenId) {
      toast.error("Please select a ticket");
      return;
    }

    // Show confirmation dialog instead of immediate purchase
    setShowConfirmationDialog(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedTokenId) return;

    try {
      // Convert price to string for ethers parsing
      const priceInEth = selectedTicket.price.toString();
      await handleBuyTicket(Number(selectedTokenId), priceInEth);
    } catch (error) {
      console.error("Purchase error:", error);
    }
  };

  const isVIP = selectedTicket.name.toLowerCase().includes("vip");
  const isPurchasing = isBuying || isConfirming;

  // Handler for uploading image to IPFS
  const handleUploadImageToIPFS = async () => {
    if (!artworkUrl) {
      toast.error("No artwork to upload!");
      return;
    }
    setIsUploadingImage(true);
    try {
      toast.loading("Uploading image to IPFS...", { id: "ipfs-upload" });
      const blob = await fetch(artworkUrl).then((r) => r.blob());
      const file = new File([blob], "vip-artwork.png", { type: blob.type });
      const ipfsUrl = await uploadFileToPinata(file);
      setImageIpfsUrl(ipfsUrl);
      toast.success("Image uploaded to IPFS!", { id: "ipfs-upload" });
    } catch (e) {
      toast.error("Failed to upload image to IPFS", { id: "ipfs-upload" });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Show VIP confirmation dialog
  const handleMintVIPTicket = async () => {
    setShowConfirmationDialog(true);
  };

  // Actual VIP purchase after confirmation
  const handleConfirmVIPPurchase = async () => {
    setIsMintingVIP(true);
    let ipfsImageUrl = imageIpfsUrl;
    try {
      // 1. Upload image to IPFS if not yet uploaded
      if (!ipfsImageUrl && artworkUrl) {
        toast.loading("Uploading NFT image to IPFS...", { id: "ipfs-upload" });
        const blob = await fetch(artworkUrl).then((r) => r.blob());
        const file = new File([blob], "vip-artwork.png", { type: blob.type });
        ipfsImageUrl = await uploadFileToPinata(file);
        setImageIpfsUrl(ipfsImageUrl);
        toast.success("Image uploaded to IPFS!", { id: "ipfs-upload" });
      }

      // 2. Upload metadata to IPFS
      toast.loading("Uploading metadata to IPFS...", { id: "ipfs-meta" });
      const metadata = {
        name: `${selectedEvent.title} - VIP Ticket`,
        description: `VIP NFT Ticket for ${selectedEvent.title}`,
        image: ipfsImageUrl,
        eventId: selectedEvent.id,
        ticketType: selectedTicket.name,
        date: selectedEvent.date,
        location: selectedEvent.location,
      };
      const metadataIpfsUrl = await uploadJSONToPinata(metadata);
      toast.success("Metadata uploaded to IPFS!", { id: "ipfs-meta" });

      // 3. Mint & Buy VIP Ticket
      toast.loading("Waiting for Wallet confirmation...", {
        id: "mint-vip",
      });
      await buyVIPTicket({
        eventId: Number(selectedEvent.id),
        metadata: { uri: metadataIpfsUrl },
        payableAmount: selectedTicket.price.toString(),
      });
      // Success handled by isTxSuccess below
    } catch (err: any) {
      toast.error("Failed to mint VIP NFT: " + (err?.message || err), {
        id: "mint-vip",
      });
    } finally {
      setIsMintingVIP(false);
      toast.dismiss("ipfs-upload");
      toast.dismiss("ipfs-meta");
    }
  };

  // Show alert on tx success/fail
  useEffect(() => {
    if (isSubmitted && vipTxHash) {
      toast.success("VIP NFT minted and purchased successfully!", {
        id: "mint-vip",
      });
    }
    if (mintError) {
      toast.error("Failed to mint VIP NFT", { id: "mint-vip" });
    }
  }, [isSubmitted, vipTxHash, mintError]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="overflow-hidden bg-[#1a1a1a] border border-white/10">
        <CardHeader className="bg-white/10 text-white p-6 border-b border-white/10">
          <CardTitle className="text-2xl text-white">
            {selectedEvent.title}
          </CardTitle>
          <CardDescription className="text-white/70">
            {selectedEvent.date} • {selectedEvent.time}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {isVIP && !nftArtGenerated && !isGenerating && (
            <div className="mb-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-lg">
              <Sparkles className="h-10 w-10 text-white/70 mb-3" />
              <h3 className="text-lg font-medium mb-2 text-white">
                Create Your VIP Ticket NFT
              </h3>
              <p className="text-sm text-center text-white/50 mb-4">
                As a VIP ticket holder, you must generate a unique NFT artwork
                for your ticket.
              </p>
              <Button
                onClick={handleGenerateArt}
                className="mt-2 bg-white/10 text-white hover:bg-white/20 border border-white/20"
              >
                <Sparkles className="h-4 w-4 mr-2 text-white/70" /> Generate NFT
                Artwork
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="mb-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-lg">
              <RefreshCw className="h-10 w-10 text-white/70 mb-3 animate-spin" />
              <h3 className="text-lg font-medium mb-2 text-white">
                Generating Your Unique NFT...
              </h3>
              <p className="text-sm text-center text-white/50 mb-4">
                Please wait while we create your one-of-a-kind ticket artwork.
              </p>
            </div>
          )}

          {nftArtGenerated && artworkUrl && isVIP && (
            <div className="mb-6">
              <div className="aspect-square rounded-lg overflow-hidden border border-white/20 bg-black/40">
                <img
                  src={artworkUrl}
                  alt="VIP Ticket NFT"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateArt}
                  disabled={isGenerating || isMintingVIP}
                  className="bg-white/5 text-white/70 border-white/20 hover:bg-white/10"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3 mr-2" />
                  )}
                  Generate New Design
                </Button>
                {/* Show Sepolia explorer link if txHash available and confirmed */}
                {vipTxHash && isSubmitted && (
                  <div className="mt-4 text-center">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${vipTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
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
                )}
              </div>
            </div>
          )}

          {isVIP ? (
            !nftArtGenerated &&
            !isGenerating && (
              <div className="mb-6 flex items-start">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-[30%] h-full object-cover rounded-md filter brightness-90"
                  width={80}
                  height={80}
                />
              </div>
            )
          ) : (
            <div className="mb-6 flex items-start">
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-[30%] h-full object-cover rounded-md filter brightness-90"
                width={80}
                height={80}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-white/50" />
              <span className="text-white/70">{selectedEvent.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-white/50" />
              <span className="text-white/70">{selectedEvent.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-white/50" />
              <span className="text-white/70">
                {selectedTicket.name} - {selectedTicket.price} ETH
              </span>
            </div>
          </div>

          {!isVIP && (
          <div className="mt-6 border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium mb-2 text-white/80">
              Available Tickets
            </h3>
            {loadingTokenIds ? (
              <div className="flex items-center text-white/60">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading available tickets...
              </div>
            ) : tokenError ? (
              <div className="flex items-center text-red-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                Error loading tickets: {tokenError.message || "Unknown error"}
              </div>
            ) : tokenIds && tokenIds.length > 0 ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tokenIds.map((tokenId) => (
                    <button
                      key={String(tokenId)}
                      onClick={() => handleTokenIdChange(tokenId)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedTokenId === tokenId
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      #{String(tokenId)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/60">
                  Total available: {tokenIds.length} tickets
                </p>
              </div>
            ) : (
              <div className="text-amber-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                No tickets available for this type
              </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-[#1a1a1a] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Complete your purchase</CardTitle>
            <CardDescription className="text-white/70">
              Selected ticket:{" "}
              <span className="font-bold">{selectedTicket.name}</span>
              {selectedTokenId && (
                <span> - NFT Token ID : #{String(selectedTokenId)}</span>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 text-white">
                  Your ticket includes:
                </h3>
                <ul className="space-y-2">
                  {selectedTicket.benefits &&
                    selectedTicket.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CalendarCheck className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                        <span className="text-white/70">{benefit}</span>
                      </li>
                    ))}

                  {isVIP && (
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-white/70 shrink-0 mt-0.5" />
                      <span className="font-medium text-white/70">
                        Custom NFT ticket artwork
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Token ID information */}
              {selectedTokenId && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="font-medium mb-2 text-white">
                    Ticket Details:
                  </h3>
                  <div className="flex items-start gap-2">
                    <Ticket className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                    <span className="text-white/70">
                      Token ID : #{String(selectedTokenId)}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    This is a unique identifier for your ticket on the
                    blockchain
                  </p>
                </div>
              )}

              {/* Price summary */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="font-medium mb-2 text-white">Price Summary:</h3>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/70">{selectedTicket.name}</span>
                  <span className="text-white/90">
                    {selectedTicket.price} ETH
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">IDR Estimation</span>
                  <span className="text-white/60">
                    {isLoadingPrice ? (
                      <span>Loading price...</span>
                    ) : (
                      <span>~ {convertEthToIdr(selectedTicket.price)}</span>
                    )}
                  </span>
                </div>
              </div>

              {isBuyTicketSuccess && txHash && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-md">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <div>
                      <span className="text-green-300 font-medium">
                        Purchase successful!
                      </span>
                      <p className="text-green-400/70 text-sm mt-1">
                        Your ticket has been purchased and added to your wallet
                      </p>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm hover:underline mt-2 inline-block"
                      >
                        View transaction
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {buyError && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                    <div>
                      <span className="text-red-300 font-medium">
                        Transaction failed
                      </span>
                      <p className="text-red-400/70 text-sm mt-1">
                        {buyError.message ||
                          "An error occurred during the purchase"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            {!isVIP && (
              <Button
                className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                disabled={
                  !selectedTokenId ||
                  loadingTokenIds ||
                  isPurchasing ||
                  isBuyTicketSuccess
                }
                onClick={handlePurchase}
              >
                {loadingTokenIds ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : isPurchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isBuying ? "Processing..." : "Confirming..."}
                  </>
                ) : isBuyTicketSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Purchase Complete
                  </>
                ) : !selectedTokenId ? (
                  "No Tickets Available"
                ) : (
                  `Buy Ticket for ${selectedTicket.price} ETH`
                )}
              </Button>
            )}
            {isVIP && (
              <Button
                className="w-full mt-2 bg-green-600/80 text-white hover:bg-green-700 border border-green-400/30"
                onClick={handleMintVIPTicket}
                disabled={isMintingVIP || isGenerating || !nftArtGenerated}
              >
                {isMintingVIP || isTxLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mint & Buy VIP Ticket...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mint & Buy VIP Ticket
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="bg-[#1a1a1a] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Important Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                <span className="text-white/70">
                  Tickets are non-refundable
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                <span className="text-white/70">
                  Please arrive at least 30 minutes before the event
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                <span className="text-white/70">
                  Your ticket will be available in your wallet after purchase
                </span>
              </div>
              {isVIP && (
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                  <span className="text-white/70">
                    Your NFT will be minted and transferred to your wallet after
                    payment
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Confirmation Dialog */}
      <PurchaseConfirmationDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
        onConfirm={isVIP ? handleConfirmVIPPurchase : handleConfirmPurchase}
        selectedTicket={selectedTicket}
        selectedEvent={selectedEvent}
        selectedTokenId={selectedTokenId ? Number(selectedTokenId) : undefined}
        isVip={isVIP}
        isLoading={isPurchasing || isMintingVIP}
      />
    </div>
  );
}
