import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { createPublicClient, parseUnits } from "viem";
import { base } from "viem/chains";
import { http, useWriteContract } from "wagmi";
import { BILLBOARD_ABI } from "../lib/contracts/billboard-abi";
import { DragNDropImage } from "./DragNDropImage";
import { useState } from "react";

export const EditSlotModal = ({
  billboardAddress,
  billboardName,
  tokenId,
  externalUrl,
  imageUrl,
  isOpen,
  onOpenChange,
}: {
  billboardAddress: string;
  billboardName: string;
  tokenId: number;
  externalUrl: string;
  imageUrl: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [selectedFile, setSelectedFile]: any = useState(null);
  const { writeContractAsync } = useWriteContract();
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const saveSlot = async () => {
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });
    const txHash = await writeContractAsync({
      abi: BILLBOARD_ABI,
      address: billboardAddress as `0x${string}`,
      functionName: "setSlotMetadata",
      args: [BigInt(tokenId), imageUrl, externalUrl],
    });
    const txReceiptData = await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });
  };
  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center text-3xl">
              Edit {billboardName} slot #{tokenId + 1}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-8 items-center">
                  <label className="text-lg font-semibold">SlotURL</label>
                  <Input type="url" variant={"flat"} value={externalUrl} />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <div className="text-lg font-semibold">Slot image</div>
                  <DragNDropImage setSelectedFile={setSelectedFile} uploadedImage={uploadedImage || imageUrl} setUploadedImage={setUploadedImage} />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="text-center items-center justify-center">
              <Button
                className="bg-gradient-to-b from-[#B2D5FF] to-[#0E7DFF] text-white font-semibold text-lg"
                onPress={saveSlot}
              >
                Save slot
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
