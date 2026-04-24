import { ArrowLeft, ArrowRightLeft, FileCode2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatEther, type Transaction, toHex } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { useRpc } from "@/lib/rpcContext";

const DEFAULT_MNEMONIC = "test test test test test test test test test test test junk";

export default function AddressDetailPage() {
  const { publicClient } = useRpc();
  const { address: addressHash } = useParams<{ address: string }>();

  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [txCount, setTxCount] = useState<number>(0);
  const [code, setCode] = useState<string | undefined>(undefined);
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);
  const [recentTxs, setRecentTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAddress = async () => {
      if (!addressHash) return;
      try {
        const addrType = addressHash as `0x${string}`;
        const [bal, count, bytecode] = await Promise.all([
          publicClient.getBalance({ address: addrType }),
          publicClient.getTransactionCount({ address: addrType }),
          publicClient.getBytecode({ address: addrType }),
        ]);

        const latest = await publicClient.getBlockNumber();
        let collectedTxs: Transaction[] = [];
        for (let i = 0n; i < 200n; i++) {
          if (latest - i >= 0n) {
            const b = await publicClient.getBlock({
              blockNumber: latest - i,
              includeTransactions: true,
            });
            const related = (b.transactions as unknown as Transaction[]).filter(
              (tx) =>
                tx.from.toLowerCase() === addrType.toLowerCase() ||
                tx.to?.toLowerCase() === addrType.toLowerCase()
            );
            collectedTxs = [...collectedTxs, ...related];
            if (collectedTxs.length >= 25) break;
          }
        }

        let derivedKey: string | undefined;
        try {
          for (let i = 0; i < 20; i++) {
            const acc = mnemonicToAccount(DEFAULT_MNEMONIC, { accountIndex: i });
            if (acc.address.toLowerCase() === addrType.toLowerCase()) {
              derivedKey = acc.getHdKey().privateKey
                ? toHex(acc.getHdKey().privateKey!)
                : undefined;
              break;
            }
          }
        } catch {
          /* ignore */
        }

        if (mounted) {
          setBalance(bal);
          setTxCount(count);
          setCode(bytecode);
          setPrivateKey(derivedKey);
          setRecentTxs(collectedTxs.slice(0, 25));
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setLoading(false);
      }
    };
    void fetchAddress();
    return () => {
      mounted = false;
    };
  }, [addressHash, publicClient]);

  if (loading)
    return (
      <div className="p-8 text-muted-foreground text-sm flex items-center justify-center">
        Loading address details...
      </div>
    );

  const isContract = code && code !== "0x";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/address"
          className="p-2 border border-border bg-card hover:bg-muted/50 rounded-md transition-colors hidden sm:flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            {isContract ? (
              <FileCode2 className="w-5 h-5 text-foreground" />
            ) : (
              <Wallet className="w-5 h-5 text-foreground" />
            )}
            {isContract ? "Contract" : "Address"}
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-xs break-all">{addressHash}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <h2 className="font-semibold text-sm">Overview</h2>
        </div>
        <div className="p-0 divide-y divide-border">
          <DetailRow label="Balance" value={`${formatEther(balance)} ETH`} />
          <DetailRow label="Nonce (Tx Count)" value={txCount.toLocaleString()} />
          {privateKey && <DetailRow label="Private Key" value={privateKey} />}
        </div>
      </div>

      {isContract && (
        <div className="bg-card border border-border rounded-lg overflow-hidden mt-6">
          <div className="p-4 border-b border-border bg-muted/20">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <FileCode2 size={16} className="text-muted-foreground" /> Bytecode
            </h2>
          </div>
          <div className="p-4">
            <textarea
              readOnly
              value={code}
              className="w-full h-48 p-3 text-xs font-mono bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring resize-none select-all"
            />
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-muted/20">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-muted-foreground" /> Recent Transactions
          </h2>
          <p className="text-[11px] text-muted-foreground font-medium mt-1">
            Scanned last 200 blocks.
          </p>
        </div>
        <div className="overflow-x-auto">
          {recentTxs.length > 0 ? (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                <tr>
                  <th className="px-5 py-3 font-medium">Txn Hash</th>
                  <th className="px-5 py-3 font-medium">Block</th>
                  <th className="px-5 py-3 font-medium">Direction</th>
                  <th className="px-5 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTxs.map((tx) => {
                  const isOut = tx.from.toLowerCase() === (addressHash as string).toLowerCase();
                  return (
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
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                            isOut
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                          }`}
                        >
                          {isOut ? "OUT" : "IN"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground font-mono">
                        {formatEther(tx.value || BigInt(0))} ETH
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm flex items-center justify-center">
              No transactions found in recent blocks for this address.
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
