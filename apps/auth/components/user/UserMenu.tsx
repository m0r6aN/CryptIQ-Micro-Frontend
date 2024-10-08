"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserSettings from "@/components/user/UserSettings";
import Image from "next/image";
import { useCurrentUser } from "@/lib/utils/useCurrentUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, Settings2 } from "lucide-react";
import { signOut } from "next-auth/react";
import LoginButton from "../auth/LoginButton";
interface Props {
  showLoginBtn?: Boolean;
}
const UserMenu = ({ showLoginBtn }: Props) => {
  const user = useCurrentUser();
  if (!user) {
    if (showLoginBtn) {
      return <LoginButton mode="modal">Login</LoginButton>;
    }
    return;
  }

  return (
    <div>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full">
            <Image
              src={
                user?.image ||
                "https://utfs.io/f/06887ef0-f017-4ff8-b30e-9bb51bbb50e9-1c1x8x.jpg"
              }
              alt="profile"
              height={40}
              width={40}
              className="h-9 w-9  cursor-pointer rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-950 mr-64 min-w-[350px] border-none p-5 shadow-xl">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Image
                  src={
                    user?.image ||
                    "https://utfs.io/f/06887ef0-f017-4ff8-b30e-9bb51bbb50e9-1c1x8x.jpg"
                  }
                  alt="profile"
                  height={60}
                  width={60}
                  className="h-12 w-12  cursor-pointer rounded-full object-cover"
                />
                <div>
                  {/*[ShowUsername]*/}
                  <p className="font-light text-gray-100 text-[10px]">
                    {user?.name}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-white  focus:bg-slate-900/90 focus:text-white ">
              <DialogTrigger className=" inline-flex cursor-pointer   w-full items-center gap-5  py-3 text-sm">
                <Settings2 />
                <span>Manage Account</span>
              </DialogTrigger>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-white  focus:bg-slate-900/90 focus:text-white ">
              <button
                className="inline-flex w-full items-center gap-5  py-3 text-sm "
                onClick={() => signOut()}
              >
                <LogOutIcon />
                <span>Sign Out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="p-0 w-auto  border-none">
          <DialogClose className="fixed !left-2 text-white    " />
          <UserSettings />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserMenu;
