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

export const CreateModal = ({
  isOpen,
  onOpenChange,
  isSuccess,
  onIsSuccessChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSuccess: boolean;
  onIsSuccessChange: (success: boolean) => void;
}) => {
  const createBillboard = async () => {
    // create billboard
    onIsSuccessChange(true);
    onOpenChange(false);
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
                    type="email"
                    variant={"flat"}
                    placeholder="e.g. Farcaster /channelname or XMTP bot name"
                  />
                </div>
                <div className="flex flex-row gap-8 items-center">
                  <label className="text-lg font-semibold">Ticker</label>
                  <Input
                    type="email"
                    variant={"flat"}
                    placeholder="$TICKER for your billboard"
                  />
                </div>
                <div className="flex flex-row gap-8 items-center">
                  <div className="text-lg font-semibold">Min.price</div>
                  <Input
                    className="flex-2/3"
                    type="email"
                    variant={"flat"}
                    placeholder="0.01ETH for the initial slots"
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <div className="text-lg font-semibold">Cover image</div>
                  <DragNDropImage />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="text-center items-center justify-center">
              <Button
                className="bg-gradient-to-b from-[#B2D5FF] to-[#0E7DFF] text-white font-semibold text-lg"
                onPress={createBillboard}
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
