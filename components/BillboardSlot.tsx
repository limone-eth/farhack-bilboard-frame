import { Button, Image, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { EditSlotModal } from "./EditSlotModal";
import { useEffect, useState } from "react";
import { http, useAccount, useWriteContract } from "wagmi";
import { BILLBOARD_ABI } from "../lib/contracts/billboard-abi";
import {
  createPublicClient,
  isAddressEqual,
  parseUnits,
  type Address,
} from "viem";
import { base } from "viem/chains";
import { fetchAddressFallbackAvatar } from "../lib/web3-bio";

export const BillboardSlot = ({
  billboardName,
  billboardAddress,
  slotOwner,
  imageUrl,
  externalUrl,
  price,
  isEditing,
  tokenId,
  billboardOwner,
}: {
  billboardName: string;
  billboardAddress: string;
  slotOwner: string;
  imageUrl?: string;
  externalUrl?: string;
  price: string;
  isEditing: boolean;
  tokenId: number;
  billboardOwner: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [fallbackImageUrl, setFallbackImageUrl] = useState<string | undefined>(
    imageUrl
  );
  const [fallbackExternalLink, setFallbackExternalLink] = useState<
    string | undefined
  >(externalUrl);
  const buySlot = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };
  const isOwner = !!address && isAddressEqual(slotOwner as Address, address);
  useEffect(() => {
    if (
      !imageUrl &&
      !fallbackImageUrl &&
      !isAddressEqual(slotOwner as Address, billboardOwner as Address)
    ) {
      fetchAddressFallbackAvatar(slotOwner).then((result) => {
        setFallbackImageUrl(result.avatar);
        setFallbackExternalLink(result.link);
      });
    }
  }, []);
  return (
    <div className="relative w-full h-full">
      {!isOwner && isEditing && (
        <Button
          size="sm"
          isLoading={isLoading}
          className={`px-2 absolute z-10 bg-gradient-to-b ${
            isOwner ? "bg-[#0E7DFF]" : "from-[#B2D5FF] to-[#0E7DFF]"
          } text-white font-semibold left-1/2 bottom-1/4 transform -translate-x-1/2 -translate-y-1/2`}
          onPress={() => {
            buySlot();
          }}
        >
          buy #{tokenId + 1} - {price} ETH
        </Button>
      )}
      {isOwner && isEditing && (
        <Button
          size="sm"
          className={`px-2 absolute z-10 bg-gradient-to-b ${
            isOwner ? "bg-[#0E7DFF]" : "from-[#B2D5FF] to-[#0E7DFF]"
          } text-white font-semibold left-1/2 bottom-1/4 transform -translate-x-1/2 -translate-y-1/2 z-20`}
          onPress={() => {
            setIsOpen(true);
          }}
        >
          edit #{tokenId + 1}
        </Button>
      )}
      {fallbackExternalLink && fallbackImageUrl && (
        <Tooltip content={fallbackExternalLink} offset={-15}>
          <Link
            href={fallbackExternalLink}
            target="_blank"
            className="relative z-0"
          >
            <Image
              radius="none"
              className="object-cover w-full h-full"
              src={fallbackImageUrl}
            />
          </Link>
        </Tooltip>
      )}
      <EditSlotModal
        billboardAddress={billboardAddress}
        billboardName={billboardName}
        tokenId={tokenId}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
};
