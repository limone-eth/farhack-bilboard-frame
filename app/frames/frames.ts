import { imagesWorkerMiddleware } from "frames.js/middleware/images-worker";
import { createFrames } from "frames.js/next";
import { appURL } from "../utils";

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
  ],
});
