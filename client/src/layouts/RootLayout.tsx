import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

export function RootLayout() {
  return (
    <div className="flex h-full bg-background text-foreground overflow-hidden">
      <Sidebar className="w-[260px] flex-shrink-0 hidden md:flex z-10 relative" />
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-8 h-full bg-muted/30">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
