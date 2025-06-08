import { BusinessData } from "@/app/kyb/page";

interface FinancialInformationStepProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

export default function FinancialInformationStep({
  data,
  updateData,
}: FinancialInformationStepProps) {
  const handleInputChange = (field: keyof BusinessData, value: string) => {
    updateData({ [field]: value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-400 mb-2">
        Financial Information
      </h2>
      <p className="text-gray-300 mb-6">
        Please provide basic financial information about your business
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Annual Revenue (USD)
          </label>
          <select
            value={data.annualRevenue}
            onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select range</option>
            <option value="0-100k">$0 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="1m-5m">$1,000,000 - $5,000,000</option>
            <option value="5m-10m">$5,000,000 - $10,000,000</option>
            <option value="10m+">$10,000,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primary Source of Funds
          </label>
          <select
            value={data.primarySourceOfFunds}
            onChange={(e) =>
              handleInputChange("primarySourceOfFunds", e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select source</option>
            <option value="revenue">Business Revenue</option>
            <option value="investment">Investment Capital</option>
            <option value="loans">Bank Loans</option>
            <option value="personal">Personal Funds</option>
            <option value="grants">Grants</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expected Monthly Transaction Volume (USD)
          </label>
          <select
            value={data.expectedMonthlyTransactionVolume}
            onChange={(e) =>
              handleInputChange(
                "expectedMonthlyTransactionVolume",
                e.target.value,
              )
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select range</option>
            <option value="0-10k">$0 - $10,000</option>
            <option value="10k-50k">$10,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="1m+">$1,000,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Purpose for TrustBridge Account
          </label>
          <textarea
            value={data.businessPurpose}
            onChange={(e) =>
              handleInputChange("businessPurpose", e.target.value)
            }
            placeholder="Please describe how your business plans to use TrustBridge services..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Information Box */}
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-400 mr-3 mt-1">ℹ️</div>
            <div>
              <h4 className="text-blue-300 font-medium mb-1">
                Why We Need This Information
              </h4>
              <p className="text-blue-200 text-sm">
                This financial information helps us understand your business
                needs and comply with regulatory requirements. All information
                is encrypted and stored securely. We comply with GDPR and other
                data protection regulations. Your data will only be used for
                business verification purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
