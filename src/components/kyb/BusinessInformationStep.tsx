import { useState } from 'react';
import { BusinessData } from '@/app/kyb/page';

interface BusinessInformationStepProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

interface ValidationErrors {
  legalCompanyName?: string;
  entityType?: string;
  registrationNumber?: string;
  email?: string;
  phoneNumber?: string;
}

export default function BusinessInformationStep({ data, updateData }: BusinessInformationStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    updateData({ [field]: value });
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'legalCompanyName':
        if (!value.trim()) {
          newErrors.legalCompanyName = 'Legal company name is required';
        } else {
          delete newErrors.legalCompanyName;
        }
        break;
      case 'entityType':
        if (!value) {
          newErrors.entityType = 'Entity type is required';
        } else {
          delete newErrors.entityType;
        }
        break;
      case 'registrationNumber':
        if (!value.trim()) {
          newErrors.registrationNumber = 'Registration number is required';
        } else {
          delete newErrors.registrationNumber;
        }
        break;
      case 'email': {
       const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailPattern.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
         delete newErrors.email;
       }
        break;
      }

      case 'phoneNumber': {
        const phonePattern = /^[+]?[0-9\s\-()]{10,}$/;
        if (value && !phonePattern.test(value)) {
         newErrors.phoneNumber = 'Please enter a valid phone number';
        } else {
         delete newErrors.phoneNumber;
        }
        break;
      }
     }

    setErrors(newErrors);
  };

  const handleBlur = (field: string, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const getFieldClassName = (fieldName: keyof ValidationErrors, hasError: boolean, value: string) => {
    const baseClasses = "w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2";
    
    if (touched[fieldName] && hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500`;
    }
    
    if (touched[fieldName] && !hasError && value) {
      return `${baseClasses} border-green-500 focus:ring-green-500`;
    }
    
    return `${baseClasses} border-gray-600 focus:ring-green-500`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-400 mb-2">Business Information</h2>
      <p className="text-gray-300 mb-6">Please provide your company details for verification</p>

      <div className="space-y-6">
        {/* Company Details */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Legal Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.legalCompanyName}
                onChange={(e) => handleInputChange('legalCompanyName', e.target.value)}
                onBlur={(e) => handleBlur('legalCompanyName', e.target.value)}
                placeholder="Acme Corporation Ltd."
                className={getFieldClassName('legalCompanyName', !!errors.legalCompanyName, data.legalCompanyName)}
              />
              {touched.legalCompanyName && errors.legalCompanyName && (
                <p className="mt-1 text-sm text-red-400">{errors.legalCompanyName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trading Name (if different)
              </label>
              <input
                type="text"
                value={data.tradingName}
                onChange={(e) => handleInputChange('tradingName', e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Entity Type <span className="text-red-400">*</span>
              </label>
              <select
                value={data.entityType}
                onChange={(e) => handleInputChange('entityType', e.target.value)}
                onBlur={(e) => handleBlur('entityType', e.target.value)}
                className={getFieldClassName('entityType', !!errors.entityType, data.entityType)}
              >
                <option value="">Select entity type</option>
                <option value="corporation">Corporation</option>
                <option value="llc">Limited Liability Company</option>
                <option value="partnership">Partnership</option>
                <option value="sole-proprietorship">Sole Proprietorship</option>
                <option value="other">Other</option>
              </select>
              {touched.entityType && errors.entityType && (
                <p className="mt-1 text-sm text-red-400">{errors.entityType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registration Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                onBlur={(e) => handleBlur('registrationNumber', e.target.value)}
                placeholder="12345678"
                className={getFieldClassName('registrationNumber', !!errors.registrationNumber, data.registrationNumber)}
              />
              {touched.registrationNumber && errors.registrationNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.registrationNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tax ID / VAT Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="987654321"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date of Incorporation <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={data.dateOfIncorporation}
                onChange={(e) => handleInputChange('dateOfIncorporation', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country of Incorporation <span className="text-red-400">*</span>
              </label>
              <select
                value={data.countryOfIncorporation}
                onChange={(e) => handleInputChange('countryOfIncorporation', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry <span className="text-red-400">*</span>
              </label>
              <select
                value={data.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="real-estate">Real Estate</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={data.companyWebsite}
                onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                placeholder="https://www.example.com"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Employees
              </label>
              <select
                value={data.numberOfEmployees}
                onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select range</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Business Address</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registered Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.registeredAddress}
                onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                placeholder="123 Business Rd, Suite 100"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={data.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="10001"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country <span className="text-red-400">*</span>
                </label>
                <select
                  value={data.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Primary Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position
              </label>
              <input
                type="text"
                value={data.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Chief Financial Officer"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
                placeholder="jane.smith@example.com"
                className={getFieldClassName('email', !!errors.email, data.email)}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={data.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                onBlur={(e) => handleBlur('phoneNumber', e.target.value)}
                pattern="[+]?[0-9\s\-\(\)]{10,}"
                title="Please enter a valid phone number"
                placeholder="+1 234 567 8900"
                className={getFieldClassName('phoneNumber', !!errors.phoneNumber, data.phoneNumber)}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
              )}
            </div>
          </div>
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
      </div>
    </div>
  );
}