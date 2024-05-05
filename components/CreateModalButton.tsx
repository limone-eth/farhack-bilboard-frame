"use client";

import { Button } from "@nextui-org/react";
import { CreateModal } from "./CreateModal";
import { useState } from "react";
import { SuccessModal } from "./SuccessModal";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const CreateModalButton = ({}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [billboardAddress, setBillboardAddress] = useState("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        <Button
          className="mt-8 w-48 bg-gradient-to-b from-[#B2D5FF] to-[#0E7DFF] text-white font-semibold text-lg"
          onPress={() => {
            setIsOpenModal(true);
          }}
        >
          Create billboard
        </Button>
      ) : (
        <div className="mt-8 flex flex-col gap-2 text-center items-center">
          <ConnectButton />
          <div className="text-xs text-center">
            Connect your wallet to create a billboard
          </div>
        </div>
      )}

      <CreateModal
        isOpen={isOpenModal}
        onOpenChange={setIsOpenModal}
        onIsSuccessChange={setIsSuccess}
        setBillboardAddress={setBillboardAddress}
        name={name}
        setName={setName}
        uploadedImage={image}
        setUploadedImage={setImage}
      />
      <SuccessModal
        isOpen={isSuccess}
        onOpenChange={setIsSuccess}
        billboardAddress={billboardAddress}
        name={name}
        image={image}
      />
    </>
  );
};
