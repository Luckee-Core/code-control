/** Compact field chrome for the inline example/source forms. */
export const inputStyles = {
  field: `flex flex-col gap-1`,
  label: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  input: `
    w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  textarea: `
    w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white min-h-[64px]
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  code: `font-mono min-h-[140px]`,
  select: `
    w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white cursor-pointer
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
} as const;
