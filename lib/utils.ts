export interface BillboardNFT {
  id: string;
  imageUrl: string;
  price: BigInt;
  owner: string;
  externalUrl: string;
}

export const base64toJson = (base64: string) => {
  const decodedString = Buffer.from(base64.split(",")[1]!, "base64").toString(
    "utf8"
  );
  const jsonObject = JSON.parse(decodedString);
  return jsonObject;
};
