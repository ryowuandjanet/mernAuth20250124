import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

// 添加最終判定選項常數
const FINAL_DECISION_OPTIONS = [
  '未判定',
  '1拍進場',
  '2拍進場',
  '3拍進場',
  '4拍進場',
  '4拍流標',
  '放棄',
];

// 添加轄區選項常數
const WORK_AREA_OPTIONS = ['北基桃竹苗', '中彰投', '雲嘉南', '高屏'];

function FinalDecisionList({ caseId, initialFinalDecisions = [] }) {
  const [finalDecisions, setFinalDecisions] = useState(initialFinalDecisions);
  const [showFinalDecisionModal, setShowFinalDecisionModal] = useState(false);
  const [editingFinalDecision, setEditingFinalDecision] = useState(null);
  const [finalDecisionFormData, setFinalDecisionFormData] = useState({
    finalDecision: '未判定',
    finalDecisionRemark: '',
    regionalHead: '',
    regionalHeadDate: '',
    regionalHeadAddDate: '',
    regionalHeadWorkArea: '',
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

  // 處理最終判定表單提交
  const handleFinalDecisionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFinalDecision) {
        await axios.put(
          `${API_URL}/api/finalDecisions/${editingFinalDecision._id}`,
          finalDecisionFormData,
        );
        toast.success('最終判定已更新');
      } else {
        await axios.post(
          `${API_URL}/api/case/${caseId}/finalDecisions`,
          finalDecisionFormData,
        );
        toast.success('最終判定已新增');
      }

      // 重新獲取最終判定列表
      const response = await axios.get(
        `${API_URL}/api/case/${caseId}/finalDecisions`,
      );
      setFinalDecisions(response.data);

      // 重置表單
      setShowFinalDecisionModal(false);
      setEditingFinalDecision(null);
      setFinalDecisionFormData({
        finalDecision: '未判定',
        finalDecisionRemark: '',
        regionalHead: '',
        regionalHeadDate: '',
        regionalHeadAddDate: '',
        regionalHeadWorkArea: '',
      });
    } catch (error) {
      toast.error(
        editingFinalDecision ? '更新最終判定失敗' : '新增最終判定失敗',
      );
    }
  };

  // 處理最終判定刪除
  const handleDeleteFinalDecision = async (finalDecisionId) => {
    if (window.confirm('確定要刪除此最終判定嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/finalDecisions/${finalDecisionId}`);
        toast.success('最終判定已刪除');
        setFinalDecisions(
          finalDecisions.filter(
            (finalDecision) => finalDecision._id !== finalDecisionId,
          ),
        );
      } catch (error) {
        toast.error('刪除最終判定失敗');
      }
    }
  };

  // 處理編輯最終判定
  const handleEditFinalDecision = (finalDecision) => {
    setEditingFinalDecision(finalDecision);
    setFinalDecisionFormData({
      finalDecision: finalDecision.finalDecision,
      finalDecisionRemark: finalDecision.finalDecisionRemark || '',
      regionalHead: finalDecision.regionalHead || '',
      regionalHeadDate: formatDateForInput(finalDecision.regionalHeadDate),
      regionalHeadAddDate: formatDateForInput(
        finalDecision.regionalHeadAddDate,
      ),
      regionalHeadWorkArea: finalDecision.regionalHeadWorkArea || '',
    });
    setShowFinalDecisionModal(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">最終判定</h3>
        <button
          onClick={() => {
            setEditingFinalDecision(null);
            setFinalDecisionFormData({
              finalDecision: '未判定',
              finalDecisionRemark: '',
              regionalHead: '',
              regionalHeadDate: '',
              regionalHeadAddDate: '',
              regionalHeadWorkArea: '',
            });
            setShowFinalDecisionModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增最終判定
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                判定結果
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                備註
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                區域主管
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                主管日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                新增日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                轄區
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {finalDecisions.map((finalDecision) => (
              <tr key={finalDecision._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {finalDecision.finalDecision}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {finalDecision.finalDecisionRemark}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {finalDecision.regionalHead}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDateForDisplay(finalDecision.regionalHeadDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDateForDisplay(finalDecision.regionalHeadAddDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {finalDecision.regionalHeadWorkArea}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditFinalDecision(finalDecision)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeleteFinalDecision(finalDecision._id)}
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

      {/* 最終判定表單 Modal */}
      {showFinalDecisionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingFinalDecision ? '編輯最終判定' : '新增最終判定'}
            </h3>
            <form onSubmit={handleFinalDecisionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  判定結果
                </label>
                <select
                  value={finalDecisionFormData.finalDecision}
                  onChange={(e) =>
                    setFinalDecisionFormData({
                      ...finalDecisionFormData,
                      finalDecision: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  {FINAL_DECISION_OPTIONS.map((option) => (
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
                  value={finalDecisionFormData.finalDecisionRemark}
                  onChange={(e) =>
                    setFinalDecisionFormData({
                      ...finalDecisionFormData,
                      finalDecisionRemark: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  區域主管
                </label>
                <input
                  type="text"
                  value={finalDecisionFormData.regionalHead}
                  onChange={(e) =>
                    setFinalDecisionFormData({
                      ...finalDecisionFormData,
                      regionalHead: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  主管日期
                </label>
                <input
                  type="date"
                  value={finalDecisionFormData.regionalHeadDate}
                  onChange={(e) =>
                    setFinalDecisionFormData({
                      ...finalDecisionFormData,
                      regionalHeadDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  新增日期
                </label>
                <input
                  type="date"
                  value={finalDecisionFormData.regionalHeadAddDate}
                  onChange={(e) =>
                    setFinalDecisionFormData({
                      ...finalDecisionFormData,
                      regionalHeadAddDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  轄區
                </label>
                <select
                  value={finalDecisionFormData.regionalHeadWorkArea}
                  onChange={(e) =>
                    setFinalDecisionFormData({
                      ...finalDecisionFormData,
                      regionalHeadWorkArea: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">請選擇轄區</option>
                  {WORK_AREA_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowFinalDecisionModal(false);
                    setEditingFinalDecision(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md border border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  {editingFinalDecision ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalDecisionList;
