export interface CompactLogLine {
  text: string;
  count: number;
}

const MAX_COMPACT_LOOKBACK = 80;

function isCompactibleRpcLog(text: string): boolean {
  const value = text.trim();
  return value.length > 0 && value.length <= 64 && /^(eth|anvil|net|web3)_[A-Za-z0-9]+$/.test(value);
}

export function appendCompactLog(
  prev: CompactLogLine[],
  text: string,
  maxLines: number,
): CompactLogLine[] {
  const value = text.trim();
  if (!value) {
    return prev;
  }

  const updated = [...prev];
  const last = updated[updated.length - 1];

  if (last && last.text === value) {
    updated[updated.length - 1] = {
      ...last,
      count: last.count + 1,
    };
    return updated;
  }

  if (isCompactibleRpcLog(value)) {
    const start = Math.max(0, updated.length - MAX_COMPACT_LOOKBACK);
    for (let i = updated.length - 1; i >= start; i--) {
      if (updated[i]?.text === value) {
        updated[i] = {
          ...updated[i],
          count: updated[i].count + 1,
        };
        return updated;
      }
    }
  }

  updated.push({ text: value, count: 1 });
  if (updated.length > maxLines) {
    updated.shift();
  }
  return updated;
}
