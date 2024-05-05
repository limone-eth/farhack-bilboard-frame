import type { Metadata } from "next";
import "react-image-crop/dist/ReactCrop.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ChainProviders } from "../components/providers";
import { Navbar } from "../components/Navbar";
import { HankenGrotesk } from "../public/fonts";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "billboards",
  description:
    "billboards - your space, their message. monetize your audience's attention.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${HankenGrotesk.className}`}>
        <ChainProviders>
          <NextUIProvider>
            <Navbar />
            {children}
          </NextUIProvider>
        </ChainProviders>
      </body>
    </html>
  );
}
