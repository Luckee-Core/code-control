'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';

type ToastContextValue = {
  showToast: (message: string, type?: 'success' | 'error') => void;
};

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = useCallback((message: string, type?: 'success' | 'error') => {
    console.log(`[toast:${type ?? 'info'}]`, message);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
