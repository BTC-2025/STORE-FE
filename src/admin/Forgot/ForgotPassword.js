import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = ({ switchToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/request-otp`, { email });
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP. Please check your email address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/verify-otp`, { email, otp });
      setStep(3);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/reset`, {
        email,
        otp,
        newPassword,
      });
      alert("Password reset successfully");
      switchToLogin();
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Reset Your Password";
      case 2: return "Verify Your Identity";
      case 3: return "Create New Password";
      default: return "Reset Password";
    }
  };

  const getStepDescription = () => {
    switch(step) {
      case 1: return "Enter your email address and we'll send you a verification code.";
      case 2: return "Enter the verification code sent to your email.";
      case 3: return "Create a strong, new password for your account.";
      default: return "";
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <p>Request</p>
          </div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <p>Verify</p>
          </div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <span>3</span>
            <p>Reset</p>
          </div>
        </div>

        <div className="form-header">
          <h2>{getStepTitle()}</h2>
          <p>{getStepDescription()}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={
          step === 1 ? handleRequestOtp : 
          step === 2 ? handleVerifyOtp : 
          handleResetPassword
        }>
          {step === 1 && (
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          {step === 2 && (
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="resend-otp">
                Didn't receive the code? <button type="button">Resend</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="password-strength">
                <div className={`strength-bar ${newPassword.length > 0 ? (newPassword.length < 6 ? "weak" : newPassword.length < 10 ? "medium" : "strong") : ""}`}></div>
                <span>
                  {newPassword.length === 0 ? "" : 
                   newPassword.length < 6 ? "Weak" : 
                   newPassword.length < 10 ? "Medium" : "Strong"}
                </span>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              step === 1 ? "Send Verification Code" :
              step === 2 ? "Verify Code" :
              "Reset Password"
            )}
          </button>
        </form>

        <div className="back-to-login">
          <button type="button" onClick={switchToLogin}>
            &larr; Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;