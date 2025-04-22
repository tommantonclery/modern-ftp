"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

export default function Topbar() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur sticky top-0 z-20 border-b shadow-sm flex items-center justify-between">
      <h2 className="text-lg font-medium">Dashboard</h2>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-xs">
            Signed in as<br />
            <span className="text-sm font-medium">{session?.user?.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

