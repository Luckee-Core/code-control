/** Table chrome shared by the vocabulary sections. */
export const vocabularyTableStyles = {
  body: `overflow-x-auto`,
  table: `w-full border-collapse text-xs`,
  th: `
    px-3 py-2 text-left bg-gray-100 border-b border-gray-300
    text-[10px] font-semibold uppercase tracking-wide text-gray-600
  `,
  row: `align-top`,
  cell: `px-3 py-2 border-b border-gray-200 text-gray-900`,
  cellMuted: `px-3 py-2 border-b border-gray-200 text-gray-600`,
  mono: `font-mono text-[11px]`,
} as const;
