import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';
import { convertToPing } from '../../utils/calculate';

// 添加建物型選項常數
const BUILD_TYPE_OPTIONS = [
  '公設',
  '公寓-5樓含以下無電梯',
  '透天厝',
  '店面-店舖',
  '辦公商業大樓',
  '住宅大樓-11層含以上有電梯',
  '華廈-10層含以下有電梯',
  '套房',
  '農舍',
  '增建-持分後坪數打對折',
];

// 添加使用分區選項常數
const USE_PARTITION_OPTIONS = [
  '第一種住宅區',
  '第二種住宅區',
  '第三種住宅區',
  '第四種住宅區',
  '第五種住宅區',
  '第一種商業區',
  '第二種商業區',
  '第三種商業區',
  '第四種商業區',
  '第二種工業區',
  '第三種工業區',
  '行政區',
  '文教區',
  '倉庫區',
  '風景區',
  '農業區',
  '保護區',
  '行水區',
  '保存區',
  '特定專用區',
];

function BuildList({ caseId, initialBuilds = [] }) {
  const [builds, setBuilds] = useState(initialBuilds);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [editingBuild, setEditingBuild] = useState(null);
  const [buildFormData, setBuildFormData] = useState({
    buildNumber: '',
    buildUrl: '',
    buildArea: '',
    buildHoldingPointPersonal: '',
    buildHoldingPointAll: '',
    buildTypeUse: '',
    buildUsePartition: '',
    buildRemark: '',
    buildAncillaryBuildingUseBy: '',
    buildAncillaryBuildingArea: '',
  });

  // 計算建物總面積
  const calculateTotalBuildArea = (builds) => {
    const totalArea = builds.reduce(
      (sum, build) => sum + (build.calculatedArea || 0),
      0,
    );
    const totalPing = convertToPing(totalArea);
    return {
      area: Math.round(totalArea * 100) / 100,
      ping: totalPing,
    };
  };

  // 處理建物資訊表單提交
  const handleBuildSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBuild) {
        await axios.put(
          `${API_URL}/api/builds/${editingBuild._id}`,
          buildFormData,
        );
        toast.success('建物資訊已更新');
      } else {
        await axios.post(`${API_URL}/api/case/${caseId}/builds`, buildFormData);
        toast.success('建物資訊已新增');
      }

      // 重新獲取建物資訊列表
      const response = await axios.get(`${API_URL}/api/case/${caseId}/builds`);
      setBuilds(response.data);

      // 重置表單
      setShowBuildModal(false);
      setEditingBuild(null);
      setBuildFormData({
        buildNumber: '',
        buildUrl: '',
        buildArea: '',
        buildHoldingPointPersonal: '',
        buildHoldingPointAll: '',
        buildTypeUse: '',
        buildUsePartition: '',
        buildRemark: '',
        buildAncillaryBuildingUseBy: '',
        buildAncillaryBuildingArea: '',
      });
    } catch (error) {
      toast.error(editingBuild ? '更新建物資訊失敗' : '新增建物資訊失敗');
    }
  };

  // 處理建物資訊刪除
  const handleDeleteBuild = async (buildId) => {
    if (window.confirm('確定要刪除此建物資訊嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/builds/${buildId}`);
        toast.success('建物資訊已刪除');
        setBuilds(builds.filter((build) => build._id !== buildId));
      } catch (error) {
        toast.error('刪除建物資訊失敗');
      }
    }
  };

  // 處理編輯建物資訊
  const handleEditBuild = (build) => {
    setEditingBuild(build);
    setBuildFormData({
      buildNumber: build.buildNumber,
      buildUrl: build.buildUrl || '',
      buildArea: build.buildArea,
      buildHoldingPointPersonal: build.buildHoldingPointPersonal,
      buildHoldingPointAll: build.buildHoldingPointAll,
      buildTypeUse: build.buildTypeUse,
      buildUsePartition: build.buildUsePartition,
      buildRemark: build.buildRemark || '',
      buildAncillaryBuildingUseBy: build.buildAncillaryBuildingUseBy || '',
      buildAncillaryBuildingArea: build.buildAncillaryBuildingArea || '',
    });
    setShowBuildModal(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">建物資訊</h3>
          {builds.length > 0 && (
            <span className="ml-4 text-sm text-gray-600">
              總面積: {calculateTotalBuildArea(builds).area} m² /{' '}
              {calculateTotalBuildArea(builds).ping} 坪
            </span>
          )}
        </div>
        <button
          onClick={() => {
            setEditingBuild(null);
            setBuildFormData({
              buildNumber: '',
              buildUrl: '',
              buildArea: '',
              buildHoldingPointPersonal: '',
              buildHoldingPointAll: '',
              buildTypeUse: '',
              buildUsePartition: '',
              buildRemark: '',
              buildAncillaryBuildingUseBy: '',
              buildAncillaryBuildingArea: '',
            });
            setShowBuildModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增建物資訊
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建號
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                謄本
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建坪
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                持分
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                計算後面積
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建物型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                使用分區
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
            {builds.map((build) => (
              <tr key={build._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {build.buildNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {build.buildUrl && (
                    <a
                      href={build.buildUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      查看謄本
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {build.buildArea} m²
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {build.buildHoldingPointPersonal}/{build.buildHoldingPointAll}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                  {build.calculatedArea} m²
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {build.buildTypeUse}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {build.buildUsePartition}
                </td>
                <td className="px-6 py-4">{build.buildRemark}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditBuild(build)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeleteBuild(build._id)}
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

      {/* 建物資訊表單 Modal */}
      {showBuildModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingBuild ? '編輯建物資訊' : '新增建物資訊'}
            </h3>
            <form onSubmit={handleBuildSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    建號
                  </label>
                  <input
                    type="text"
                    value={buildFormData.buildNumber}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildNumber: e.target.value,
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
                    value={buildFormData.buildUrl}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildUrl: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    建坪(平方公尺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={buildFormData.buildArea}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildArea: e.target.value,
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
                    value={buildFormData.buildHoldingPointPersonal}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildHoldingPointPersonal: e.target.value,
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
                    value={buildFormData.buildHoldingPointAll}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildHoldingPointAll: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    建物型
                  </label>
                  <select
                    value={buildFormData.buildTypeUse}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildTypeUse: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">請選擇建物型</option>
                    {BUILD_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    使用分區
                  </label>
                  <select
                    value={buildFormData.buildUsePartition}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildUsePartition: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">請選擇使用分區</option>
                    {USE_PARTITION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    備註
                  </label>
                  <input
                    type="text"
                    value={buildFormData.buildRemark}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildRemark: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    附屬建物用途
                  </label>
                  <input
                    type="text"
                    value={buildFormData.buildAncillaryBuildingUseBy}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildAncillaryBuildingUseBy: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    附屬建物面積
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={buildFormData.buildAncillaryBuildingArea}
                    onChange={(e) =>
                      setBuildFormData({
                        ...buildFormData,
                        buildAncillaryBuildingArea: e.target.value,
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
                    setShowBuildModal(false);
                    setEditingBuild(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md border border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  {editingBuild ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuildList;
