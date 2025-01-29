import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';
import { convertToPing } from '../../utils/calculate';

function LandList({ caseId, initialLands = [] }) {
  const [lands, setLands] = useState(initialLands);
  const [showLandModal, setShowLandModal] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  const [landFormData, setLandFormData] = useState({
    landNumber: '',
    landUrl: '',
    landArea: '',
    landHoldingPointPersonal: '',
    landHoldingPointAll: '',
    landRemark: '',
  });

  // 計算總面積
  const calculateTotalArea = (lands) => {
    const totalArea = lands.reduce(
      (sum, land) => sum + (land.calculatedArea || 0),
      0,
    );
    const totalPing = convertToPing(totalArea);
    return {
      area: Math.round(totalArea * 100) / 100,
      ping: totalPing,
    };
  };

  // 處理土地資訊表單提交
  const handleLandSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLand) {
        await axios.put(
          `${API_URL}/api/lands/${editingLand._id}`,
          landFormData,
        );
        toast.success('土地資訊已更新');
      } else {
        await axios.post(`${API_URL}/api/case/${caseId}/lands`, landFormData);
        toast.success('土地資訊已新增');
      }

      // 重新獲取土地資訊列表
      const response = await axios.get(`${API_URL}/api/case/${caseId}/lands`);
      setLands(response.data);

      // 重置表單
      setShowLandModal(false);
      setEditingLand(null);
      setLandFormData({
        landNumber: '',
        landUrl: '',
        landArea: '',
        landHoldingPointPersonal: '',
        landHoldingPointAll: '',
        landRemark: '',
      });
    } catch (error) {
      toast.error(editingLand ? '更新土地資訊失敗' : '新增土地資訊失敗');
    }
  };

  // 處理土地資訊刪除
  const handleDeleteLand = async (landId) => {
    if (window.confirm('確定要刪除此土地資訊嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/lands/${landId}`);
        toast.success('土地資訊已刪除');
        setLands(lands.filter((land) => land._id !== landId));
      } catch (error) {
        toast.error('刪除土地資訊失敗');
      }
    }
  };

  // 處理編輯土地資訊
  const handleEditLand = (land) => {
    setEditingLand(land);
    setLandFormData({
      landNumber: land.landNumber,
      landUrl: land.landUrl || '',
      landArea: land.landArea,
      landHoldingPointPersonal: land.landHoldingPointPersonal,
      landHoldingPointAll: land.landHoldingPointAll,
      landRemark: land.landRemark || '',
    });
    setShowLandModal(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">土地資訊</h3>
          {lands.length > 0 && (
            <span className="ml-4 text-sm text-gray-600">
              總面積: {calculateTotalArea(lands).area} m² /{' '}
              {calculateTotalArea(lands).ping} 坪
            </span>
          )}
        </div>
        <button
          onClick={() => {
            setEditingLand(null);
            setLandFormData({
              landNumber: '',
              landUrl: '',
              landArea: '',
              landHoldingPointPersonal: '',
              landHoldingPointAll: '',
              landRemark: '',
            });
            setShowLandModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增土地資訊
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                地號
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                謄本
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                地坪
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                持分
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                計算後面積
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                備註
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lands.map((land) => (
              <tr key={land._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {land.landNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {land.landUrl && (
                    <a
                      href={land.landUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      查看謄本
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {land.landArea} m²
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {land.landHoldingPointPersonal}/{land.landHoldingPointAll}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                  {land.calculatedArea} m²
                </td>
                <td className="px-6 py-4">{land.landRemark}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditLand(land)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeleteLand(land._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 土地資訊表單 Modal */}
      {showLandModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingLand ? '編輯土地資訊' : '新增土地資訊'}
            </h3>
            <form onSubmit={handleLandSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    地號
                  </label>
                  <input
                    type="text"
                    value={landFormData.landNumber}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        landNumber: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    謄本連結
                  </label>
                  <input
                    type="url"
                    value={landFormData.landUrl}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        landUrl: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    地坪(平方公尺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={landFormData.landArea}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        landArea: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    個人持分
                  </label>
                  <input
                    type="text"
                    value={landFormData.landHoldingPointPersonal}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        landHoldingPointPersonal: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    所有持分
                  </label>
                  <input
                    type="text"
                    value={landFormData.landHoldingPointAll}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        landHoldingPointAll: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    備註
                  </label>
                  <input
                    type="text"
                    value={landFormData.landRemark}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        landRemark: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowLandModal(false);
                    setEditingLand(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md border border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  {editingLand ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandList;
