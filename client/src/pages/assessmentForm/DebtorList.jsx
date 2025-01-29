import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

function DebtorList({ caseId, initialDebtors = [] }) {
  const [debtors, setDebtors] = useState(initialDebtors);
  const [showDebtorModal, setShowDebtorModal] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState(null);
  const [debtorFormData, setDebtorFormData] = useState({
    name: '',
  });

  // 處理債務人表單提交
  const handleDebtorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDebtor) {
        await axios.put(
          `${API_URL}/api/debtors/${editingDebtor._id}`,
          debtorFormData,
        );
        toast.success('債務人資料已更新');
      } else {
        await axios.post(
          `${API_URL}/api/case/${caseId}/debtors`,
          debtorFormData,
        );
        toast.success('債務人已新增');
      }

      // 重新獲取債務人列表
      const response = await axios.get(`${API_URL}/api/case/${caseId}/debtors`);
      setDebtors(response.data);

      // 重置表單
      setShowDebtorModal(false);
      setEditingDebtor(null);
      setDebtorFormData({ name: '' });
    } catch (error) {
      toast.error(editingDebtor ? '更新債務人失敗' : '新增債務人失敗');
    }
  };

  // 處理債務人刪除
  const handleDeleteDebtor = async (debtorId) => {
    if (window.confirm('確定要刪除此債務人嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/debtors/${debtorId}`);
        toast.success('債務人已刪除');
        setDebtors(debtors.filter((debtor) => debtor._id !== debtorId));
      } catch (error) {
        toast.error('刪除債務人失敗');
      }
    }
  };

  // 處理編輯債務人
  const handleEditDebtor = (debtor) => {
    setEditingDebtor(debtor);
    setDebtorFormData({
      name: debtor.name,
    });
    setShowDebtorModal(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">債務人清單</h3>
        <button
          onClick={() => {
            setEditingDebtor(null);
            setDebtorFormData({ name: '' });
            setShowDebtorModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增債務人
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                姓名
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {debtors.map((debtor) => (
              <tr key={debtor._id}>
                <td className="px-6 py-4 whitespace-nowrap">{debtor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditDebtor(debtor)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeleteDebtor(debtor._id)}
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

      {/* 債務人表單 Modal */}
      {showDebtorModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingDebtor ? '編輯債務人' : '新增債務人'}
            </h3>
            <form onSubmit={handleDebtorSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  姓名
                </label>
                <input
                  type="text"
                  value={debtorFormData.name}
                  onChange={(e) =>
                    setDebtorFormData({
                      ...debtorFormData,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowDebtorModal(false);
                    setEditingDebtor(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md border border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  {editingDebtor ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebtorList;
