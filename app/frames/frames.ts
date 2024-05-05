import { imagesWorkerMiddleware } from "frames.js/middleware/images-worker";
import { createFrames } from "frames.js/next";
import { appURL } from "../utils";
import { openframes } from "frames.js/middleware";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";
 

type State = {
  counter: number;
};

export const frames = createFrames<State>({
  basePath: "/frames",
  baseUrl: appURL(),
  initialState: { counter: 0 },
  middleware: [
    imagesWorkerMiddleware({
      imagesRoute: "/images",
      secret: "secret",
    }),
    openframes({
      clientProtocol: {
        id: "xmtp",
        version: "2024-02-09",
      },
      handler: {
        isValidPayload: (body: JSON) => isXmtpFrameActionPayload(body),
        getFrameMessage: async (body: JSON) => {
          if (!isXmtpFrameActionPayload(body)) {
            return undefined;
          }
          const result = await getXmtpFrameMessage(body);
 
          return { ...result };
        },
      },
    }),
  ],
});
