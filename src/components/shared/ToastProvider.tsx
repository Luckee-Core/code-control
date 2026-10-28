'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type ToastType = 'success' | 'error' | 'info';

type ToastState = {
  message: string;
  type: ToastType;
  id: number;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

const TOAST_MS = 8000;

/**
 * Fixed toast banner (not console-only).
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type, id: Date.now() });
    console.log(`[toast:${type}]`, message);
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div
          className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : ''} ${toast.type === 'error' ? styles.toastError : ''}`}
          role="status"
          aria-live="polite"
        >
          <p className={styles.toastMessage}>{toast.message}</p>
          <button
            type="button"
            className={styles.toastDismiss}
            aria-label="Dismiss"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = {
  toast: `
    fixed bottom-4 right-4 z-[100] max-w-md rounded-lg border px-4 py-3 shadow-lg
    flex items-start gap-3 bg-gray-900 text-white border-gray-700
  `,
  toastSuccess: `bg-green-900 border-green-700 text-green-50`,
  toastError: `bg-red-900 border-red-700 text-red-50`,
  toastMessage: `text-sm leading-relaxed m-0 flex-1`,
  toastDismiss: `
    shrink-0 text-lg leading-none bg-transparent border-none text-inherit
    opacity-80 hover:opacity-100 cursor-pointer p-0
  `,
};
