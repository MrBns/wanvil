import { ArrowLeft, ArrowRightLeft, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatEther, formatGwei, type Transaction, type TransactionReceipt } from "viem";
import { useRpc } from "@/lib/rpcContext";

export default function TxDetailPage() {
  const { publicClient } = useRpc();
  const { hash: txHash } = useParams<{ hash: string }>();

  const [tx, setTx] = useState<Transaction | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTx = async () => {
      if (!txHash) return;
      try {
        const hash = txHash as `0x${string}`;
        const [t, r] = await Promise.all([
          publicClient.getTransaction({ hash }),
          publicClient.getTransactionReceipt({ hash }).catch(() => null),
        ]);
        if (mounted) {
          setTx(t);
          setReceipt(r);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setLoading(false);
      }
    };
    void fetchTx();
    return () => {
      mounted = false;
    };
  }, [txHash, publicClient]);

  if (loading)
    return (
      <div className="p-8 text-muted-foreground text-sm flex items-center justify-center">
        Loading transaction...
      </div>
    );
  if (!tx)
    return (
      <div className="p-8 text-destructive text-sm flex items-center justify-center">
        Transaction not found.
      </div>
    );

  const isSuccess = receipt?.status === "success";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/tx"
          className="p-2 border border-border bg-card hover:bg-muted/50 rounded-md transition-colors hidden sm:flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-foreground" />
            Transaction Details
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-xs break-all">{tx.hash}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <h2 className="font-semibold text-sm">Overview</h2>
          {receipt && (
            <div
              className={`px-2 py-1 rounded-[4px] border text-[11px] font-medium flex items-center gap-1.5 ${
                isSuccess
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {isSuccess ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {isSuccess ? "Success" : "Failed"}
            </div>
          )}
        </div>
        <div className="p-0 divide-y divide-border">
          <DetailRow
            label="Block"
            value={String(tx.blockNumber)}
            link={`/block/${tx.blockNumber}`}
          />
          <DetailRow label="From" value={tx.from} link={`/address/${tx.from}`} />
          <DetailRow
            label="To"
            value={tx.to || "Contract Creation"}
            link={tx.to ? `/address/${tx.to}` : undefined}
          />
          {receipt && tx.to === null && receipt.contractAddress && (
            <DetailRow
              label="Contract Created"
              value={receipt.contractAddress}
              link={`/address/${receipt.contractAddress}`}
            />
          )}
          <DetailRow label="Value" value={`${formatEther(tx.value)} ETH`} />
          <DetailRow
            label="Transaction Fee"
            value={
              receipt
                ? `${formatEther(receipt.gasUsed * (receipt.effectiveGasPrice || tx.gasPrice || 0n))} ETH`
                : "Pending..."
            }
          />
          <DetailRow
            label="Gas Price"
            value={tx.gasPrice ? `${formatGwei(tx.gasPrice)} Gwei` : "N/A"}
          />
          <DetailRow label="Gas Limit" value={Number(tx.gas).toLocaleString()} />
          <DetailRow
            label="Gas Used"
            value={receipt ? Number(receipt.gasUsed).toLocaleString() : "Pending..."}
          />
          {tx.input && tx.input !== "0x" && (
            <div className="flex flex-col sm:flex-row sm:items-start py-4 px-5 hover:bg-muted/10 transition-colors">
              <div className="w-1/3 min-w-[150px] text-[13px] font-medium text-muted-foreground pt-1">
                Input Data
              </div>
              <div className="flex-1 mt-2 sm:mt-0">
                <textarea
                  readOnly
                  value={tx.input}
                  className="w-full h-32 p-3 text-xs font-mono bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring resize-none select-all"
                />
              </div>
            </div>
          )}
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
      <div className="font-mono text-[13px] break-all text-foreground mt-1 sm:mt-0 flex-1">
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
