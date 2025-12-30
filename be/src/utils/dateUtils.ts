export function todayISO(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function isDateBefore(a: string, b: string): boolean {
  return new Date(a) < new Date(b);
}

export function isDateAfter(a: string, b: string): boolean {
  return new Date(a) > new Date(b);
}
