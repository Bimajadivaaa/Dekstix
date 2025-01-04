import { useAccount } from "wagmi";
import Image from "next/image";
import nftImage from "../../public/Images/nft-ticket.png";
import PurchaseHistory from "@/components/Table-data";

export default function Profile() {
  const { address } = useAccount();

  const tickets = Array(6).fill({
    title: "Ticket #1",
    image: nftImage,
  });

  return (
    <div className="font-stapelText">
      <div className="p-4 bg-[#CAE6FF] min-h-[50vh] mx-4 rounded-[20px]">
        <div className="text-left mb-6">
          <h1 className="text-lg font-stapelBold flex items-center gap-2">
            <span>🔗</span>
            {address
              ? `${address.substring(0, 6)}...${address.substring(
                  address.length - 4
                )}`
              : "Not Connected"}
          </h1>
          <p className="font-stapelText text-3xl">
            My <span className="text-blue-600 font-stapelBold">NFT</span> Ticket
            Collection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tickets.map((ticket, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 text-center"
            >
              <Image
                src={ticket.image}
                alt={`NFT Ticket ${index + 1}`}
                width={100}
                height={100}
                className="object-contain mx-auto mb-3"
              />

              <div className="bg-gray-800 text-white rounded-2xl py-3">
                <h3 className="text-xs font-semibold mb-2">{ticket.title}</h3>
                <button className="bg-white text-black font-stapelBold py-1 px-4 rounded-full hover:opacity-90 transition text-sm">
                  Validate Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#CAE6FF] min-h-[50vh] mx-4 rounded-[20px] mt-4 shadow-md">
        <div className="flex justify-center items-center">
          <PurchaseHistory />
        </div>
      </div>
    </div>
  );
}
