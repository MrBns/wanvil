import { formatDistanceToNow } from "date-fns";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Block } from "viem";
import { useRpc } from "@/lib/rpcContext";

export default function BlocksPage() {
  const { publicClient } = useRpc();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchBlocks = async () => {
      try {
        const latest = await publicClient.getBlockNumber();
        const blks: Block[] = [];
        for (let i = 0n; i < 50n; i++) {
          if (latest - i >= 0n) {
            blks.push(
              await publicClient.getBlock({
                blockNumber: latest - i,
                includeTransactions: true,
              })
            );
          }
        }
        if (mounted) {
          setBlocks(blks);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };
    void fetchBlocks();
    return () => {
      mounted = false;
    };
  }, [publicClient]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Box className="w-6 h-6 text-foreground" />
          Latest Blocks
        </h1>
        <p className="text-sm text-muted-foreground">Recent network activity across blocks.</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-muted-foreground text-sm flex items-center justify-center">
            Loading blocks...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                <tr>
                  <th className="px-5 py-3 font-medium">Block</th>
                  <th className="px-5 py-3 font-medium">Age</th>
                  <th className="px-5 py-3 font-medium">Txn</th>
                  <th className="px-5 py-3 font-medium">Gas Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blocks.map((b) => (
                  <tr key={b.hash} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs">
                      <Link
                        to={`/block/${Number(b.number)}`}
                        className="text-foreground hover:underline"
                      >
                        {Number(b.number)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">
                      {formatDistanceToNow(Number(b.timestamp) * 1000)} ago
                    </td>
                    <td className="px-5 py-3 text-xs text-foreground font-mono">
                      {b.transactions.length}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs font-mono">
                      {Number(b.gasUsed).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blocks.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No blocks found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
