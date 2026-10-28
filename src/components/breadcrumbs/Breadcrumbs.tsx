'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { LayoutBuilderActions } from '@/store/builders';
import { PanelLeft, PanelLeftClose } from 'lucide-react';

export const Breadcrumbs = () => {
  const dispatch = useAppDispatch();
  const layoutBuilder = useAppSelector((state) => state.layoutBuilder);
  const isSidebarOpen = layoutBuilder.isSidebarOpen;
  const breadcrumbs = layoutBuilder.breadcrumbs;

  const handleToggleSidebar = () => {
    dispatch(LayoutBuilderActions.toggleSidebar());
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleToggleSidebar}
        className={styles.menuButton}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="w-5 h-5" />
        ) : (
          <PanelLeft className="w-5 h-5" />
        )}
      </button>
      {breadcrumbs.map((item, index) => (
        <div key={index} className={styles.itemWrapper}>
          <span className={styles.separator}>/</span>
          {item.href ? (
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.text}>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: `
    flex items-center gap-1 px-3 min-w-0
  `,
  menuButton: `
    w-8 h-8 shrink-0
    flex items-center justify-center
    text-gray-600
    hover:text-gray-900 hover:bg-gray-100
    transition-colors rounded cursor-pointer
    border-none bg-transparent
    focus:outline-none focus:ring-1 focus:ring-gray-400
  `,
  itemWrapper: `
    flex items-center gap-1 min-w-0
  `,
  separator: `
    text-gray-400 text-sm
  `,
  link: `
    text-sm text-gray-700 font-medium
    hover:text-gray-900
    transition-colors cursor-pointer truncate
  `,
  text: `
    text-sm text-gray-900 font-medium truncate
  `,
};
