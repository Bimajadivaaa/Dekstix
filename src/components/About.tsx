import Image from "next/image";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2, RefreshCw, Shield, Wallet } from "lucide-react";
import nftTicket from "../public/Images/nft-ticket.png";

export default function About() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left content */}
          <div className="max-w-xl">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-blue-200 text-blue-700 bg-blue-50">
              Modern Ticketing Solution
            </Badge>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Say goodbye to manual tickets, enjoy{" "}
              <span className="relative inline-block">
                real-time verification
                <span className="absolute bottom-1 left-0 w-full h-10 bg-blue-600 opacity-40"></span>
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Whether you're hosting events or attending them, embrace the
              future of digital ticketing with seamless wallet integration and
              decentralized solutions that provide unmatched security and convenience.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                { icon: Shield, text: "Enhanced security with blockchain technology" },
                { icon: RefreshCw, text: "Seamless transfers between wallets" },
                { icon: Wallet, text: "Direct integration with popular crypto wallets" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{item.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="gap-2 rounded-lg bg-blue-600 hover:bg-blue-700">
              Learn More About Blockchain Ticketing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Right content - Ticket display */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-xl opacity-20 rounded-3xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-xl opacity-20 rounded-3xl transform -rotate-3"></div>
            
            <Card className="relative overflow-hidden rounded-2xl border border-blue-100 shadow-xl bg-white p-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full transform translate-x-10 -translate-y-10 opacity-20"></div>
              
              <div className="relative p-6 flex flex-col items-center">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                  Blockchain Verified
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl mb-4 max-w-xs">
                  <Image
                    src={nftTicket}
                    alt="NFT Ticket"
                    className="rounded-lg object-contain"
                    width={300}
                    height={300}
                  />
                </div>
                
                <div className="w-full mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Ticket Type</span>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      VIP Pass
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Transferable</span>
                    <span className="text-sm font-medium text-green-600">Yes</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Smart Contract</span>
                    <span className="text-sm font-mono text-gray-800 truncate max-w-[180px]">
                      0x3F7A...4E92
                    </span>
                  </div>
                </div>
                
                <div className="w-full mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Minted on Ethereum</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-yellow-300 rounded-full opacity-50"></div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-2 h-10 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}