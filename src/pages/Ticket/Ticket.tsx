import NFTticket from "../../public/Images/nft-ticket.png";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Ticket() {
  const tickets = Array(9).fill({
    title: "Ticket #1",
    price: "10 USDT",
    image: NFTticket,
  });

  return (
    <div className="p-6 min-h-screen bg-[#CAE6FF] mx-4 rounded-[20px] font-stapelText">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-stapelBold">Purchase NFT Ticket</h1>
        <p className="text-lg text-gray-700">
          Own your unique <span className="text-blue-600 font-bold">NFT</span> ticket now and enjoy exclusive event perks!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 justify-center items-center">
        {tickets.map((ticket, index) => (
          <Card
            key={index}
            className="p-4 bg-white rounded-[20px] shadow-md hover:shadow-lg transition-shadow w-full max-w-[18rem] mx-auto"
          >
            <div className="flex justify-center items-center mb-4">
              <Image
                src={ticket.image}
                alt={`Ticket ${index + 1}`}
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div className="bg-gray-800 text-white rounded-[15px] p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold">{ticket.title}</span>
                <span className="text-sm flex items-center gap-1">
                  💎 {ticket.price}
                </span>
              </div>
              <Button className="w-full bg-[#003459] text-white py-2 rounded-md hover:bg-[#002640] transition flex items-center justify-center gap-2 text-sm">
                <span>🛒</span> Buy Ticket
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
