import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import toast from 'react-hot-toast';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Attempting login with:', { email: formData.email }); // 添加日誌

      const response = await axios.post(`${API_URL}/api/users/login`, formData);
      console.log('Login response:', response.data); // 添加日誌

      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('登入成功');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      toast.error(
        error.response?.data?.message || '登入失敗，請檢查您的郵箱和密碼',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-0">歡迎回來</h2>
                  <p className="text-muted mt-2">請登入您的帳號</p>
                </div>

                <form onSubmit={handleSubmit}>
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

                  <div className="mb-4">
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

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3 py-2"
                  >
                    登入
                  </button>

                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none text-muted"
                    >
                      忘記密碼？
                    </Link>
                  </div>
                </form>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    還沒有帳號？{' '}
                    <Link to="/register" className="text-primary fw-bold">
                      立即註冊
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
