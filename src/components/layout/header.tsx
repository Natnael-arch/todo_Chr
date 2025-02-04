import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import logo from "../../assets/logo.svg";
import { ConnectWallet } from "./wallet";

const Header = () => {
  const classNameLeftCube = cn(
    "before:cube before:bottom-[-4px] before:left-[-4px] before:hidden sm:before:block",
  );
  const classNameRightCube = cn(
    "after:cube after:bottom-[-4px] after:right-[-4px] after:hidden sm:after:block",
  );

  return (
    <div className="sticky left-0 right-0 top-0 z-50 h-20 border-0 border-b border-solid border-border/20 bg-popover/10 backdrop-blur-md">
      <div
        className={cn(
          "container relative flex h-full items-center justify-between border-0 border-l border-r border-border/20 sm:border-solid",
          classNameLeftCube,
          classNameRightCube,
        )}
      >
        <Link href="/">
          <Image alt="logo" className="h-7 w-auto" src={logo} />
        </Link>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
