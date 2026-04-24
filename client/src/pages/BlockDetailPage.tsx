import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Box } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { type Block, formatGwei } from "viem";
import { useRpc } from "@/lib/rpcContext";

export default function BlockDetailPage() {
  const { publicClient } = useRpc();
  const { id: idStr } = useParams<{ id: string }>();

  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idStr) return;
    let mounted = true;
    const isHash = idStr.startsWith("0x");
    const blockParam = isHash
      ? { blockHash: idStr as `0x${string}` }
      : { blockNumber: BigInt(idStr) };

    const fetchBlock = async () => {
      try {
        const b = await publicClient.getBlock({ ...blockParam, includeTransactions: true });
        if (mounted) {
          setBlock(b);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setLoading(false);
      }
    };
    void fetchBlock();
    return () => {
      mounted = false;
    };
  }, [idStr, publicClient]);

  if (loading)
    return (
      <div className="p-8 text-muted-foreground text-sm flex items-center justify-center">
        Loading block...
      </div>
    );
  if (!block)
    return (
      <div className="p-8 text-destructive text-sm flex items-center justify-center">
        Block not found.
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/blocks"
          className="p-2 border border-border bg-card hover:bg-muted/50 rounded-md transition-colors hidden sm:flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Box className="w-5 h-5 text-foreground" />
            Block{" "}
            <span className="text-muted-foreground font-mono text-xl">#{Number(block.number)}</span>
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-xs break-all">{block.hash}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <h2 className="font-semibold text-sm">Overview</h2>
        </div>
        <div className="p-0 divide-y divide-border">
          <DetailRow label="Block Height" value={String(Number(block.number))} />
          <DetailRow
            label="Timestamp"
            value={`${new Date(Number(block.timestamp) * 1000).toLocaleString()} (${formatDistanceToNow(Number(block.timestamp) * 1000, { addSuffix: true })})`}
          />
          <DetailRow label="Transactions" value={`${block.transactions.length} transactions`} />
          <DetailRow label="Mined By" value={block.miner} />
          <DetailRow
            label="Base Fee"
            value={block.baseFeePerGas ? `${formatGwei(block.baseFeePerGas)} Gwei` : "N/A"}
          />
          <DetailRow
            label="Gas Used"
            value={`${Number(block.gasUsed).toLocaleString()} (${((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(2)}%)`}
          />
          <DetailRow label="Gas Limit" value={Number(block.gasLimit).toLocaleString()} />
          <DetailRow label="Hash" value={block.hash ?? ""} />
          <DetailRow
            label="Parent Hash"
            value={block.parentHash}
            link={`/block/${block.parentHash}`}
          />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, link }: { label: string; value: string; link?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3.5 px-5 hover:bg-muted/10 transition-colors">
      <div className="w-1/3 min-w-[150px] text-[13px] font-medium text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-[13px] break-all text-foreground mt-1 sm:mt-0 flex items-center gap-2 flex-1">
        {link ? (
          <Link to={link} className="text-foreground hover:underline truncate">
            {value}
          </Link>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
