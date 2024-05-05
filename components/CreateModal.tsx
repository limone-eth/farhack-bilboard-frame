"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { DragNDropImage } from "./DragNDropImage";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { BILLBOARD_FACTORY_ABI } from "../lib/contracts/billboard-factory-abi";
import { BILLBOARD_FACTORY_BASE_ADDRESS } from "../lib/constants";
import { createPublicClient, decodeEventLog, http, parseUnits } from "viem";
import { base } from "viem/chains";
import { pinToPinata } from "../lib/pinata";

export const CreateModal = ({
  isOpen,
  onOpenChange,
  onIsSuccessChange,
  setBillboardAddress,
  name,
  setName,
  uploadedImage,
  setUploadedImage,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onIsSuccessChange: (success: boolean) => void;
  setBillboardAddress: (address: string) => void;
  name: string;
  setName: (name: string) => void;
  uploadedImage: string;
  setUploadedImage: (image: string) => void;
}) => {
  const { isConnected } = useAccount();
  const [ticker, setTicker] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [selectedFile, setSelectedFile]: any = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const isDisabled =
    !name || !ticker || !minPrice || !selectedFile || !isConnected;
  const { writeContractAsync } = useWriteContract();

  const createBillboard = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    const pinataResponse = await pinToPinata(formData);
    if (!pinataResponse.IpfsHash) {
      console.error("Error pinning to Pinata", pinataResponse);
    }
    const ipfsHash = pinataResponse.IpfsHash;

    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });
      const txHash = await writeContractAsync({
        abi: BILLBOARD_FACTORY_ABI,
        address: BILLBOARD_FACTORY_BASE_ADDRESS,
        functionName: "create",
        args: [
          name,
          ticker,
          `ipfs://${ipfsHash}`,
          parseUnits(minPrice, 18),
          parseUnits("0.0000001", 18),
        ],
      });
      const txReceiptData = await publicClient.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
      });
      const billboardAddress = txReceiptData.logs
        .filter(
          (log) => log.address === BILLBOARD_FACTORY_BASE_ADDRESS.toLowerCase()
        )
        .map((log) =>
          decodeEventLog({
            abi: BILLBOARD_FACTORY_ABI,
            eventName: "BillboardCreated",
            ...log,
          })
        )[0]?.args.billboardProxy;
      if (!billboardAddress) {
        throw new Error("Billboard address not found");
      }
      setBillboardAddress(billboardAddress!);
      onIsSuccessChange(true);
      onOpenChange(false);
    } catch (e) {
      console.error("Error creating billboard", e);
      setError(
        "There was an error deploying your billboard. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center text-3xl">
              Create new billboard frame
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="text-sm rounded-xl bg-blue-50 p-4 text-blue-300">
                  <div className="flex flex-row gap-2 items-center">
                    <svg
                      className="flex-shrink-0 inline w-4 h-4 me-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div className="text-xs">
                      Each billboard frame is an NFT collection with 9 NFTs
                      (slots) deployed on Base.
                      <br></br>
                      You can set the name, ticker, minimum price and cover
                      image for your collection (billboard).
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-8 items-center">
                  <label className="text-lg font-semibold">Name</label>
                  <Input
                    type="text"
                    variant={"flat"}
                    value={name}
                    onValueChange={setName}
                    placeholder="e.g. Farcaster /channelname or XMTP bot name"
                  />
                </div>
                <div className="flex flex-row gap-8 items-center">
                  <label className="text-lg font-semibold">Ticker</label>
                  <Input
                    type="text"
                    variant={"flat"}
                    maxLength={20}
                    value={ticker}
                    onValueChange={setTicker}
                    placeholder="$TICKER for your billboard"
                  />
                </div>
                <div className="flex flex-row gap-8 items-center">
                  <div className="text-lg font-semibold">Min.price</div>
                  <Input
                    type="text"
                    variant={"flat"}
                    value={minPrice}
                    onValueChange={setMinPrice}
                    placeholder="e.g. 0.01ETH for the initial slots"
                    pattern="^\d*(\.\d{0,6})?$"
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <div className="text-lg font-semibold">Cover image</div>
                  <DragNDropImage
                    setSelectedFile={setSelectedFile}
                    setUploadedImage={setUploadedImage}
                    uploadedImage={uploadedImage}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="text-center items-center justify-center flex flex-col">
              <div className="text-red-500">{error}</div>
              <Button
                className="bg-gradient-to-b from-[#B2D5FF] to-[#0E7DFF] text-white font-semibold text-lg"
                onPress={createBillboard}
                isDisabled={isDisabled}
                isLoading={isLoading}
              >
                Create billboard
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
