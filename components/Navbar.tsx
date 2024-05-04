import { Button } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div>
      <nav className="flex justify-between items-center">
        <Link href={"/"} className="font-black">billboards</Link>
        <ConnectButton />
      </nav>
    </div>
  );
};
