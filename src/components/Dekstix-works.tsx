import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function DekstixWorks() {
  const steps = [
    {
      id: 1,
      title: "Connect your wallet.",
      description: "You can connect your wallet to our platform to begin.",
    },
    {
      id: 2,
      title: "Purchase Your NFT Ticket",
      description:
        "Select your NFT Ticket and complete your purchase securely.",
    },
    {
      id: 3,
      title: "Receive Your NFT Ticket",
      description:
        "The ticket will appear in your wallet's collectibles & My Ticket page.",
    },
    {
      id: 4,
      title: "Verify Your NFT Ticket",
      description: "Use the verification feature to ensure ticket validity.",
    },
    {
      id: 5,
      title: "Get Your Access Code",
      description: "Once verified, receive a unique access code for the event.",
    },
    {
      id: 6,
      title: "Enter the Venue",
      description: "Show your access code to event staff for seamless entry.",
    },
  ];

  return (
    <div className="p-8">
      <Card className="bg-gradient-to-b from-blue-700 to-blue-900 p-10">
        <h2 className="text-3xl font-stapelBold text-center text-white mb-8">
          How <span className="text-[#A2D2FF]">Dekstix</span> works:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <Card
              key={step.id}
              className="p-4 bg-gradient-to-b from-blue-700 to-blue-900 text-white rounded-lg border-black"
            >
              <CardHeader>
                <CardTitle className="text-xl font-stapelBold">
                  {step.id}. {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-2 font-stapelText">
                <p className="text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
