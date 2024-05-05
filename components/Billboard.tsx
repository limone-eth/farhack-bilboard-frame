"use client";
import { Image, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { formatUnits, isAddressEqual, type Address } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { Token } from "../lib/airstack/types";
import { BILLBOARD_ABI } from "../lib/contracts/billboard-abi";
import { BillboardNFT, base64toJson } from "../lib/utils";
import { BillboardSlot } from "./BillboardSlot";

export const Billboard = ({
  token,
  address,
}: {
  token: Token;
  address: string;
}) => {
  const { address: userAddress, isConnected } = useAccount();
  const [tokens, setTokens] = useState<BillboardNFT[]>([]);
  const [selected, setSelected] = useState("view");
  const { data: priceData, isLoading: isLoadingPrices } = useReadContracts({
    contracts: Array.from({ length: 9 }, (_, i) => ({
      address: address as `0x${string}`,
      abi: BILLBOARD_ABI,
      functionName: "getPrice",
      args: [BigInt(i)],
    })),
  });
  const { data: tokenURIData, isLoading: isLoadingTokenURI } = useReadContracts(
    {
      contracts: Array.from({ length: 9 }, (_, i) => ({
        address: address as `0x${string}`,
        abi: BILLBOARD_ABI,
        functionName: "tokenURI",
        args: [BigInt(i)],
      })),
    }
  );
  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    address: address as `0x${string}`,
    abi: BILLBOARD_ABI,
    functionName: "owner",
  });
  const { data: minimumPriceIncrement, isLoading: isLoadingTotalSupply } =
    useReadContract({
      address: address as `0x${string}`,
      abi: BILLBOARD_ABI,
      functionName: "minimumPriceIncrement",
    });
  useEffect(() => {
    if (tokenURIData && owner && minimumPriceIncrement) {
      const metadataArray = tokenURIData?.map((uri) => {
        return uri.status === "success"
          ? base64toJson(uri.result as string)
          : null;
      });
      const tokens = token!
        .tokenNfts!.map((nft) =>
          nft.tokenBalances!.map(
            (b) =>
              ({
                owner: b.owner.identity,
                id: nft.tokenId,
                externalUrl: (metadataArray[parseInt(nft.tokenId)] as any)
                  ?.external_url,
                imageUrl: (metadataArray[parseInt(nft.tokenId)] as any)?.image,
                price: priceData?.[parseInt(nft.tokenId)]?.result,
              } as BillboardNFT)
          )
        )
        .flat();
      setTokens(tokens);
    }
  }, [tokenURIData, owner, minimumPriceIncrement]);

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="relative w-96 h-96 bg-gray-100 rounded-2xl">
        <div className="relative bg-blend-overlay w-full h-full flex flex-col text-center items-center justify-evenly">
          <div className="bg-grey-800 bg-blend-overlay w-full h-full flex flex-col text-center items-center justify-around gap-8">
            <div className="flex flex-col text-center items-center">
              <div className="flex text-6xl font-black">billboard</div>
            </div>
            <Image
              radius="lg"
              className=" flex rounded-2xl w-48 h-48 object-cover"
              src="https://i.imgur.com/7Q0QBrm.jpg"
            />
          </div>
        </div>
        <div className="flex flex-wrap absolute inset-0 z-10">
          <div className="relative grid grid-cols-3 grid-rows-3">
            {tokens.map((billboardToken, index) => (
              <BillboardSlot
                key={"billboardSlot-" + index}
                billboardAddress={address}
                billboardName={token.name!}
                tokenId={index}
                imageUrl={billboardToken.imageUrl}
                externalUrl={billboardToken.externalUrl}
                price={formatUnits(
                  billboardToken.price + minimumPriceIncrement!,
                  18
                ).toString()}
                isEditing={selected === "edit"}
                slotOwner={billboardToken.owner}
                billboardOwner={owner as string}
                isOwned={
                  !!userAddress &&
                  isAddressEqual(userAddress, billboardToken.owner as Address)
                }
              />
            ))}
          </div>
        </div>
      </div>
      {isConnected ? (
        <Tabs
          key={"default"}
          aria-label="Options"
          radius="full"
          selectedKey={selected}
          onSelectionChange={(value) => setSelected(value as string)}
        >
          <Tab key="view" title="View" />
          <Tab key="edit" title="Edit" />
        </Tabs>
      ) : (
        <div>connect wallet to buy/edit your sponsored slots</div>
      )}
    </div>
  );
};
