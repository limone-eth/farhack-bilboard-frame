import { Button, Image, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { EditSlotModal } from "./EditSlotModal";
import { useState } from "react";
export const BillboardSlot = ({
  billboardName,
  billboardAddress,
  imageUrl,
  externalUrl,
  price,
  isEditing,
  index,
  isOwned,
}: {
  billboardName: string;
  billboardAddress: string;
  imageUrl?: string;
  externalUrl?: string;
  price: string;
  isEditing: boolean;
  index: number;
  isOwned?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full h-full">
      {!imageUrl && isEditing && (
        <div className="flex flex-col items-center justify-center h-full">
          <Button
            size="sm"
            className="px-2 bg-gradient-to-b from-[#B2D5FF] to-[#0E7DFF] text-white font-semibold"
            onPress={() => {}}
          >
            buy #{index} - {price} ETH
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
              }
            }}
          >
            {isOwned ? `edit #${index}` : `buy #${index} - ${price} ETH`}
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
        index={index}
        externalUrl={externalUrl!}
        imageUrl={imageUrl!}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
};
