import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import toast from 'react-hot-toast';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      setIsEmailSent(true);
      toast.success('重設密碼郵件已發送');
    } catch (error) {
      toast.error(error.response?.data?.message || '發送郵件失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-0">重設密碼</h2>
                  <p className="text-muted mt-2">
                    {!isEmailSent
                      ? '請輸入您的電子郵件以重設密碼'
                      : '請查看您的電子郵件'}
                  </p>
                </div>

                {!isEmailSent ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="請輸入您的電子郵件"
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
                          發送中...
                        </>
                      ) : (
                        '發送重設密碼郵件'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="success-checkmark mb-4">
                      <i className="bi bi-check-circle-fill text-success fs-1"></i>
                    </div>
                    <p className="mb-4">
                      重設密碼的連結已發送到您的電子郵件。
                      <br />
                      請查看您的收件匣並點擊連結重設密碼。
                    </p>
                    <button
                      onClick={() => setIsEmailSent(false)}
                      className="btn btn-outline-primary mb-3"
                    >
                      重新發送
                    </button>
                  </div>
                )}

                <div className="text-center mt-4">
                  <p className="mb-0">
                    <Link to="/login" className="text-decoration-none">
                      <i className="bi bi-arrow-left me-2"></i>
                      返回登入
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

export default ForgotPassword;
