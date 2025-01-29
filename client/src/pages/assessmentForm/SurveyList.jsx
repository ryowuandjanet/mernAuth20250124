import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

function SurveyList({ caseId, initialSurveys = [] }) {
  const [surveys, setSurveys] = useState(initialSurveys);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [surveyFormData, setSurveyFormData] = useState({
    surveyFirstDay: '',
    surveySecondDay: '',
    surveyForeclosureAnnouncementLink: '',
    survey988Link: '',
    surveyObjectPhotoLink: '',
    surveyForeclosureRecordLink: '',
    surveyObjectViewLink: '',
    surveyPagesViewLink: '',
    surveyMoneytViewLink: '',
  });

  // 處理勘查資訊表單提交
  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSurvey) {
        await axios.put(
          `${API_URL}/api/surveys/${editingSurvey._id}`,
          surveyFormData,
        );
        toast.success('勘查資訊已更新');
      } else {
        await axios.post(
          `${API_URL}/api/case/${caseId}/surveys`,
          surveyFormData,
        );
        toast.success('勘查資訊已新增');
      }

      // 重新獲取勘查資訊列表
      const response = await axios.get(`${API_URL}/api/case/${caseId}/surveys`);
      setSurveys(response.data);

      // 重置表單
      setShowSurveyModal(false);
      setEditingSurvey(null);
      setSurveyFormData({
        surveyFirstDay: '',
        surveySecondDay: '',
        surveyForeclosureAnnouncementLink: '',
        survey988Link: '',
        surveyObjectPhotoLink: '',
        surveyForeclosureRecordLink: '',
        surveyObjectViewLink: '',
        surveyPagesViewLink: '',
        surveyMoneytViewLink: '',
      });
    } catch (error) {
      toast.error(editingSurvey ? '更新勘查資訊失敗' : '新增勘查資訊失敗');
    }
  };

  // 處理勘查資訊刪除
  const handleDeleteSurvey = async (surveyId) => {
    if (window.confirm('確定要刪除此勘查資訊嗎？')) {
      try {
        await axios.delete(`${API_URL}/api/surveys/${surveyId}`);
        toast.success('勘查資訊已刪除');
        setSurveys(surveys.filter((survey) => survey._id !== surveyId));
      } catch (error) {
        toast.error('刪除勘查資訊失敗');
      }
    }
  };

  // 處理編輯勘查資訊
  const handleEditSurvey = (survey) => {
    setEditingSurvey(survey);
    setSurveyFormData({
      surveyFirstDay: survey.surveyFirstDay || '',
      surveySecondDay: survey.surveySecondDay || '',
      surveyForeclosureAnnouncementLink:
        survey.surveyForeclosureAnnouncementLink || '',
      survey988Link: survey.survey988Link || '',
      surveyObjectPhotoLink: survey.surveyObjectPhotoLink || '',
      surveyForeclosureRecordLink: survey.surveyForeclosureRecordLink || '',
      surveyObjectViewLink: survey.surveyObjectViewLink || '',
      surveyPagesViewLink: survey.surveyPagesViewLink || '',
      surveyMoneytViewLink: survey.surveyMoneytViewLink || '',
    });
    setShowSurveyModal(true);
  };

  // 格式化日期
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">勘查資訊</h3>
        <button
          onClick={() => {
            setEditingSurvey(null);
            setSurveyFormData({
              surveyFirstDay: '',
              surveySecondDay: '',
              surveyForeclosureAnnouncementLink: '',
              survey988Link: '',
              surveyObjectPhotoLink: '',
              surveyForeclosureRecordLink: '',
              surveyObjectViewLink: '',
              surveyPagesViewLink: '',
              surveyMoneytViewLink: '',
            });
            setShowSurveyModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新增勘查資訊
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                第一次勘查日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                第二次勘查日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                拍賣公告
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                988
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                物件照片
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                執行紀錄
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                物件
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                頁面
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金額
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {surveys.map((survey) => (
              <tr key={survey._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(survey.surveyFirstDay)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(survey.surveySecondDay)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {survey.surveyForeclosureAnnouncementLink ? (
                    <a
                      href={survey.surveyForeclosureAnnouncementLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      V
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {survey.survey988Link ? (
                    <a
                      href={survey.survey988Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      V
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {survey.surveyObjectPhotoLink ? (
                    <a
                      href={survey.surveyObjectPhotoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      V
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {survey.surveyForeclosureRecordLink ? (
                    <a
                      href={survey.surveyForeclosureRecordLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      V
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {survey.surveyObjectViewLink ? (
                    <a
                      href={survey.surveyObjectViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      V
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {survey.surveyPagesViewLink ? (
                    <a
                      href={survey.surveyPagesViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      V
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {survey.surveyMoneytViewLink ? (
                    <a
                      href={survey.surveyMoneytViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      V
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditSurvey(survey)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeleteSurvey(survey._id)}
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

      {/* 勘查資訊表單 Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingSurvey ? '編輯勘查資訊' : '新增勘查資訊'}
            </h3>
            <form onSubmit={handleSurveySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    第一次勘查日期
                  </label>
                  <input
                    type="date"
                    value={surveyFormData.surveyFirstDay}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        surveyFirstDay: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    第二次勘查日期
                  </label>
                  <input
                    type="date"
                    value={surveyFormData.surveySecondDay}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        surveySecondDay: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    拍賣公告連結
                  </label>
                  <input
                    type="url"
                    value={surveyFormData.surveyForeclosureAnnouncementLink}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        surveyForeclosureAnnouncementLink: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    988連結
                  </label>
                  <input
                    type="url"
                    value={surveyFormData.survey988Link}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        survey988Link: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    物件照片連結
                  </label>
                  <input
                    type="url"
                    value={surveyFormData.surveyObjectPhotoLink}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        surveyObjectPhotoLink: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    執行紀錄連結
                  </label>
                  <input
                    type="url"
                    value={surveyFormData.surveyForeclosureRecordLink}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        surveyForeclosureRecordLink: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    物件連結
                  </label>
                  <input
                    type="url"
                    value={surveyFormData.surveyObjectViewLink}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        surveyObjectViewLink: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    頁面連結
                  </label>
                  <input
                    type="url"
                    value={surveyFormData.surveyPagesViewLink}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        surveyPagesViewLink: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    金額連結
                  </label>
                  <input
                    type="url"
                    value={surveyFormData.surveyMoneytViewLink}
                    onChange={(e) =>
                      setSurveyFormData({
                        ...surveyFormData,
                        surveyMoneytViewLink: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowSurveyModal(false);
                    setEditingSurvey(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md border border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  {editingSurvey ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyList;
