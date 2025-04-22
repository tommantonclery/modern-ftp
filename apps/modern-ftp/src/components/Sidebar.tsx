"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, Server, File, Settings } from "lucide-react";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Connections", href: "/dashboard/connections", icon: Server },
  { label: "Files", href: "/dashboard/files", icon: File },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-r h-screen px-6 py-6 shadow-sm flex flex-col justify-between">
      <div className="space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Modern FTP</h1>
        <nav className="space-y-2 text-sm">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                pathname === href
                  ? "bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900/20"
                  : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-800"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} Modern FTP</p>
    </aside>
  );
}