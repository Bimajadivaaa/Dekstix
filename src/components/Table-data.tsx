import { useAccount } from "wagmi";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

export default function PurchaseHistory() {
  const { address } = useAccount();

  const allPurchaseHistory = [
    { no: 1, accessCode: "QKELS", purchaseDate: "01 - 01 - 2025", status: "Not validated yet" },
    { no: 2, accessCode: "ABCDE", purchaseDate: "01 - 01 - 2025", status: "Validated" },
    { no: 3, accessCode: "FGHIJ", purchaseDate: "01 - 01 - 2025", status: "Validated" },
    { no: 4, accessCode: "KLMNO", purchaseDate: "01 - 01 - 2025", status: "Validated" },
    { no: 5, accessCode: "PQRST", purchaseDate: "01 - 01 - 2025", status: "Validated" },
    { no: 6, accessCode: "UVWXY", purchaseDate: "02 - 01 - 2025", status: "Not validated yet" },
    { no: 7, accessCode: "ZABCD", purchaseDate: "02 - 01 - 2025", status: "Validated" },
    { no: 8, accessCode: "EFGHI", purchaseDate: "02 - 01 - 2025", status: "Validated" },
    { no: 9, accessCode: "JKLMN", purchaseDate: "02 - 01 - 2025", status: "Validated" },
    { no: 10, accessCode: "OPQRS", purchaseDate: "02 - 01 - 2025", status: "Validated" },
  ];

 
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allPurchaseHistory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(allPurchaseHistory.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-4 font-stapelText">
      <div className="mb-6">
        <h1 className="text-2xl font-stapelBold">
          Purchase History of{" "}
          <span className="text-blue-600">
            {address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : "Not Connected"}
          </span>
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <Table className="max-w-3xl mx-auto">
          <TableCaption className="text-left">Your NFT Ticket Purchase History</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Access Code</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.no}</TableCell>
                <TableCell>{entry.accessCode}</TableCell>
                <TableCell>{entry.purchaseDate}</TableCell>
                <TableCell>
                  {entry.status === "Validated" ? (
                    <span className="text-green-600 font-stapelBold">{entry.status}</span>
                  ) : (
                    <span className="text-red-600 font-stapelBold">{entry.status}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPreviousPage}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white"
            }`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="font-stapelBold">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={goToNextPage}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white"
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
