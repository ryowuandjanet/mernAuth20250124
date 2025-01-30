import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

function AuctionList({ caseId, initialAuctions, setAuctions, totalArea }) {
  const [auctions, setLocalAuctions] = useState(initialAuctions || []);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    auctionType: '一拍',
    auctionDate: '',
    auctionFloorPrice: 0,
    auctionClick: 0,
    auctionMonitor: 0,
    auctionCaseCount: 0,
    auctionMargin: 0,
  });

  // 拍別選項
  const auctionTypes = ['一拍', '二拍', '三拍', '四拍'];

  // 當 initialAuctions 更新時，更新本地狀態
  useEffect(() => {
    setLocalAuctions(initialAuctions);
  }, [initialAuctions]);

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await axios.put(
          `${API_URL}/api/auctions/${editing._id}`,
          formData,
        );
        toast.success('拍賣資訊已更新');
      } else {
        response = await axios.post(
          `${API_URL}/api/case/${caseId}/auctions`,
          formData,
        );
        toast.success('拍賣資訊已新增');
      }

      // 更新列表
      const updatedList = editing
        ? auctions.map((item) =>
            item._id === editing._id ? response.data : item,
          )
        : [...auctions, response.data];

      setLocalAuctions(updatedList);
      setAuctions(updatedList); // 更新父組件的狀態

      // 重置表單
      setShowModal(false);
      setEditing(null);
      setFormData({
        auctionType: '一拍',
        auctionDate: '',
        auctionFloorPrice: 0,
        auctionClick: 0,
        auctionMonitor: 0,
        auctionCaseCount: 0,
        auctionMargin: 0,
      });
    } catch (error) {
      toast.error(editing ? '更新拍賣資訊失敗' : '新增拍賣資訊失敗');
    }
  };

  // 處理刪除
  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此拍賣資訊嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/auctions/${id}`);
        const updatedList = auctions.filter((item) => item._id !== id);
        setLocalAuctions(updatedList);
        setAuctions(updatedList); // 更新父組件的狀態
        toast.success('拍賣資訊已刪除');
      } catch (error) {
        toast.error('刪除拍賣資訊失敗');
      }
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  // 修改格式化數字的函數，添加整數選項
  const formatNumber = (number, isInteger = false) => {
    if (number == null) return '';
    const formattedNumber = isInteger ? Math.round(number) : number;
    return formattedNumber.toLocaleString('zh-TW');
  };

  // 添加進場建議判斷函數
  const getEntryRecommendation = (auctionType, pingCP) => {
    const thresholds = {
      一拍: 0.92,
      二拍: 1.15,
      三拍: 1.44,
      四拍: 1.8,
    };

    const threshold = thresholds[auctionType];
    if (!threshold || !pingCP) return '不可進場';

    return pingCP > threshold ? '建議進場' : '不可進場';
  };

  // 添加進場建議的樣式
  const getRecommendationStyle = (recommendation) => {
    return recommendation === '建議進場'
      ? 'text-green-600 font-medium'
      : 'text-red-600 font-medium';
  };

  // 添加件數參考加價計算函數
  const calculateReferencePrice = (auction) => {
    if (!auction.auctionFloorPrice || !auction.auctionCaseCount) return 0;

    // 計算 a 值：底價 * (1 + (成交件數/4.5/100))
    const a =
      auction.auctionFloorPrice * (1 + auction.auctionCaseCount / 4.5 / 100);

    // 計算 b 值：底價 * (CP值/1.6)
    const b = auction.auctionFloorPrice * (auction.pingCP / 1.6);

    // 返回較小值
    return Math.min(a, b);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">拍賣資訊</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditing(null);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增拍賣資訊
        </button>
      </div>

      <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                是否進場
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                拍別
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                拍賣日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                底價
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                坪數
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                坪價
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                時價
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                點閱
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                監控
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                成交件數
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                件數參考加價
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                保証金
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auctions.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={getRecommendationStyle(
                      getEntryRecommendation(item.auctionType, item.pingCP),
                    )}
                  >
                    {getEntryRecommendation(item.auctionType, item.pingCP)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.auctionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(item.auctionDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(item.auctionFloorPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.pingValueTotal?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(item.pingPriceTotal, true)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(item.nowPriceTotal, true)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.pingCP?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(item.auctionClick)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(item.auctionMonitor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(item.auctionCaseCount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(calculateReferencePrice(item), true)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(item.auctionMargin)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditing(item);
                      setFormData({
                        ...item,
                        auctionDate: item.auctionDate.split('T')[0],
                      });
                      setShowModal(true);
                    }}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editing ? '編輯拍賣資訊' : '新增拍賣資訊'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  拍別
                </label>
                <select
                  value={formData.auctionType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      auctionType: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  {auctionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  拍賣日
                </label>
                <input
                  type="date"
                  value={formData.auctionDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      auctionDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  底價
                </label>
                <input
                  type="number"
                  value={formData.auctionFloorPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      auctionFloorPrice: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  點閱
                </label>
                <input
                  type="number"
                  value={formData.auctionClick}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      auctionClick: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  監控
                </label>
                <input
                  type="number"
                  value={formData.auctionMonitor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      auctionMonitor: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  成交件數
                </label>
                <input
                  type="number"
                  value={formData.auctionCaseCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      auctionCaseCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  保証金
                </label>
                <input
                  type="number"
                  value={formData.auctionMargin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      auctionMargin: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
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

export default AuctionList;
