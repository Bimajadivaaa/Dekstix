import { useState } from "react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is blockchain ticketing?",
      answer:
        "Blockchain ticketing is a secure and transparent way to manage and distribute event tickets using blockchain technology.",
    },
    {
      question: "What are the benefits of using blockchain for ticketing?",
      answer:
        "Blockchain ensures security, transparency, and prevents fraud or ticket scalping while enabling easy verification of ownership.",
    },
    {
      question: "How do I purchase a blockchain-based ticket?",
      answer:
        "You can purchase it by connecting your wallet, selecting the event, and completing the transaction using cryptocurrency.",
    },
    {
      question: "Do I need cryptocurrency to buy an NFT ticket?",
      answer:
        "Yes, most platforms require cryptocurrency like Ethereum or Polygon to purchase NFT tickets.",
    },
    {
      question: "How do I purchase the cryptocurrency?",
      answer:
        "You can buy cryptocurrency from trusted exchanges like Coinbase, Binance, or Kraken using your local currency.",
    },
  ];

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <h3 className="text-lg font-semibold text-black">
                {faq.question}
              </h3>
              {activeIndex === index ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 15.5l-7.5-7.5-7.5 7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 8.5l7.5 7.5 7.5-7.5"
                  />
                </svg>
              )}
            </div>
            {activeIndex === index && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
