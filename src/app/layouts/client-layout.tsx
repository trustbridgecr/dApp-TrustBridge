'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import ApolloProviderWrapper from '@/providers/ApolloProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProviderWrapper>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProviderWrapper>
  );
} 