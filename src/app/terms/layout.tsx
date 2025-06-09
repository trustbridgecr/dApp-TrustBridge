import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | TrustBridge',
  description: 'Terms and Conditions governing the use of the TrustBridge decentralized lending platform built on Stellar blockchain.',
  keywords: 'terms, conditions, TrustBridge, blockchain, lending, Stellar, cryptocurrency, microloans',
  openGraph: {
    title: 'Terms and Conditions | TrustBridge',
    description: 'Terms and Conditions for TrustBridge decentralized lending platform',
    type: 'website',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}