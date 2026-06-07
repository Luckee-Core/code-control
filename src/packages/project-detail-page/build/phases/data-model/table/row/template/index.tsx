'use client';

import type { DataEntityWithFields } from '@/model';

type TemplateTabProps = {
  entity: DataEntityWithFields;
  filePath: string;
};

export const TemplateTab = ({ entity, filePath }: TemplateTabProps) => {
  const fields = entity.fields ?? [];
  
  const mapTypeToTypeScript = (type: string): string => {
    const typeMap: Record<string, string> = {
      string: 'string', text: 'string', number: 'number', integer: 'number',
      bigint: 'number', float: 'number', decimal: 'number', numeric: 'number',
      boolean: 'boolean', date: 'string', datetime: 'string', timestamp: 'string',
      uuid: 'string', json: 'Record<string, unknown>', jsonb: 'Record<string, unknown>',
      email: 'string', url: 'string', phone: 'string',
    };
    return typeMap[type.toLowerCase().trim()] || 'string';
  };

  const fieldLines = [...fields]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((field) => {
      const tsType = mapTypeToTypeScript(field.type);
      const nullable = field.nullable ? ' | null' : '';
      return `  ${field.name}: ${tsType}${nullable};`;
    })
    .join('\n');

  const promptTemplate = `# Task
Create a TypeScript model file at ${filePath} for the ${entity.name} entity.

# Entity Definition
- **Name:** ${entity.name}
- **Table:** ${entity.table_name || entity.name.toLowerCase()}
- **Description:** ${entity.description || 'No description provided'}

# Type Structure
Generate a clean TypeScript type definition:

\`\`\`typescript
export type ${entity.name} = {
${fieldLines}
};
\`\`\`

# Requirements
- Export a type named ${entity.name}
- Use proper TypeScript types (string, number, boolean, Date)
- Add \` | null\` for nullable fields
- Simple type definition only (no Omit/Partial/Pick utilities)
- No additional helper types or functions
- Follow TypeScript best practices

# Important
- This is a pure type definition file
- Keep it simple and clean
- The type name should be ${entity.name} exactly as shown`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>Prompt Template</h4>
      </div>
      <pre className={styles.content}>{promptTemplate}</pre>
      <div className={styles.infoNote}>
        <span className={styles.noteIcon}>ℹ️</span>
        <span className={styles.noteText}>
          This prompt will be sent to Cursor AI to generate the TypeScript model file at <code className={styles.inlineCode}>{filePath}</code>
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: `
    space-y-3
  `,
  header: `
    flex items-center justify-between
  `,
  title: `
    text-sm font-semibold text-foreground
  `,
  content: `
    text-xs font-mono bg-background border border-border rounded-md p-4 
    overflow-x-auto whitespace-pre-wrap text-foreground leading-relaxed
  `,
  infoNote: `
    flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 border border-blue-200 
    rounded-md p-3
  `,
  noteIcon: `
    text-base shrink-0
  `,
  noteText: `
    leading-relaxed
  `,
  inlineCode: `
    bg-muted px-1 py-0.5 rounded text-foreground font-mono
  `,
};
