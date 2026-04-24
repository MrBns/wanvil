import { useCallback } from "react";
import type { Block, Transaction } from "viem";
import { useRpc } from "@/lib/rpcContext";

export function useBlockchainService() {
  const { publicClient } = useRpc();

  const getLatestBlocks = useCallback(
    async (count = 5): Promise<{ blockNumber: bigint; blocks: Block[]; txs: Transaction[] }> => {
      try {
        const blockNumber = await publicClient.getBlockNumber();
        const blocks: Block[] = [];
        for (let i = 0n; i < BigInt(count); i++) {
          if (blockNumber - i >= 0n) {
            const b = await publicClient.getBlock({
              blockNumber: blockNumber - i,
              includeTransactions: true,
            });
            blocks.push(b);
          }
        }

        const txs = blocks.flatMap((b) => b.transactions as unknown as Transaction[]).slice(0, 10);
        return { blockNumber, blocks, txs };
      } catch (err) {
        console.error("Failed to connect to Anvil node", err);
        throw err;
      }
    },
    [publicClient]
  );

  const watchBlocks = useCallback(
    (onUpdate: () => void) => {
      return publicClient.watchBlockNumber({
        onBlockNumber: onUpdate,
      });
    },
    [publicClient]
  );

  return {
    publicClient,
    getLatestBlocks,
    watchBlocks,
  };
}
