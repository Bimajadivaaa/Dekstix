import Image from "next/image";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Shield,
  Wallet,
} from "lucide-react";
import nftTicket from "../public/Images/nft-ticket.png";
import Link from "next/link";
export default function About() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black text-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-white/20 animate-gradient-x"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-white/30 mix-blend-overlay animate-gradient-y"></div>
      </div>

      {/* Geometric Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[length:100px_100px] bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left content */}
          <div className="max-w-xl">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 border-white/20 text-white/70 bg-white/10"
            >
              Modern Ticketing Solution
            </Badge>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Say goodbye to manual tickets, embrace{" "}
              <span className="relative inline-block">
                decentralized verification
                <span className="absolute bottom-1 left-0 w-full h-10 bg-white/20 opacity-50 blur-lg"></span>
              </span>
            </h2>

            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Transform your event experience with blockchain-powered ticketing.
              Seamlessly integrate cutting-edge wallet technologies and enjoy
              unparalleled security and transparency.
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  icon: Shield,
                  text: "Blockchain-enhanced security protocols",
                },
                {
                  icon: RefreshCw,
                  text: "Instant wallet-to-wallet ticket transfers",
                },
                {
                  icon: Wallet,
                  text: "Multi-chain crypto wallet compatibility",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CheckCircle2 className="h-6 w-6 text-white/70 mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-white/50" />
                      <span className="font-medium text-white">
                        {item.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white">
              <Link href="/Ticket/Ticket" className="flex items-center gap-2">
                Explore Blockchain Ticketing
                <ExternalLink className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>

          {/* Right content - Ticket display */}
          <div className="relative">
            <div className="absolute -inset-1 bg-white/20 rounded-3xl opacity-30 blur-2xl"></div>

            <Card className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#1a1a1a] p-1">
              <div className="relative p-6 flex flex-col items-center z-10">

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-4 max-w-xs">
                  <Image
                    src={nftTicket}
                    alt="NFT Ticket"
                    className="rounded-lg object-contain filter brightness-110 contrast-125"
                    width={300}
                    height={300}
                  />
                </div>

                <div className="w-full mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Ticket Type</span>
                    <Badge className="bg-white/10 text-white/70 hover:bg-white/20">
                      Standard Ticket
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Transferable</span>
                    <span className="text-sm font-medium text-green-400">
                      Yes
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">
                      Smart Contract
                    </span>
                    <span className="text-sm font-mono text-white truncate max-w-[180px]">
                      <a
                        href="https://sepolia.basescan.org//address/0x57b0aa66587b487c58a8f585fa6ce83b52a2c635"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white hover:underline"
                      >
                        0x57b0...c635
                      </a>
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>Minted on Sepolia</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-white/10 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-2 h-10 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
