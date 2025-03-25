'use client';

import { DashboardFooter } from '@/components/layouts/Footer';
import { DashboardHeader } from '@/components/layouts/Header';
import { RouteGuard } from '@/components/auth/RouteGuard';
import type React from 'react';
import { useState, useEffect } from 'react';
import { LenderSidebar } from '@/components/layouts/lender/Sidebar';

export default function LenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [, setLanguage] = useState<'es' | 'en' | 'fr' | 'de'>('en');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <RouteGuard allowedRoles={['Lender']}>
      <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <LenderSidebar />
        <div className='w-full flex flex-col bg-gradient-to-b from-[#0B1120] via-[#0B1120] to-[#121E31]'>
          {/* <div className='w-full'> */}
          <DashboardHeader
            theme={theme}
            setTheme={setTheme}
            setLanguage={setLanguage}
          />
          {children}
          <DashboardFooter />
        </div>
      </div>
    </RouteGuard>
  );
}
