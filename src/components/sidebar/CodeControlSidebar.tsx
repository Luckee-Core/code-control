'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppSelector } from '@/store';
import { BrandLogo } from '@/components/brand-logo';
import { CUSTOMERS_PATH, CUSTOMER_DETAIL_PAGE_PATH, DASHBOARD_PATH, PROJECTS_PATH, PROJECT_DETAIL_PAGE_PATH } from '@/config/routes';
import { getNavigationLinks } from '@/utils/navigation';
import type { NavigationLink } from '@/utils/navigation';

export const CodeControlSidebar = () => {
  const pathname = usePathname();
  const layoutBuilder = useAppSelector((state) => state.layoutBuilder);
  const isSidebarOpen = layoutBuilder.isSidebarOpen;
  const navigationLinks = useMemo(() => getNavigationLinks(), []);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => new Set(navigationLinks.filter((l) => l.children?.length).map((l) => l.name)),
  );

  const isLinkActive = useCallback(
    (href: string): boolean => {
      if (href === DASHBOARD_PATH) return pathname === DASHBOARD_PATH;
      if (href === CUSTOMERS_PATH) {
        return pathname === CUSTOMERS_PATH || pathname === CUSTOMER_DETAIL_PAGE_PATH;
      }
      if (href === PROJECTS_PATH) {
        return pathname === PROJECTS_PATH || pathname === PROJECT_DETAIL_PAGE_PATH;
      }
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  const isParentActive = useCallback(
    (link: NavigationLink): boolean =>
      !!link.children?.some((child) => isLinkActive(child.href)),
    [isLinkActive],
  );

  useEffect(() => {
    navigationLinks.forEach((link) => {
      if (link.children?.length && isParentActive(link)) {
        setExpandedItems((prev) => (prev.has(link.name) ? prev : new Set(prev).add(link.name)));
      }
    });
  }, [pathname, navigationLinks, isParentActive]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (!isSidebarOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <div className={styles.brandPanel}>
          <BrandLogo className={styles.logoMark} />
          <div className={styles.brandTextGroup}>
            <span className={styles.logoText}>Code Control</span>
            <span className={styles.logoHint}>A LUCKEE APP</span>
          </div>
        </div>

        <nav className={styles.navigation} aria-label="Primary">
          <p className={styles.navLabel}>Navigation</p>
          <ul className={styles.menuList}>
            {navigationLinks.map((link) => {
              const hasChildren = Boolean(link.children?.length);
              const isExpanded = expandedItems.has(link.name);
              const parentActive = isParentActive(link);
              const isActive = isLinkActive(link.href);

              if (hasChildren) {
                return (
                  <li key={link.href} className={styles.menuItem}>
                    <div className={styles.parentRow}>
                      <Link
                        href={link.href}
                        className={`${styles.menuButton} ${
                          isActive || parentActive
                            ? styles.menuButtonActive
                            : styles.menuButtonInactive
                        }`}
                      >
                        <span>{link.name}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(link.name)}
                        className={styles.expandButton}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <ChevronRight
                          className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
                        />
                      </button>
                    </div>
                    {isExpanded && link.children && (
                      <ul className={styles.childList}>
                        {link.children.map((child) => {
                          const childActive = isLinkActive(child.href);
                          return (
                            <li key={child.href} className={styles.childItem}>
                              <Link
                                href={child.href}
                                className={`${styles.childButton} ${
                                  childActive ? styles.menuButtonActive : styles.menuButtonInactive
                                }`}
                              >
                                <span>{child.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.href} className={styles.menuItem}>
                  <Link
                    href={link.href}
                    className={`${styles.menuButton} ${
                      isActive ? styles.menuButtonActive : styles.menuButtonInactive
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: `
    relative flex h-screen w-[15.5rem] flex-col
    border-r border-gray-300 bg-white overflow-y-auto print:hidden shrink-0
  `,
  inner: `
    flex h-full flex-1 flex-col gap-4 p-3
  `,
  brandPanel: `
    flex items-center gap-2.5 rounded border border-gray-300 bg-gray-50 px-3 py-2.5
  `,
  logoMark: `h-8 w-auto shrink-0`,
  brandTextGroup: `
    flex min-w-0 flex-col
  `,
  logoText: `
    text-sm font-semibold text-gray-900 tracking-tight truncate
  `,
  logoHint: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  navigation: `
    flex-1 overflow-y-auto
  `,
  navLabel: `
    mb-2 px-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  menuList: `
    flex flex-col gap-0.5
  `,
  menuItem: `
    group relative
  `,
  menuButton: `
    flex flex-1 items-center gap-2 rounded px-2.5 py-2 text-xs font-medium
    text-gray-700 transition-colors cursor-pointer
    hover:bg-gray-50 hover:text-gray-900
  `,
  menuButtonActive: `
    bg-gray-100 text-gray-900 font-semibold
    ring-1 ring-inset ring-gray-300
  `,
  menuButtonInactive: `
    bg-transparent
  `,
  parentRow: `
    flex items-center gap-0
  `,
  expandButton: `
    flex h-7 w-7 shrink-0 items-center justify-center rounded
    border border-transparent bg-transparent
    transition-colors cursor-pointer p-0
    hover:border-gray-300 hover:bg-gray-50
  `,
  chevron: `
    h-3.5 w-3.5 text-gray-500 transition-transform duration-200
  `,
  chevronExpanded: `
    rotate-90
  `,
  childList: `
    ml-2.5 mt-0.5 flex flex-col gap-0.5 border-l border-gray-300 pl-2
  `,
  childItem: `
    group relative
  `,
  childButton: `
    flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium
    text-gray-600 transition-colors cursor-pointer
    hover:bg-gray-50 hover:text-gray-900
  `,
};
