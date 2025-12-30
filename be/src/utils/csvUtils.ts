export interface CsvRow {
  [key: string]: string | number;
}

export function buildCsv(headers: string[], rows: CsvRow[]): string {
  let csv = headers.join(",") + "\n";

  for (const row of rows) {
    const line = headers
      .map((h) => {
        const value = row[h] ?? "";
        const str = String(value).replace(/"/g, '""');
        // quote text, leave numbers as-is
        return typeof value === "number" ? String(value) : `"${str}"`;
      })
      .join(",");
    csv += line + "\n";
  }

  return csv;
}
