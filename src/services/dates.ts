// src/services/dates.ts
export function parseDeadlineToDate(deadline?: string): Date | null {
  if (!deadline) return null;
  const cleaned = deadline.replace(/\s*\(.*?\)\s*$/, "").trim();

  const direct = Date.parse(cleaned);
  if (!Number.isNaN(direct)) return new Date(direct);

  const noDow = cleaned.replace(/^[A-Za-z]{3},\s*/, "");
  const parsedNoDow = Date.parse(noDow);
  if (!Number.isNaN(parsedNoDow)) return new Date(parsedNoDow);

  return null;
}

export function isExpired(deadline?: string, now: Date = new Date()): boolean {
  const d = parseDeadlineToDate(deadline);
  return d ? d.getTime() < now.getTime() : false;
}
