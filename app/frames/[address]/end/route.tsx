/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../frames";
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
  const slot = ctx.searchParams.slot;
  const error = ctx.searchParams.error;

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
      <div tw="w-full h-full flex flex-col text-center items-center justify-around gap-8 p-16">
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
        {error ? (
          <div tw="flex text-6xl font-bold text-red-500">Error!</div>
        ) : (
          <div tw="flex flex-col text-center items-center gap-8">
            <div tw="flex text-6xl font-bold text-green-500">Success!</div>
            <div tw="flex text-4xl">You've bought slot #{slot}</div>
            <div tw="flex text-2xl mt-8">
              visit <span tw="text-blue-500 mx-2">billboards.cool</span> to
              customize your slot image
            </div>
          </div>
        )}
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: `/${address}` }}>
        Refresh frame
      </Button>,
      <Button action="link" target={appURL()}>
        Visit billboards.cool
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
