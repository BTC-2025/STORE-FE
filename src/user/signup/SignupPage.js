import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    otp: "",
  });
  const [otpRequested, setOtpRequested] = useState(false);

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
            headers:{
                "Content-Type": "application/json"
            }
        }
      );
      toast.success("OTP sent to your email!");
      setOtpRequested(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to request OTP");
      console.error(err,formData.email);
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/register`,
        formData
      );
      toast.success(res.data.message || "Account created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5 bg-light">
      <Toaster />
      <div
        className="d-flex shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        {/* Left Image */}
        <div className="w-50 bg-light d-none d-md-block">
          <img
            src="https://img.freepik.com/free-photo/surprised-man-holding-shopping-bags_23-2148872040.jpg"
            alt="Shopping"
            className="w-100 h-100 object-fit-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-100 w-md-50 bg-primary text-white p-5">
          <h4 className="fw-bold mb-3">Sign Up</h4>
          <p className="small">
            Sign up to create an account and enjoy exclusive shopping.
          </p>

          <form onSubmit={handleRegister}>
            {/* Name */}
            <input
              type="text"
              name="name"
              className="form-control mb-3"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <input
              type="text"
              name="phoneNumber"
              className="form-control mb-3"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

            {/* Email + Verify button */}
            <div className="input-group mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleRequestOtp}
                disabled={!formData.email}
              >
                Verify
              </button>
            </div>

            {/* OTP input (shown after Verify) */}
            {otpRequested && (
              <input
                type="text"
                name="otp"
                className="form-control mb-3"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            )}

            {/* Password */}
            <input
              type="password"
              name="password"
              className="form-control mb-3"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Submit */}
            <button type="submit" className="btn btn-dark w-100">
              Create Account
            </button>
          </form>

          <div className="mt-3 text-center">
            <span>Already have an account? </span>
            <a href="/login" className="text-warning fw-bold">
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
