import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import toast from 'react-hot-toast';
import './VerifyEmail.css';

function VerifyEmail() {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Submitting verification code:', {
        email: user.email,
        code: verificationCode.trim(),
      });

      const response = await axios.post(
        `${API_URL}/api/users/verify-email`,
        {
          email: user.email,
          verificationCode: verificationCode.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      console.log('Verification response:', response.data);

      // 更新本地存儲中的用戶信息
      const updatedUser = { ...user, isVerified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('郵件驗證成功');
      navigate('/dashboard');
    } catch (error) {
      console.error('Verification error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || '驗證失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(
        `${API_URL}/api/users/resend-verification`,
        {
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      toast.success('驗證碼已重新發送');
    } catch (error) {
      console.error('Resend error:', error.response?.data);
      toast.error(error.response?.data?.message || '重新發送失敗');
    }
  };

  const handleVerificationCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setVerificationCode(value);
  };

  return (
    <div className="verify-email-container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="email-icon mb-3">
                    <i className="bi bi-envelope-check fs-1 text-primary"></i>
                  </div>
                  <h2 className="fw-bold mb-0">驗證您的電子郵件</h2>
                  <p className="text-muted mt-2">
                    我們已發送驗證碼至
                    <br />
                    <span className="fw-bold text-primary">{user?.email}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="verification-code-input mb-4">
                    <label htmlFor="verificationCode" className="form-label">
                      驗證碼
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-shield-lock"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg text-center"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                        placeholder="請輸入6位數驗證碼"
                        maxLength="6"
                        required
                        pattern="\d{6}"
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
                        驗證中...
                      </>
                    ) : (
                      '驗證'
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      沒有收到驗證碼？{' '}
                      <button
                        type="button"
                        onClick={handleResend}
                        className="btn btn-link text-decoration-none p-0"
                      >
                        重新發送
                      </button>
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

export default VerifyEmail;
