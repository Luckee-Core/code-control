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
const MENU_ITEM_HEIGHT = 32;
const MENU_MAX_HEIGHT = 288;
const VIEWPORT_GAP = 8;

type ActionsMenuProps = { label: string; actions: TargetAction[]; busy: boolean };

/** Kebab menu with one delivery row's actions (open / merge / update PR, preview, refresh). */
export const ActionsMenu = ({ label, actions, busy }: ActionsMenuProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; maxHeight: number } | null>(null);

  useEffect(() => {
    if (!menuPosition) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setMenuPosition(null);
    };
    // The menu is fixed to the viewport: close it when anything scrolls or resizes so it never
    // floats away from its row (and scrolling stays free while it is open).
    const handleScroll = (event: Event) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setMenuPosition(null);
    };
    const close = () => setMenuPosition(null);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', close);
    };
  }, [menuPosition]);

  const handleToggle = () => {
    if (menuPosition || !triggerRef.current) {
      setMenuPosition(null);
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = Math.min(MENU_MAX_HEIGHT, actions.length * MENU_ITEM_HEIGHT + 8);
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_GAP;
    const spaceAbove = rect.top - VIEWPORT_GAP;
    // Open upward when the menu doesn't fit below the trigger and there is more room above.
    const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;
    const top = openUp ? Math.max(VIEWPORT_GAP, rect.top - 4 - menuHeight) : rect.bottom + 4;
    setMenuPosition({ top, left: Math.max(VIEWPORT_GAP, rect.right - MENU_WIDTH), maxHeight: openUp ? spaceAbove : spaceBelow });
  };

  const menu =
    menuPosition && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            className={styles.menu}
            role="menu"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: MENU_WIDTH,
              maxHeight: Math.min(MENU_MAX_HEIGHT, Math.max(120, menuPosition.maxHeight)),
            }}
          >
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
          </div>,
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
  menu: `
    fixed z-[70] overflow-y-auto overflow-x-hidden
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
