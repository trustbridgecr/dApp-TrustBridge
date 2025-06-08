'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import BusinessInformationStep from '@/components/kyb/BusinessInformationStep';
import OwnershipStructureStep from '@/components/kyb/OwnershipStructureStep';
import DocumentUploadStep from '@/components/kyb/DocumentUploadStep';
import FinancialInformationStep from '@/components/kyb/FinancialInformationStep';
import ComplianceStep from '@/components/kyb/ComplianceStep';
import ConfirmationStep from '@/components/kyb/ConfirmationStep';

export interface BusinessData {
  // Business Information
  legalCompanyName: string;
  tradingName: string;
  entityType: string;
  registrationNumber: string;
  taxId: string;
  dateOfIncorporation: string;
  countryOfIncorporation: string;
  industry: string;
  companyWebsite: string;
  numberOfEmployees: string;
  registeredAddress: string;
  city: string;
  postalCode: string;
  country: string;
  contactName: string;
  position: string;
  email: string;
  phoneNumber: string;

  // Ownership Structure
  ownershipStructure: string;
  hasComplexStructure: boolean;
  ubos: Array<{
    id: string;
    fullName: string;
    nationality: string;
    dateOfBirth: string;
    ownershipPercentage: string;
    position: string;
  }>;

  // Document Upload
  documents: {
    certificateOfIncorporation: File | null;
    articlesOfAssociation: File | null;
    proofOfBusinessAddress: File | null;
    ownershipStructureChart: File | null;
    financialStatements: File | null;
  };

  // Financial Information
  annualRevenue: string;
  primarySourceOfFunds: string;
  expectedMonthlyTransactionVolume: string;
  businessPurpose: string;

  // Compliance
  regulatoryLicenses: string;
  hasPEP: boolean;
  operatesHighRiskIndustries: boolean;
  sanctionsCompliance: string;
  accurateInformation: boolean;
  notIllegalActivities: boolean;
  additionalInfoConsent: boolean;
  privacyPolicyConsent: boolean;
}

const steps = [
  { id: 1, name: 'Business Information', completed: false },
  { id: 2, name: 'Ownership Structure', completed: false },
  { id: 3, name: 'Document Upload', completed: false },
  { id: 4, name: 'Financial Information', completed: false },
  { id: 5, name: 'Compliance', completed: false },
  { id: 6, name: 'Complete', completed: false },
];

export default function KYBPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData>({
    // Business Information
    legalCompanyName: '',
    tradingName: '',
    entityType: '',
    registrationNumber: '',
    taxId: '',
    dateOfIncorporation: '',
    countryOfIncorporation: '',
    industry: '',
    companyWebsite: '',
    numberOfEmployees: '',
    registeredAddress: '',
    city: '',
    postalCode: '',
    country: '',
    contactName: '',
    position: '',
    email: '',
    phoneNumber: '',

    // Ownership Structure
    ownershipStructure: '',
    hasComplexStructure: false,
    ubos: [],

    // Document Upload
    documents: {
      certificateOfIncorporation: null,
      articlesOfAssociation: null,
      proofOfBusinessAddress: null,
      ownershipStructureChart: null,
      financialStatements: null,
    },

    // Financial Information
    annualRevenue: '',
    primarySourceOfFunds: '',
    expectedMonthlyTransactionVolume: '',
    businessPurpose: '',

    // Compliance
    regulatoryLicenses: '',
    hasPEP: false,
    operatesHighRiskIndustries: false,
    sanctionsCompliance: '',
    accurateInformation: false,
    notIllegalActivities: false,
    additionalInfoConsent: false,
    privacyPolicyConsent: false,
  });

  const updateBusinessData = (updates: Partial<BusinessData>) => {
    setBusinessData(prev => ({ ...prev, ...updates }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: { // Business Information
       const requiredBusinessFields = ['legalCompanyName', 'entityType', 'registrationNumber', 'email'];
       return requiredBusinessFields.every(field => 
         businessData[field as keyof BusinessData] && 
         String(businessData[field as keyof BusinessData]).trim() !== ''
       );
      }
      
      case 2: // Ownership Structure
        return businessData.ownershipStructure && businessData.ubos.length > 0;
      
      case 3: { // Document Upload
        const requiredDocs = ['certificateOfIncorporation', 'articlesOfAssociation', 'proofOfBusinessAddress', 'financialStatements'];
        return requiredDocs.every(doc => businessData.documents[doc as keyof typeof businessData.documents]);
      }

      case 4: { // Financial Information
        const requiredFinancialFields = ['annualRevenue', 'primarySourceOfFunds', 'expectedMonthlyTransactionVolume', 'businessPurpose'];
        return requiredFinancialFields.every(field => 
         businessData[field as keyof BusinessData] && 
         String(businessData[field as keyof BusinessData]).trim() !== ''
        );
      }
      
      case 5: // Compliance
        return businessData.accurateInformation && 
               businessData.notIllegalActivities && 
               businessData.additionalInfoConsent && 
               businessData.privacyPolicyConsent;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
     setError('Please complete all required fields before proceeding.');
      return;
    }
    
    if (currentStep < 6) {
      setError(null); // Clear error on successful navigation
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Here you would submit to your backend/Firebase
      console.log('Submitting KYB data:', businessData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setCurrentStep(6);
    } catch (error) {
      console.error('Error submitting KYB:', error);
      setError('Failed to submit KYB data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted && currentStep === 6) {
    return <ConfirmationStep />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-green-400 hover:text-green-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-green-400 mb-2">KYB Verification</h1>
          <p className="text-gray-300">Complete your business verification to access all TrustBridge features</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.id < currentStep 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : step.id === currentStep 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.id <= currentStep ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`ml-4 mr-4 h-0.5 w-16 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-red-400 mr-3 mt-1">⚠️</div>
              <div>
                <h4 className="text-red-300 font-medium mb-1">Submission Error</h4>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          {currentStep === 1 && (
            <BusinessInformationStep 
              data={businessData} 
              updateData={updateBusinessData}
            />
          )}
          {currentStep === 2 && (
            <OwnershipStructureStep 
              data={businessData} 
              updateData={updateBusinessData}
            />
          )}
          {currentStep === 3 && (
            <DocumentUploadStep 
              data={businessData} 
              updateData={updateBusinessData}
            />
          )}
          {currentStep === 4 && (
            <FinancialInformationStep 
              data={businessData} 
              updateData={updateBusinessData}
            />
          )}
          {currentStep === 5 && (
            <ComplianceStep 
              data={businessData} 
              updateData={updateBusinessData}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>
          
          {currentStep === 5 ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit KYB'
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}