"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Star, 
  Trophy, 
  Coins, 
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  Calendar,
  Wallet,
  Image,
  Package,
  Award,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@/lib/hooks/use-wallet";
import { useAccount, useChainId } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { toast } from "sonner";
import { useGetMyTicket } from "@/lib/hooks/read/useGetMyTicket";
import { useMintDekstixToken } from "@/lib/hooks/write/useMintDekstixToken";
import nftImage from "../../public/Images/nft-ticket.png";

interface NFTCollection {
  id: number;
  name: string;
  description: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  owned: number;
  category: "event" | "special" | "vip" | "founder";
}

interface TokenReward {
  id: number;
  title: string;
  description: string;
  tokenAmount: number;
  tokenSymbol: string;
  nftRequirement: number;
  nftType?: string;
  status: "available" | "claimed" | "locked";
  expiresAt?: string;
  icon: React.ReactNode;
}

interface UserStats {
  totalNFTs: number;
  uniqueCollections: number;
}

export default function RewardsPage() {
  const [selectedTab, setSelectedTab] = useState<"collection" | "rewards">("collection");
  const [nftMetadata, setNftMetadata] = useState<{ [key: string]: any }>({});
  const [isMounted, setIsMounted] = useState(false);
  const [claimingRewards, setClaimingRewards] = useState<Set<number>>(new Set());
  
  const { address } = useWallet();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  
  // Get real NFT data from hooks
  const { tickets = [], isLoading: isLoadingTickets } = useGetMyTicket();
  
  const isWrongNetwork = isConnected && chainId !== baseSepolia.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize mint hook
  const { handleMintTokens, isMintSuccess } = useMintDekstixToken();

  // Clean up claiming state when minting completes
  useEffect(() => {
    if (isMintSuccess) {
      // Clear all claiming states when transaction succeeds
      setClaimingRewards(new Set());
    }
  }, [isMintSuccess]);


  // Function to fetch NFT metadata from IPFS
  const fetchNFTMetadata = async (tokenURI: string, tokenId: string) => {
    try {
      // Convert IPFS URI to HTTP URL
      const ipfsUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await fetch(ipfsUrl);
      const metadata = await response.json();
      
      setNftMetadata(prev => ({
        ...prev,
        [tokenId]: metadata
      }));
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
    }
  };

  // Fetch metadata for each ticket
  useEffect(() => {
    if (tickets.length > 0) {
      tickets.forEach((ticket) => {
        if (ticket.tokenURI) {
          fetchNFTMetadata(ticket.tokenURI, ticket.tokenId.toString());
        }
      });
    }
  }, [tickets]);

  // Function to get image URL
  const getImageUrl = (ticket: any) => {
    const metadata = nftMetadata[ticket.tokenId.toString()];
    if (metadata?.image) {
      return metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return nftImage.src;
  };

  // Map ticket types to their names
  const TICKET_TYPES = ["Standard Ticket", "Premium Ticket", "VIP Ticket"];

  // Calculate real user stats based on actual NFT ownership
  const userStats: UserStats = {
    totalNFTs: tickets.length,
    uniqueCollections: new Set(tickets.map(ticket => ticket.eventName)).size,
  };

  // Group tickets by event and ticket type for collection view
  const groupedTickets = tickets.reduce((acc, ticket) => {
    const key = `${ticket.eventName}-${ticket.ticketType}`;
    if (!acc[key]) {
      acc[key] = {
        eventName: ticket.eventName,
        ticketType: ticket.ticketType,
        tickets: [],
        count: 0
      };
    }
    acc[key].tickets.push(ticket);
    acc[key].count++;
    return acc;
  }, {} as { [key: string]: { eventName: string; ticketType: number; tickets: any[]; count: number; } });

  // Convert grouped tickets to collection format
  const nftCollections: NFTCollection[] = Object.values(groupedTickets).map((group, index) => {
    const getRarity = (ticketType: number) => {
      switch (ticketType) {
        case 0: return "common" as const;   // Standard
        case 1: return "rare" as const;     // Premium  
        case 2: return "legendary" as const; // VIP
        default: return "common" as const;
      }
    };

    const getCategory = (ticketType: number) => {
      switch (ticketType) {
        case 2: return "vip" as const;      // VIP tickets
        case 1: return "special" as const;  // Premium tickets
        default: return "event" as const;   // Standard tickets
      }
    };

    const getEmoji = (eventName: string, ticketType: number) => {
      if (ticketType === 2) return "👑"; // VIP
      if (eventName.toLowerCase().includes("concert")) return "🎵";
      if (eventName.toLowerCase().includes("tech")) return "💻";
      if (eventName.toLowerCase().includes("sport")) return "⚽";
      if (eventName.toLowerCase().includes("genesis") || eventName.toLowerCase().includes("launch")) return "🏆";
      return "🎫"; // Default ticket emoji
    };

    return {
      id: index + 1,
      name: `${group.eventName} - ${TICKET_TYPES[group.ticketType]}`,
      description: `${TICKET_TYPES[group.ticketType]} tickets for ${group.eventName}`,
      image: getEmoji(group.eventName, group.ticketType),
      rarity: getRarity(group.ticketType),
      owned: group.count,
      category: getCategory(group.ticketType)
    };
  });

  // Token rewards based on NFT collection milestones
  const getTokenRewards = (): TokenReward[] => {
    const totalNFTs = tickets.length;
    
    // Check for VIP tickets
    // Standard enum: 0=STANDARD, 1=PREMIUM, 2=VIP
    const hasVIPTicket = tickets.some(ticket => ticket.ticketType === 2);
    
    // Debug logging (client-side only)
    if (isMounted && tickets.length > 0) {
      console.log("Debug - All tickets:", tickets);
      console.log("Debug - Ticket types:", tickets.map(t => ({ ticketType: t.ticketType, eventName: t.eventName })));
      console.log("Debug - VIP Detection Result:", hasVIPTicket);
      console.log("Debug - VIP tickets (type 2):", tickets.filter(t => t.ticketType === 2));
    }
    
    return [
      {
        id: 1,
        title: "First Collector Reward",
        description: "Welcome bonus for your first NFT",
        tokenAmount: 50,
        tokenSymbol: "DEKSTIX",
        nftRequirement: 1,
        status: totalNFTs >= 1 ? "available" : "locked",
        icon: <Gift className="h-5 w-5" />
      },
      {
        id: 2,
        title: "VIP Holder Exclusive",
        description: "Special reward for VIP ticket holders",
        tokenAmount: 1000,
        tokenSymbol: "DEKSTIX",
        nftRequirement: 1,
        nftType: "VIP",
        status: hasVIPTicket ? "available" : "locked",
        icon: <Sparkles className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Active Collector Reward",
        description: "Reward for dedicated collectors",
        tokenAmount: 250,
        tokenSymbol: "DEKSTIX",
        nftRequirement: 5,
        status: totalNFTs >= 5 ? "available" : "locked",
        icon: <Package className="h-5 w-5" />
      },
      {
        id: 4,
        title: "Serious Collector Bonus",
        description: "For collectors with substantial holdings",
        tokenAmount: 500,
        tokenSymbol: "DEKSTIX",
        nftRequirement: 10,
        status: totalNFTs >= 10 ? "available" : "locked",
        icon: <Award className="h-5 w-5" />
      },
      {
        id: 5,
        title: "Elite Collector Tier",
        description: "Premium rewards for elite collectors",
        tokenAmount: 1000,
        tokenSymbol: "DEKSTIX",
        nftRequirement: 25,
        status: totalNFTs >= 25 ? "available" : "locked",
        icon: <Trophy className="h-5 w-5" />
      },
      {
        id: 6,
        title: "Legendary Collector Status",
        description: "Ultimate reward for legendary collectors",
        tokenAmount: 2500,
        tokenSymbol: "DEKSTIX",
        nftRequirement: 50,
        status: totalNFTs >= 50 ? "available" : "locked",
        expiresAt: "2025-12-31",
        icon: <Star className="h-5 w-5" />
      }
    ];
  };

  const tokenRewards = getTokenRewards();

  const getRarityColor = (rarity: NFTCollection["rarity"]) => {
    switch (rarity) {
      case "common": return "bg-gray-500/20 text-gray-400";
      case "rare": return "bg-blue-500/20 text-blue-400";
      case "epic": return "bg-purple-500/20 text-purple-400";
      case "legendary": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCategoryColor = (category: NFTCollection["category"]) => {
    switch (category) {
      case "event": return "bg-green-500/20 text-green-400";
      case "special": return "bg-blue-500/20 text-blue-400";
      case "vip": return "bg-purple-500/20 text-purple-400";
      case "founder": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getRewardStatusColor = (status: TokenReward["status"]) => {
    switch (status) {
      case "available": return "bg-green-500/20 text-green-400";
      case "claimed": return "bg-blue-500/20 text-blue-400";
      case "locked": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleClaimTokenReward = async (rewardId: number) => {
    if (isWrongNetwork) {
      toast.error("Please switch to Base Sepolia network to claim rewards");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    const reward = tokenRewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (reward.status !== "available") {
      toast.error("This reward is not available for claiming");
      return;
    }

    // Check NFT requirement
    if (reward.nftType === "VIP") {
      // Special check for VIP tickets (ticketType 2 = VIP)
      const hasVIPTicket = tickets.some(ticket => ticket.ticketType === 2);
      if (isMounted) {
        console.log("Debug - Claiming VIP reward - hasVIPTicket:", hasVIPTicket);
      }
      if (!hasVIPTicket) {
        toast.error("You need to hold at least 1 VIP ticket to claim this reward.");
        return;
      }
    } else {
      // Regular NFT count requirement
      const totalNFTs = tickets.length;
      if (totalNFTs < reward.nftRequirement) {
        toast.error(`You need ${reward.nftRequirement} NFTs to claim this reward. You currently have ${totalNFTs} NFTs.`);
        return;
      }
    }

    try {
      // Add this reward to claiming set
      setClaimingRewards(prev => new Set(prev).add(rewardId));
      
      // Mint DEKSTIX tokens to the user's address
      await handleMintTokens(address, reward.tokenAmount.toString());
      
      // Remove from claiming set on success/failure
      setClaimingRewards(prev => {
        const newSet = new Set(prev);
        newSet.delete(rewardId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to claim reward:", error);
      toast.error("Failed to claim reward. Please try again.");
      
      // Remove from claiming set on error
      setClaimingRewards(prev => {
        const newSet = new Set(prev);
        newSet.delete(rewardId);
        return newSet;
      });
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-r from-white/10 to-white/20 text-white p-6">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white flex items-center justify-center gap-2">
            <Gift className="h-8 w-8" />
            Rewards & Airdrops
          </h1>
          <p className="text-white/70 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" /> Earn rewards for your loyalty and participation
          </p>
        </header>

        {!address ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Wallet className="h-12 w-12 mb-4 text-white/30" />
            <h2 className="text-2xl font-semibold text-white/80 mb-2">
              Please connect your wallet to view NFT collection
            </h2>
            <p className="text-white/60 mb-4">
              Connect your wallet to view your NFT collection and claim $DEKSTIX tokens.
            </p>
          </div>
        ) : (
          <>
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Package className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total NFTs</p>
                      <p className="text-2xl font-bold text-white">{userStats.totalNFTs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Image className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Collections</p>
                      <p className="text-2xl font-bold text-white">{userStats.uniqueCollections}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collection Progress */}
            <Card className="bg-white/5 border-white/10 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Collection Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">
                        Next Milestone: {userStats.totalNFTs >= 50 ? "100" : userStats.totalNFTs >= 25 ? "50" : userStats.totalNFTs >= 10 ? "25" : "10"} NFTs
                      </span>
                      <span className="text-white">
                        {userStats.totalNFTs}/{userStats.totalNFTs >= 50 ? "100" : userStats.totalNFTs >= 25 ? "50" : userStats.totalNFTs >= 10 ? "25" : "10"}
                      </span>
                    </div>
                    <Progress 
                      value={
                        userStats.totalNFTs >= 50 ? (userStats.totalNFTs / 100) * 100 :
                        userStats.totalNFTs >= 25 ? (userStats.totalNFTs / 50) * 100 :
                        userStats.totalNFTs >= 10 ? (userStats.totalNFTs / 25) * 100 :
                        (userStats.totalNFTs / 10) * 100
                      } 
                      className="h-2" 
                    />
                  </div>
                  <p className="text-white/60 text-sm">
                    {userStats.totalNFTs === 0 
                      ? "Purchase your first ticket to start earning $DEKSTIX rewards!"
                      : "Collect more NFTs to unlock higher tier $DEKSTIX rewards!"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={selectedTab === "collection" ? "default" : "outline"}
                onClick={() => setSelectedTab("collection")}
                className={selectedTab === "collection" 
                  ? "bg-white text-black hover:bg-gray-100" 
                  : "border-white/30 bg-white/5 text-white hover:bg-white/20 hover:border-white/50 hover:text-white transition-all duration-200"
                }
              >
                <Package className="h-4 w-4 mr-2" />
                My Collection
              </Button>
              <Button
                variant={selectedTab === "rewards" ? "default" : "outline"}
                onClick={() => setSelectedTab("rewards")}
                className={selectedTab === "rewards" 
                  ? "bg-white text-black hover:bg-gray-100" 
                  : "border-white/30 bg-white/5 text-white hover:bg-white/20 hover:border-white/50 hover:text-white transition-all duration-200"
                }
              >
                <Coins className="h-4 w-4 mr-2" />
                Token Rewards
              </Button>
            </div>

            {/* Collection Tab */}
            {selectedTab === "collection" && (
              <>
                {isLoadingTickets ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Card key={index} className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white/10 rounded-lg animate-pulse"></div>
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
                                <div className="h-3 bg-white/10 rounded animate-pulse w-1/2"></div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <div className="h-3 bg-white/10 rounded animate-pulse w-16"></div>
                                <div className="h-3 bg-white/10 rounded animate-pulse w-8"></div>
                              </div>
                              <div className="flex justify-between">
                                <div className="h-3 bg-white/10 rounded animate-pulse w-12"></div>
                                <div className="h-6 bg-white/10 rounded-full animate-pulse w-16"></div>
                              </div>
                              <div className="flex justify-between">
                                <div className="h-3 bg-white/10 rounded animate-pulse w-16"></div>
                                <div className="h-6 bg-white/10 rounded-full animate-pulse w-12"></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : nftCollections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-96">
                    <Package className="h-12 w-12 mb-4 text-white/30" />
                    <h2 className="text-2xl font-semibold text-white/80 mb-2">
                      No NFT Collection Found
                    </h2>
                    <p className="text-white/60 mb-4">
                      You don't have any NFT tickets yet. Purchase tickets to start your collection!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nftCollections.map((collection) => (
                      <Card key={collection.id} className="bg-white/5 border-white/10">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-4xl">{collection.image}</div>
                              <div>
                                <CardTitle className="text-white text-lg">{collection.name}</CardTitle>
                                <p className="text-white/70 text-sm">{collection.description}</p>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Owned:</span>
                              <span className="text-white font-semibold text-xl">{collection.owned}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Rarity:</span>
                              <Badge className={getRarityColor(collection.rarity)}>
                                {collection.rarity}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Category:</span>
                              <Badge className={getCategoryColor(collection.category)}>
                                {collection.category}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Token Rewards Tab */}
            {selectedTab === "rewards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tokenRewards.map((reward) => (
                  <Card key={reward.id} className="bg-white/5 border-white/10">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/10">
                            {reward.icon}
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{reward.title}</CardTitle>
                            <p className="text-white/70 text-sm">{reward.description}</p>
                          </div>
                        </div>
                        <Badge className={getRewardStatusColor(reward.status)}>
                          {reward.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Reward:</span>
                          <span className="text-white font-semibold text-lg">
                            {reward.tokenAmount} {reward.tokenSymbol}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">NFT Requirement:</span>
                          <span className="text-white/90 text-sm">
                            {reward.nftRequirement} {reward.nftType || "NFTs"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Your Progress:</span>
                          <span className="text-white/90 text-sm">
                            {reward.nftType === "VIP" 
                              ? `${tickets.filter(t => t.ticketType === 2).length}/${reward.nftRequirement}`
                              : reward.nftType 
                                ? `${nftCollections.find(c => c.name === reward.nftType)?.owned || 0}/${reward.nftRequirement}`
                                : `${userStats.totalNFTs}/${reward.nftRequirement}`
                            }
                          </span>
                        </div>
                        {reward.expiresAt && (
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Expires:</span>
                            <span className="text-white/90 text-sm flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {reward.expiresAt}
                            </span>
                          </div>
                        )}
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/70">Progress</span>
                            <span className="text-white/70">
                              {Math.min(100, reward.nftType === "VIP"
                                ? Math.round(tickets.filter(t => t.ticketType === 2).length / reward.nftRequirement * 100)
                                : reward.nftType 
                                  ? Math.round((nftCollections.find(c => c.name === reward.nftType)?.owned || 0) / reward.nftRequirement * 100)
                                  : Math.round(userStats.totalNFTs / reward.nftRequirement * 100)
                              )}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(100, reward.nftType === "VIP"
                              ? tickets.filter(t => t.ticketType === 2).length / reward.nftRequirement * 100
                              : reward.nftType 
                                ? (nftCollections.find(c => c.name === reward.nftType)?.owned || 0) / reward.nftRequirement * 100
                                : userStats.totalNFTs / reward.nftRequirement * 100
                            )} 
                            className="h-2" 
                          />
                        </div>

                        <Button
                          onClick={() => handleClaimTokenReward(reward.id)}
                          disabled={reward.status !== "available" || claimingRewards.has(reward.id)}
                          className="w-full mt-4"
                          variant={reward.status === "available" ? "default" : "outline"}
                        >
                          {claimingRewards.has(reward.id) ? (
                            "Claiming..."
                          ) : reward.status === "locked" ? (
                            "Requirements Not Met"
                          ) : (
                            `Claim ${reward.tokenAmount} ${reward.tokenSymbol}`
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
