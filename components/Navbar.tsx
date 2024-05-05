import { Image } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="p-4">
      <nav className="flex justify-between items-center">
        <Link href={"/"} className="font-black">
          <Image src="/logo.svg" alt="billboards" height={20} width={120} />
        </Link>
        <ConnectButton />
      </nav>
    </div>
  );
};
