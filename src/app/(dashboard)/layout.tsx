'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar - hidden on mobile unless open */}
        <aside
          className={`
            ${sidebarOpen ? 'block' : 'hidden'} 
            md:block md:w-64 lg:w-72
            fixed inset-y-0 left-0 top-16 z-40 w-64
            md:static md:z-auto
          `}
        >
          <Sidebar onLinkClick={closeSidebar} />
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}