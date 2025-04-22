"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Server,
  File,
  Settings,
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 👇 Command item type with optional href
type CommandItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
};

// 👇 Grouped command menu items
const items: { label: string; commands: CommandItem[] }[] = [
  {
    label: "Navigation",
    commands: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Connections", icon: Server, href: "/dashboard/connections" },
      { label: "Files", icon: File, href: "/dashboard/files" },
      { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
  {
    label: "Other",
    commands: [
      { label: "Search (Coming Soon)", icon: Search }, // no href
    ],
  },
];

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {items.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.commands.map((cmd) => (
              <CommandItem
                key={cmd.label}
                onSelect={() => {
                  if (cmd.href) {
                    router.push(cmd.href);
                    setOpen(false);
                  }
                }}
              >
                <cmd.icon className="mr-2 h-4 w-4" />
                <span>{cmd.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
