"use client";
import { Tab, Tabs, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { BillboardSlot } from "./BillboardSlot";
import { BILLBOARD_ABI } from "../lib/contracts/billboard-abi";
import { parseUnits } from "viem";
import { base64toJson } from "../lib/utils";

export const Billboard = ({
  name,
  address,
}: {
  name: string;
  address: string;
}) => {
  const { isConnected } = useAccount();
  const [metadataArray, setMetadataArray] = useState([]);
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
  useEffect(() => {
    if (tokenURIData) {
      const array = tokenURIData?.map((uri) => {
        return uri.status === "success"
          ? base64toJson(uri.result as string)
          : null;
      });
      setMetadataArray(array as any);
    }
  }, [tokenURIData]);
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
            <BillboardSlot
              billboardAddress={address}
              billboardName={name}
              index={1}
              imageUrl="https://placehold.co/400x400/EEE/31343C"
              externalUrl="https://google.it"
              price="0.05"
              isEditing={selected === "edit"}
            />
            <BillboardSlot
              billboardAddress={address}
              billboardName={name}
              index={2}
              price="0.01"
              isEditing={selected === "edit"}
            />
            <BillboardSlot
              billboardAddress={address}
              billboardName={name}
              index={3}
              imageUrl="https://placehold.co/400x400/EEE/31343C"
              externalUrl="https://google.it"
              price="0.10"
              isEditing={selected === "edit"}
              isOwned={true}
            />
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
