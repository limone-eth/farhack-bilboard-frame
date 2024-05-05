import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@nextui-org/react";
import { useState } from "react";

export const SuccessModal = ({
  isOpen,
  onOpenChange,
  billboardAddress,
  name,
  image,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  billboardAddress: string;
  image: string;
  name: string;
}) => {
  const billboardUrl = `https://billboards.cool/${billboardAddress}`;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const content = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="flex flex-row gap-1">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <div className="text-small font-bold">Copied to clipboard</div>
        </div>
      </div>
    </PopoverContent>
  );
  const copyBillboardLink = () => {
    navigator.clipboard.writeText(billboardUrl);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="p-4">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              <div className="text-4xl text-green-500">Billboard created!</div>
              <div className="text-center font-medium">
                Copy the URL and integrate it within your channel pinned cast or
                XMTP bot.
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4 p-4 items-center">
                <div className="flex flex-col text-center items-center justify-around bg-gray-100 rounded-xl py-8 px-16 gap-1 h-96 w-96">
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold">billboard</div>
                    <div className="text-2xl">{name}</div>
                  </div>
                  <Image className="w-48 h-48" src={image} />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="text-center items-center justify-center">
              <div className="flex flex-row gap-2 items-center">
                <div className="text-lg font-semibold">Frame URL</div>
                <div className="border-2 border-gray-200 bg-gray-100 rounded-xl py-2 px-4 text-gray-400 text-xs w-64">
                  {billboardUrl.substring(0, 35)}...
                </div>
                <Popover
                  key={"default"}
                  placement="top"
                  color={"default"}
                  onOpenChange={(e) => {
                    copyBillboardLink();
                    setIsPopoverOpen(e);
                    setTimeout(() => setIsPopoverOpen(false), 2000);
                  }}
                  isOpen={isPopoverOpen}
                >
                  <PopoverTrigger>
                    <Button
                      className="bg-gradient-to-b from-[#B2D5FF] to-[#0E7DFF] text-white font-semibold text-lg"
                      onPress={copyBillboardLink}
                    >
                      Copy URL
                    </Button>
                  </PopoverTrigger>
                  {content}
                </Popover>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
