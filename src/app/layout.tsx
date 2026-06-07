import type { Metadata } from 'next';
import { ReduxProvider } from '@/components/ReduxProvider';
import { CodeControlSidebar } from '@/components/sidebar';
import { MainContent } from '@/components/main-content/MainContent';
import { ToastProvider } from '@/components/shared';
import './globals.css';

export const metadata: Metadata = {
  title: 'Code Control',
  description: 'Code Control — project workspace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <ReduxProvider>
          <ToastProvider>
            <div className="flex h-screen overflow-hidden">
              <CodeControlSidebar />
              <MainContent>{children}</MainContent>
            </div>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
