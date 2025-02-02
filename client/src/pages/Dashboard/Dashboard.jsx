import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { API_URL } from '../../config';
import './Dashboard.css';

// 縣市區域資料
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

// 格式化地址
const formatAddress = (caseData) => {
  const addressParts = [
    caseData.city,
    caseData.district,
    caseData.section,
    caseData.subsection,
    caseData.village,
    caseData.neighborhood && `${caseData.neighborhood}鄰`,
    caseData.street,
    caseData.streetSection && `${caseData.streetSection}段`,
    caseData.lane && `${caseData.lane}巷`,
    caseData.alley && `${caseData.alley}弄`,
    caseData.number && `${caseData.number}號`,
    caseData.floor,
  ];

  return addressParts.filter(Boolean).join('');
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
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/cases`);
        setCases(response.data.cases);
      } catch (error) {
        console.error('Error fetching cases:', error);
        toast.error('獲取案件失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // 修改表單提交部分
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user || !user.token) {
        toast.error('請先登入');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (editingCase) {
        const response = await axios.put(
          `${API_URL}/api/cases/${editingCase._id}`,
          formData,
          config,
        );
        console.log('Update response:', response.data);
        toast.success('案件更新成功');
      } else {
        const response = await axios.post(
          `${API_URL}/api/cases`,
          formData,
          config,
        );
        console.log('Create response:', response.data);
        toast.success('案件新增成功');
      }
      resetForm();
      fetchCases();
    } catch (error) {
      console.error('Operation error:', error);
      const errorMessage = error.response?.data?.message || '操作失敗';
      toast.error(errorMessage);
    }
  };

  // 重置表單
  const resetForm = () => {
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
  };

  // 處理刪除
  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此案件嗎？')) {
      try {
        if (!user || !user.token) {
          toast.error('請先登入');
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        await axios.delete(`${API_URL}/api/cases/${id}`, config);
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
      ...Object.fromEntries(
        Object.keys(formData).map((key) => [key, caseItem[key] || '']),
      ),
      status: caseItem.status || '處理中',
    });
    setShowAddModal(true);
  };

  // 處理縣市變更
  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setFormData((prev) => ({
      ...prev,
      city: newCity,
      district: '',
    }));
  };

  // 處理登出
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('登出成功');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container min-vh-100 bg-light">
      <Navbar onLogoutClick={() => setShowLogoutConfirm(true)} />

      <div className="container py-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 mb-0">案件管理系統</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <i className="bi bi-plus-lg me-2"></i>新增案件
          </button>
        </div>

        {/* Cases Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>標題</th>
                    <th>描述</th>
                    <th>狀態</th>
                    <th>創建時間</th>
                    <th>創建者</th>
                    {cases.length > 0 &&
                      cases[0].createdBy._id === user._id && <th>操作</th>}
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr key={caseItem._id}>
                      <td>{caseItem._id}</td>
                      <td>{caseItem.title}</td>
                      <td>{caseItem.description}</td>
                      <td>
                        <span
                          className={`badge bg-${getStatusColor(
                            caseItem.status,
                          )}`}
                        >
                          {caseItem.status}
                        </span>
                      </td>
                      <td>{new Date(caseItem.createdAt).toLocaleString()}</td>
                      <td>{caseItem.createdBy?.name || '未知'}</td>
                      {caseItem.createdBy._id === user._id && (
                        <td>
                          <button
                            onClick={() => handleEdit(caseItem)}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleDelete(caseItem._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            刪除
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCase ? '編輯案件' : '新增案件'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Case Number */}
                    <div className="col-md-4">
                      <label className="form-label">案號</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.caseNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            caseNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Company */}
                    <div className="col-md-4">
                      <label className="form-label">所屬公司</label>
                      <select
                        className="form-select"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        required
                      >
                        <option value="">請選擇公司</option>
                        <option value="揚富開發有限公司">
                          揚富開發有限公司
                        </option>
                        <option value="鉅鈦開發有限公司">
                          鉅鈦開發有限公司
                        </option>
                      </select>
                    </div>

                    {/* Status */}
                    <div className="col-md-4">
                      <label className="form-label">狀態</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <option value="處理中">處理中</option>
                        <option value="已完成">已完成</option>
                      </select>
                    </div>

                    {/* Address Fields */}
                    <div className="col-md-6">
                      <label className="form-label">縣市</label>
                      <select
                        className="form-select"
                        value={formData.city}
                        onChange={handleCityChange}
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

                    <div className="col-md-6">
                      <label className="form-label">區域</label>
                      <select
                        className="form-select"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        required
                        disabled={!formData.city}
                      >
                        <option value="">請選擇區域</option>
                        {formData.city &&
                          cityDistrictData[formData.city].map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Other address fields */}
                    {/* ... Add other address input fields similarly ... */}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      取消
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingCase ? '更新' : '新增'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">確認登出</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>確定要登出系統嗎？</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  確認登出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 根據狀態返回對應的 Bootstrap 顏色類
function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'in progress':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
}

export default Dashboard;
