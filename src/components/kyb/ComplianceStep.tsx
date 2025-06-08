import { useState, useEffect } from 'react';
import { BusinessData } from '@/app/kyb/page';

interface ComplianceStepProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

interface ValidationErrors {
  accurateInformation?: string;
  notIllegalActivities?: string;
  additionalInfoConsent?: string;
  privacyPolicyConsent?: string;
}

export default function ComplianceStep({ data, updateData }: ComplianceStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showValidation, setShowValidation] = useState(false);

  const handleInputChange = (field: keyof BusinessData, value: string | boolean) => {
    updateData({ [field]: value });
    
    // Clear error when user checks the box
    if (value === true && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getCheckboxClassName = (fieldName: keyof ValidationErrors, isChecked: boolean) => {
    const baseClasses = "w-4 h-4 text-green-500 bg-gray-700 rounded focus:ring-green-500 mt-1";
    
    if (showValidation && !isChecked) {
      return `${baseClasses} border-2 border-red-500`;
    }
    
    if (isChecked) {
      return `${baseClasses} border border-green-500`;
    }
    
    return `${baseClasses} border border-gray-600`;
  };

  // Expose validation function to parent component
  useEffect(() => {
    const allRequiredChecked = data.accurateInformation &&
                              data.notIllegalActivities &&
                              data.additionalInfoConsent &&
                              data.privacyPolicyConsent;
    // Only update if the validation status has changed
    if ((data as any)._complianceStepValid !== allRequiredChecked) {
      updateData({
        _complianceStepValid: allRequiredChecked
      } as Partial<BusinessData>);
    }
  }, [
    data.accurateInformation,
    data.notIllegalActivities,
    data.additionalInfoConsent,
    data.privacyPolicyConsent,
    data,
    updateData
  ]);
  return (
    <div>
      <h2 className="text-2xl font-bold text-green-400 mb-2">Compliance Information</h2>
      <p className="text-gray-300 mb-6">Please provide information related to regulatory compliance</p>

      <div className="space-y-6">
        {/* Regulatory Licenses & Registrations */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Regulatory Licenses & Registrations</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              List any regulatory licenses or registrations your company holds:
            </label>
            <textarea
              value={data.regulatoryLicenses}
              onChange={(e) => handleInputChange('regulatoryLicenses', e.target.value)}
              placeholder="Enter any regulatory licenses or registrations..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Risk Assessment */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.hasPEP}
                  onChange={(e) => handleInputChange('hasPEP', e.target.checked)}
                  className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 mt-1"
                />
                <div>
                  <span className="text-gray-300 font-medium">
                    Are any of the company&apos;s directors, officers, or beneficial owners a Politically Exposed Person (PEP)?
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.operatesHighRiskIndustries}
                  onChange={(e) => handleInputChange('operatesHighRiskIndustries', e.target.checked)}
                  className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 mt-1"
                />
                <div>
                  <span className="text-gray-300 font-medium">
                    Does your business operate in any high-risk industries (e.g. gambling, cryptocurrency, precious metals, etc.)?
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Sanctions & Compliance Screening */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Sanctions & Compliance Screening</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Provide any additional information relevant to sanctions or compliance screening:
            </label>
            <textarea
              value={data.sanctionsCompliance}
              onChange={(e) => handleInputChange('sanctionsCompliance', e.target.value)}
              placeholder="Enter any additional information..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Required Declarations */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Required Declarations <span className="text-red-400">*</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.accurateInformation}
                  onChange={(e) => handleInputChange('accurateInformation', e.target.checked)}
                  className={getCheckboxClassName('accurateInformation', data.accurateInformation)}
                />
                <div className="flex-1">
                  <span className="text-gray-300">
                    I confirm that all information provided is accurate, complete, and up-to-date. <span className="text-red-400">*</span>
                  </span>
                  {showValidation && errors.accurateInformation && (
                    <p className="mt-1 text-sm text-red-400">{errors.accurateInformation}</p>
                  )}
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.notIllegalActivities}
                  onChange={(e) => handleInputChange('notIllegalActivities', e.target.checked)}
                  className={getCheckboxClassName('notIllegalActivities', data.notIllegalActivities)}
                />
                <div className="flex-1">
                  <span className="text-gray-300">
                    I confirm that the company is not involved in any illegal activities, including but not limited to money 
                    laundering, terrorist financing, fraud, or tax evasion. <span className="text-red-400">*</span>
                  </span>
                  {showValidation && errors.notIllegalActivities && (
                    <p className="mt-1 text-sm text-red-400">{errors.notIllegalActivities}</p>
                  )}
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.additionalInfoConsent}
                  onChange={(e) => handleInputChange('additionalInfoConsent', e.target.checked)}
                  className={getCheckboxClassName('additionalInfoConsent', data.additionalInfoConsent)}
                />
                <div className="flex-1">
                  <span className="text-gray-300">
                    I understand that TrustBridge may request additional information or documentation to complete the 
                    verification process. <span className="text-red-400">*</span>
                  </span>
                  {showValidation && errors.additionalInfoConsent && (
                    <p className="mt-1 text-sm text-red-400">{errors.additionalInfoConsent}</p>
                  )}
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.privacyPolicyConsent}
                  onChange={(e) => handleInputChange('privacyPolicyConsent', e.target.checked)}
                  className={getCheckboxClassName('privacyPolicyConsent', data.privacyPolicyConsent)}
                />
                <div className="flex-1">
                  <span className="text-gray-300">
                    I consent to TrustBridge processing the provided information for KYB verification purposes in accordance with 
                    the Privacy Policy. <span className="text-red-400">*</span>
                  </span>
                  {showValidation && errors.privacyPolicyConsent && (
                    <p className="mt-1 text-sm text-red-400">{errors.privacyPolicyConsent}</p>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Validation Summary */}
          {showValidation && Object.keys(errors).length > 0 && (
            <div className="mt-4 bg-red-900 border border-red-700 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-red-400 mr-3 mt-1">⚠️</div>
                <div>
                  <h4 className="text-red-300 font-medium mb-1">Required Declarations Missing</h4>
                  <p className="text-red-200 text-sm">
                    All declarations marked with (*) must be accepted to proceed with KYB verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Indicator */}
          {showValidation && Object.keys(errors).length === 0 && (
            <div className="mt-4 bg-green-900 border border-green-700 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-green-400 mr-3 mt-1">✅</div>
                <div>
                  <h4 className="text-green-300 font-medium mb-1">All Declarations Complete</h4>
                  <p className="text-green-200 text-sm">
                    You have successfully completed all required compliance declarations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data Protection Notice */}
        <div className="bg-green-900 border border-green-700 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-green-400 mr-3 mt-1">🔒</div>
            <div>
              <h4 className="text-green-300 font-medium mb-1">Data Protection</h4>
              <p className="text-green-200 text-sm">
                Your business information is encrypted and stored securely. We comply with GDPR and other data protection regulations. 
                Your data will only be used for business verification purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}