/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./../../frames";
import { appURL } from "../../../utils";
import * as fs from "node:fs/promises";
import path from "path";

const interRegularFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "Inter-Regular.ttf")
);

const interBoldFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "Inter-Bold.ttf")
);

const frameHandler = frames(async (ctx) => {
  const [interRegularFontData, interBoldFontData] = await Promise.all([
    interRegularFont,
    interBoldFont,
  ]);
  const urlSplit = ctx.request.url.split("/");
  const address = urlSplit[urlSplit.length - 2];

  return {
    imageOptions: {
      aspectRatio: "1:1",
      fonts: [
        {
          name: "Inter",
          data: interRegularFontData,
          weight: 400,
        },
        {
          name: "Inter",
          data: interBoldFontData,
          weight: 700,
        },
      ],
    },
    image: (
      <div tw="relative flex">
        <div tw="relative bg-blend-overlay w-full h-full flex flex-col text-center items-center justify-around gap-8 p-16">
          <div tw="bg-grey-800 bg-blend-overlay w-full h-full flex flex-col text-center items-center justify-around gap-8 p-16">
            <div tw="flex flex-col text-center items-center">
              <div tw="flex text-8xl font-bold">billboard</div>
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
        <div tw="flex flex-wrap absolute inset-0 z-10 bg-gray-800/50">
          <div tw="relative flex h-full flex-wrap">
            <div tw="flex w-full h-96">
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #1 - 0.01 ETH
                </div>
              </div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #2 - 0.01 ETH
                </div>
              </div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #3 - 0.01 ETH
                </div>
              </div>
            </div>
            <div tw="flex w-full h-96">
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #4 - 0.01 ETH
                </div>
              </div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #5 - 0.01 ETH
                </div>
              </div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #6 - 0.01 ETH
                </div>
              </div>
            </div>
            <div tw="flex w-full h-96">
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #7 - 0.01 ETH
                </div>
              </div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #8 - 0.01 ETH
                </div>
              </div>
              <div tw="flex-1 aspect-w-1 aspect-h-1 border-2 border-white flex items-center justify-center p-8">
                <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                  #9 - 0.01 ETH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    textInput: ctx.message?.inputText
      ? `Enter your price for slot ${ctx.message?.inputText}`
      : `Enter slot # (1-9) to buy`,
    buttons: [
      ctx.message?.inputText ? (
        // TODO: uncomment to exec tx
        /*<Button
          action="tx"
          post_url={"SUCCESS TX FRAME URL"}
          target={{ pathname: `/${address}/support` }}
        >
          {`Buy slot #${ctx.message?.inputText}`}
        </Button>*/
        <Button
          action="post"
          target={{ pathname: `/${address}/end`, query: { slot: ctx.message?.inputText } }}
        >
          {`Buy slot #${ctx.message?.inputText}`}
        </Button>
      ) : (
        <Button action="post" target={{ pathname: `/${address}/support` }}>
          Continue
        </Button>
      ),
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
