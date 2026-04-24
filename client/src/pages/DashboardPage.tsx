import { formatDistanceToNow } from "date-fns";
import { Activity, ArrowRightLeft, Box, Cpu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Block, Transaction } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBlockchainService } from "@/services/blockchain.service";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { getLatestBlocks, watchBlocks } = useBlockchainService();

  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTxs, setLatestTxs] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getLatestBlocks(5);
        setBlockNumber(data.blockNumber);
        setLatestBlocks(data.blocks);
        setLatestTxs(data.txs);
      } catch (_err) {
        // Handled in service
      }
    };

    void fetchInitialData();

    const unwatch = watchBlocks(() => {
      void fetchInitialData();
    });

    return () => unwatch();
  }, [getLatestBlocks, watchBlocks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    if (searchQuery.length === 66) {
      navigate(`/tx/${searchQuery}`);
    } else if (searchQuery.startsWith("0x")) {
      navigate(`/address/${searchQuery}`);
    } else if (!Number.isNaN(Number(searchQuery))) {
      navigate(`/block/${searchQuery}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Explorer Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Real-time view of your local Wanvil blockchain state
        </p>
      </header>

      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
          size={18}
        />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Address / Txn Hash / Block"
          className="w-full py-5 pl-10 pr-4 font-mono shadow-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 z-10">
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded border border-border text-[10px] uppercase font-semibold text-muted-foreground">
            Ctrl K
          </kbd>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Box className="text-foreground" />}
          title="Last Block"
          value={blockNumber !== null ? Number(blockNumber).toLocaleString() : "---"}
        />
        <StatCard
          icon={<Activity className="text-foreground" />}
          title="Transactions"
          value={latestTxs.length.toString()}
          subtitle="In view"
        />
        <StatCard
          icon={<Cpu className="text-foreground" />}
          title="Network"
          value="localhost:8545"
          subtitle="Chain ID: 31337"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest Blocks */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Box size={16} className="text-muted-foreground" />
              Latest Blocks
            </CardTitle>
            <Link
              to="/blocks"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
            </Link>
          </CardHeader>
          <div className="flex-1 overflow-auto">
            {latestBlocks.map((block) => (
              <div
                key={block.hash ?? String(block.number)}
                className="p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded text-muted-foreground border border-border">
                    <Box size={16} />
                  </div>
                  <div>
                    <Link
                      to={`/block/${Number(block.number)}`}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {Number(block.number)}
                    </Link>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(Number(block.timestamp) * 1000, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-muted-foreground">
                    {block.transactions.length} txns
                  </div>
                </div>
              </div>
            ))}
            {latestBlocks.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No blocks found</div>
            )}
          </div>
        </Card>

        {/* Latest Transactions */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowRightLeft size={16} className="text-muted-foreground" />
              Latest Transactions
            </CardTitle>
            <Link
              to="/tx"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
            </Link>
          </CardHeader>
          <div className="flex-1 overflow-auto">
            {latestTxs.slice(0, 5).map((tx) => (
              <div
                key={tx.hash}
                className="p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-1.5 rounded text-muted-foreground border border-border">
                    <ArrowRightLeft size={14} />
                  </div>
                  <Link
                    to={`/tx/${tx.hash}`}
                    className="font-mono text-xs text-foreground hover:underline truncate max-w-[140px]"
                  >
                    {tx.hash.slice(0, 16)}...
                  </Link>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span>From</span>
                  <Link
                    to={`/address/${tx.from}`}
                    className="font-mono text-foreground hover:underline truncate max-w-[90px]"
                  >
                    {tx.from}
                  </Link>
                  <span>→</span>
                  <span>To</span>
                  {tx.to ? (
                    <Link
                      to={`/address/${tx.to}`}
                      className="font-mono text-foreground hover:underline truncate max-w-[90px]"
                    >
                      {tx.to}
                    </Link>
                  ) : (
                    <span className="font-mono text-muted-foreground">Contract Creation</span>
                  )}
                </div>
              </div>
            ))}
            {latestTxs.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No transactions found
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | React.ReactNode;
  subtitle?: string;
}) {
  return (
    <Card className="rounded-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 bg-muted border border-border rounded-md text-foreground">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {title}
          </p>
          <h3 className="text-xl font-bold tracking-tight text-foreground">{value}</h3>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
