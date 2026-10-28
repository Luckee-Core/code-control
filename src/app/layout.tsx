import type { Metadata } from 'next';
import { ReduxProvider } from '@/components/ReduxProvider';
import { CodeControlSidebar } from '@/components/sidebar';
import { MainContent } from '@/components/main-content/MainContent';
import { StudioStackProbe } from '@/components/studio-stack-probe';
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
      <body className="antialiased bg-gray-50 text-gray-900">
        <ReduxProvider>
          <ToastProvider>
            <StudioStackProbe />
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
