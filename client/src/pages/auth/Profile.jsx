import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import toast from 'react-hot-toast';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    userFirstName: user?.userFirstName || '',
    userLastName: user?.userLastName || '',
    userWorkArea: user?.userWorkArea || '',
    userRole: user?.userRole || '',
    userIdentityCard: user?.userIdentityCard || '',
    userBirthday: user?.userBirthday
      ? new Date(user.userBirthday).toISOString().split('T')[0]
      : '',
    userLocalPhone: user?.userLocalPhone || '',
    userMobilePhone: user?.userMobilePhone || '',
    userCountry: user?.userCountry || '',
    userTownship: user?.userTownship || '',
    userVillage: user?.userVillage || '',
    userNeighbor: user?.userNeighbor || '',
    userStreet: user?.userStreet || '',
    userSection: user?.userSection || '',
    userLane: user?.userLane || '',
    userAlley: user?.userAlley || '',
    userNumber: user?.userNumber || '',
    userFloor: user?.userFloor || '',
    userPublicOrPrivate: user?.userPublicOrPrivate || '',
  });

  const workAreas = ['北基桃竹苗', '中彰投', '雲嘉南', '高屏'];
  const roles = ['管理者', '一般使用者', '遊客', '黑名單'];
  const publicPrivateOptions = ['公', '私'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('個人資料更新成功');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || '更新失敗');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">個人資料設定</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本資料 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  姓氏
                </label>
                <input
                  type="text"
                  value={formData.userFirstName}
                  onChange={(e) =>
                    setFormData({ ...formData, userFirstName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  名字
                </label>
                <input
                  type="text"
                  value={formData.userLastName}
                  onChange={(e) =>
                    setFormData({ ...formData, userLastName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  工作轄區
                </label>
                <select
                  value={formData.userWorkArea}
                  onChange={(e) =>
                    setFormData({ ...formData, userWorkArea: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">請選擇工作轄區</option>
                  {workAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  權限
                </label>
                <select
                  value={formData.userRole}
                  onChange={(e) =>
                    setFormData({ ...formData, userRole: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">請選擇權限</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* 其他欄位... */}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  身分別
                </label>
                <select
                  value={formData.userPublicOrPrivate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userPublicOrPrivate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">請選擇身分別</option>
                  {publicPrivateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                儲存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
