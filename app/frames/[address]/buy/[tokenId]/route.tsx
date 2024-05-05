import { NextRequest, NextResponse } from "next/server";
import { BILLBOARD_ABI } from "../../../../../lib/contracts/billboard-abi";
import {
  createPublicClient,
  encodeFunctionData,
  formatUnits,
  http,
  parseUnits,
} from "viem";
import { base } from "viem/chains";

export const POST = async (
  req: NextRequest,
  {
    params: { address, tokenId },
  }: { params: { address: string; tokenId: string } }
) => {
  const { searchParams } = new URL(req.url);
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });
  const price = await publicClient.readContract({
    address: address as `0x${string}`,
    abi: BILLBOARD_ABI,
    functionName: "getPrice",
    args: [BigInt(parseInt(tokenId) - 1)],
  });
  const minimumPriceIncrement = await publicClient.readContract({
    address: address as `0x${string}`,
    abi: BILLBOARD_ABI,
    functionName: "minimumPriceIncrement",
  });
  const txData = encodeFunctionData({
    abi: BILLBOARD_ABI,
    functionName: "buy",
    args: [
      BigInt(parseInt(tokenId) - 1),
      searchParams.get("receiverAddress") as `0x${string}`,
    ],
  });
  console.log({
    chainId: "eip155:".concat(base.id.toString()),
    method: "eth_sendTransaction",
    params: {
      to: address,
      data: txData,
      value: formatUnits(price + minimumPriceIncrement, 11),
    },
  });
  return NextResponse.json({
    chainId: "eip155:".concat(base.id.toString()),
    method: "eth_sendTransaction",
    params: {
      abi: BILLBOARD_ABI,
      to: address,
      data: txData,
      value: searchParams.get("customPrice")
        ? (parseFloat(searchParams.get("customPrice")!) * 10 ** 18).toString()
        : (price + minimumPriceIncrement).toString(),
    },
  });
};
