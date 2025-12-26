import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 5000);
  };

  const validateEmail = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/forgot-password/request-otp`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        showMessage('OTP sent to your email', 'success');
        setStep(2);
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      showMessage(error.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    // No frontend validation for OTP - let backend handle it
    if (!otp) {
      showMessage('Please enter OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/forgot-password/verify-otp`,
        { email, otp },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        showMessage('OTP verified successfully', 'success');
        setStep(3);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showMessage(error.response?.data?.message || 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/forgot-password/reset`,
        { email, otp, newPassword },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        showMessage('Password reset successfully! Redirecting to login...', 'success');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      showMessage(error.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleRequestOtp} className="forgot-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Sending OTP...
                </>
              ) : (
                'SEND OTP'
              )}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyOtp} className="forgot-form">
            <div className="form-group">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                type="text"
                id="otp"
                className="form-input"
                placeholder="Enter OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
              <div className="otp-note">
                <i className="fas fa-info-circle"></i>
                Check your email for the OTP code
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                type="button" 
                className="back-btn"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Verifying...
                  </>
                ) : (
                  'VERIFY OTP'
                )}
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetPassword} className="forgot-form">
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            
            <div className="action-buttons">
              <button 
                type="button" 
                className="back-btn"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Resetting...
                  </>
                ) : (
                  'RESET PASSWORD'
                )}
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Message Toast */}
      {message.show && (
        <div className="toast-container">
          <div className={`toast toast-${message.type}`}>
            <div className="toast-content">
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              {message.text}
            </div>
            <button 
              className="toast-close"
              onClick={() => setMessage({ show: false, text: '', type: '' })}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="forgot-password-content">
        {/* Left Side - Image */}
        <div className="forgot-image-side">
          <div className="image-container">
            {/* <div className="image-placeholder">
              <div className="image-content">
                <div className="image-icon">
                  <i className="fas fa-key"></i>
                </div>
                <h2 className="image-title">Reset Your Password</h2>
                <p className="image-subtitle">
                  Secure your account with a new password
                </p>
              </div>
            
            </div> */}
            <img src={"https://image.freepik.com/free-vector/forgot-password-illustration_65141-418.jpg"} alt='forgot password illustration' />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="forgot-form-side">
          <div className="forgot-password-card">
            <div className="card-header">
              <div className="logo">
                <i className="fas fa-lock"></i>
              </div>
              <h1 className="card-title">Forgot Your Password?</h1>
              <p className="card-subtitle">
                {step === 1 && 'Enter your email address to receive a verification code'}
                {step === 2 && 'Enter the code sent to your email'}
                {step === 3 && 'Create your new password'}
              </p>
            </div>

            <div className="progress-bar">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Email</span>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">OTP</span>
              </div>
              <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <span className="step-number">3</span>
                <span className="step-label">Password</span>
              </div>
            </div>

            {renderStep()}

            <div className="card-footer">
              <Link to="/login" className="back-link">
                <i className="fas fa-arrow-left"></i>
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;