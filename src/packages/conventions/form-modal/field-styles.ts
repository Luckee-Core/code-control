/** Shared field chrome for the convention form inputs. */
export const fieldStyles = {
  field: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-700`,
  hint: `text-[11px] text-gray-500`,
  input: `
    w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500
  `,
  textarea: `
    w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 min-h-[84px]
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  mono: `font-mono text-xs`,
  select: `
    w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
} as const;
