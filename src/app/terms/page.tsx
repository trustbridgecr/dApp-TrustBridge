import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Back to Home Button */}
      <div className="pt-8 pl-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 text-center mb-12">
          Terms and Conditions
        </h1>

        {/* Single Content Container - exactly like the reference */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 md:p-12 space-y-8">
          
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern the use of the TrustBridge platform (&ldquo;the Platform&rdquo;), operated by TrustBridge Inc. By accessing or using our Platform, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Platform.
            </p>
          </section>

          {/* 2. Definitions */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              2. Definitions
            </h2>
            <div className="space-y-3 text-gray-300">
              <p><strong className="text-emerald-400">&ldquo;User&rdquo;:</strong> Any person who accesses or uses the Platform.</p>
              <p><strong className="text-emerald-400">&ldquo;Lender&rdquo;:</strong> User who provides funds for loans through the Platform.</p>
              <p><strong className="text-emerald-400">&ldquo;Borrower&rdquo;:</strong> User who requests and receives loans through the Platform.</p>
              <p><strong className="text-emerald-400">&ldquo;Loan Agreement&rdquo;:</strong> Agreement between Lender and Borrower facilitated by the Platform.</p>
            </div>
          </section>

          {/* 3. Registration and Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              3. Registration and Accounts
            </h2>
            <div className="space-y-3 text-gray-300">
              <p><strong>3.1.</strong> To use certain features of the Platform, you must register and create an account.</p>
              <p><strong>3.2.</strong> You are responsible for maintaining the confidentiality of your account information and password.</p>
              <p><strong>3.3.</strong> You must provide accurate, current, and complete information during the registration process and keep this information updated.</p>
            </div>
          </section>

          {/* 4. Loan Services */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              4. Loan Services
            </h2>
            <div className="space-y-3 text-gray-300">
              <p><strong>4.1.</strong> TrustBridge facilitates the connection between Lenders and Borrowers but is not a party to Loan Agreements.</p>
              <p><strong>4.2.</strong> All loans are subject to the specific terms agreed upon between the Lender and Borrower.</p>
              <p><strong>4.3.</strong> TrustBridge does not guarantee the creditworthiness of any Borrower or compliance with loan terms.</p>
            </div>
          </section>

          {/* 5. Blockchain Technology */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              5. Blockchain Technology
            </h2>
            <div className="space-y-3 text-gray-300">
              <p><strong>5.1.</strong> The Platform uses the Stellar blockchain to process transactions.</p>
              <p><strong>5.2.</strong> You acknowledge that blockchain transactions are irreversible and TrustBridge cannot cancel or reverse transactions once confirmed.</p>
              <p><strong>5.3.</strong> It is your responsibility to ensure the security of your private keys and wallet credentials.</p>
            </div>
          </section>

          {/* 6. Fees and Commissions */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              6. Fees and Commissions
            </h2>
            <p className="text-gray-300 leading-relaxed">
              <strong>6.1.</strong> TrustBridge charges commissions for facilitating loans through the Platform. Current fees are available in the Platform&rsquo;s Fees section and may change periodically.
            </p>
          </section>

          {/* 7. Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              7. Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              <strong>7.1.</strong> Our Privacy Policy, available on the Platform, describes how we collect, use, and share your personal information and forms part of these Terms.
            </p>
          </section>

          {/* 8. Modifications */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              8. Modifications
            </h2>
            <p className="text-gray-300 leading-relaxed">
              <strong>8.1.</strong> TrustBridge reserves the right to modify these Terms at any time. Modifications will take effect immediately upon posting on the Platform.
            </p>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              9. Contact
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms, contact us at{' '}
              <a 
                href="mailto:trustbridge.cr30@gmail.com" 
                className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
              >
                trustbridge.cr30@gmail.com
              </a>.
            </p>
          </section>

          {/* 10. Preliminary Nature */}
          <section>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
              10. Preliminary Nature of the Platform
            </h2>
            <div className="space-y-3 text-gray-300">
              <p><strong>10.1.</strong> The current version of the Platform is an initial release intended to validate core functionalities and gather user feedback.</p>
              <p><strong>10.2.</strong> As such, features, performance, and security may evolve over time. While TrustBridge strives to provide a stable experience, the Platform may still be subject to bugs, updates, or temporary limitations.</p>
              <p><strong>10.3.</strong> Users are encouraged to report issues and understand that some functionalities may operate in a provisional manner during this early stage.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}