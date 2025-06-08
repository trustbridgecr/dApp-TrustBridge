import { useState, useEffect } from 'react';
import { BusinessData } from '@/app/kyb/page';

interface FinancialInformationStepProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

interface ValidationErrors {
  annualRevenue?: string;
  primarySourceOfFunds?: string;
  expectedMonthlyTransactionVolume?: string;
  businessPurpose?: string;
}

export default function FinancialInformationStep({ data, updateData }: FinancialInformationStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    updateData({ [field]: value });
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const value = data[field as keyof BusinessData] as string;
    const newErrors = { ...errors };

    switch (field) {
      case 'annualRevenue':
        if (!value) {
          newErrors.annualRevenue = 'Annual revenue is required';
        } else {
          newErrors.annualRevenue = undefined;
        }
        break;
      case 'primarySourceOfFunds':
        if (!value) {
          newErrors.primarySourceOfFunds = 'Primary source of funds is required';
        } else {
          newErrors.primarySourceOfFunds = undefined;
        }
        break;
      case 'expectedMonthlyTransactionVolume':
        if (!value) {
          newErrors.expectedMonthlyTransactionVolume = 'Expected transaction volume is required';
        } else {
          newErrors.expectedMonthlyTransactionVolume = undefined;
        }
        break;
      case 'businessPurpose':
        if (!value || value.trim().length < 10) {
          newErrors.businessPurpose = 'Business purpose must be at least 10 characters';
        } else {
          newErrors.businessPurpose = undefined;
        }
        break;
    }

    setErrors(newErrors);
  };

  const getFieldClassName = (fieldName: keyof ValidationErrors, hasError: boolean) => {
    const baseClasses = "w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2";
    
    if (touched[fieldName] && hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500`;
    }
    
    if (touched[fieldName] && !hasError && data[fieldName as keyof BusinessData]) {
      return `${baseClasses} border-green-500 focus:ring-green-500`;
    }
    
    return `${baseClasses} border-gray-600 focus:ring-green-500`;
  };

  // Expose validation function to parent component
  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const allFieldsFilled = data.annualRevenue && data.primarySourceOfFunds && 
                           data.expectedMonthlyTransactionVolume && data.businessPurpose;
    
   const isValid = !hasErrors && allFieldsFilled;
  
   // Only update if validation status has changed
   if ((data as any)._financialStepValid !== isValid) {
     updateData({ 
        _financialStepValid: isValid 
     } as Partial<BusinessData>);
   }
  }, [errors, data.annualRevenue, data.primarySourceOfFunds, data.expectedMonthlyTransactionVolume, data.businessPurpose, data, updateData]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-400 mb-2">Financial Information</h2>
      <p className="text-gray-300 mb-6">Please provide basic financial information about your business</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Annual Revenue (USD) <span className="text-red-400">*</span>
          </label>
          <select
            value={data.annualRevenue}
            onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
            onBlur={() => handleBlur('annualRevenue')}
            className={getFieldClassName('annualRevenue', !!errors.annualRevenue)}
          >
            <option value="">Select range</option>
            <option value="0-100k">$0 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="1m-5m">$1,000,000 - $5,000,000</option>
            <option value="5m-10m">$5,000,000 - $10,000,000</option>
            <option value="10m+">$10,000,000+</option>
          </select>
          {touched.annualRevenue && errors.annualRevenue && (
            <p className="mt-1 text-sm text-red-400">{errors.annualRevenue}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primary Source of Funds <span className="text-red-400">*</span>
          </label>
          <select
            value={data.primarySourceOfFunds}
            onChange={(e) => handleInputChange('primarySourceOfFunds', e.target.value)}
            onBlur={() => handleBlur('primarySourceOfFunds')}
            className={getFieldClassName('primarySourceOfFunds', !!errors.primarySourceOfFunds)}
          >
            <option value="">Select source</option>
            <option value="revenue">Business Revenue</option>
            <option value="investment">Investment Capital</option>
            <option value="loans">Bank Loans</option>
            <option value="personal">Personal Funds</option>
            <option value="grants">Grants</option>
            <option value="other">Other</option>
          </select>
          {touched.primarySourceOfFunds && errors.primarySourceOfFunds && (
            <p className="mt-1 text-sm text-red-400">{errors.primarySourceOfFunds}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expected Monthly Transaction Volume (USD) <span className="text-red-400">*</span>
          </label>
          <select
            value={data.expectedMonthlyTransactionVolume}
            onChange={(e) => handleInputChange('expectedMonthlyTransactionVolume', e.target.value)}
            onBlur={() => handleBlur('expectedMonthlyTransactionVolume')}
            className={getFieldClassName('expectedMonthlyTransactionVolume', !!errors.expectedMonthlyTransactionVolume)}
          >
            <option value="">Select range</option>
            <option value="0-10k">$0 - $10,000</option>
            <option value="10k-50k">$10,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="1m+">$1,000,000+</option>
          </select>
          {touched.expectedMonthlyTransactionVolume && errors.expectedMonthlyTransactionVolume && (
            <p className="mt-1 text-sm text-red-400">{errors.expectedMonthlyTransactionVolume}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Purpose for TrustBridge Account <span className="text-red-400">*</span>
          </label>
          <textarea
            value={data.businessPurpose}
            onChange={(e) => handleInputChange('businessPurpose', e.target.value)}
            onBlur={() => handleBlur('businessPurpose')}
            placeholder="Please describe how your business plans to use TrustBridge services..."
            rows={4}
            className={getFieldClassName('businessPurpose', !!errors.businessPurpose).replace('border rounded-lg', 'border border-gray-600 rounded-lg')}
          />
          {touched.businessPurpose && errors.businessPurpose && (
            <p className="mt-1 text-sm text-red-400">{errors.businessPurpose}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {data.businessPurpose?.length || 0} characters (minimum 10 required)
          </p>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-red-400 mr-3 mt-1">⚠️</div>
              <div>
                <h4 className="text-red-300 font-medium mb-1">Please complete all required fields</h4>
                <p className="text-red-200 text-sm">
                  All fields marked with (*) are required to proceed to the next step.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-400 mr-3 mt-1">ℹ️</div>
            <div>
              <h4 className="text-blue-300 font-medium mb-1">Why We Need This Information</h4>
              <p className="text-blue-200 text-sm">
                This financial information helps us understand your business needs and comply with regulatory requirements. All 
                information is encrypted and stored securely. We comply with GDPR and other data protection regulations. 
                Your data will only be used for business verification purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}