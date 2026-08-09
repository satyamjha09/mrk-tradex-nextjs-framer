const ACRONYMS = new Set(["DOL", "HP", "MCB", "MRP", "OLP", "SKU", "WLC"]);

function titleWord(word: string) {
  const upper = word.toUpperCase();
  if (ACRONYMS.has(upper)) return upper;
  return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
}

export function formatMrkSpecValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;

  const text = String(value).trim();
  if (!text) return null;
  if (ACRONYMS.has(text.toUpperCase())) return text.toUpperCase();

  if (text.includes("_")) {
    return text.split("_").filter(Boolean).map(titleWord).join(" ");
  }

  if (/^[A-Z][A-Z\s/-]+$/.test(text) && !/\d/.test(text)) {
    return text
      .split(/(\s+|\/|-)/)
      .map((part) => {
        if (/^\s+$|^\/$|^-$/.test(part)) return part;
        return titleWord(part);
      })
      .join("");
  }

  return text;
}
