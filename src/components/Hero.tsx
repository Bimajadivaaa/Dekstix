import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Ticket } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative overflow-hidden pb-20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70"></div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      
      <div className="relative container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Redefining Event Ticketing</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                Blockchain ticketing with{" "}
                <span className="text-blue-600 inline-block relative">
                  NFT
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-200 opacity-30 rounded-full transform translate-y-2"></span>
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl">
                Secure, transparent, and immutable blockchain ticketing solution. 
                Own your tickets as collectible NFTs while ensuring authenticity and preventing fraud.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                <Ticket className="h-5 w-5" />
                Browse Events
              </Button>
              <Button size="lg" variant="outline" className="gap-2 rounded-xl">
                Learn How It Works
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-blue-100">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-80"></div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <strong>1,000+</strong> collectors have secured their ticket NFTs
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
            <Card className="relative w-full bg-white/90 backdrop-blur border border-blue-100 shadow-xl rounded-2xl overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                VIP Access
              </div>
              
              <div className="flex items-center justify-center h-48 bg-gradient-to-r from-blue-500 to-indigo-500">
                <svg viewBox="0 0 200 200" className="w-24 h-24 text-white">
                  <polygon 
                    points="100,10 40,180 190,60 10,60 160,180" 
                    fill="currentColor" 
                  />
                </svg>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">Museum Karaton Festival</h3>
                    <p className="text-gray-500">Surakarta, Jawa Tengah • March 20, 2025</p>
                  </div>
                  
                  <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex space-x-1">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-10 w-1 bg-gray-800"
                          style={{ width: `${Math.random() * 2 + 1}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-gray-500">NFT ID: 0x3F7A...4E92</span>
                    <span className="text-xs rounded-full px-2 py-1 bg-blue-100 text-blue-700">Transferable</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0 gap-2">
                <Button className="w-full rounded-xl gap-2">
                  <Sparkles className="h-4 w-4" />
                  Mint Your Ticket
                </Button>
              </CardFooter>
            </Card>
            
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-300 rounded-full blur-xl opacity-30"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-300 rounded-full blur-xl opacity-30"></div>
          </div>
        </div>
      </div>
      
      {/* Feature badges */}
      <div className="relative container mx-auto px-4 mt-8">
        <div className="flex flex-wrap justify-center gap-4">
          {["Secure", "Transferable", "Collectible", "Transparent", "Fraud-proof"].map((feature) => (
            <div key={feature} className="px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-blue-100 shadow-sm text-sm font-medium text-gray-700">
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}