import { Plus, Trash2 } from 'lucide-react';
import { BusinessData } from '@/app/kyb/page';

interface OwnershipStructureStepProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

export default function OwnershipStructureStep({ data, updateData }: OwnershipStructureStepProps) {
  const addUBO = () => {
    const newUBO = {
      id: Date.now().toString(),
      fullName: '',
      nationality: '',
      dateOfBirth: '',
      ownershipPercentage: '',
      position: ''
    };
    updateData({
      ubos: [...data.ubos, newUBO]
    });
  };

  const removeUBO = (id: string) => {
    updateData({
      ubos: data.ubos.filter(ubo => ubo.id !== id)
    });
  };

  const updateUBO = (id: string, field: string, value: string) => {
    updateData({
      ubos: data.ubos.map(ubo => 
        ubo.id === id ? { ...ubo, [field]: value } : ubo
      )
    });
  };

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
              Ownership Structure
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
            <h3 className="text-lg font-semibold text-white">Ultimate Beneficial Owners (UBOs)</h3>
            <button
              onClick={addUBO}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add UBO
            </button>
          </div>

          {data.ubos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No UBOs added yet. Click &quot;Add UBO&quot; to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.ubos.map((ubo, index) => (
                <div key={ubo.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-white">UBO #{index + 1}</h4>
                    <button
                      onClick={() => removeUBO(ubo.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={ubo.fullName}
                        onChange={(e) => updateUBO(ubo.id, 'fullName', e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
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
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={ubo.dateOfBirth}
                        onChange={(e) => updateUBO(ubo.id, 'dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ownership Percentage
                      </label>
                      <input
                        type="text"
                        value={ubo.ownershipPercentage}
                        onChange={(e) => updateUBO(ubo.id, 'ownershipPercentage', e.target.value)}
                        placeholder="25%"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
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