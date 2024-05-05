/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./../frames";
import { appURL } from "../../utils";
import * as fs from "node:fs/promises";
import path from "path";
import { Token } from "../../../lib/airstack/types";
import { readTokenURI } from "../../../lib/contracts/utils";
import { base64toJson, getIpfsUrl } from "../../../lib/utils";

const hankenGroteskRegularFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "HankenGrotesk-Regular.ttf")
);

const hankenGroteskBoldFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "HankenGrotesk-Black.ttf")
);

const frameHandler = frames(async (ctx) => {
  const [interRegularFontData, interBoldFontData] = await Promise.all([
    hankenGroteskRegularFont,
    hankenGroteskBoldFont,
  ]);
  const address = ctx.request.url.split("/").pop();
  const res = await fetch(`http://localhost:3000/api/billboards/${address}`, {
    next: { revalidate: 0 },
    headers: {
      "x-secret": process.env.SECRET!,
    },
  });
  const token: Token = await res.json();
  const tokenURIData = await readTokenURI(address!);
  const tokens = tokenURIData.map((uri, index) => ({
    tokenId: index,
    image: base64toJson(uri.result as string).image,
  }));
  return {
    imageOptions: {
      aspectRatio: "1:1",
      fonts: [
        {
          name: "Inter",
          data: interRegularFontData,
        },
        {
          name: "Inter",
          data: interBoldFontData,
        },
      ],
    },
    image: (
      <div tw="flex relative">
        <div tw="relative bg-blend-overlay w-full h-full flex flex-col text-center items-center justify-around gap-8 p-16">
          <div tw="bg-grey-800 bg-blend-overlay w-full h-full flex flex-col text-center items-center justify-around gap-8 p-16">
            <div tw="flex flex-col text-center items-center">
              <div tw="flex text-8xl font-black">billboard</div>
              <div tw="flex text-4xl">{token.name}</div>
            </div>
            <div tw="flex">
              <img
                tw=" flex rounded-2xl w-96 h-96 object-cover"
                src={getIpfsUrl(
                  base64toJson(token.contractMetaDataURI!)!.image.replace(
                    "ipfs://",
                    ""
                  )
                )}
              />
            </div>
          </div>
        </div>
        <div tw="flex flex-wrap absolute inset-0 z-10">
          <div tw="relative flex h-full flex-wrap">
            <div tw="flex w-full h-96">
              {tokens.slice(0, 3).map((token, index) => (
                <div
                  key={index}
                  tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"
                >
                  {token.image && (
                    <img
                      tw="h-96 w-96 transform scale-75"
                      style={{ objectFit: "cover" }}
                      src={getIpfsUrl(token.image.replace("ipfs://", ""))}
                    />
                  )}
                </div>
              ))}
            </div>
            <div tw="flex w-full h-96">
              {tokens.slice(3, 6).map((token, index) => (
                <div
                  key={index}
                  tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"
                >
                  {token.image && (
                    <img
                      tw="h-96 w-96 transform scale-75"
                      style={{ objectFit: "cover" }}
                      src={getIpfsUrl(token.image.replace("ipfs://", ""))}
                    />
                  )}
                </div>
              ))}
            </div>
            <div tw="flex w-full h-96">
              {tokens.slice(6, 9).map((token, index) => (
                <div
                  key={index}
                  tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"
                >
                  {token.image && (
                    <img
                      tw="h-96 w-96 transform scale-75"
                      style={{ objectFit: "cover" }}
                      src={getIpfsUrl(token.image.replace("ipfs://", ""))}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: `/${address}/support` }}>
        Support
      </Button>,
      <Button action="link" target={appURL()}>
        Visit billboards.cool
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
