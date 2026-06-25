'use client';

import { useState } from 'react';
import { buildGitCloneCommand } from '@/utils/repos/build-git-clone-command';

type CopyGitCloneButtonProps = {
  cloneUrl: string | null;
  repoUrl?: string | null;
  showCommand?: boolean;
};

/**
 * Copy a `git clone …` command to the clipboard.
 */
export const CopyGitCloneButton = ({
  cloneUrl,
  repoUrl,
  showCommand = false,
}: CopyGitCloneButtonProps) => {
  const [copied, setCopied] = useState(false);
  const command = buildGitCloneCommand({ clone_url: cloneUrl, repo_url: repoUrl });

  if (!command) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy git clone command:', error);
      alert('Failed to copy to clipboard. Please try selecting and copying manually.');
    }
  };

  return (
    <div className={showCommand ? styles.wrapperExpanded : styles.wrapper}>
      {showCommand ? (
        <code className={styles.command} title={command}>
          {command}
        </code>
      ) : null}
      <button type="button" onClick={handleCopy} className={styles.button} title={command}>
        {copied ? 'Copied!' : 'Copy clone'}
      </button>
    </div>
  );
};

const styles = {
  wrapper: `
    flex flex-col items-end gap-1 min-w-0
  `,
  wrapperExpanded: `
    flex flex-col items-start gap-2 min-w-0 w-full
  `,
  command: `
    w-full break-all text-xs font-mono text-gray-800 bg-gray-100 px-2 py-1.5 rounded
  `,
  button: `
    shrink-0 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700
    hover:bg-gray-50 transition-colors cursor-pointer
  `,
};
