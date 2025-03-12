"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Ticket, QrCode, User, Home, Sparkles, ChevronRight } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/90 shadow-sm backdrop-blur-md" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <Ticket className="absolute -bottom-1 left-1/2 h-5 w-5 -translate-x-1/2 text-white/90 transform rotate-12" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Dekstix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "gap-1.5",
                      isActive("/") && "bg-blue-50 text-blue-700 font-medium"
                    )}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/Ticket/Ticket" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "gap-1.5",
                      isActive("/Ticket/Ticket") && "bg-blue-50 text-blue-700 font-medium"
                    )}
                  >
                    <Ticket className="h-4 w-4" />
                    Tickets
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/Validation/Validation" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "gap-1.5",
                      isActive("/Validation/Validation") && "bg-blue-50 text-blue-700 font-medium"
                    )}
                  >
                    <QrCode className="h-4 w-4" />
                    Validation
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/Profile/Profile" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "gap-1.5",
                      isActive("/Profile/Profile") && "bg-blue-50 text-blue-700 font-medium"
                    )}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </NavigationMenuLink>
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
                            className="bg-blue-600 hover:bg-blue-700 rounded-full h-9"
                            size="sm"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 rounded-full"
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
                            className="h-9 px-3 rounded-full"
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
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80">
                <SheetHeader className="mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Ticket className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                      Dekstix
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Blockchain-powered event ticketing
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-0.5">
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
                      Tickets
                    </MobileNavLink>
                    <MobileNavLink 
                      href="/Validation/Validation" 
                      active={isActive("/Validation/Validation")}
                      icon={<QrCode className="h-4 w-4" />}
                    >
                      Validation
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
                    <Button variant="outline" className="w-full justify-start gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      Create Event
                    </Button>
                    <div className="pt-2">
                      <ConnectButton />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
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
        "flex items-center gap-2 py-3 px-3 rounded-md transition-colors group",
        active 
          ? "bg-blue-50 text-blue-700 font-medium" 
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
      )}
    >
      {icon && <span className="text-blue-600">{icon}</span>}
      <span>{children}</span>
      <ChevronRight 
        className={cn(
          "h-4 w-4 ml-auto opacity-50",
          active ? "text-blue-600 opacity-100" : "group-hover:opacity-100"
        )} 
      />
    </Link>
  );
}