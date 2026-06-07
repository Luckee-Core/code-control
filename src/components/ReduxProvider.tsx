'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useCodeControlDataLoader } from '@/hooks/useCodeControlDataLoader';
import { useEffect, useState } from 'react';

const DataLoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useCodeControlDataLoader();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setCanRender(true), 100);
    }
  }, [isLoading]);

  if (isLoading || !canRender) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading workspace data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <DataLoader>{children}</DataLoader>
    </Provider>
  );
};
