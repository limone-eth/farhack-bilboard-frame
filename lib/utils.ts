import { PINATA_GATEWAY } from "./constants";

export interface BillboardNFT {
  id: string;
  imageUrl: string;
  price: bigint;
  owner: string;
  externalUrl: string;
}

export const base64toJson = (base64: string) => {
  if (!base64) return {};
  const decodedString = Buffer.from(base64.split(",")[1]!, "base64").toString(
    "utf8"
  );
  const jsonObject = JSON.parse(decodedString);
  return jsonObject;
};

export const getIpfsUrl = (ipfsHash: string) => {
  return `${PINATA_GATEWAY}${ipfsHash}`;
};
