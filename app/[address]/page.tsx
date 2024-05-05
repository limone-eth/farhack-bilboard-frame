import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import Link from "next/link";
import { createDebugUrl } from "./../debug";
import { appURL, currentURL } from "./../utils";
import { Billboard } from "../../components/Billboard";

export async function generateMetadata({
  params,
}: {
  params: {
    address: string;
  };
}): Promise<Metadata> {
  const { address } = params;
  return {
    title: "billboards",
    description: "their brand, your profit.",
    other: {
      ...(await fetchMetadata(new URL(`/frames/${address}`, appURL()))),
    },
  };
}

// This is a react server component only
export default async function Home({
  params: { address },
}: {
  params: { address: string };
}) {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-evenly text-center gap-8 p-32">
        <div className="text-2xl">/gaming billboard</div>
        <Billboard name={"gaming"} address={address} />
      </div>
    </div>
  );
}
