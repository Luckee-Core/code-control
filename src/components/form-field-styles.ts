/**
 * Shared label / input / select / textarea chrome for forms and editable panels.
 */
export const formFieldStyles = {
  field: `
    flex flex-col gap-1
  `,
  label: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  input: `
    h-8 px-2 text-xs border border-gray-300 rounded bg-white text-gray-900
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
  `,
  select: `
    h-8 px-2 text-xs border border-gray-300 rounded bg-white text-gray-900
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  textarea: `
    px-2 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-900 min-h-20
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
  `,
  codeTextarea: `
    px-2 py-1.5 text-xs font-mono border border-gray-300 rounded bg-white text-gray-900 min-h-28
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
  `,
  row: `
    grid grid-cols-1 sm:grid-cols-2 gap-3
  `,
  error: `
    text-xs text-red-600
  `,
};
