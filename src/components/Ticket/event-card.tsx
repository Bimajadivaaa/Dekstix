"use client";

import { Calendar, MapPin, Speaker, Ticket, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Event } from "../../lib/type";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useWalletClient, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  const [walletChainId, setWalletChainId] = useState<number | null>(null);

  const wcChainId = walletClient?.chain?.id;

  useEffect(() => {
    // 1) update dari walletClient saat ada
    if (wcChainId) setWalletChainId(wcChainId);

    // 2) fallback: baca dari window.ethereum + dengarkan 'chainChanged'
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      // fetch sekali saat mount
      eth
        .request?.({ method: "eth_chainId" })
        .then((hex: string) => {
          const id = parseInt(hex, 16);
          setWalletChainId((prev) => (prev !== id ? id : prev));
        })
        .catch(() => {});

      // listen perubahan jaringan
      const onChainChanged = (hex: string) => {
        const id = parseInt(hex, 16);
        setWalletChainId(id);
      };
      eth.on?.("chainChanged", onChainChanged);
      return () => eth.removeListener?.("chainChanged", onChainChanged);
    }
  }, [wcChainId]);

  // ---- Derived states ----
  const isWrongNetwork = useMemo(
    () => !!walletChainId && walletChainId !== sepolia.id,
    [walletChainId]
  );

  const isDisabled = !isConnected || isWrongNetwork;

  const handleFixNetwork = () => {
    if (isWrongNetwork) {
      try {
        switchChain({ chainId: sepolia.id });
      } catch {
        // fallback manual kalau wallet tidak support programmatic switch
        toast.error("Please switch to Sepolia in your wallet");
      }
    }
  };

  const handleClick = () => {
    if (isDisabled) {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
      } else if (isWrongNetwork) {
        toast.error("Please switch to Sepolia network to view tickets");
      }
      return;
    }
    onSelect(event);
  };

  return (
    <Card className="overflow-hidden bg-[#1a1a1a] border border-white/10 hover:shadow-xl hover:shadow-white/10 transition-all duration-300">
      <div className="relative flex justify-center items-center bg-white/5 border-b border-white/10 h-[25rem]">
        <Image
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover filter brightness-90 contrast-125 cursor-pointer"
          width={1920}
          height={1080}
          quality={100}
          priority
          loading="eager"
          onClick={handleClick}
        />
      </div>

      <CardHeader>
        <div className="flex gap-2 mb-3">
          {event.categories.slice(0, 2).map((category, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-white/10 text-white/50 border-white/20 hover:bg-white/20"
            >
              {category}
            </Badge>
          ))}
        </div>
        <CardTitle
          className={`text-white ${
            !isDisabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          }`}
          onClick={handleClick}
        >
          {event.title}
        </CardTitle>
        <CardDescription className="text-white/70">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/50" />
            <span className="text-sm text-white/70">{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-white/50" />
            <span className="text-sm text-white/70">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-white/50" />
            <span className="text-sm text-white/70">
              {event.remaining} tickets remaining
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Speaker className="h-4 w-4 text-white/50" />
            <span className="text-sm text-white/70">{event.speakers}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="outline"
          className={`w-full border-white/20 ${
            isWrongNetwork
              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
              : "bg-white/10 text-white hover:bg-white/20"
          } disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          onClick={isWrongNetwork ? handleFixNetwork : handleClick}
          disabled={isDisabled}
          title={
            isDisabled
              ? !isConnected
                ? "Please connect your wallet"
                : "Please switch to Sepolia network"
              : ""
          }
        >
          {isWrongNetwork ? (
            <button className="flex items-center gap-2">
              <AlertTriangle className="h-2 w-2 mr-2" />
              Wrong Network
            </button>
          ) : (
            "View Tickets"
          )}
        </Button>

        {isWrongNetwork && (
          <p className="text-red-400 text-xs text-center">
            Please switch to Sepolia network to view tickets
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
