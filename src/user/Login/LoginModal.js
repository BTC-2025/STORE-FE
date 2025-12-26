import React, { useState, useEffect } from "react";
import logo from '../../assests/login.png'
import axios from "axios";
import toast from "react-hot-toast";

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
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        style={{
          transform: animate ? "translateY(0) scale(1)" : "translateY(-30px) scale(0.95)",
          opacity: animate ? 1 : 0,
          transition: "all 0.4s ease-in-out",
        }}
      >
        <div className="modal-content">
          <div className="d-flex h-100">
            {/* Left Section */}
            <div
              className="p-5 text-white d-flex flex-column justify-content-between"
              style={{ background: "#2874f0", width: "40%" }}
            >
              <div>
                <h4 className="fw-bold">Login</h4>
                <p>Get access to your Orders, Wishlist and Recommendations</p>
              </div>
              <div className="text-center">
                <img src={logo} alt="Login" className="pt-5 img-fluid" />
              </div>
            </div>

            {/* Right Section */}
            <div className="p-4 flex-grow-1 d-flex flex-column mt-5 justify-content-center">
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-3">
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
                <div className="mb-3">
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

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              {/* Extra Links */}
              <div className="mt-3 text-center">
                <a href="#forgot" className="d-block text-secondary mb-2">
                  Forgot Password?
                </a>
                <a href="#signup" className="text-primary fw-bold">
                  New here? Create an account
                </a>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={handleClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
