import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css"; // Updated CSS import

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/login`,
        login,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      toast.success(res.data.message || "Login successful!");

      // Call parent handler to update App state immediately
      if (onLogin) {
        onLogin(res.data);
      } else {
        // Fallback if not passed (though it should be)
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
      }

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Section - Image/Brand */}
      <div className="login-image-section">
        <div className="login-image-overlay"></div>
        <div className="brand-text">MyShop.</div>
        <div className="quote-container">
          <p className="quote-text">"Style is a way to say who you are without having to speak."</p>
          <p className="quote-author">— Rachel Zoe</p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="login-form-container">
        <div className="login-header">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Please enter your details to sign in.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">Email</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="login-input"
                value={login.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="login-input"
                value={login.password}
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?
            <Link to="/signup" className="login-link">Sign up</Link>
          </p>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
