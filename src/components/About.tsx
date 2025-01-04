import Image from "next/image";
import { Card } from "./ui/card";
import nftTicket from "../public/Images/nft-ticket.png";

export default function About() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:space-x-[12rem] md:p-[11rem] p-8 space-y-8 md:space-y-0">
      <div className="max-w-lg text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-stapelBold text-black">
          Say goodbye to manual tickets, and enjoy real-time ownership
          verification.
        </h2>
        <p className="text-base md:text-lg text-gray-700 mt-2 font-stapelText">
          Whether you're hosting events or attending them, embrace the
          future of digital ticketing with seamless wallet integration and
          decentralized solutions.
        </p>
      </div>

        <Card className="flex items-center justify-center p-10 border-none">
          <Image
            src={nftTicket}
            alt="NFT Ticket"
            className="rounded-lg "
            width={250}
            height={250}
          />
        </Card>
    </div>
  );
}
