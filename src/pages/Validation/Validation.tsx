"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  QrCode, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  Upload, 
  Ticket, 
  Search,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import nftImage from "../../public/Images/nft-ticket.png";

export default function EnhancedValidation() {
  const [isConnected, setIsConnected] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [progress, setProgress] = useState(0);

  // Simulate validation process
  const handleValidate = () => {
    setIsValidating(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsValidating(false);
          setValidationComplete(true);
          setAccessCode("DKST-" + Math.floor(100000 + Math.random() * 900000));
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="relative py-16 px-4 min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      
      <div className="container relative mx-auto max-w-4xl">
        <div className="flex flex-col items-center mb-12 text-center">
          <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Secure Verification
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Validate your NFT Ticket
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl">
            Verify your <span className="text-blue-600 font-semibold">NFT</span> ticket to receive a unique access code for event entry
          </p>
        </div>
        
        <Tabs defaultValue="wallet" className="mx-auto max-w-xl">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="wallet" className="rounded-l-lg flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span>Validate with Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="id" className="rounded-r-lg flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search by Ticket ID</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl text-gray-900">Wallet Verification</CardTitle>
                <CardDescription>
                  Connect your wallet to automatically detect and validate your NFT tickets
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 pb-4">
                <div className="flex justify-center">
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
                    <Image 
                      src={nftImage} 
                      alt="NFT Ticket" 
                      fill
                      className="object-cover"
                    />
                    
                    {!isConnected && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-white/70" />
                      </div>
                    )}
                    
                    {validationComplete && (
                      <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {isConnected && !validationComplete && !isValidating && (
                  <div className="text-center space-y-2">
                    <h3 className="font-medium text-gray-900">NFT Ticket Found</h3>
                    <p className="text-sm text-gray-600">
                      Event: Music Festival 2025<br />
                      Date: March 20, 2025<br />
                      Token ID: #3742
                    </p>
                  </div>
                )}
                
                {isValidating && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900">Validating your ticket</h3>
                      <p className="text-sm text-gray-500">Please wait while we verify your NFT</p>
                    </div>
                    
                    <Progress value={progress} className="h-2" />
                    
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Checking blockchain</span>
                      <span>{progress}%</span>
                    </div>
                  </div>
                )}
                
                {validationComplete && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-medium text-gray-900 mb-1">Validation Complete</h3>
                      <p className="text-sm text-gray-600">Your ticket has been successfully validated</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Your Access Code:</p>
                      <div className="flex items-center justify-between gap-2">
                        <code className="font-mono text-xl font-bold text-blue-700 tracking-wide">
                          {accessCode}
                        </code>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs" 
                          onClick={() => navigator.clipboard.writeText(accessCode)}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <Separator className="mb-4" />
              
              <CardFooter className="flex justify-center pt-0 pb-6">
                {!isConnected ? (
                  <div className="w-full max-w-xs">
                    <ConnectButton.Custom>
                      {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        mounted,
                      }) => {
                        const ready = mounted;
                        const connected = ready && account && chain;

                        return (
                          <div
                            {...(!ready && {
                              'aria-hidden': true,
                              style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                              },
                            })}
                            className="w-full"
                          >
                            {(() => {
                              if (!connected) {
                                return (
                                  <Button 
                                    onClick={openConnectModal} 
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700"
                                  >
                                    Connect Wallet
                                  </Button>
                                );
                              }

                              if (connected && !isValidating && !validationComplete) {
                                // This would typically happen automatically in a real app
                                // Here we're simulating the connection for demo purposes
                                if (!isConnected) setIsConnected(true);
                                
                                return (
                                  <Button 
                                    onClick={handleValidate} 
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                  >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Validate Ticket
                                  </Button>
                                );
                              }

                              if (validationComplete) {
                                return (
                                  <Button 
                                    variant="outline" 
                                    className="w-full border-green-500 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    disabled
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Ticket Validated
                                  </Button>
                                );
                              }

                              return null;
                            })()}
                          </div>
                        );
                      }}
                    </ConnectButton.Custom>
                  </div>
                ) : (
                  isValidating ? (
                    <Button disabled className="w-full max-w-xs">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </Button>
                  ) : (
                    !validationComplete && (
                      <Button 
                        onClick={handleValidate} 
                        className="w-full max-w-xs bg-blue-600 hover:bg-blue-700"
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Validate Ticket
                      </Button>
                    )
                  )
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="id" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-gray-900">Lookup by Ticket ID</CardTitle>
                <CardDescription>
                  Enter your NFT ticket ID to validate and receive your access code
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 pb-6">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter ticket ID or token address" 
                    className="bg-white border-gray-200"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 shrink-0">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                
                <div className="text-center py-8">
                  <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-500 font-medium">No ticket found</h3>
                  <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">
                    Enter a valid ticket ID or use the wallet verification method
                  </p>
                </div>
              </CardContent>
              
              <Separator />
              
              <CardFooter className="pt-6 pb-6 text-center flex justify-center">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>You can also scan a QR code at the event entrance</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <motion.div 
          className="mt-12 text-center text-gray-600 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-gray-700 mb-2">How Validation Works</h3>
          <p className="text-sm">
            Our secure verification system checks the blockchain to confirm your ticket NFT ownership.
            Once validated, you'll receive a unique access code that can be shown at the event entrance.
            This process ensures that only valid ticket holders can gain access.
          </p>
        </motion.div>
      </div>
    </div>
  );
}