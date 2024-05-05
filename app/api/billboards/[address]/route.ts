import { NextResponse } from "next/server";
import { fetchNFTData } from "../../../../lib/airstack";

export const GET = async (
  req: Request,
  { params: { address } }: { params: { address: string } }
) => {
  if (req.headers.get("x-secret") !== process.env.SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const NFTData = await fetchNFTData(address);
  if (!NFTData) {
    return NextResponse.json({ error: "NFT not found" }, { status: 404 });
  }
  return NextResponse.json(NFTData);
};

export const dynamic = "force-dynamic";
