'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { RouteGuardProps } from '@/@types/auth';

export function RouteGuard({ children, allowedRoles = [] }: RouteGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
        return;
      }

      if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        router.push('/403');
        return;
      }
    }
  }, [isAuthenticated, isLoading, router, allowedRoles, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 