import { ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatEther, type Transaction } from "viem";
import { useRpc } from "@/lib/rpcContext";

export default function TxListPage() {
  const { publicClient } = useRpc();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTxs = async () => {
      try {
        const latest = await publicClient.getBlockNumber();
        let collectedTxs: Transaction[] = [];

        for (let i = 0n; i < 100n; i++) {
          if (latest - i >= 0n) {
            const b = await publicClient.getBlock({
              blockNumber: latest - i,
              includeTransactions: true,
            });
            collectedTxs = [...collectedTxs, ...(b.transactions as unknown as Transaction[])];
            if (collectedTxs.length >= 50) break;
          }
        }
        if (mounted) {
          setTxs(collectedTxs.slice(0, 50));
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };
    void fetchTxs();
    return () => {
      mounted = false;
    };
  }, [publicClient]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-foreground" />
          Latest Transactions
        </h1>
        <p className="text-sm text-muted-foreground">Recent transactions across the network.</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-muted-foreground text-sm flex items-center justify-center">
            Loading transactions...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                <tr>
                  <th className="px-5 py-3 font-medium">Txn Hash</th>
                  <th className="px-5 py-3 font-medium">Block</th>
                  <th className="px-5 py-3 font-medium">From</th>
                  <th className="px-5 py-3 font-medium">To</th>
                  <th className="px-5 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {txs.map((tx) => (
                  <tr key={tx.hash} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs">
                      <Link
                        to={`/tx/${tx.hash}`}
                        className="text-foreground hover:underline truncate inline-block max-w-[140px] align-middle"
                      >
                        {tx.hash}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      <Link
                        to={`/block/${Number(tx.blockNumber)}`}
                        className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                      >
                        {Number(tx.blockNumber)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground truncate max-w-[150px]">
                      <Link
                        to={`/address/${tx.from}`}
                        className="hover:text-foreground hover:underline transition-colors"
                      >
                        {tx.from}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground truncate max-w-[150px]">
                      {tx.to ? (
                        <Link
                          to={`/address/${tx.to}`}
                          className="hover:text-foreground hover:underline transition-colors"
                        >
                          {tx.to}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground/60 italic">Contract Creation</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground font-mono">
                      {formatEther(tx.value || 0n)} ETH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {txs.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No transactions found recently
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
