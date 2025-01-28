import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { API_URL } from '../config';

// 在文件頂部添加縣市區域資料
const cityDistrictData = {
  新北市: [
    '板橋區',
    '三重區',
    '中和區',
    '永和區',
    '新莊區',
    '新店區',
    '樹林區',
    '鶯歌區',
    '三峽區',
    '淡水區',
    '汐止區',
    '瑞芳區',
    '土城區',
    '蘆洲區',
    '五股區',
    '泰山區',
    '林口區',
    '深坑區',
    '石碇區',
    '坪林區',
    '三芝區',
    '石門區',
    '八里區',
    '平溪區',
    '雙溪區',
    '貢寮區',
    '金山區',
    '萬里區',
    '烏來區',
  ],
  高雄市: [
    '鹽埕區',
    '鼓山區',
    '左營區',
    '楠梓區',
    '三民區',
    '新興區',
    '前金區',
    '苓雅區',
    '前鎮區',
    '旗津區',
    '小港區',
    '鳳山區',
    '林園區',
    '大寮區',
    '大樹區',
    '大社區',
    '仁武區',
    '鳥松區',
    '岡山區',
    '橋頭區',
    '燕巢區',
    '田寮區',
    '阿蓮區',
    '路竹區',
    '湖內區',
    '茄萣區',
    '永安區',
    '彌陀區',
    '梓官區',
    '旗山區',
    '美濃區',
    '六龜區',
    '甲仙區',
    '杉林區',
    '內門區',
    '茂林區',
    '桃源區',
    '那瑪夏區',
  ],
};

// 格式化地址函式
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

function Dashboard() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [cases, setCases] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [formData, setFormData] = useState({
    caseNumber: '',
    company: '',
    city: '',
    district: '',
    section: '',
    subsection: '',
    village: '',
    neighborhood: '',
    street: '',
    streetSection: '',
    lane: '',
    alley: '',
    number: '',
    floor: '',
    status: '處理中',
  });

  // 獲取案件列表
  const fetchCases = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cases`);
      setCases(response.data);
    } catch (error) {
      toast.error('獲取案件列表失敗');
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userString);
    if (!user.isVerified) {
      toast.error('請先完成電子郵件驗證');
      navigate('/verify-email');
      return;
    }

    fetchCases();
  }, [navigate]);

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCase) {
        await axios.put(`${API_URL}/api/cases/${editingCase._id}`, formData);
        toast.success('案件更新成功');
      } else {
        await axios.post(`${API_URL}/api/cases`, formData);
        toast.success('案件新增成功');
      }
      setShowAddModal(false);
      setEditingCase(null);
      setFormData({
        caseNumber: '',
        company: '',
        city: '',
        district: '',
        section: '',
        subsection: '',
        village: '',
        neighborhood: '',
        street: '',
        streetSection: '',
        lane: '',
        alley: '',
        number: '',
        floor: '',
        status: '處理中',
      });
      fetchCases();
    } catch (error) {
      toast.error(editingCase ? '更新案件失敗' : '新增案件失敗');
    }
  };

  // 處理刪除
  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此案件嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/cases/${id}`);
        toast.success('案件刪除成功');
        fetchCases();
      } catch (error) {
        toast.error('刪除案件失敗');
      }
    }
  };

  // 處理編輯
  const handleEdit = (caseItem) => {
    setEditingCase(caseItem);
    setFormData({
      caseNumber: caseItem.caseNumber || '',
      company: caseItem.company || '',
      city: caseItem.city || '',
      district: caseItem.district || '',
      section: caseItem.section || '',
      subsection: caseItem.subsection || '',
      village: caseItem.village || '',
      neighborhood: caseItem.neighborhood || '',
      street: caseItem.street || '',
      streetSection: caseItem.streetSection || '',
      lane: caseItem.lane || '',
      alley: caseItem.alley || '',
      number: caseItem.number || '',
      floor: caseItem.floor || '',
      status: caseItem.status || '處理中',
    });
    setShowAddModal(true);
  };

  // 處理縣市變更
  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setFormData({
      ...formData,
      city: newCity,
      district: '', // 重置區域選擇
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogoutClick={() => setShowLogoutConfirm(true)} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">案件清單</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              新增案件
            </button>
          </div>

          {/* 案件列表 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案號
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    所屬公司
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cases.map((caseItem) => (
                  <tr key={caseItem._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/case/${caseItem._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {caseItem.caseNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {caseItem.company}
                    </td>
                    <td className="px-6 py-4">{formatAddress(caseItem)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          caseItem.status === '已完成'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(caseItem)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(caseItem._id)}
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
      </main>

      {/* 新增/編輯案件表單 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingCase
                ? `編輯案件 - ${editingCase.caseNumber}`
                : '新增案件'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 案號 */}
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

                {/* 所屬公司 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    所屬公司
                  </label>
                  <select
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">請選擇公司</option>
                    <option value="揚富開發有限公司">揚富開發有限公司</option>
                    <option value="鉅鈦開發有限公司">鉅鈦開發有限公司</option>
                  </select>
                </div>

                {/* 縣市 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    縣市
                  </label>
                  <select
                    value={formData.city}
                    onChange={handleCityChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">請選擇縣市</option>
                    {Object.keys(cityDistrictData).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 鄉鎮區里 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    鄉鎮區里
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                    disabled={!formData.city} // 如果未選擇縣市則禁用
                  >
                    <option value="">請選擇鄉鎮區里</option>
                    {formData.city &&
                      cityDistrictData[formData.city].map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 段號 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    段號
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 小段 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    小段
                  </label>
                  <input
                    type="text"
                    value={formData.subsection}
                    onChange={(e) =>
                      setFormData({ ...formData, subsection: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 村里 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    村里
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) =>
                      setFormData({ ...formData, village: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 鄰 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    鄰
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      setFormData({ ...formData, neighborhood: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 街路 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    街路
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 段 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    段
                  </label>
                  <input
                    type="text"
                    value={formData.streetSection}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        streetSection: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 巷 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    巷
                  </label>
                  <input
                    type="text"
                    value={formData.lane}
                    onChange={(e) =>
                      setFormData({ ...formData, lane: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 弄 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    弄
                  </label>
                  <input
                    type="text"
                    value={formData.alley}
                    onChange={(e) =>
                      setFormData({ ...formData, alley: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 號 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    號
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 樓(含之幾) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    樓(含之幾)
                  </label>
                  <input
                    type="text"
                    value={formData.floor}
                    onChange={(e) =>
                      setFormData({ ...formData, floor: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* 案件狀態 */}
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

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCase(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md border border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  {editingCase ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default Dashboard;
