import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import './Login.css';

const Login = ({ onLogin, switchToRegister, switchToForgot }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="minimal-auth-container">
      <div className="minimal-auth-card">
        <div className="minimal-auth-header">
          <div className="minimal-logo">
            <FaSignInAlt />
          </div>
          <h2 className="minimal-auth-title">Admin Portal</h2>
          <p className="minimal-auth-subtitle">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="minimal-auth-form">
          <div className="minimal-input-group">
            <div className="minimal-input-wrapper">
              <FaEnvelope className="minimal-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="minimal-form-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="minimal-input-group">
            <div className="minimal-input-wrapper">
              <FaLock className="minimal-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="minimal-form-input"
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="minimal-password-toggle"
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="minimal-form-options">
            <button 
              type="button" 
              onClick={switchToForgot}
              className="minimal-forgot-link"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="minimal-error-message">
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="minimal-auth-button"
            disabled={loading}
          >
            {loading ? (
              <div className="minimal-button-loading">
                <div className="minimal-spinner"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="minimal-auth-footer">
          <p className="minimal-auth-footer-text">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={switchToRegister}
              className="minimal-auth-link"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;