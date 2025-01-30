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

  // 新增評分相關的 state
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [currentReferenceObject, setCurrentReferenceObject] = useState(null);
  const [scoreFormData, setScoreFormData] = useState({
    objectBuildScorer: '',
    objectBuildScorRate: '',
    objectBuildScorReason: '',
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

  // 處理評分表單提交
  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingScore) {
        response = await axios.put(
          `${API_URL}/api/referenceObjects/${currentReferenceObject._id}/scores/${editingScore._id}`,
          scoreFormData,
        );
      } else {
        response = await axios.post(
          `${API_URL}/api/referenceObjects/${currentReferenceObject._id}/scores`,
          scoreFormData,
        );
      }

      // 更新列表
      const updatedList = referenceObjects.map((item) =>
        item._id === currentReferenceObject._id ? response.data : item,
      );
      setReferenceObjects(updatedList);

      // 重置表單
      setShowScoreModal(false);
      setEditingScore(null);
      setCurrentReferenceObject(null);
      setScoreFormData({
        objectBuildScorer: '',
        objectBuildScorRate: '',
        objectBuildScorReason: '',
      });

      toast.success(editingScore ? '評分已更新' : '評分已新增');
    } catch (error) {
      toast.error(editingScore ? '更新評分失敗' : '新增評分失敗');
    }
  };

  // 處理刪除評分
  const handleDeleteScore = async (referenceObjectId, scoreId) => {
    if (window.confirm('確定要刪除此評分嗎？')) {
      try {
        await axios.delete(
          `${API_URL}/api/referenceObjects/${referenceObjectId}/scores/${scoreId}`,
        );

        // 更新列表
        const response = await axios.get(
          `${API_URL}/api/case/${caseId}/referenceObjects`,
        );
        setReferenceObjects(response.data);

        toast.success('評分已刪除');
      } catch (error) {
        toast.error('刪除評分失敗');
      }
    }
  };

  // 處理編輯評分
  const handleEditScore = (referenceObject, score) => {
    setCurrentReferenceObject(referenceObject);
    setEditingScore(score);
    setScoreFormData({
      objectBuildScorer: score.objectBuildScorer,
      objectBuildScorRate: score.objectBuildScorRate,
      objectBuildScorReason: score.objectBuildScorReason,
    });
    setShowScoreModal(true);
  };

  // 格式化日期
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('zh-TW') : '';
  };

  // 新增一個格式化數字的函數
  const formatNumber = (number) => {
    return number?.toLocaleString('zh-TW');
  };

  // 計算單價的函數
  const calculateUnitPrice = (totalPrice, buildArea) => {
    if (!totalPrice || !buildArea || buildArea === 0) return 0;
    return Math.round(totalPrice / buildArea);
  };

  // 格式化金額的函數
  const formatCurrency = (number) => {
    return number?.toLocaleString('zh-TW');
  };

  // 計算 adjustedPrice 平均值的函數
  const calculateAverageAdjustedPrice = () => {
    if (!referenceObjects || referenceObjects.length === 0) return 0;
    const total = referenceObjects.reduce(
      (sum, obj) => sum + (obj.adjustedPrice || 0),
      0,
    );
    return Math.round(total / referenceObjects.length);
  };

  // 計算 adjustedPrice 總和的函數
  const calculateTotalAdjustedPrice = () => {
    return referenceObjects.reduce(
      (sum, item) => sum + (item.adjustedPrice || 0),
      0,
    );
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium text-gray-900">參考物件</h2>
          {referenceObjects.length > 0 && (
            <span className="text-sm text-gray-500">
              (平均調整後價格：{formatNumber(calculateAverageAdjustedPrice())}
              元)
            </span>
          )}
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setEditing(null);
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
                參考物件資訊
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                評分資訊
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referenceObjects.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 space-y-1">
                    <p>地址：{item.objectBuildAddress}</p>
                    {item.objectBuildHouseAge && (
                      <p>屋齡：{item.objectBuildHouseAge.toFixed(2)}年</p>
                    )}
                    {item.objectBuildFloorHeight && (
                      <p>樓高：{item.objectBuildFloorHeight}</p>
                    )}
                    {item.objectBuildTransactionDate && (
                      <p>
                        成交日期：{formatDate(item.objectBuildTransactionDate)}
                      </p>
                    )}
                    {item.objectBuildTotalPrice && (
                      <p>
                        總價：{formatCurrency(item.objectBuildTotalPrice)}元
                      </p>
                    )}
                    {item.objectBuildBuildArea && (
                      <p>建坪：{item.objectBuildBuildArea.toFixed(2)}坪</p>
                    )}
                    {item.objectBuildTotalPrice &&
                      item.objectBuildBuildArea && (
                        <p>
                          單價：
                          {formatNumber(
                            calculateUnitPrice(
                              item.objectBuildTotalPrice,
                              item.objectBuildBuildArea,
                            ),
                          )}
                          元/坪
                        </p>
                      )}
                    {item.objectBuildSubBuildArea > 0 && (
                      <p>
                        增建坪數：{item.objectBuildSubBuildArea.toFixed(2)}坪
                      </p>
                    )}
                    {item.objectBuildStatus && (
                      <p>狀態：{item.objectBuildStatus}</p>
                    )}
                  </div>
                  {item.objectBuildUrl && (
                    <a
                      href={item.objectBuildUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                    >
                      查看附件
                    </a>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {item.scores?.length > 0 ? (
                      <>
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                勘查員
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                加成
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                原因
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                                操作
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {item.scores.map((score) => (
                              <tr key={score._id}>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {score.objectBuildScorer}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {(score.objectBuildScorRate >= 0 ? '+' : '') +
                                    score.objectBuildScorRate.toFixed(2)}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="max-w-xs overflow-hidden text-ellipsis">
                                    {score.objectBuildScorReason}
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-right">
                                  <button
                                    onClick={() => handleEditScore(item, score)}
                                    className="text-indigo-600 hover:text-indigo-900 text-xs mr-2"
                                  >
                                    編輯
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteScore(item._id, score._id)
                                    }
                                    className="text-red-600 hover:text-red-900 text-xs"
                                  >
                                    刪除
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {/* 新增調整後單價顯示 */}
                        <div className="mt-3 bg-gray-50 p-2 rounded">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-700">
                              調整後單價：
                            </span>
                            <span className="text-gray-900">
                              {item.adjustedPrice > 0 ? (
                                <>
                                  {formatNumber(item.adjustedPrice)}
                                  <span className="text-gray-500 text-xs ml-1">
                                    元/坪
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-500">尚未計算</span>
                              )}
                            </span>
                          </div>
                          {/* 顯示原始單價作為參考 */}
                          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                            <span>原始單價：</span>
                            <span>
                              {item.objectBuildTotalPrice &&
                              item.objectBuildBuildArea
                                ? `${formatNumber(
                                    Math.round(
                                      item.objectBuildTotalPrice /
                                        item.objectBuildBuildArea,
                                    ),
                                  )} 元/坪`
                                : '尚未設定'}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        尚無評分資料
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setCurrentReferenceObject(item);
                        setEditingScore(null);
                        setScoreFormData({
                          objectBuildScorer: '',
                          objectBuildScorRate: '',
                          objectBuildScorReason: '',
                        });
                        setShowScoreModal(true);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                    >
                      + 新增評分
                    </button>
                  </div>
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

      {/* 評分 Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingScore ? '編輯評分' : '新增評分'}
            </h3>
            <form onSubmit={handleScoreSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  勘查員
                </label>
                <input
                  type="text"
                  value={scoreFormData.objectBuildScorer}
                  onChange={(e) =>
                    setScoreFormData({
                      ...scoreFormData,
                      objectBuildScorer: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  加成
                </label>
                <input
                  type="number"
                  value={scoreFormData.objectBuildScorRate}
                  onChange={(e) => {
                    const value = e.target.value;
                    // 驗證是否在 -1 到 1 之間，且最多兩位小數
                    if (
                      value === '' ||
                      (/^-?\d*\.?\d{0,2}$/.test(value) &&
                        parseFloat(value) >= -1 &&
                        parseFloat(value) <= 1)
                    ) {
                      setScoreFormData({
                        ...scoreFormData,
                        objectBuildScorRate: value,
                      });
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  min="-1"
                  max="1"
                  step="0.01"
                  placeholder="請輸入-1.00 ~ 1.00 之間的數值"
                />
                <p className="mt-1 text-sm text-gray-500">
                  請輸入-1.00 到 1.00 之間的數值，最多兩位小數
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  加成原因
                </label>
                <textarea
                  value={scoreFormData.objectBuildScorReason}
                  onChange={(e) =>
                    setScoreFormData({
                      ...scoreFormData,
                      objectBuildScorReason: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowScoreModal(false);
                    setEditingScore(null);
                    setCurrentReferenceObject(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingScore ? '更新' : '新增'}
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
