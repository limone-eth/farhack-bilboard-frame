import { NextRequest } from "next/server";
import { BILLBOARD_ABI } from "../../../../../lib/contracts/billboard-abi";
import { createPublicClient, encodeFunctionData, http, parseUnits } from "viem";
import { base } from "viem/chains";

export const POST = async (
  req: NextRequest,
  {
    params: { address, tokenId },
  }: { params: { address: string; tokenId: string } }
) => {
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
    args: [BigInt(parseInt(tokenId) - 1), address as `0x${string}`],
  });

  return {
    chainId: "eip155:".concat(base.id.toString()),
    method: "eth_sendTransaction",
    params: {
      abi: BILLBOARD_ABI,
      to: address,
      data: txData,
      value: parseUnits((price + minimumPriceIncrement).toString(), 18),
    },
  };
};
