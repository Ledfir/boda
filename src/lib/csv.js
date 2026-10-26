/** Exportación sencilla a CSV (compatible con Excel). */

function escapeValue(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename, columns, rows) {
  const header = columns.map((column) => escapeValue(column.label)).join(',');
  const body = rows
    .map((row) => columns.map((column) => escapeValue(row[column.key])).join(','))
    .join('\n');
  const csv = `\uFEFF${[header, body].join('\n')}`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}