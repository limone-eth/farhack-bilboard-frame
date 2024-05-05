import { NextRequest, NextResponse } from "next/server";
import { getFrameMessage } from "frames.js";
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
  const body = await req.json();
  const { requesterVerifiedAddresses, requesterCustodyAddress, inputText } =
    await getFrameMessage(body);
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
      requesterVerifiedAddresses.length > 0
        ? (requesterVerifiedAddresses[0]! as `0x${string}`)
        : (requesterCustodyAddress as `0x${string}`),
    ],
  });
  console.log({
    chainId: "eip155:".concat(base.id.toString()),
    method: "eth_sendTransaction",
    params: {
      to: address,
      data: txData,
      value: inputText
        ? (parseFloat(inputText) * 10 ** 18).toString()
        : (price + minimumPriceIncrement).toString(),
    },
  });
  return NextResponse.json({
    chainId: "eip155:".concat(base.id.toString()),
    method: "eth_sendTransaction",
    params: {
      abi: BILLBOARD_ABI,
      to: address,
      data: txData,
      value: inputText
        ? (parseFloat(inputText) * 10 ** 18).toString()
        : (price + minimumPriceIncrement).toString(),
    },
  });
};
