import { KeyRound, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatEther, toHex } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { useRpc } from "@/lib/rpcContext";

interface AddressInfo {
  address: string;
  balance: bigint;
  txCount: number;
  privateKey?: string;
}

const DEFAULT_MNEMONIC = "test test test test test test test test test test test junk";

export default function AddressListPage() {
  const { rpcUrl, publicClient } = useRpc();
  const [accounts, setAccounts] = useState<AddressInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAccounts = async () => {
      try {
        const res = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", method: "eth_accounts", params: [], id: 1 }),
        });
        const data = await res.json();
        const addresses = (data.result || []) as `0x${string}`[];

        const knownKeys: Record<string, string> = {};
        for (let i = 0; i < 20; i++) {
          const acc = mnemonicToAccount(DEFAULT_MNEMONIC, { accountIndex: i });
          knownKeys[acc.address.toLowerCase()] = acc.getHdKey().privateKey
            ? toHex(acc.getHdKey().privateKey!)
            : "";
        }

        const accountsData = await Promise.all(
          addresses.map(async (address: `0x${string}`) => {
            const [balance, txCount] = await Promise.all([
              publicClient.getBalance({ address }),
              publicClient.getTransactionCount({ address }),
            ]);
            return {
              address,
              balance,
              txCount,
              privateKey: knownKeys[address.toLowerCase()],
            };
          })
        );
        if (mounted) {
          setAccounts(accountsData);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };
    void fetchAccounts();
    return () => {
      mounted = false;
    };
  }, [rpcUrl, publicClient]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-foreground" />
          Local Accounts
        </h1>
        <p className="text-sm text-muted-foreground">
          Addresses currently managed by the Anvil node.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-muted-foreground text-sm flex items-center justify-center">
            Loading accounts...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                <tr>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 font-medium">Private Key</th>
                  <th className="px-5 py-3 font-medium">Balance</th>
                  <th className="px-5 py-3 font-medium">Txn Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {accounts.map((acc, i) => (
                  <tr key={acc.address} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-mono flex items-center gap-2">
                      <span className="text-[10px] bg-background border border-border text-muted-foreground px-1.5 py-0.5 rounded font-semibold">
                        {i}
                      </span>
                      <Link
                        to={`/address/${acc.address}`}
                        className="text-foreground text-xs hover:underline truncate"
                      >
                        {acc.address}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {acc.privateKey ? (
                        <div className="flex items-center gap-2 truncate max-w-[200px]">
                          <KeyRound size={12} className="text-muted-foreground shrink-0" />
                          {acc.privateKey}
                        </div>
                      ) : (
                        "Unknown"
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-foreground font-mono">
                      {formatEther(acc.balance || BigInt(0))} ETH
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground font-mono">
                      {acc.txCount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {accounts.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No unlocked accounts found on this RPC.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
