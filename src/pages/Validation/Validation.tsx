import Image from "next/image";
import nftImage from "../../public/Images/nft-ticket.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Validation() {
  return (
    <div className="p-8 bg-[#CAE6FF] min-h-screen flex flex-col justify-center items-center  mx-3 my-0 md:mx-[2rem] rounded-[20px] font-stapelText pb-[10rem]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-stapelBold mb-4">Validate your NFT</h1>    
        <p className="text-xl text-black">
          Validate your <span className="text-blue-600 font-bold">NFT</span> to Get the Access Code!
        </p>
      </div>

      <div className="bg-white p-8 rounded-[20px] shadow-md w-full max-w-md text-center">
        <Image src={nftImage} alt="NFT Ticket" width={150} height={150} className="mx-auto mb-6" />
        <div className="mb-6 flex justify-center items-center">
          <ConnectButton/>
        </div>
        <p className="text-sm text-gray-600">
          Connect to your wallet first, to detect your NFT Ticket.
        </p>
      </div>
    </div>
  );
}
