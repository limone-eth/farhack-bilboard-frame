import { createImagesWorker } from "frames.js/middleware/images-worker/next";

const imagesRoute = createImagesWorker({
  secret: "secret",
});

export const GET = imagesRoute();
