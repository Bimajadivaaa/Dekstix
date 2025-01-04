import {
    Card,
    CardFooter,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "./ui/card";
  import { Button } from "./ui/button";
  
  export default function Hero() {
    return (
      <div className="flex justify-center items-center mt-10 px-4">
        <Card className="w-full max-w-5xl bg-[#A2D2FF] rounded-[20px] shadow-md p-[1rem]">
          <CardHeader>
            <CardTitle className="text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[7rem] font-bold text-left leading-tight">
              Blockchain ticketing with{" "}
              <span className="text-blue-600">NFT</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="font-stapelText text-[#001A68] text-left text-[1rem] sm:text-[1.2rem] md:text-[1.5rem] leading-relaxed">
              Revolutionize your ticketing experience with blockchain technology.
              Our platform ensures secure, transparent, and tamper-proof ticketing
              through NFT integration.
            </CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-start gap-4 mt-6">
            <Button className="bg-[#003459] text-white px-6 py-2 rounded-[20px] w-full sm:w-auto">
              Connect Wallet
            </Button>
            <Button
              variant="outline"
              className="text-black px-6 py-2 rounded-[20px] w-full sm:w-auto"
            >
              Purchase Ticket
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  