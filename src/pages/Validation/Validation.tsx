"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  Ticket, 
  AlertCircle,
  Wallet
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import nftImage from "../../public/Images/nft-ticket.png";
import { useGetNFTBalance } from "@/lib/hooks/read/useGetNFTBalance";
import { useWallet } from "@/lib/hooks/use-wallet";

export default function EnhancedValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [progress, setProgress] = useState(0);
  
  // Use the wallet hook to get connection status and address
  const { address, isConnected } = useWallet();
  
  // Use the NFT balance hook to get the number of NFTs
  const { 
    balance: nftBalance, 
    isLoading: isLoadingNFTs, 
    hasNFTs, 
    refetch: refetchNFTs 
  } = useGetNFTBalance();

  // Fetch NFT balance when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      refetchNFTs();
    }
  }, [isConnected, address, refetchNFTs]);

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
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-white/70" /> Secure Verification
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Validate your NFT Ticket
          </h1>
          
          <p className="text-lg text-white/70 max-w-2xl">
            Verify your <span className="text-white/90 font-semibold">NFT</span> ticket to receive a unique access code for event entry
          </p>
        </div>
        
        <div className="mx-auto max-w-xl">
          <Card className="bg-[#1a1a1a] border border-white/10">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl text-white">Wallet Verification</CardTitle>
              <CardDescription className="text-white/70">
                Connect your wallet to automatically detect and validate your NFT tickets
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pb-4">
              {isConnected && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 text-white/60 mr-2" />
                    <span className="text-sm text-white/80">Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
                  </div>
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white/80">
                    {isLoadingNFTs ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Ticket className="h-3 w-3 mr-1" />
                    )}
                    {isLoadingNFTs ? "Loading..." : `${nftBalance || 0} Tickets`}
                  </Badge>
                </div>
              )}

              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-white/20">
                  <Image 
                    src={nftImage} 
                    alt="NFT Ticket" 
                    fill
                    className="object-cover filter brightness-90"
                  />
                  
                  {!isConnected && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-white/70" />
                    </div>
                  )}
                  
                  {isConnected && !hasNFTs && !isLoadingNFTs && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center p-3">
                        <AlertCircle className="h-10 w-10 text-amber-400/70 mx-auto mb-2" />
                        <p className="text-sm text-white/80">No tickets found</p>
                      </div>
                    </div>
                  )}
                  
                  {validationComplete && (
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-white/10 rounded-full p-2 shadow-lg">
                        <CheckCircle2 className="h-10 w-10 text-green-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {isConnected && hasNFTs && !validationComplete && !isValidating && (
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-white">NFT Ticket Found</h3>
                  <p className="text-sm text-white/70">
                    Event: Music Festival 2025<br />
                    Date: March 20, 2025<br />
                    Token ID: #3742
                  </p>
                </div>
              )}
              
              {isValidating && (
                <div className="space-y-3">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 text-white/70 animate-spin mx-auto mb-2" />
                    <h3 className="font-medium text-white">Validating your ticket</h3>
                    <p className="text-sm text-white/70">Please wait while we verify your NFT</p>
                  </div>
                  
                  <Progress value={progress} className="h-2 bg-white/10" />
                  
                  <div className="text-xs text-white/50 flex justify-between">
                    <span>Checking blockchain</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              )}
              
              {validationComplete && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-medium text-white mb-1">Validation Complete</h3>
                    <p className="text-sm text-white/70">Your ticket has been successfully validated</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-sm text-white/70 mb-1">Your Access Code:</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="font-mono text-xl font-bold text-white tracking-wide">
                        {accessCode}
                      </code>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20" 
                        onClick={() => navigator.clipboard.writeText(accessCode)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
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
                </div>
              ) : (
                isLoadingNFTs ? (
                  <Button disabled className="w-full max-w-xs bg-white/10 text-white">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading tickets...
                  </Button>
                ) : !hasNFTs ? (
                  <Button disabled className="w-full max-w-xs bg-white/10 text-white/70 border border-white/10">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    No NFT tickets found
                  </Button>
                ) : isValidating ? (
                  <Button disabled className="w-full max-w-xs bg-white/10 text-white">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </Button>
                ) : (
                  !validationComplete && (
                    <Button 
                      onClick={handleValidate} 
                      className="w-full max-w-xs bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Validate Ticket
                    </Button>
                  )
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
          <h3 className="font-semibold text-white mb-2">How Validation Works</h3>
          <p className="text-sm">
            Our secure verification system checks the blockchain to confirm your ticket NFT ownership.
            Once validated, you'll receive a unique access code that can be shown at the event entrance.
            This process ensures that only valid ticket holders can gain access.
          </p>
        </div>
      </div>
    </div>
  );
}