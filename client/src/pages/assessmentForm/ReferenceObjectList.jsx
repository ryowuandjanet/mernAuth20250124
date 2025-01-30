import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

function ReferenceObjectList({ caseId, initialReferenceObjects }) {
  const [referenceObjects, setReferenceObjects] = useState(
    initialReferenceObjects,
  );
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    objectBuildAddress: '',
    objectBuildTotalPrice: '',
    objectBuildBuildArea: '',
    objectBuildSubBuildArea: '',
    objectBuildHouseAge: '',
    objectBuildFloorHeight: '',
    objectBuildStatus: '',
    objectBuildTransactionDate: '',
    objectBuildUrl: '',
  });

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await axios.put(
          `${API_URL}/api/referenceObjects/${editing._id}`,
          formData,
        );
        toast.success('參考物件已更新');
      } else {
        response = await axios.post(
          `${API_URL}/api/case/${caseId}/referenceObjects`,
          formData,
        );
        toast.success('參考物件已新增');
      }

      // 更新列表
      const updatedList = editing
        ? referenceObjects.map((item) =>
            item._id === editing._id ? response.data : item,
          )
        : [...referenceObjects, response.data];
      setReferenceObjects(updatedList);

      // 重置表單
      setShowModal(false);
      setEditing(null);
      setFormData({
        objectBuildAddress: '',
        objectBuildTotalPrice: '',
        objectBuildBuildArea: '',
        objectBuildSubBuildArea: '',
        objectBuildHouseAge: '',
        objectBuildFloorHeight: '',
        objectBuildStatus: '',
        objectBuildTransactionDate: '',
        objectBuildUrl: '',
      });
    } catch (error) {
      toast.error(editing ? '更新參考物件失敗' : '新增參考物件失敗');
    }
  };

  // 處理刪除
  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此參考物件嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/referenceObjects/${id}`);
        setReferenceObjects(referenceObjects.filter((item) => item._id !== id));
        toast.success('參考物件已刪除');
      } catch (error) {
        toast.error('刪除參考物件失敗');
      }
    }
  };

  // 處理編輯
  const handleEdit = (referenceObject) => {
    setEditing(referenceObject);
    setFormData({
      objectBuildAddress: referenceObject.objectBuildAddress,
      objectBuildTotalPrice: referenceObject.objectBuildTotalPrice,
      objectBuildBuildArea: referenceObject.objectBuildBuildArea,
      objectBuildSubBuildArea: referenceObject.objectBuildSubBuildArea || '',
      objectBuildHouseAge: referenceObject.objectBuildHouseAge || '',
      objectBuildFloorHeight: referenceObject.objectBuildFloorHeight || '',
      objectBuildStatus: referenceObject.objectBuildStatus || '',
      objectBuildTransactionDate: referenceObject.objectBuildTransactionDate
        ? new Date(referenceObject.objectBuildTransactionDate)
            .toISOString()
            .split('T')[0]
        : '',
      objectBuildUrl: referenceObject.objectBuildUrl || '',
    });
    setShowModal(true);
  };

  // 格式化日期
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('zh-TW') : '';
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">參考物件</h3>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({
              objectBuildAddress: '',
              objectBuildTotalPrice: '',
              objectBuildBuildArea: '',
              objectBuildSubBuildArea: '',
              objectBuildHouseAge: '',
              objectBuildFloorHeight: '',
              objectBuildStatus: '',
              objectBuildTransactionDate: '',
              objectBuildUrl: '',
            });
            setShowModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增參考物件
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                地址
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                總價(NT)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建坪(坪)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                增建坪數
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                屋齡
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                樓高
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                成交日期
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referenceObjects.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.objectBuildAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.objectBuildTotalPrice?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.objectBuildBuildArea}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.objectBuildSubBuildArea}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.objectBuildHouseAge}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.objectBuildFloorHeight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.objectBuildStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(item.objectBuildTransactionDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
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

      {/* 新增/編輯 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editing ? '編輯參考物件' : '新增參考物件'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    地址
                  </label>
                  <input
                    type="text"
                    value={formData.objectBuildAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildAddress: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    總價(NT)
                  </label>
                  <input
                    type="number"
                    value={formData.objectBuildTotalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildTotalPrice: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    建坪(坪)
                  </label>
                  <input
                    type="number"
                    value={formData.objectBuildBuildArea}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildBuildArea: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    增建坪數(坪)
                  </label>
                  <input
                    type="number"
                    value={formData.objectBuildSubBuildArea}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildSubBuildArea: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    屋齡(年)
                  </label>
                  <input
                    type="number"
                    value={formData.objectBuildHouseAge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildHouseAge: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    樓高
                  </label>
                  <input
                    type="text"
                    value={formData.objectBuildFloorHeight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildFloorHeight: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    狀態
                  </label>
                  <input
                    type="text"
                    value={formData.objectBuildStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildStatus: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    成交日期
                  </label>
                  <input
                    type="date"
                    value={formData.objectBuildTransactionDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildTransactionDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    附件URL
                  </label>
                  <input
                    type="url"
                    value={formData.objectBuildUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        objectBuildUrl: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editing ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferenceObjectList;
