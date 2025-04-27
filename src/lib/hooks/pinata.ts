import { PINATA_JWT_TOKEN } from "@/config/const";

const pinataJwtToken = PINATA_JWT_TOKEN;

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export async function uploadJSONToPinata(
  metadata: object,
  options?: {
    pinataMetadata?: { name?: string; keyvalues?: Record<string, string> };
    pinataOptions?: { cidVersion?: 0 | 1 };
  }
) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  try {
    const payload: any = {
      pinataContent: metadata,
    };
    if (options?.pinataMetadata) {
      payload.pinataMetadata = options.pinataMetadata;
    }
    if (options?.pinataOptions) {
      payload.pinataOptions = options.pinataOptions;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinataJwtToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const resultJSON = await response.json();
    console.log("resultJSON Upload JSON to Pinata", resultJSON);
    const ipfsHash = resultJSON.IpfsHash;
    console.log("ipfsHash", ipfsHash);
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw new Error(
      `Failed to upload JSON to Pinata: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function uploadFileToPinata(file: File) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const pinataJwtToken = process.env.NEXT_PUBLIC_PINATA_JWT_TOKEN || PINATA_JWT_TOKEN;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pinataJwtToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Pinata file upload failed: ${response.statusText} - ${err}`);
  }

  const resData = await response.json();
  return `ipfs://${resData.IpfsHash}`;
}