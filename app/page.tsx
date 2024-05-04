import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { Image } from "@nextui-org/react";
import { appURL, currentURL } from "./utils";
import { CreateModalButton } from "../components/CreateModalButton";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "frames.js starter",
    description: "This is a frames.js starter template",
    other: {
      ...(await fetchMetadata(new URL("/frames", appURL()))),
    },
  };
}

// This is a react server component only
export default async function Home() {
  const url = currentURL("/");
  // then, when done, return next frame
  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-evenly text-center gap-36">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-8xl font-bold">billboards</h1>
          <p className="text-2xl font-semibold">
            Spotlight your space: their brand, your profit.
          </p>
          <CreateModalButton />
        </div>
        <Image src="https://placehold.co/600x400/EEE/31343C" />
      </div>
    </div>
  );
}
