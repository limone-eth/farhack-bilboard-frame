"use client";

import { Button } from "@nextui-org/react";
import { CreateModal } from "./CreateModal";
import { useState } from "react";
import { SuccessModal } from "./SuccessModal";

export const CreateModalButton = ({}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  return (
    <>
      <Button
        className="mt-8 w-48 bg-gradient-to-b from-[#B2D5FF] to-[#0E7DFF] text-white font-semibold text-lg"
        onPress={() => {
          setIsOpenModal(true);
        }}
      >
        Create billboard
      </Button>
      <CreateModal
        isOpen={isOpenModal}
        onOpenChange={setIsOpenModal}
        isSuccess={isSuccess}
        onIsSuccessChange={setIsSuccess}
      />
      <SuccessModal isOpen={isSuccess} onOpenChange={setIsSuccess} />
    </>
  );
};
