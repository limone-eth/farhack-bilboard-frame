/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./../../frames";
import * as fs from "node:fs/promises";
import path from "path";
import { Token } from "../../../../lib/airstack/types";
import {
  readMinimumPriceIncrement,
  readOwner,
  readPriceData,
  readTokenURI,
} from "../../../../lib/contracts/utils";
import { base64toJson, getIpfsUrl } from "../../../../lib/utils";
import { Address, formatUnits, isAddress, isAddressEqual } from "viem";
import { appURL } from "../../../utils";
import { fetchAddressFallbackAvatar } from "../../../../lib/web3-bio";
import { PINATA_GATEWAY } from "../../../../lib/constants";

const hankenGroteskRegularFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "HankenGrotesk-Regular.ttf")
);

const hankenGroteskBoldFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "HankenGrotesk-Black.ttf")
);

const frameHandler = frames(async (ctx) => {
  const [hankenGroteskRegularFontData, hankenGroteskBoldFontData] =
    await Promise.all([hankenGroteskRegularFont, hankenGroteskBoldFont]);
  const urlSplit = ctx.request.url.split("/");
  const address = urlSplit.find((part) => part.startsWith("0x"));
  const res = await fetch(`${appURL()}/api/billboards/${address}`, {
    next: { revalidate: 0 },
    headers: {
      "x-secret": process.env.SECRET!,
    },
  });
  const token: Token = await res.json();
  const priceData = await readPriceData(address!);
  const minimumPriceIncrement = await readMinimumPriceIncrement(address!);
  const tokenURIData = await readTokenURI(address!);
  const billboardOwner = await readOwner(address!);
  const tokens = (
    await Promise.all(
      token!.tokenNfts!.map((nft) =>
        Promise.all(
          nft.tokenBalances!.map(async (b) =>
            prepareTokens(
              tokenURIData,
              priceData,
              b.owner.identity,
              nft.tokenId,
              billboardOwner,
              minimumPriceIncrement
            )
          )
        )
      )
    )
  ).flat();
  return {
    imageOptions: {
      aspectRatio: "1:1",
      fonts: [
        {
          name: "Hanken",
          data: hankenGroteskRegularFontData,
          weight: 400,
        },
        {
          name: "Hanken",
          data: hankenGroteskBoldFontData,
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
                      src={token.image}
                    />
                  )}
                  <div tw="absolute inset-0 flex items-center justify-center">
                    <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                      {`#${token.tokenId + 1} - ${token.price} ETH`}
                    </div>
                  </div>
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
                      src={token.image}
                    />
                  )}
                  <div tw="absolute inset-0 flex items-center justify-center">
                    <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                      {`#${token.tokenId + 1} - ${token.price} ETH`}
                    </div>
                  </div>
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
                      src={token.image}
                    />
                  )}
                  <div tw="absolute inset-0 flex items-center justify-center">
                    <div tw="border-4 border-white rounded-lg bg-blue-500 p-4 text-4xl text-white">
                      {`#${token.tokenId + 1} - ${token.price} ETH`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    textInput: ctx.message?.inputText
      ? `Enter a price or buy at floor`
      : `Enter slot # (1-9) to buy`,
    buttons: [
      ctx.message?.inputText ? (
        <Button
          action="tx"
          post_url={`/${address}/end?slot=${ctx.message?.inputText}`}
          target={{
            pathname: `/${address}/buy/${ctx.message?.inputText}?receiverAddress=${ctx}`,
          }}
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

const prepareTokens = async (
  tokenURIDataArray: any,
  priceData: any[],
  owner: string,
  tokenId: string,
  billboardOwner: string,
  minimumPriceIncrement: bigint
) => {
  let image = "";
  const tokenURIData = tokenURIDataArray[parseInt(tokenId)];
  if (tokenURIData && base64toJson(tokenURIData.result as string).image) {
    image = getIpfsUrl(
      base64toJson(tokenURIData.result as string).image.replace("ipfs://", "")
    );
  } else {
    if (!isAddressEqual(billboardOwner as Address, owner as Address)) {
      image = (await fetchAddressFallbackAvatar(owner))?.avatar;
    }
  }
  return {
    owner,
    tokenId: parseInt(tokenId),
    image,
    price: formatUnits(
      priceData?.[parseInt(tokenId)]?.result + minimumPriceIncrement,
      18
    ),
  };
};

export const GET = frameHandler;
export const POST = frameHandler;
