import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import toast from 'react-hot-toast';
import './ResetPassword.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('密碼不一致');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/users/reset-password`, {
        token,
        password,
      });
      toast.success('密碼重設成功');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || '密碼重設失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="lock-icon mb-3">
                    <i className="bi bi-shield-lock-fill text-primary fs-1"></i>
                  </div>
                  <h2 className="fw-bold mb-0">重設密碼</h2>
                  <p className="text-muted mt-2">請輸入您的新密碼</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      新密碼
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        placeholder="請輸入新密碼"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`bi bi-eye${showPassword ? '-slash' : ''}`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      確認密碼
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="6"
                        placeholder="請再次輸入新密碼"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3 py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        重設中...
                      </>
                    ) : (
                      '重設密碼'
                    )}
                  </button>
                </form>

                <div className="password-requirements mt-4">
                  <h6 className="text-muted mb-2">密碼要求：</h6>
                  <ul className="text-muted small">
                    <li>至少 6 個字符</li>
                    <li>包含大小寫字母</li>
                    <li>包含數字</li>
                    <li>包含特殊字符</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
