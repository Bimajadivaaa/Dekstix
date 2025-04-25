import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Ticket, Star } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative overflow-hidden pb-20 bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full opacity-20 blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full opacity-10 blur-3xl animate-float-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-white/10 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      
      <div className="relative container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/20 shadow-lg shadow-white/5 font-medium text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Redefining Event Ticketing</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                Blockchain ticketing with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-white/50 inline-block relative">
                  NFT
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-white/70 to-white/50 opacity-30 rounded-full transform translate-y-2"></span>
                </span>
              </h1>
              
              <p className="text-xl text-white/70 max-w-2xl">
                Secure, transparent, and immutable blockchain ticketing solution. 
                Own your tickets as collectible NFTs while ensuring authenticity and preventing fraud.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white">
                <Ticket className="h-5 w-5" />
                Browse Events
              </Button>
              <Button size="lg" variant="outline" className="gap-2 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10">
                Learn How It Works
              </Button>
            </div>
            
            {/* <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-inner">
                    <div className="w-full h-full bg-white/10 opacity-80"></div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/70">
                <strong className="text-white">1,000+</strong> collectors have secured their ticket NFTs
              </div>
            </div> */}
          </div>
          
          <div className="relative">
            {/* Enhanced card glow */}
            <div className="absolute -inset-0.5 bg-white/20 rounded-2xl blur opacity-50 animate-pulse group-hover:opacity-75 transition duration-1000"></div>
            
            <Card className="relative w-full bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-2xl overflow-hidden group">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 text-white text-xs rounded-full font-medium shadow-lg">
                VIP Access
              </div>
              
              <div className="flex items-center justify-center h-48 bg-white/5 border-b border-white/10">
                <div className="relative">
                  <Star className="absolute -top-6 -left-6 h-4 w-4 text-white/70 animate-twinkle" />
                  <Star className="absolute -bottom-6 -right-6 h-3 w-3 text-white/50 animate-twinkle-slow" />
                  
                  {/* Diamond shape */}
                  <div className="bg-white/10 p-0.5 rounded-lg transform rotate-45 shadow-lg">
                    <div className="bg-white/10 w-20 h-20 flex items-center justify-center transform -rotate-45">
                      <Ticket className="h-10 w-10 text-white/70 drop-shadow-md" />
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 border-t border-white/10">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Museum Karaton Festival</h3>
                    <p className="text-white/70">Surakarta, Jawa Tengah • March 20, 2025</p>
                  </div>
                  
                  <div className="w-full h-16 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                    <div className="flex space-x-1">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-10 w-1 bg-white/80"
                          style={{ width: `${Math.random() * 2 + 1}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-white/70">NFT ID: 0x3F7A...4E92</span>
                    <span className="text-xs rounded-full px-2 py-1 bg-white/10 text-white/70 border border-white/20">Transferable</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0 gap-2 border-t border-white/10">
                <Button className="w-full rounded-xl gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  <Sparkles className="h-4 w-4" />
                  Mint Your Ticket
                </Button>
              </CardFooter>
            </Card>
            
            {/* Enhanced glowing orbs */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl opacity-30 animate-pulse-slow"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-xl opacity-30 animate-float"></div>
          </div>
        </div>
      </div>
      
      {/* Feature badges with enhanced design */}
      <div className="relative container mx-auto px-4 mt-8">
        <div className="flex flex-wrap justify-center gap-4">
          {["Secure", "Transferable", "Collectible", "Transparent", "Fraud-proof"].map((feature) => (
            <div key={feature} className="px-4 py-2 bg-white/5 rounded-full border border-white/10 shadow-lg text-sm font-medium text-white/70 hover:bg-white/10 transition-colors">
              {feature}
            </div>
          ))}
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-slow {
          0% { opacity: 0.2; }
          50% { opacity: 0.3; }
          100% { opacity: 0.2; }
        }
        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        @keyframes twinkle-slow {
          0% { opacity: 0.2; }
          50% { opacity: 0.8; }
          100% { opacity: 0.2; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-twinkle-slow {
          animation: twinkle-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}