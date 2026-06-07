'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppSelector } from '@/store';
import { getNavigationLinks } from '@/utils/navigation/get-navigation-links';
import type { NavigationLink } from '@/utils/navigation/get-navigation-links';

export const CodeControlSidebar = () => {
  const pathname = usePathname();
  const isSidebarOpen = useAppSelector((state) => state.layoutBuilder.isSidebarOpen);
  const navigationLinks = useMemo(() => getNavigationLinks(), []);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => new Set(navigationLinks.filter((l) => l.children).map((l) => l.name))
  );

  const isLinkActive = useCallback(
    (href: string): boolean => {
      if (href === '/') return pathname === '/';
      return pathname === href || pathname.startsWith(href + '/');
    },
    [pathname]
  );

  const isParentActive = useCallback(
    (link: NavigationLink): boolean =>
      !!link.children?.some((child) => isLinkActive(child.href)),
    [isLinkActive]
  );

  useEffect(() => {
    navigationLinks.forEach((link) => {
      if (link.children && isParentActive(link)) {
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

  const renderNavItem = (link: NavigationLink) => {
    const hasChildren = link.children && link.children.length > 0;
    const isExpanded = expandedItems.has(link.name);
    const isParentHighlighted = isParentActive(link);

    if (hasChildren) {
      return (
        <li key={link.href} className={styles.menuItem}>
          <div className={styles.accordionHeader}>
            <Link
              href={link.href}
              className={`${styles.menuButton} ${isParentHighlighted ? styles.menuButtonActive : styles.menuButtonInactive}`}
            >
              <span>{link.name}</span>
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleExpanded(link.name);
              }}
              className={styles.chevronButton}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronRight
                className={`${styles.chevronIcon} ${isExpanded ? styles.chevronExpanded : ''}`}
              />
            </button>
          </div>
          {isExpanded && (
            <ul className={styles.childMenuList}>
              {link.children!.map((child) => (
                <li key={child.href} className={styles.childMenuItem}>
                  <Link
                    href={child.href}
                    className={`${styles.childMenuButton} ${isLinkActive(child.href) ? styles.menuButtonActive : styles.menuButtonInactive}`}
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={link.href} className={styles.menuItem}>
        <Link
          href={link.href}
          className={`${styles.menuButton} ${isLinkActive(link.href) ? styles.menuButtonActive : styles.menuButtonInactive}`}
        >
          {link.name}
        </Link>
      </li>
    );
  };

  if (!isSidebarOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Link href="/projects" className={styles.logo}>
          Code Control
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.menuList}>{navigationLinks.map(renderNavItem)}</ul>
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: `
    w-64 flex-shrink-0 bg-gray-900 text-gray-100 flex flex-col h-full overflow-y-auto
  `,
  header: `px-4 py-5 border-b border-gray-800`,
  logo: `text-lg font-semibold text-white hover:text-blue-300`,
  nav: `flex-1 px-2 py-4`,
  menuList: `space-y-1`,
  menuItem: ``,
  menuButton: `
    flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
  `,
  menuButtonActive: `bg-gray-800 text-white`,
  menuButtonInactive: `text-gray-300 hover:bg-gray-800 hover:text-white`,
  accordionHeader: `flex items-center`,
  chevronButton: `p-2 text-gray-400 hover:text-white`,
  chevronIcon: `w-4 h-4 transition-transform`,
  chevronExpanded: `rotate-90`,
  childMenuList: `ml-4 mt-1 space-y-1`,
  childMenuItem: ``,
  childMenuButton: `
    block w-full px-3 py-1.5 rounded-md text-sm transition-colors
  `,
};
