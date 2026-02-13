import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css"; // Reusing Login styles

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    otp: "",
  });
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Request OTP
  const handleRequestOtp = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/request-otp`,
        { email: formData.email },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      toast.success("OTP sent to your email!");
      setOtpRequested(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to request OTP");
      console.error(err, formData.email);
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/register`,
        formData
      );
      toast.success(res.data.message || "Account created successfully!");
      // Optional: Navigate to login after success
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Toaster />
      {/* Left Section - Image/Brand */}
      <div className="login-image-section" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="login-image-overlay"></div>
        <div className="brand-text">MyShop.</div>
        <div className="quote-container">
          <p className="quote-text">"Fashion is the armor to survive the reality of everyday life."</p>
          <p className="quote-author">— Bill Cunningham</p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="login-form-container">
        <div className="login-header">
          <h2 className="login-title">Create Account</h2>
          <p className="login-subtitle">Join us for exclusive offers and more.</p>
        </div>

        <form className="login-form" onSubmit={handleRegister}>
          {/* Name */}
          <div className="login-form-group">
            <label className="login-label">Full Name</label>
            <div className="input-wrapper">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="login-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="login-form-group">
            <label className="login-label">Phone Number</label>
            <div className="input-wrapper">
              <i className="fas fa-phone input-icon"></i>
              <input
                type="text"
                name="phoneNumber"
                placeholder="+1 234 567 890"
                className="login-input"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email + Verify */}
          <div className="login-form-group">
            <label className="login-label">Email Address</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                className="login-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="verify-btn"
                onClick={handleRequestOtp}
                disabled={!formData.email || otpRequested}
              >
                {otpRequested ? "Sent" : "Verify"}
              </button>
            </div>
          </div>

          {/* OTP */}
          {otpRequested && (
            <div className="login-form-group">
              <label className="login-label">One-Time Password (OTP)</label>
              <div className="input-wrapper">
                <i className="fas fa-key input-icon"></i>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  className="login-input"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="login-form-group">
            <label className="login-label">Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                className="login-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`login-submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?
            <Link to="/login" className="login-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
