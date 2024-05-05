import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import Image from "next/image";
import { appURL, currentURL } from "./utils";
import { CreateModalButton } from "../components/CreateModalButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "billboards",
    description:
      "billboards - your space, their message. monetize your audience's attention.",
    other: {
      ...(await fetchMetadata(new URL("/frames", appURL()))),
    },
  };
}

// This is a react server component only
export default async function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-evenly text-center gap-36 my-16">
        <div className="flex flex-col items-center justify-center text-center">
          <Image src="/logo.svg" alt="billboards" width={600} height={100} />
          <p className="text-6xl font-medium flex items-baseline mb-8">
            for
            <Image
              src="/farcaster.svg"
              alt="Farcaster"
              className="ml-4 mr-2"
              width={40}
              height={40}
            />
            frames and
            <Image
              src="/xmtp.svg"
              alt="XMTP"
              className="ml-4 mr-2"
              width={40}
              height={40}
            />
            chats
          </p>
          <CreateModalButton />
        </div>
      </div>

      <div className="relative my-32 aspect-[1375/800]">
        <Image src="/graphic.png" alt="" className="object-contain" fill />
      </div>

      <div className="my-32">
        <h2 className="text-center text-6xl mb-16">How it works ⚙️</h2>
        <div className="flex gap-12 text-center max-w-[720px] w-full mx-auto">
          <div className="space-y-4 flex-1">
            <div className="mx-auto rounded-full w-24 h-24 text-4xl font-semibold text-white bg-blue-600 flex items-center justify-center">
              1
            </div>
            <h3 className="text-2xl">Create</h3>
            <p>Connect your wallet and create a new onchain billboard</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="mx-auto rounded-full w-24 h-24 text-4xl font-semibold text-white bg-purple-600 flex items-center justify-center">
              2
            </div>
            <h3 className="text-2xl">Share</h3>
            <p>
              Put the frame URL in you pinned Farcaster channel or XMTP chat
            </p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="mx-auto rounded-full w-24 h-24 text-4xl font-semibold text-white bg-pink-600 flex items-center justify-center">
              3
            </div>
            <h3 className="text-2xl">Monetize</h3>
            <p>
              Your supporters buy slots for ETH, whoever bids more overwrites
              the slot
            </p>
          </div>
        </div>
      </div>
      <div className="text-center py-16 relative">
        <Image src="/bg.png" alt="" fill />
        <div className="relative z-10">
          <h3 className="text-6xl mb-8">Brought to you by</h3>
          <div className="flex justify-center gap-8 text-[#C848FF] text-3xl">
            <a href="https://warpcast.com/limone.eth">@limone.eth</a>
            <a href="https://warpcast.com/owl">@owl</a>
            <a href="https://warpcast.com/serg">@serg</a>
          </div>
        </div>
      </div>
    </>
  );
}
