import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { useReadContracts, useReadContract } from "wagmi";
import { BILLBOARD_ABI } from "./billboard-abi";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export const readPriceData = async (address: string) => {
  return await publicClient.multicall({
    contracts: Array.from({ length: 9 }, (_, i) => ({
      address: address as `0x${string}`,
      abi: BILLBOARD_ABI,
      functionName: "getPrice",
      args: [BigInt(i)],
    })),
  });
};

export const readTokenURI = async (address: string) => {
  return await publicClient.multicall({
    contracts: Array.from({ length: 9 }, (_, i) => ({
      address: address as `0x${string}`,
      abi: BILLBOARD_ABI,
      functionName: "tokenURI",
      args: [BigInt(i)],
    })),
  });
};

export const readOwner = async (address: string) => {
  return await publicClient.readContract({
    address: address as `0x${string}`,
    abi: BILLBOARD_ABI,
    functionName: "owner",
  });
};

export const readMinimumPriceIncrement = async (address: string) => {
  return await publicClient.readContract({
    address: address as `0x${string}`,
    abi: BILLBOARD_ABI,
    functionName: "minimumPriceIncrement",
  });
};
