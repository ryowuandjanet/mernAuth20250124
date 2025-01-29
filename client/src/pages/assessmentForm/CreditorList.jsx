import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

function CreditorList({ caseId, initialPersons = [] }) {
  const [persons, setPersons] = useState(initialPersons);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [personFormData, setPersonFormData] = useState({
    name: '',
    phone: '',
  });

  // 處理人員表單提交
  const handlePersonSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPerson) {
        await axios.put(
          `${API_URL}/api/persons/${editingPerson._id}`,
          personFormData,
        );
        toast.success('人員資料已更新');
      } else {
        await axios.post(
          `${API_URL}/api/case/${caseId}/persons`,
          personFormData,
        );
        toast.success('人員已新增');
      }

      // 重新獲取人員列表
      const response = await axios.get(`${API_URL}/api/case/${caseId}/persons`);
      setPersons(response.data);

      // 重置表單
      setShowPersonModal(false);
      setEditingPerson(null);
      setPersonFormData({ name: '', phone: '' });
    } catch (error) {
      toast.error(editingPerson ? '更新人員失敗' : '新增人員失敗');
    }
  };

  // 處理人員刪除
  const handleDeletePerson = async (personId) => {
    if (window.confirm('確定要刪除此人員嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/persons/${personId}`);
        toast.success('人員已刪除');
        setPersons(persons.filter((person) => person._id !== personId));
      } catch (error) {
        toast.error('刪除人員失敗');
      }
    }
  };

  // 處理編輯人員
  const handleEditPerson = (person) => {
    setEditingPerson(person);
    setPersonFormData({
      name: person.name,
      phone: person.phone,
    });
    setShowPersonModal(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">債權人清單</h3>
        <button
          onClick={() => {
            setEditingPerson(null);
            setPersonFormData({ name: '', phone: '' });
            setShowPersonModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增債權人
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                姓名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                電話
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {persons.map((person) => (
              <tr key={person._id}>
                <td className="px-6 py-4 whitespace-nowrap">{person.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{person.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditPerson(person)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeletePerson(person._id)}
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

      {/* 人員表單 Modal */}
      {showPersonModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingPerson ? '編輯債權人' : '新增債權人'}
            </h3>
            <form onSubmit={handlePersonSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  姓名
                </label>
                <input
                  type="text"
                  value={personFormData.name}
                  onChange={(e) =>
                    setPersonFormData({
                      ...personFormData,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  電話
                </label>
                <input
                  type="text"
                  value={personFormData.phone}
                  onChange={(e) =>
                    setPersonFormData({
                      ...personFormData,
                      phone: e.target.value,
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
                    setShowPersonModal(false);
                    setEditingPerson(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md border border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  {editingPerson ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreditorList;
