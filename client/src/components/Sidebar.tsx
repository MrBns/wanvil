import {
  ArrowRightLeft,
  Blocks,
  Edit2,
  Home,
  StopCircle,
  TerminalSquare,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WanvilMark } from "@/components/WanvilMark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { anvilSocketStop, useAnvilSocketConnected } from "@/lib/anvilSocket";
import { useRpc } from "@/lib/rpcContext";

function normalizeRpcUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "127.0.0.1" || parsed.hostname === "0.0.0.0") {
      parsed.hostname = "localhost";
    }
    let res = parsed.toString().toLowerCase();
    if (res.endsWith("/")) res = res.slice(0, -1);
    return res;
  } catch {
    let fallback = url.trim().toLowerCase();
    if (fallback.endsWith("/")) fallback = fallback.slice(0, -1);
    return fallback;
  }
}

export function Sidebar({ className = "" }: { className?: string }) {
  const { rpcUrl, setRpcUrl } = useRpc();
  const location = useLocation();
  const socketConnected = useAnvilSocketConnected();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftUrl, setDraftUrl] = useState(rpcUrl);

  const stopAnvil = async () => {
    try {
      if (socketConnected) {
        await anvilSocketStop();
      }
    } catch {
      /* ignore */
    }
  };

  const openRpcModal = () => {
    setDraftUrl(rpcUrl);
    setIsModalOpen(true);
  };

  const cancelRpcEdit = () => {
    setIsModalOpen(false);
  };

  const confirmRpcEdit = async () => {
    setIsModalOpen(false);
    if (normalizeRpcUrl(draftUrl) !== normalizeRpcUrl(rpcUrl)) {
      if (socketConnected) {
        try {
          await anvilSocketStop();
        } catch {}
      }
      setRpcUrl(draftUrl);
    }
  };

  return (
    <>
      <aside
        className={`bg-card border-r border-border h-full flex flex-col pt-6 pb-4 px-3 ${className}`}
      >
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <WanvilMark className="h-5 w-5" />
          <span className="font-semibold text-sm text-foreground tracking-tight">wanvil</span>
        </div>

        <nav className="flex-1 space-y-0.5">
          <SidebarItem
            to="/"
            icon={<Home size={16} />}
            label="Dashboard"
            active={location.pathname === "/"}
          />
          <SidebarItem
            to="/blocks"
            icon={<Blocks size={16} />}
            label="Blocks"
            active={location.pathname.startsWith("/block")}
          />
          <SidebarItem
            to="/tx"
            icon={<ArrowRightLeft size={16} />}
            label="Transactions"
            active={location.pathname.startsWith("/tx")}
          />
          <SidebarItem
            to="/address"
            icon={<Users size={16} />}
            label="Addresses"
            active={location.pathname.startsWith("/address")}
          />

          {socketConnected &&
            (() => {
              let isLocal = false;
              try {
                const parsed = new URL(rpcUrl);
                const h = parsed.hostname;
                if (h === "127.0.0.1" || h === "0.0.0.0" || h === "localhost") isLocal = true;
              } catch {
                isLocal =
                  rpcUrl.includes("localhost") ||
                  rpcUrl.includes("127.0.0.1") ||
                  rpcUrl.includes("0.0.0.0");
              }
              return isLocal;
            })() && (
              <SidebarItem
                to="/anvil"
                icon={<TerminalSquare size={16} />}
                label="Wanvil Control"
                active={location.pathname === "/anvil"}
              />
            )}
        </nav>

        <div className="mt-auto px-2 pt-4 border-t border-border mt-4">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Settings
          </div>

          <div className="mb-3">
            <label className="text-[10px] font-medium text-muted-foreground uppercase mb-1 flex items-center justify-between">
              <span>RPC URL</span>
              <button
                type="button"
                onClick={openRpcModal}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                title="Edit RPC URL"
              >
                <Edit2 size={12} />
              </button>
            </label>
            <div
              className="w-full bg-muted border border-border rounded-md text-xs font-mono px-2.5 py-1.5 truncate text-foreground/80 cursor-default"
              title={rpcUrl}
            >
              {rpcUrl}
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={stopAnvil}
            disabled={!socketConnected}
            className="w-full flex items-center justify-center gap-2 py-2 text-[13px] h-auto"
          >
            <StopCircle size={13} /> Stop Wanvil Node
          </Button>
        </div>
      </aside>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change RPC URL</DialogTitle>
            <DialogDescription>
              If changing from a local node managed by this app, it will stop the current local node
              before switching.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            className="font-mono text-sm shadow-none mt-4"
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="http://127.0.0.1:8545"
          />
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={cancelRpcEdit}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmRpcEdit}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SidebarItem({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-muted text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
