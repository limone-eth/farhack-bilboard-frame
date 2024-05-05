import { Button, Image, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { EditSlotModal } from "./EditSlotModal";
import { useState } from "react";
import { http, useAccount, useWriteContract } from "wagmi";
import { BILLBOARD_ABI } from "../lib/contracts/billboard-abi";
import { BILLBOARD_FACTORY_BASE_ADDRESS } from "../lib/constants";
import { createPublicClient, parseUnits } from "viem";
import { base } from "viem/chains";

export const BillboardSlot = ({
  billboardName,
  billboardAddress,
  imageUrl,
  externalUrl,
  price,
  isEditing,
  tokenId,
  isOwned,
}: {
  billboardName: string;
  billboardAddress: string;
  imageUrl?: string;
  externalUrl?: string;
  price: string;
  isEditing: boolean;
  tokenId: number;
  isOwned?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const buySlot = async () => {
    console.log("buying slot");
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });
    const txHash = await writeContractAsync({
      abi: BILLBOARD_ABI,
      address: billboardAddress as `0x${string}`,
      functionName: "buy",
      value: parseUnits(price, 18),
      args: [BigInt(tokenId), address as `0x${string}`],
    });
    const txReceiptData = await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });
  };
  return (
    <div className="w-full h-full">
      {!imageUrl && isEditing && (
        <div className="flex flex-col items-center justify-center h-full">
          <Button
            size="sm"
            className="px-2 bg-gradient-to-b from-[#B2D5FF] to-[#0E7DFF] text-white font-semibold"
            onPress={() => {
              if (!isOwned) {
                buySlot();
              }
            }}
          >
            buy #{tokenId + 1} - {price} ETH
          </Button>
        </div>
      )}
      {imageUrl && isEditing && (
        <div className="relative">
          <Image className="object-cover w-full h-full" src={imageUrl} />
          <Button
            size="sm"
            className={`px-2 absolute z-10 bg-gradient-to-b ${
              isOwned ? "bg-[#0E7DFF]" : "from-[#B2D5FF] to-[#0E7DFF]"
            } text-white font-semibold left-1/2 bottom-1/4 transform -translate-x-1/2 -translate-y-1/2`}
            onPress={() => {
              if (isOwned) {
                setIsOpen(true);
              } else {
                buySlot();
              }
            }}
          >
            {isOwned
              ? `edit #${tokenId}`
              : `buy #${tokenId + 1} - ${price} ETH`}
          </Button>
        </div>
      )}
      {externalUrl && imageUrl && !isEditing && (
        <Tooltip content={externalUrl} offset={-15}>
          <Link href={externalUrl} target="_blank">
            <Image className="object-cover w-full h-full" src={imageUrl} />
          </Link>
        </Tooltip>
      )}
      <EditSlotModal
        billboardAddress={billboardAddress}
        billboardName={billboardName}
        tokenId={tokenId}
        externalUrl={externalUrl!}
        imageUrl={imageUrl!}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
};
