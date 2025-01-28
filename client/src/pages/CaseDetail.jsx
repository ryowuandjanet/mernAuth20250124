import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';

function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [persons, setPersons] = useState([]);
  const [debtors, setDebtors] = useState([]);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showDebtorModal, setShowDebtorModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingDebtor, setEditingDebtor] = useState(null);
  const [personFormData, setPersonFormData] = useState({
    name: '',
    phone: '',
  });
  const [debtorFormData, setDebtorFormData] = useState({
    name: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 獲取案件詳情、債權人和債務人列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caseResponse, personsResponse, debtorsResponse] =
          await Promise.all([
            axios.get(`${API_URL}/api/cases/${id}`),
            axios.get(`${API_URL}/api/case/${id}/persons`),
            axios.get(`${API_URL}/api/case/${id}/debtors`),
          ]);
        setCaseData(caseResponse.data);
        setPersons(personsResponse.data);
        setDebtors(debtorsResponse.data);
        setFormData(caseResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('獲取資料失敗');
        navigate('/dashboard');
      }
    };

    fetchData();
  }, [id, navigate]);

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/api/cases/${id}`, formData);
      setCaseData(response.data);
      setIsEditing(false);
      toast.success('案件更新成功');
    } catch (error) {
      toast.error('更新案件失敗');
    }
  };

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
        await axios.post(`${API_URL}/api/case/${id}/persons`, personFormData);
        toast.success('人員已新增');
      }

      // 重新獲取人員列表
      const response = await axios.get(`${API_URL}/api/case/${id}/persons`);
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
        await axios.post(`${API_URL}/api/case/${id}/debtors`, debtorFormData);
        toast.success('債務人已新增');
      }

      // 重新獲取債務人列表
      const response = await axios.get(`${API_URL}/api/case/${id}/debtors`);
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

  // 處理返回
  const handleBack = () => {
    navigate('/dashboard');
  };

  // 添加格式化地址函式
  const formatAddress = (caseData) => {
    const parts = [];

    // 添加縣市和區
    if (caseData.city) parts.push(caseData.city);
    if (caseData.district) parts.push(caseData.district);

    // 添加段號和小段
    if (caseData.section) parts.push(caseData.section);
    if (caseData.subsection) parts.push(caseData.subsection);

    // 添加村里
    if (caseData.village) parts.push(caseData.village);

    // 添加鄰（加上"鄰"字）
    if (caseData.neighborhood) parts.push(`${caseData.neighborhood}鄰`);

    // 添加街路
    if (caseData.street) parts.push(caseData.street);

    // 添加段（加上"段"字）
    if (caseData.streetSection) parts.push(`${caseData.streetSection}段`);

    // 添加巷（加上"巷"字）
    if (caseData.lane) parts.push(`${caseData.lane}巷`);

    // 添加弄（加上"弄"字）
    if (caseData.alley) parts.push(`${caseData.alley}弄`);

    // 添加號（加上"號"字）
    if (caseData.number) parts.push(`${caseData.number}號`);

    // 添加樓層
    if (caseData.floor) parts.push(`${caseData.floor}`);

    return parts.join('');
  };

  if (!caseData) {
    return <div>載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogoutClick={() => setShowLogoutConfirm(true)} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">案件詳情</h2>
            <div>
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                返回
              </button>
            </div>
          </div>

          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    案號
                  </label>
                  <input
                    type="text"
                    value={formData.caseNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, caseNumber: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    所屬公司
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    縣市
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                {/* 其他編輯欄位... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    案件狀態
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="處理中">處理中</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">案號</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {caseData.caseNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    所屬公司
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {caseData.company}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">地址</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatAddress(caseData)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    案件狀態
                  </dt>
                  <dd className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        caseData.status === '已完成'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {caseData.status}
                    </span>
                  </dd>
                </div>
                {/* 其他詳情欄位... */}
              </dl>
            </div>
          )}

          {/* 人員清單部分 */}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {person.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {person.phone}
                      </td>
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
          </div>

          {/* 債務人清單部分 */}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {debtor.name}
                      </td>
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
          </div>

          {/* 人員新增/編輯 Modal */}
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
                  <div className="flex justify-end space-x-4">
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

          {/* 債務人新增/編輯 Modal */}
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
                  <div className="flex justify-end space-x-4">
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
      </main>

      {/* 登出確認對話框 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">確認登出</h3>
            <p className="text-sm text-gray-500 mb-4">您確定要登出嗎？</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              >
                取消
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  toast.success('已登出');
                  navigate('/login');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
              >
                確認登出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseDetail;
