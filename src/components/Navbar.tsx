"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNetworkValidation } from "@/lib/hooks/use-network-validation";
import { NetworkWarning } from "@/components/NetworkWarning";
import { baseSepolia } from "wagmi/chains";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheIDReader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Ticket, QrCode, User, Home, Sparkles, ChevronRight, Wallet, AlertTriangle, Gift } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isWrongNetwork } = useNetworkValidation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled 
            ? "bg-gradient-to-br from-black via-[#0a0a0a] to-black/90 shadow-sm backdrop-blur-md" 
            : "bg-gradient-to-br from-black via-[#0a0a0a] to-black"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 p-0.5">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
              <div className="h-full w-full bg-black rounded-[7px] flex items-center justify-center">
                <Ticket className="h-5 w-5 text-white transform -rotate-12 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
              </div>
              <div className="absolute -inset-[1px] bg-white/20 rounded-lg blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Dekstix
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center gap-2">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-1.5 rounded-full border-white/20 bg-white/5 text-white",
                      isActive("/") && "bg-white text-black"
                    )}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/Ticket/Ticket" legacyBehavior passHref>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-1.5 rounded-full border-white/20 bg-white/5 text-white",
                      isActive("/Ticket/Ticket") && "bg-white text-black"
                    )}
                  >
                    <Ticket className="h-4 w-4" />
                    Purchase Tickets
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/Validation/Validation" legacyBehavior passHref>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-1.5 rounded-full border-white/20 bg-white/5 text-white",
                      isActive("/Validation/Validation") && "bg-white text-black"
                    )}
                  >
                    <QrCode className="h-4 w-4" />
                    Generate Ticket Code
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/Rewards/Rewards" legacyBehavior passHref>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-1.5 rounded-full border-white/20 bg-white/5 text-white",
                      isActive("/Rewards/Rewards") && "bg-white text-black"
                    )}
                  >
                    <Gift className="h-4 w-4" />
                    Rewards
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/Profile/Profile" legacyBehavior passHref>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-1.5 rounded-full border-white/20 bg-white/5 text-white",
                      isActive("/Profile/Profile") && "bg-white text-black"
                    )}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Connect Button for Desktop */}
          <div className="hidden md:flex items-center gap-4">
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
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button 
                            onClick={openConnectModal} 
                            className="bg-white/10 hover:bg-white/20 rounded-full h-9 text-white"
                            size="sm"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.id !== baseSepolia.id) {
                        return (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={openChainModal}
                              variant="outline"
                              size="sm"
                              className="h-9 px-3 rounded-full border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                              <AlertTriangle className="h-4 w-4 mr-1.5" />
                              Wrong Network
                            </Button>
                          </div>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 rounded-full border-white/20 bg-white/5 text-white"
                          >
                            {chain.hasIcon && (
                              <div className="mr-1.5 h-4 w-4 overflow-hidden rounded-full">
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    className="h-full w-full"
                                  />
                                )}
                              </div>
                            )}
                            {chain.name ?? chain.id}
                          </Button>

                          <Button
                            onClick={openAccountModal}
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 rounded-full border-white/20 bg-white/5 text-white"
                          >
                            {account.displayName}
                            {account.displayBalance ? ` (${account.displayBalance})` : ''}
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80 bg-black border-l border-white/10">
                <SheIDReader className="mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                      <Ticket className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-bold text-white">
                      Dekstix
                    </span>
                  </SheetTitle>
                  <SheetDescription className="text-white/50">
                    Blockchain-powered event ticketing
                  </SheetDescription>
                </SheIDReader>
                <div className="py-4">
                  <div className="space-y-2">
                    <MobileNavLink 
                      href="/" 
                      active={isActive("/")}
                      icon={<Home className="h-4 w-4" />}
                    >
                      Home
                    </MobileNavLink>
                    <MobileNavLink 
                      href="/Ticket/Ticket" 
                      active={isActive("/Ticket/Ticket")}
                      icon={<Ticket className="h-4 w-4" />}
                    >
                      Purchase Tickets
                    </MobileNavLink>
                    <MobileNavLink 
                      href="/Validation/Validation" 
                      active={isActive("/Validation/Validation")}
                      icon={<QrCode className="h-4 w-4" />}
                    >
                      Generate Ticket Code
                    </MobileNavLink>
                    <MobileNavLink 
                      href="/Rewards/Rewards" 
                      active={isActive("/Rewards/Rewards")}
                      icon={<Gift className="h-4 w-4" />}
                    >
                      Rewards
                    </MobileNavLink>
                    <MobileNavLink 
                      href="/Profile/Profile" 
                      active={isActive("/Profile/Profile")}
                      icon={<User className="h-4 w-4" />}
                    >
                      Profile
                    </MobileNavLink>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="pt-2">
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
                              className="space-y-2"
                            >
                              {(() => {
                                if (!connected) {
                                  return (
                                    <Button 
                                      onClick={openConnectModal} 
                                      className="w-full justify-start gap-1.5 bg-white/10 hover:bg-white/20 text-white"
                                      size="default"
                                    >
                                      <Wallet className="h-4 w-4" />
                                      Connect Wallet
                                    </Button>
                                  );
                                }

                                if (chain.id !== baseSepolia.id) {
                                  return (
                                    <div className="space-y-2">
                                      <Button
                                        onClick={openChainModal}
                                        variant="outline"
                                        className="w-full justify-start gap-1.5 border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                      >
                                        <AlertTriangle className="h-4 w-4" />
                                        Wrong Network - Switch to Sepolia
                                      </Button>
                                    </div>
                                  );
                                }

                                return (
                                  <div className="space-y-2">
                                    <Button
                                      onClick={openChainModal}
                                      variant="outline"
                                      className="w-full justify-start gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10"
                                    >
                                      {chain.hasIcon && (
                                        <div className="h-4 w-4 overflow-hidden rounded-full">
                                          {chain.iconUrl && (
                                            <img
                                              alt={chain.name ?? 'Chain icon'}
                                              src={chain.iconUrl}
                                              className="h-full w-full"
                                            />
                                          )}
                                        </div>
                                      )}
                                      {chain.name ?? chain.id}
                                    </Button>

                                    <Button
                                      onClick={openAccountModal}
                                      variant="outline"
                                      className="w-full justify-start gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10"
                                    >
                                      <User className="h-4 w-4" />
                                      {account.displayName}
                                      {account.displayBalance ? ` (${account.displayBalance})` : ''}
                                    </Button>
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        }}
                      </ConnectButton.Custom>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>

    {/* Wrong Network Warning Banner */}
    <NetworkWarning />
    </>
  );
}

interface MobileNavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function MobileNavLink({ href, active, children, icon }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 py-3 px-3 rounded-md transition-colors group text-white/70",
        active 
          ? "bg-white/10 text-white font-medium" 
          : "hover:text-white hover:bg-white/5"
      )}
    >
      {icon && <span className="text-white/70">{icon}</span>}
      <span>{children}</span>
      <ChevronRight 
        className={cn(
          "h-4 w-4 ml-auto opacity-50 text-white",
          active ? "opacity-100" : "group-hover:opacity-100"
        )} 
      />
    </Link>
  );
}