import { Button } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="p-4">
      <nav className="flex justify-between items-center">
        <div></div>
        <ConnectButton />
      </nav>
    </div>
  );
};
