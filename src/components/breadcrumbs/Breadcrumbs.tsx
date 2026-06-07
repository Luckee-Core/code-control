'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { LayoutBuilderActions } from '@/store/builders';
import { PanelLeft, PanelLeftClose } from 'lucide-react';

export const Breadcrumbs = () => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.layoutBuilder.isSidebarOpen);
  const breadcrumbs = useAppSelector((state) => state.layoutBuilder.breadcrumbs);

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
    flex items-center gap-1 px-4
  `,
  menuButton: `
    w-8 h-8
    flex items-center justify-center
    text-muted-foreground
    hover:text-foreground hover:bg-muted
    transition-colors rounded cursor-pointer
    border-none bg-transparent
    focus:outline-none focus:ring-2 focus:ring-primary
  `,
  itemWrapper: `
    flex items-center gap-1
  `,
  separator: `
    text-muted-foreground text-sm
  `,
  link: `
    text-sm text-foreground font-medium
    hover:text-primary
    transition-colors
  `,
  text: `
    text-sm text-foreground font-medium
  `,
};
