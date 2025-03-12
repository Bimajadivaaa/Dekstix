import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github, 
  Mail, 
  MapPin, 
  Phone,
  ArrowRight,
  Ticket
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <Ticket className="absolute -bottom-1 left-1/2 h-5 w-5 -translate-x-1/2 text-white/90 transform rotate-12" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Dekstix
              </span>
            </div>
            
            <p className="text-gray-600 pr-4">
              The next generation of blockchain-powered event ticketing, giving event organizers and attendees a secure, transparent, and fraud-proof solution.
            </p>
            
            <div className="flex items-center space-x-3">
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} />
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} />
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} />
              <SocialLink href="https://github.com" icon={<Github size={18} />} />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Events", href: "/Ticket/Ticket" },
                { label: "Validation", href: "/Validation/Validation" },
                { label: "Profile", href: "/Profile/Profile" },
                { label: "Help Center", href: "#" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Dekstix Innovation Hub<br />
                  123 Blockchain Avenue<br />
                  San Francisco, CA 94103
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="text-gray-600">support@dekstix.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates on events and features.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white border-gray-200 rounded-lg"
              />
              <Button size="sm" className="rounded-lg bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-200" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            &copy; {currentYear} Dekstix. All rights reserved.
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Cookie Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Legal Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-full border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
      >
        {icon}
      </Button>
    </Link>
  );
}