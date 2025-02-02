import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import toast from 'react-hot-toast';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('密碼不一致');
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        formData,
      );
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('註冊成功');
      navigate('/verify-email');
    } catch (error) {
      toast.error(error.response?.data?.message || '註冊失敗');
    }
  };

  return (
    <div className="register-container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-0">建立新帳號</h2>
                  <p className="text-muted mt-2">請填寫以下資料進行註冊</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* 姓名欄位 */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      姓名
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        placeholder="請輸入姓名"
                      />
                    </div>
                  </div>

                  {/* 電子郵件欄位 */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      電子郵件
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        placeholder="請輸入電子郵件"
                      />
                    </div>
                  </div>

                  {/* 密碼欄位 */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      密碼
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        placeholder="請輸入密碼"
                      />
                    </div>
                  </div>

                  {/* 確認密碼欄位 */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      確認密碼
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        placeholder="請再次輸入密碼"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3 py-2"
                  >
                    註冊
                  </button>

                  <div className="text-center mt-4">
                    <p className="mb-0">
                      已經有帳號了？{' '}
                      <Link to="/login" className="text-primary fw-bold">
                        立即登入
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
