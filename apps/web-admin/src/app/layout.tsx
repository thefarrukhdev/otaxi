import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/sidebar';

export const metadata: Metadata = {
  title: 'OTAXI Admin — Shaharlararo va Xalqaro Safarlar Boshqaruvi',
  description: 'OTAXI Central Asia Mobility ERP & CRM Platformasi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
