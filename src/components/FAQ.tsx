import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { HelpCircle, Search } from "lucide-react";
import { Input } from "./ui/input";

export default function EnhancedFAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "What is blockchain ticketing?",
      answer:
        "Blockchain ticketing is a secure and transparent way to manage and distribute event tickets using blockchain technology. Each ticket is represented as a non-fungible token (NFT) on the blockchain, providing a tamper-proof record of ownership and authenticity.",
      tags: ["basics", "blockchain"]
    },
    {
      question: "What are the benefits of using blockchain for ticketing?",
      answer:
        "Blockchain ensures security, transparency, and prevents fraud or ticket scalping while enabling easy verification of ownership. Other benefits include: reduced counterfeiting, programmable royalties for resales, collectible digital memorabilia, and completely transparent transaction history.",
      tags: ["benefits", "security"]
    },
    {
      question: "How do I purchase a blockchain-based ticket?",
      answer:
        "You can purchase it by connecting your wallet, selecting the event, and completing the transaction using cryptocurrency. Our platform guides you through each step of the process, making it simple even for those new to blockchain technology.",
      tags: ["purchase", "howto"]
    },
    {
      question: "Do I need cryptocurrency to buy an NFT ticket?",
      answer:
        "Yes, most platforms require cryptocurrency like Ethereum or Polygon to purchase NFT tickets. However, some platforms (including ours for certain events) may offer credit card payment options that handle the crypto conversion in the background.",
      tags: ["purchase", "crypto"]
    },
    {
      question: "How do I purchase the cryptocurrency?",
      answer:
        "You can buy cryptocurrency from trusted exchanges like Coinbase, Binance, or Kraken using your local currency. Once purchased, you can transfer the cryptocurrency to your wallet and use it to buy tickets on our platform.",
      tags: ["crypto", "howto"]
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            Got Questions?
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about blockchain ticketing and how our platform works
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative mx-auto max-w-md mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search frequently asked questions..."
            className="pl-10 py-3 bg-white border-gray-200 rounded-lg focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filteredFaqs.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 last:border-0">
                  <AccordionTrigger className="py-5 px-6 hover:bg-gray-50 text-left font-medium text-gray-900 text-lg group">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-500 shrink-0 mt-1" />
                      <span className="group-hover:text-blue-600">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0">
                    <div className="ml-8">
                      <p className="text-gray-600 mb-3">{faq.answer}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {faq.tags.map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="outline" 
                            className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 cursor-pointer"
                            onClick={() => setSearchQuery(tag)}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No matching questions</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any FAQs matching your search query
            </p>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Badge>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="inline-flex p-0.5 rounded-lg bg-gray-100">
            <button className="px-4 py-2 rounded-md bg-white shadow-sm text-sm font-medium text-gray-900">
              Contact Support
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Join Discord
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}