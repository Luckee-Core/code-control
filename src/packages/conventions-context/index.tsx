'use client';

import { useEffect, useState } from 'react';
import { getConventionsContext } from '@/api/conventions';
import type { ConventionsContext as ConventionsContextResult } from '@/api/conventions/types';
import { detailPageStyles } from '@/components/detail-page-styles';
import { CONVENTIONS_PATH } from '@/config/routes';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { getConventionsThunk } from '@/store/thunks/conventions';

/**
 * Previews exactly what the AI receives for a domain + repo role (active conventions only).
 * The result is page-local; it is read-only output, not app state.
 */
export const ConventionsContext = () => {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((state) => state.conventionsCatalog);
  const [domainKey, setDomainKey] = useState('data_model');
  const [roleKey, setRoleKey] = useState('storage');
  const [result, setResult] = useState<ConventionsContextResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useBreadcrumbs([{ label: 'Conventions', href: CONVENTIONS_PATH }, { label: 'AI context' }]);

  useEffect(() => {
    if (catalog.topics.length === 0) void dispatch(getConventionsThunk());
  }, [dispatch, catalog.topics.length]);

  const handleLoad = async () => {
    setIsLoading(true);
    setCopied(false);
    const response = await getConventionsContext(domainKey, roleKey || null);
    setIsLoading(false);
    if (!response.success || !response.data) {
      setError(response.error ?? 'Could not build the context');
      setResult(null);
      return;
    }
    setError(null);
    setResult(response.data);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
  };

  return (
    <div className={detailPageStyles.page}>
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelHeader}>
          <div>
            <h2 className={detailPageStyles.panelTitle}>AI context preview</h2>
            <p className={detailPageStyles.panelSubtitle}>
              The exact conventions text sent to the AI. Only active conventions are included.
            </p>
          </div>
        </div>
        <div className={`${detailPageStyles.panelBody} ${styles.controls}`}>
          <select value={domainKey} onChange={(event) => setDomainKey(event.target.value)} className={styles.select}>
            {catalog.domains.map((domain) => (
              <option key={domain.key} value={domain.key}>
                {domain.name}
              </option>
            ))}
          </select>
          <select value={roleKey} onChange={(event) => setRoleKey(event.target.value)} className={styles.select}>
            <option value="">All repo roles</option>
            {catalog.repo_roles.map((role) => (
              <option key={role.key} value={role.key}>
                {role.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void handleLoad()}
            disabled={isLoading}
            className={detailPageStyles.primaryButton}
          >
            {isLoading ? 'Building…' : 'Build context'}
          </button>
          {result ? (
            <>
              <span className={styles.meta}>
                {result.convention_count} conventions · {result.text.length.toLocaleString()} chars · hash{' '}
                {result.hash.slice(0, 12)}
              </span>
              <button type="button" onClick={() => void handleCopy()} className={detailPageStyles.secondaryButton}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </>
          ) : null}
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        {result ? <pre className={styles.output}>{result.text}</pre> : null}
      </section>
    </div>
  );
};

const styles = {
  controls: `flex flex-wrap items-center gap-2`,
  select: `
    h-7 px-2 text-xs text-gray-900 bg-white border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer
  `,
  meta: `text-xs text-gray-600 tabular-nums`,
  error: `mx-4 mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
  output: `
    mx-4 mb-4 max-h-[70vh] overflow-auto text-[11px] font-mono whitespace-pre-wrap
    bg-gray-50 border border-gray-200 rounded p-4 text-gray-800
  `,
};
