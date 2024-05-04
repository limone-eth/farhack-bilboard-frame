/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./../frames";
import { appURL } from "../../utils";
import * as fs from "node:fs/promises";
import path from "path";

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
  console.log(address);

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
              <div tw="flex text-4xl">/{address}</div>
            </div>
            <div tw="flex">
              <img
                tw=" flex rounded-2xl w-96 h-96 object-cover"
                src="https://i.imgur.com/7Q0QBrm.jpg"
              />
            </div>
          </div>
        </div>
        <div tw="flex flex-wrap absolute inset-0 z-10">
          <div tw="relative flex h-full flex-wrap">
            <div tw="flex w-full h-96">
              <div tw="bg-blue-500 flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8">
                <img
                  tw="h-96 w-96  transform scale-75"
                  style={{ objectFit: "cover" }}
                  src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/7019daeb-8a20-4025-ef52-a69dc7acf000/original"
                />
              </div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"></div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"></div>
            </div>
            <div tw="flex w-full h-96">
              <div tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"></div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"></div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"></div>
            </div>
            <div tw="flex w-full h-96">
              <div tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"></div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"></div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 flex items-center justify-center p-8"></div>
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
