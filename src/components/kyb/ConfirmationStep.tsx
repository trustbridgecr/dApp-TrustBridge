import { Check } from 'lucide-react';

export default function ConfirmationStep() {
  const referenceId = `KYB-${Date.now()}`;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            KYB Submitted Successfully!
          </h2>
          
          <p className="text-gray-300 mb-6">
            Your KYB application has been submitted for review.             We&apos;ll notify you via email once the verification is complete.
            This process typically takes 3-5 business days.
          </p>
          
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm mb-1">Reference ID</p>
            <p className="text-green-400 font-mono text-lg">{referenceId}</p>
          </div>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}