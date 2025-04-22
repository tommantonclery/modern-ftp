import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import CommandMenu from "@/components/CommandMenu";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <CommandMenu />
        <main className="flex-1 overflow-y-auto p-10 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
