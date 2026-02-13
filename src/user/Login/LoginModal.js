import React, { useState, useEffect } from "react";
import logo from '../../assests/login.png'
import axios from "axios";
import toast from "react-hot-toast";
import './LoginModal.css';

const LoginModal = ({ show, handleClose, onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [animate, setAnimate] = useState(false);
  const [hasOpened, setHasOpened] = useState(false); // prevent multiple opens

  useEffect(() => {
    if (show && !hasOpened) {
      setHasOpened(true);
      setTimeout(() => setAnimate(true), 10);
    } else if (!show) {
      setAnimate(false);
    }
  }, [show, hasOpened]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(
  //       "https://periodically-road-stays-afghanistan.trycloudflare.comapi/auth/login",
  //       formData,
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     toast.success(res.data.message || "Login successful!");
  //     localStorage.setItem("user", JSON.stringify(res.data.user));
  //     localStorage.setItem("token", res.data.token);

  //     if (onLogin) onLogin(res.data);
  //     handleClose();
  //   } catch (err) {
  //     toast.error(err.response?.data?.error || "Login failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://periodically-road-stays-afghanistan.trycloudflare.com/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(res.data.message || "Login successful!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      if (onLogin) onLogin(res.data); // ✅ sends both user + token to App
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };


  if (!show || (hasOpened && !animate)) return null;

  return (
    <div className={`login-modal-overlay ${animate ? 'show' : ''}`}>
      <div className="login-modal-dialog">
        <div className="login-modal-content">
          <div className="login-modal-body">
            {/* Left Section */}
            <div className="login-modal-left">
              <div>
                <h4>Login</h4>
                <p>Get access to your Orders, Wishlist and Recommendations</p>
              </div>
              <div className="login-modal-image">
                <img src={logo} alt="Login" />
              </div>
            </div>

            {/* Right Section */}
            <div className="login-modal-right">
              <form className="login-modal-form" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    required
                    onChange={handleChange}
                    value={formData.password}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>

              {/* Extra Links */}
              <div className="login-modal-links">
                <a href="#forgot">
                  Forgot Password?
                </a>
                <a href="#signup" className="text-primary">
                  New here? Create an account
                </a>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            className="login-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
