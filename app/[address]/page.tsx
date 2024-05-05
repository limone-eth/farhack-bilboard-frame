import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
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
    description:
      "billboards - your space, their message. monetize your audience's attention.",
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
