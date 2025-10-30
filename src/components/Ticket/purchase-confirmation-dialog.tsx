"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Ticket, 
  Clock, 
  MapPin, 
  DollarSign, 
  Fuel, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useEstimateGas, useGasPrice, usePublicClient } from "wagmi";
import { TICKETING_ADDRESS, TICKETING_ABI } from "@/config/const";
import { formatEther } from "viem";
import { TicketTier, Event } from "@/lib/type";

interface PurchaseConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedTicket: TicketTier | null;
  selectedEvent: Event | null;
  selectedTokenId?: number;
  isVip?: boolean;
  isLoading?: boolean;
}

export function PurchaseConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedTicket,
  selectedEvent,
  selectedTokenId,
  isVip = false,
  isLoading = false,
}: PurchaseConfirmationDialogProps) {
  const [gasEstimate, setGasEstimate] = useState<bigint | null>(null);
  const [gasPrice, setGasPrice] = useState<bigint | null>(null);
  
  const publicClient = usePublicClient();
  const { data: currentGasPrice } = useGasPrice();

  // Estimate gas for the transaction
  useEffect(() => {
    const estimateGas = async () => {
      if (!selectedTicket || !selectedTokenId || !publicClient) return;

      try {
        let estimate;
        if (isVip) {
          estimate = await publicClient.estimateContractGas({
            address: TICKETING_ADDRESS,
            abi: TICKETING_ABI,
            functionName: "mintAndBuyVIPTicket",
            args: [selectedEvent?.id || 0, ""], // placeholder URI
            value: BigInt(Number(selectedTicket.price) * 1e18),
          });
        } else {
          estimate = await publicClient.estimateContractGas({
            address: TICKETING_ADDRESS,
            abi: TICKETING_ABI,
            functionName: "buyTicket",
            args: [selectedTokenId],
            value: BigInt(Number(selectedTicket.price) * 1e18),
          });
        }
        setGasEstimate(estimate);
      } catch (error) {
        console.error("Gas estimation failed:", error);
        // Set a default estimate
        setGasEstimate(BigInt(21000));
      }
    };

    if (open && selectedTicket && selectedTokenId) {
      estimateGas();
    }
  }, [open, selectedTicket, selectedTokenId, isVip, selectedEvent, publicClient]);

  useEffect(() => {
    if (currentGasPrice) {
      setGasPrice(currentGasPrice);
    }
  }, [currentGasPrice]);

  if (!selectedTicket || !selectedEvent) return null;

  const ticketPrice = Number(selectedTicket.price);
  const estimatedGasFee = gasEstimate && gasPrice 
    ? Number(formatEther(gasEstimate * gasPrice))
    : 0.001; // fallback estimate

  const totalCost = ticketPrice + estimatedGasFee;

  const ticketBenefits = {
    standard: [
      "Main event access",
      "Food area access", 
      "General seating",
      "Tour guide"
    ],
    premium: [
      "Main event access",
      "Food area access",
      "Priority seating",
      "Tour guide",
      "Welcome drink",
      "Event souvenir"
    ],
    vip: [
      "All premium benefits",
      "VIP lounge access",
      "Meet & greet with speakers",
      "Exclusive networking session",
      "Custom NFT collectible",
      "Priority parking"
    ]
  };

  const getBenefits = () => {
    if (isVip || selectedTicket.name.toLowerCase().includes('vip')) {
      return ticketBenefits.vip;
    } else if (selectedTicket.name.toLowerCase().includes('premium')) {
      return ticketBenefits.premium;
    }
    return ticketBenefits.standard;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Purchase Confirmation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Info */}
          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-2">{selectedEvent.title}</h3>
              <div className="space-y-1 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedEvent.date} • {selectedEvent.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedEvent.location}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">{selectedTicket.name}</h4>
                  <p className="text-sm text-white/60">{selectedTicket.description}</p>
                </div>
                {isVip && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    VIP
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-white flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Benefits Included:
                </h5>
                <ul className="text-sm text-white/70 space-y-1">
                  {getBenefits().map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-400 rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Breakdown
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Ticket Price:</span>
                  <span>{ticketPrice} ETH</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span className="flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    Estimated Gas Fee:
                  </span>
                  <span>~{estimatedGasFee.toFixed(6)} ETH</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-white font-medium">
                  <span>Total Cost:</span>
                  <span>{totalCost.toFixed(6)} ETH</span>
                </div>
              </div>

              <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-200">
                  Gas fees are estimates and may vary based on network congestion.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-200">
              <p className="font-medium mb-1">Important:</p>
              <p>This transaction is irreversible. Please verify all details before confirming.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-black border-white/30 text-white hover:bg-gray-900 hover:text-white hover:border-white/50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="flex-1 bg-white text-black hover:bg-gray-100 hover:text-black"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Purchase"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}