import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Wallet, 
  ShoppingCart, 
  Inbox, 
  ShieldCheck, 
  QrCode, 
  DoorOpen 
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function EnhancedDekstixWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const steps = [
    {
      id: 1,
      title: "Connect your wallet",
      description: "Connect your crypto wallet to our platform to begin the process",
      icon: Wallet,
      color: "bg-white/10"
    },
    {
      id: 2,
      title: "Purchase Your NFT Ticket",
      description: "Select your event and ticket tier, then complete your purchase securely",
      icon: ShoppingCart,
      color: "bg-white/10"
    },
    {
      id: 3,
      title: "Receive Your NFT Ticket",
      description: "The NFT ticket will appear in your wallet's collectibles & My Ticket page",
      icon: Inbox,
      color: "bg-white/10"
    },
    {
      id: 4,
      title: "Verify Your NFT Ticket",
      description: "Use our verification feature to confirm your ticket's authenticity",
      icon: ShieldCheck,
      color: "bg-white/10"
    },
    {
      id: 5,
      title: "Get Your Access Code",
      description: "Once verified, receive a unique QR code for entry to the event",
      icon: QrCode,
      color: "bg-white/10"
    },
    {
      id: 6,
      title: "Enter the Venue",
      description: "Present your QR code to event staff for quick and seamless entry",
      icon: DoorOpen,
      color: "bg-white/10"
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black"
      id="works"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      
      {/* Flowing shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-24 w-64 h-64 bg-white/10 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-white/10 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <motion.div 
        className="container mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div 
          className="flex flex-col items-center mb-16"
          variants={itemVariants}
        >
          <Badge className="mb-4 px-3 py-1.5 bg-white/10 text-white/70 backdrop-blur-sm border-0">
            Simple & Secure
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4 tracking-tight">
            How <span className="text-white/70">Dekstix</span> works
          </h2>
          
          <p className="text-white/70 text-center max-w-2xl text-lg">
            Our blockchain-powered ticketing platform makes event attendance seamless and secure.
            Here's how it works in six simple steps:
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
            >
              <Card
                className="relative overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:bg-white/10 group"
              >
                <div className="absolute top-0 right-0 p-3 font-mono text-xs text-white/50">
                  STEP {step.id}/6
                </div>
                
                <CardHeader className="pt-8 pb-2">
                  <div className="flex items-start gap-4">
                    <div className={`${step.color} p-3 rounded-xl text-white/70 shadow-lg`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-white group-hover:text-white/70 transition-colors">
                      {step.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-6">
                  <div className="ml-[3.25rem]">
                    <p className="text-white/50 leading-relaxed">{step.description}</p>
                  </div>
                </CardContent>
                
                {/* Connector line for all but the last in each row */}
                {step.id % 3 !== 0 && step.id < 6 && (
                  <div className="absolute top-[2.75rem] right-0 w-8 h-[2px] bg-gradient-to-r from-white/20 to-transparent lg:block hidden"></div>
                )}
                
                {/* Vertical connector for rows */}
                {step.id <= 3 && (
                  <div className="absolute bottom-0 left-[2.75rem] h-8 w-[2px] bg-gradient-to-b from-white/20 to-transparent lg:hidden md:block hidden"></div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
      </motion.div>
    </section>
  );
}