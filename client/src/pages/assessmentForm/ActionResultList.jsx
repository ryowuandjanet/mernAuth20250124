import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

// 添加執行結果選項常數
const ACTION_RESULT_OPTIONS = ['未判定', '撤回', '第三人搶標', '得標'];

// 添加搶標拍別選項常數
const BID_AUCTION_OPTIONS = ['一拍', '二拍', '三拍', '四拍'];

function ActionResultList({ caseId, initialActionResults = [] }) {
  const [actionResults, setActionResults] = useState(initialActionResults);
  const [showActionResultModal, setShowActionResultModal] = useState(false);
  const [editingActionResult, setEditingActionResult] = useState(null);
  const [actionResultFormData, setActionResultFormData] = useState({
    stopBuyDate: '',
    actionResult: '未判定',
    bidAuctionTime: '',
    bidMoney: '',
    objectNumber: '',
  });

  // 格式化日期為表單使用的 YYYY-MM-DD
  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  // 格式化日期為顯示用的 YYYY/MM/DD
  const formatDateForDisplay = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 處理執行結果表單提交
  const handleActionResultSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingActionResult) {
        await axios.put(
          `${API_URL}/api/actionResults/${editingActionResult._id}`,
          actionResultFormData,
        );
        toast.success('執行結果已更新');
      } else {
        await axios.post(
          `${API_URL}/api/case/${caseId}/actionResults`,
          actionResultFormData,
        );
        toast.success('執行結果已新增');
      }

      // 重新獲取執行結果列表
      const response = await axios.get(
        `${API_URL}/api/case/${caseId}/actionResults`,
      );
      setActionResults(response.data);

      // 重置表單
      setShowActionResultModal(false);
      setEditingActionResult(null);
      setActionResultFormData({
        stopBuyDate: '',
        actionResult: '未判定',
        bidAuctionTime: '',
        bidMoney: '',
        objectNumber: '',
      });
    } catch (error) {
      toast.error(
        editingActionResult ? '更新執行結果失敗' : '新增執行結果失敗',
      );
    }
  };

  // 處理執行結果刪除
  const handleDeleteActionResult = async (actionResultId) => {
    if (window.confirm('確定要刪除此執行結果嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/actionResults/${actionResultId}`);
        toast.success('執行結果已刪除');
        setActionResults(
          actionResults.filter(
            (actionResult) => actionResult._id !== actionResultId,
          ),
        );
      } catch (error) {
        toast.error('刪除執行結果失敗');
      }
    }
  };

  // 處理編輯執行結果
  const handleEditActionResult = (actionResult) => {
    setEditingActionResult(actionResult);
    setActionResultFormData({
      stopBuyDate: formatDateForInput(actionResult.stopBuyDate),
      actionResult: actionResult.actionResult || '未判定',
      bidAuctionTime: actionResult.bidAuctionTime || '',
      bidMoney: actionResult.bidMoney || '',
      objectNumber: actionResult.objectNumber || '',
    });
    setShowActionResultModal(true);
  };

  // 修改處理函數
  const handleActionResultChange = (value) => {
    setActionResultFormData((prev) => {
      const newData = { ...prev, actionResult: value };

      // 當執行結果為"得標"時，清空搶標拍別和得標金額
      if (value === '得標') {
        newData.bidAuctionTime = '';
        newData.bidMoney = '';
      }

      // 當執行結果為"第三人搶標"時，清空標的編號
      if (value === '第三人搶標') {
        newData.objectNumber = '';
      }

      // 當執行結果為"撤回"時，清空搶標拍別、標的編號和得標金額
      if (value === '撤回') {
        newData.bidAuctionTime = '';
        newData.objectNumber = '';
        newData.bidMoney = '';
      }

      return newData;
    });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">執行結果</h3>
        <button
          onClick={() => {
            setEditingActionResult(null);
            setActionResultFormData({
              stopBuyDate: '',
              actionResult: '未判定',
              bidAuctionTime: '',
              bidMoney: '',
              objectNumber: '',
            });
            setShowActionResultModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增執行結果
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                停止購買日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                執行結果
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                搶標拍別
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                得標金額
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                標的編號
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {actionResults.map((actionResult) => (
              <tr key={actionResult._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDateForDisplay(actionResult.stopBuyDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {actionResult.actionResult}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {actionResult.bidAuctionTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {actionResult.bidMoney}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {actionResult.objectNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditActionResult(actionResult)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeleteActionResult(actionResult._id)}
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

      {/* 執行結果表單 Modal */}
      {showActionResultModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingActionResult ? '編輯執行結果' : '新增執行結果'}
            </h3>
            <form onSubmit={handleActionResultSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  停止購買日期
                </label>
                <input
                  type="date"
                  value={actionResultFormData.stopBuyDate}
                  onChange={(e) =>
                    setActionResultFormData({
                      ...actionResultFormData,
                      stopBuyDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  執行結果
                </label>
                <select
                  value={actionResultFormData.actionResult}
                  onChange={(e) => handleActionResultChange(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  {ACTION_RESULT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {/* 搶標拍別欄位 - 當執行結果不為"得標"且不為"撤回"時顯示 */}
              {actionResultFormData.actionResult !== '得標' &&
                actionResultFormData.actionResult !== '撤回' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      搶標拍別
                    </label>
                    <select
                      value={actionResultFormData.bidAuctionTime}
                      onChange={(e) =>
                        setActionResultFormData({
                          ...actionResultFormData,
                          bidAuctionTime: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option value="">請選擇拍別</option>
                      {BID_AUCTION_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              {/* 得標金額欄位 - 當執行結果不為"得標"且不為"撤回"時顯示 */}
              {actionResultFormData.actionResult !== '得標' &&
                actionResultFormData.actionResult !== '撤回' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      得標金額
                    </label>
                    <input
                      type="number"
                      value={actionResultFormData.bidMoney}
                      onChange={(e) =>
                        setActionResultFormData({
                          ...actionResultFormData,
                          bidMoney: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                )}
              {/* 標的編號欄位 - 當執行結果不為"第三人搶標"且不為"撤回"時顯示 */}
              {actionResultFormData.actionResult !== '第三人搶標' &&
                actionResultFormData.actionResult !== '撤回' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      標的編號
                    </label>
                    <input
                      type="text"
                      value={actionResultFormData.objectNumber}
                      onChange={(e) =>
                        setActionResultFormData({
                          ...actionResultFormData,
                          objectNumber: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowActionResultModal(false);
                    setEditingActionResult(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md border border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  {editingActionResult ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionResultList;
