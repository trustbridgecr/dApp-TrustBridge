import { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { BusinessData } from '@/app/kyb/page';

interface OwnershipStructureStepProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

export default function OwnershipStructureStep({ data, updateData }: OwnershipStructureStepProps) {
  const [uboCounter, setUboCounter] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const addUBO = () => {
    const newUBO = {
      id: crypto.randomUUID(), // More robust ID generation
      fullName: '',
      nationality: '',
      dateOfBirth: '',
      ownershipPercentage: '',
      position: ''
    };
    updateData({
      ubos: [...data.ubos, newUBO]
    });
    setUboCounter(prev => prev + 1);
  };

  const removeUBO = (id: string) => {
    updateData({
      ubos: data.ubos.filter(ubo => ubo.id !== id)
    });
    // Clear validation errors for removed UBO
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.includes(id)) {
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  };

  const updateUBO = (id: string, field: string, value: string) => {
    // Special validation for ownership percentage
    if (field === 'ownershipPercentage') {
      // Allow only numbers and decimal point
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      
      // Prevent values over 100%
      if (sanitizedValue && parseFloat(sanitizedValue) > 100) {
        return;
      }
      
      // Clear error when user fixes the value
      const errorKey = `${id}_${field}`;
      if (validationErrors[errorKey] && sanitizedValue) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
      
      updateData({
        ubos: data.ubos.map(ubo => 
          ubo.id === id ? { ...ubo, [field]: sanitizedValue } : ubo
        )
      });
    } else {
      updateData({
        ubos: data.ubos.map(ubo => 
          ubo.id === id ? { ...ubo, [field]: value } : ubo
        )
      });
    }
  };

  const validateUBOField = (uboId: string, field: string, value: string) => {
    const errorKey = `${uboId}_${field}`;
    const newErrors = { ...validationErrors };

    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          newErrors[errorKey] = 'Full name is required';
        } else {
          delete newErrors[errorKey];
        }
        break;
      case 'ownershipPercentage':
        if (!value) {
          newErrors[errorKey] = 'Ownership percentage is required';
        } else if (parseFloat(value) <= 0) {
          newErrors[errorKey] = 'Ownership percentage must be greater than 0';
        } else {
          delete newErrors[errorKey];
        }
        break;
      case 'dateOfBirth':
        if (!value) {
          newErrors[errorKey] = 'Date of birth is required';
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) {
            newErrors[errorKey] = 'UBO must be at least 18 years old';
          } else {
            delete newErrors[errorKey];
          }
        }
        break;
    }

    setValidationErrors(newErrors);
  };

  // Calculate total ownership percentage
  const totalOwnership = data.ubos.reduce((total, ubo) => {
    const percentage = parseFloat(ubo.ownershipPercentage) || 0;
    return total + percentage;
  }, 0);

  const getTotalOwnershipError = () => {
    if (data.ubos.length > 0 && totalOwnership > 100) {
      return 'Total ownership percentage cannot exceed 100%';
    }
    return null;
  };

  const getFieldClassName = (fieldName: string, hasError: boolean, value: string) => {
    const baseClasses = "w-full px-3 py-2 bg-gray-600 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2";
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500`;
    }
    
    if (value && !hasError) {
      return `${baseClasses} border-green-500 focus:ring-green-500`;
    }
    
    return `${baseClasses} border-gray-500 focus:ring-green-500`;
  };

  useEffect(() => {
    // Validate total ownership when UBOs change
    const totalError = getTotalOwnershipError();
    if (totalError) {
      setValidationErrors(prev => ({ ...prev, totalOwnership: totalError }));
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.totalOwnership;
        return newErrors;
      });
    }
  }, [data.ubos]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-400 mb-2">Ownership Structure</h2>
      <p className="text-gray-300 mb-6">Please provide details about your company&apos;s ownership structure</p>

      <div className="space-y-6">
        {/* Company Structure */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company Structure</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ownership Structure <span className="text-red-400">*</span>
            </label>
            <select
              value={data.ownershipStructure}
              onChange={(e) => updateData({ ownershipStructure: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select structure type</option>
              <option value="simple">Simple Structure</option>
              <option value="complex">Complex Structure</option>
              <option value="trust">Trust Structure</option>
              <option value="holding">Holding Company</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.hasComplexStructure}
                onChange={(e) => updateData({ hasComplexStructure: e.target.checked })}
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-300">
                This company has a complex ownership structure
              </span>
            </label>
          </div>
        </div>

        {/* Ultimate Beneficial Owners */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              Ultimate Beneficial Owners (UBOs) <span className="text-red-400">*</span>
            </h3>
            <button
              onClick={addUBO}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add UBO
            </button>
          </div>

          {/* Total Ownership Display */}
          {data.ubos.length > 0 && (
            <div className={`mb-4 p-3 rounded-lg border ${
              totalOwnership > 100 
                ? 'bg-red-900 border-red-700' 
                : totalOwnership === 100 
                ? 'bg-green-900 border-green-700' 
                : 'bg-yellow-900 border-yellow-700'
            }`}>
              <div className="flex items-center space-x-2">
                {totalOwnership > 100 && <AlertCircle className="w-4 h-4 text-red-400" />}
                <span className={`text-sm font-medium ${
                  totalOwnership > 100 ? 'text-red-300' : 
                  totalOwnership === 100 ? 'text-green-300' : 'text-yellow-300'
                }`}>
                  Total Ownership: {totalOwnership.toFixed(1)}%
                </span>
              </div>
              {validationErrors.totalOwnership && (
                <p className="text-red-200 text-xs mt-1">{validationErrors.totalOwnership}</p>
              )}
            </div>
          )}

          {data.ubos.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-600 rounded-lg">
              <p>No UBOs added yet. Click &quot;Add UBO&quot; to get started.</p>
              <p className="text-xs mt-2">At least one UBO is required for verification.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.ubos.map((ubo, index) => (
                <div key={ubo.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-white">UBO #{index + 1}</h4>
                    <button
                      onClick={() => removeUBO(ubo.id)}
                      className="text-red-400 hover:text-red-300 flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={ubo.fullName}
                        onChange={(e) => updateUBO(ubo.id, 'fullName', e.target.value)}
                        onBlur={(e) => validateUBOField(ubo.id, 'fullName', e.target.value)}
                        placeholder="John Doe"
                        className={getFieldClassName(`${ubo.id}_fullName`, !!validationErrors[`${ubo.id}_fullName`], ubo.fullName)}
                      />
                      {validationErrors[`${ubo.id}_fullName`] && (
                        <p className="mt-1 text-sm text-red-400">{validationErrors[`${ubo.id}_fullName`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={ubo.nationality}
                        onChange={(e) => updateUBO(ubo.id, 'nationality', e.target.value)}
                        placeholder="United States"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date of Birth <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={ubo.dateOfBirth}
                        onChange={(e) => updateUBO(ubo.id, 'dateOfBirth', e.target.value)}
                        onBlur={(e) => validateUBOField(ubo.id, 'dateOfBirth', e.target.value)}
                        className={getFieldClassName(`${ubo.id}_dateOfBirth`, !!validationErrors[`${ubo.id}_dateOfBirth`], ubo.dateOfBirth)}
                      />
                      {validationErrors[`${ubo.id}_dateOfBirth`] && (
                        <p className="mt-1 text-sm text-red-400">{validationErrors[`${ubo.id}_dateOfBirth`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ownership Percentage <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={ubo.ownershipPercentage}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            if (parseFloat(value) <= 100 || value === '') {
                              updateUBO(ubo.id, 'ownershipPercentage', value);
                            }
                          }}
                          onBlur={(e) => validateUBOField(ubo.id, 'ownershipPercentage', e.target.value)}
                          placeholder="25"
                          className={getFieldClassName(`${ubo.id}_ownershipPercentage`, !!validationErrors[`${ubo.id}_ownershipPercentage`], ubo.ownershipPercentage) + ' pr-8'}
                        />
                        <span className="absolute right-3 top-2 text-gray-400">%</span>
                      </div>
                      {validationErrors[`${ubo.id}_ownershipPercentage`] && (
                        <p className="mt-1 text-sm text-red-400">{validationErrors[`${ubo.id}_ownershipPercentage`]}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={ubo.position}
                        onChange={(e) => updateUBO(ubo.id, 'position', e.target.value)}
                        placeholder="Director"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Information Box */}
          <div className="mt-6 bg-blue-900 border border-blue-700 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-400 mr-3 mt-1">ℹ️</div>
              <div>
                <h4 className="text-blue-300 font-medium mb-1">What is a UBO?</h4>
                <p className="text-blue-200 text-sm">
                  An Ultimate Beneficial Owner (UBO) is any individual who ultimately owns or controls more than 25% of a company&apos;s 
                  shares or voting rights, or who otherwise exercises control over the company or its management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}