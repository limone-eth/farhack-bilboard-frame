import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ChainProviders } from "../components/providers";
import { Navbar } from "../components/Navbar";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "frames.js starter",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="p-4">
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
