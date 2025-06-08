import { useRef, useState } from 'react';
import { Upload, FileText, Users, MapPin, BarChart, X } from 'lucide-react';
import { BusinessData } from '@/app/kyb/page';

interface DocumentUploadStepProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

interface FileError {
  type: 'size' | 'type' | 'general';
  message: string;
}

export default function DocumentUploadStep({ data, updateData }: DocumentUploadStepProps) {
  const [fileErrors, setFileErrors] = useState<Record<string, FileError | null>>({});
  
  const fileInputRefs = {
    certificateOfIncorporation: useRef<HTMLInputElement>(null),
    articlesOfAssociation: useRef<HTMLInputElement>(null),
    proofOfBusinessAddress: useRef<HTMLInputElement>(null),
    ownershipStructureChart: useRef<HTMLInputElement>(null),
    financialStatements: useRef<HTMLInputElement>(null),
  };

  const validateFile = (file: File): FileError | null => {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        type: 'size',
        message: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 10MB limit`
      };
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return {
        type: 'type',
        message: 'Only PDF, PNG, and JPG files are allowed'
      };
    }

    return null;
  };

  const handleFileSelect = (documentType: keyof typeof data.documents, file: File | null) => {
    if (file) {
      const error = validateFile(file);
      if (error) {
        setFileErrors(prev => ({ ...prev, [documentType]: error }));
        // Clear the file input
        if (fileInputRefs[documentType].current) {
          fileInputRefs[documentType].current!.value = '';
        }
        return;
      }
      
      // Clear any previous error
      setFileErrors(prev => ({ ...prev, [documentType]: null }));
    }

    updateData({
      documents: {
        ...data.documents,
        [documentType]: file
      }
    });
  };

  const triggerFileInput = (documentType: keyof typeof data.documents) => {
    fileInputRefs[documentType].current?.click();
  };

  const documentTypes = [
    {
      key: 'certificateOfIncorporation' as keyof typeof data.documents,
      title: 'Certificate of Incorporation',
      description: 'Upload your company&apos;s certificate of incorporation or equivalent document',
      icon: FileText,
      required: true,
    },
    {
      key: 'articlesOfAssociation' as keyof typeof data.documents,
      title: 'Articles of Association',
      description: 'Upload your company&apos;s articles of association, bylaws, or equivalent document',
      icon: FileText,
      required: true,
    },
    {
      key: 'proofOfBusinessAddress' as keyof typeof data.documents,
      title: 'Proof of Business Address',
      description: 'Upload a utility bill, bank statement, or official document showing your business address (not older than 3 months)',
      icon: MapPin,
      required: true,
    },
    {
      key: 'ownershipStructureChart' as keyof typeof data.documents,
      title: 'Ownership Structure Chart',
      description: 'Upload a document showing your company&apos;s ownership structure (required for complex structures)',
      icon: Users,
      required: false,
    },
    {
      key: 'financialStatements' as keyof typeof data.documents,
      title: 'Financial Statements',
      description: 'Upload your most recent financial statements or annual report',
      icon: BarChart,
      required: true,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-400 mb-2">Document Upload</h2>
      <p className="text-gray-300 mb-6">Please upload the required company documents for verification</p>

      <div className="space-y-6">
        {documentTypes.map((docType) => {
          const IconComponent = docType.icon;
          const currentFile = data.documents[docType.key];
          const error = fileErrors[docType.key];
          
          return (
            <div key={docType.key} className="border border-gray-600 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    currentFile ? 'bg-green-500' : 'bg-gray-600'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {docType.title}
                    {docType.required && <span className="text-red-400 ml-1">*</span>}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{docType.description}</p>
                  
                  {currentFile ? (
                    <div className="bg-green-900 border border-green-700 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-sm">{currentFile.name}</span>
                          <span className="text-green-400 text-xs">
                            ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => handleFileSelect(docType.key, null)}
                          className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => triggerFileInput(docType.key)}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        error 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 hover:border-green-500'
                      }`}
                    >
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${
                        error ? 'text-red-400' : 'text-gray-400'
                      }`} />
                      <p className={`mb-2 ${error ? 'text-red-300' : 'text-gray-400'}`}>
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-500 text-xs">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  )}

                  {/* File Error Display */}
                  {error && (
                    <div className="bg-red-900 border border-red-700 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <X className="w-4 h-4 text-red-400 mt-0.5" />
                        <div>
                          <p className="text-red-300 text-sm font-medium">Upload Error</p>
                          <p className="text-red-200 text-sm">{error.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => triggerFileInput(docType.key)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    {currentFile ? 'Replace File' : 'Choose File'}
                  </button>
                  
                  <input
                    ref={fileInputRefs[docType.key]}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileSelect(docType.key, file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Document Requirements */}
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-yellow-400 mr-3 mt-1">⚠️</div>
            <div>
              <h4 className="text-yellow-300 font-medium mb-2">Document Requirements</h4>
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>• Documents must be clear and readable</li>
                <li>• All information must be visible</li>
                <li>• File formats: JPEG, PNG, or PDF</li>
                <li>• Maximum file size: 10MB per document</li>
                <li>• Documents must be in English or accompanied by a certified translation</li>
                <li>• Files marked with (*) are required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}