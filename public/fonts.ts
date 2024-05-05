import localFont from "next/font/local";

export const HankenGrotesk = localFont({
  src: [
    {
      path: "./HankenGrotesk-Regular.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./HankenGrotesk-Bold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./HankenGrotesk-Black.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});
