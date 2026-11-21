'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Eye, GitMerge, GitPullRequest, MessageSquare, MoreVertical, RefreshCw } from 'lucide-react';

export type TargetAction = {
  key: string;
  label: string;
  icon: 'deliver' | 'merge' | 'update' | 'preview' | 'refresh' | 'github';
  onSelect: () => void;
  disabled?: boolean;
  title?: string;
};

const ICONS: Record<TargetAction['icon'], ComponentType<{ className?: string }>> = {
  deliver: GitPullRequest,
  merge: GitMerge,
  update: MessageSquare,
  preview: Eye,
  refresh: RefreshCw,
  github: ExternalLink,
};

const MENU_WIDTH = 208;

type ActionsMenuProps = { label: string; actions: TargetAction[]; busy: boolean };

/** Kebab menu with one delivery row's actions (open / merge / update PR, preview, refresh). */
export const ActionsMenu = ({ label, actions, busy }: ActionsMenuProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!menuPosition) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setMenuPosition(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuPosition]);

  const handleToggle = () => {
    if (menuPosition || !triggerRef.current) {
      setMenuPosition(null);
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 4, left: Math.max(8, rect.right - MENU_WIDTH) });
  };

  const menu =
    menuPosition && typeof document !== 'undefined'
      ? createPortal(
          <>
            <button type="button" className={styles.backdrop} aria-label="Close menu" onClick={() => setMenuPosition(null)} />
            <div ref={menuRef} className={styles.menu} role="menu" style={{ top: menuPosition.top, left: menuPosition.left, width: MENU_WIDTH }}>
              {actions.map((action) => {
                const Icon = ICONS[action.icon];
                return (
                  <button
                    key={action.key}
                    type="button"
                    role="menuitem"
                    title={action.title}
                    disabled={action.disabled}
                    className={action.icon === 'merge' ? styles.menuItemMerge : styles.menuItem}
                    onClick={() => {
                      setMenuPosition(null);
                      action.onSelect();
                    }}
                  >
                    <Icon className={styles.menuItemIcon} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div className={styles.container}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={styles.trigger}
        aria-label={`Actions for ${label}`}
        aria-expanded={Boolean(menuPosition)}
        aria-haspopup="menu"
        disabled={actions.length === 0}
      >
        {busy ? <RefreshCw className={`${styles.icon} animate-spin`} /> : <MoreVertical className={styles.icon} />}
      </button>
      {menu}
    </div>
  );
};

const styles = {
  container: `relative flex justify-end overflow-visible`,
  trigger: `
    p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100
    border-none bg-transparent cursor-pointer transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  icon: `h-4 w-4`,
  backdrop: `fixed inset-0 z-[60] cursor-default bg-transparent border-none`,
  menu: `
    fixed z-[70] max-h-72 overflow-y-auto overflow-x-hidden
    bg-white rounded-md shadow-lg border border-gray-300 py-1
  `,
  menuItem: `
    w-full flex items-center gap-2 px-3 py-2 text-xs text-left
    text-gray-700 hover:bg-gray-50 border-none bg-transparent cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  menuItemMerge: `
    w-full flex items-center gap-2 px-3 py-2 text-xs text-left font-medium
    text-green-700 hover:bg-green-50 border-none bg-transparent cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  menuItemIcon: `h-3.5 w-3.5 shrink-0`,
};
