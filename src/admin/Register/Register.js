// src/admin/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // ✅ Icons
import './Register.css';

const Register = ({ onRegister, switchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/admin/register`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data) {
        alert("Registration successful! Please login.");
        switchToLogin();
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Registration failed');
      } else if (err.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2 className="register-heading">Admin Registration</h2>
        <form onSubmit={handleSubmit} className="register-form">
          
          <div className="register-group">
            <label className="register-label">Full Name</label>
            <div className="register-input-wrapper">
              <FaUser className="register-icon" />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="register-input"
              />
            </div>
          </div>

          <div className="register-group">
            <label className="register-label">Email</label>
            <div className="register-input-wrapper">
              <FaEnvelope className="register-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="register-input"
              />
            </div>
          </div>

          <div className="register-group">
            <label className="register-label">Password</label>
            <div className="register-input-wrapper">
              <FaLock className="register-icon" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="register-input"
              />
            </div>
          </div>

          {error && <div className="register-error">{error}</div>}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="register-switch">
          Already have an account? 
          <span onClick={switchToLogin} className="register-link"> Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
