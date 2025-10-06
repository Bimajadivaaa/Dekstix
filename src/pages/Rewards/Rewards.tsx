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
import { useGetHistoryPurchase } from "@/lib/hooks/read/useGetHistoryPurchase";
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
  totalTokensEarned: number;
  claimedRewards: number;
}

export default function RewardsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"collection" | "rewards">("collection");
  const [nftMetadata, setNftMetadata] = useState<{ [key: string]: any }>({});
  
  const { address } = useWallet();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  
  // Get real NFT data from hooks
  const {
    tickets = [],
    isLoading: isLoadingTickets,
  } = useGetMyTicket();

  const {
    purchaseHistory = [],
    isLoading: isLoadingHistory,
  } = useGetHistoryPurchase();
  
  const isWrongNetwork = isConnected && chainId !== baseSepolia.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    totalTokensEarned: 1850, // This would be calculated from claimed rewards in real app
    claimedRewards: 5 // This would be tracked from blockchain events
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

  // Mock token rewards based on NFT collection milestones
  const tokenRewards: TokenReward[] = [
    {
      id: 1,
      title: "Collector Starter Pack",
      description: "Welcome bonus for new collectors",
      tokenAmount: 100,
      tokenSymbol: "DEKSTIX",
      nftRequirement: 5,
      status: "claimed",
      icon: <Gift className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Active Collector Reward",
      description: "Reward for dedicated collectors",
      tokenAmount: 250,
      tokenSymbol: "DEKSTIX",
      nftRequirement: 10,
      status: "claimed",
      icon: <Package className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Serious Collector Bonus",
      description: "For collectors with substantial holdings",
      tokenAmount: 500,
      tokenSymbol: "DEKSTIX",
      nftRequirement: 25,
      status: "available",
      icon: <Award className="h-5 w-5" />
    },
    {
      id: 4,
      title: "Elite Collector Tier",
      description: "Premium rewards for elite collectors",
      tokenAmount: 1000,
      tokenSymbol: "DEKSTIX",
      nftRequirement: 50,
      status: "locked",
      icon: <Trophy className="h-5 w-5" />
    },
    {
      id: 5,
      title: "Legendary Collector Status",
      description: "Ultimate reward for legendary collectors",
      tokenAmount: 2500,
      tokenSymbol: "DEKSTIX",
      nftRequirement: 100,
      status: "locked",
      expiresAt: "2025-12-31",
      icon: <Star className="h-5 w-5" />
    },
    {
      id: 6,
      title: "VIP Collection Bonus",
      description: "Special reward for VIP NFT holders",
      tokenAmount: 300,
      tokenSymbol: "DEKSTIX",
      nftRequirement: 3,
      nftType: "VIP Experience Token",
      status: "locked",
      icon: <Sparkles className="h-5 w-5" />
    }
  ];

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

  const handleClaimTokenReward = (rewardId: number) => {
    if (isWrongNetwork) {
      toast.error("Please switch to Base Sepolia network to claim rewards");
      return;
    }

    const reward = tokenRewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (reward.status !== "available") {
      toast.error("This reward is not available for claiming");
      return;
    }

    // Check NFT requirement
    if (reward.nftType) {
      const specificCollection = nftCollections.find(c => c.name === reward.nftType);
      if (!specificCollection || specificCollection.owned < reward.nftRequirement) {
        toast.error(`You need ${reward.nftRequirement} ${reward.nftType} NFTs to claim this reward`);
        return;
      }
    } else {
      if (userStats.totalNFTs < reward.nftRequirement) {
        toast.error(`You need ${reward.nftRequirement} NFTs to claim this reward`);
        return;
      }
    }

    // Simulate claiming
    toast.success(`Successfully claimed ${reward.tokenAmount} ${reward.tokenSymbol} tokens!`);
  };

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <Coins className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">DEKSTIX Earned</p>
                      <p className="text-2xl font-bold text-white">{userStats.totalTokensEarned}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Rewards Claimed</p>
                      <p className="text-2xl font-bold text-white">{userStats.claimedRewards}</p>
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
                  ? "bg-white text-black" 
                  : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                }
              >
                <Package className="h-4 w-4 mr-2" />
                My Collection
              </Button>
              <Button
                variant={selectedTab === "rewards" ? "default" : "outline"}
                onClick={() => setSelectedTab("rewards")}
                className={selectedTab === "rewards" 
                  ? "bg-white text-black" 
                  : "border-white/20 bg-white/5 text-white hover:bg-white/10"
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
                            {reward.nftType 
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
                              {Math.min(100, reward.nftType 
                                ? Math.round((nftCollections.find(c => c.name === reward.nftType)?.owned || 0) / reward.nftRequirement * 100)
                                : Math.round(userStats.totalNFTs / reward.nftRequirement * 100)
                              )}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(100, reward.nftType 
                              ? (nftCollections.find(c => c.name === reward.nftType)?.owned || 0) / reward.nftRequirement * 100
                              : userStats.totalNFTs / reward.nftRequirement * 100
                            )} 
                            className="h-2" 
                          />
                        </div>

                        <Button
                          onClick={() => handleClaimTokenReward(reward.id)}
                          disabled={reward.status !== "available"}
                          className="w-full mt-4"
                          variant={reward.status === "available" ? "default" : "outline"}
                        >
                          {reward.status === "claimed" ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Claimed
                            </>
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