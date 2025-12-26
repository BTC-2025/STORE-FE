import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {

    const [Login,Setlogin] = useState({
        email:"",
        password:""
    })

    const handleChange = (e) =>{
        const {name,value} = e.target;
        Setlogin({...Login,[name]:value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`,
                Login,
                {
                    headers:{
                        "Content-Type": "application/json"
                    }
                })
                toast.success(res.data.message || "Login successful!");
                localStorage.setItem("user",JSON.stringify(res.data.user));
                localStorage.setItem("token",res.data.token)
        }catch(err){
            toast.error(err.response?.data?.error || "Login failed");
        }

    }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa"
      }}
      className="py-5"
    >
      {/* Login Card */}
      <div
        style={{
          display: "flex",
          width: "900px",
          maxWidth: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          backgroundColor: "#fff"
        }}
      >
        {/* Left Section (Image) */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "30px"
          }}
          className="d-none d-md-flex"
        >
          <img
            src="https://img.freepik.com/free-vector/delivery-service-illustration_23-2148505081.jpg"
            alt="Login Illustration"
            style={{ maxWidth: "90%", height: "auto" }}
          />
        </div>

        {/* Right Section (Form) */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#0d2c91",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px"
          }}
        >
          <h2 style={{ fontWeight: "600", marginBottom: "10px" }}>Welcome Back!</h2>
          <p style={{ marginBottom: "30px", textAlign: "center", maxWidth: "350px" }}>
            Please login to continue accessing your account.
          </p>

          <form style={{ width: "100%", maxWidth: "350px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  marginBottom: "5px",
                  display: "block"
                }}
              >
                Username
              </label>
              <input
                type="email"
                placeholder="johnsmith123@gmail.com"
                name="email"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "none",
                  borderBottom: "1px solid #ddd",
                  background: "transparent",
                  color: "#fff",
                  outline: "none"
                }}
                value={Login.email}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label
                style={{
                  fontSize: "14px",
                  marginBottom: "5px",
                  display: "block"
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "none",
                  borderBottom: "1px solid #ddd",
                  background: "transparent",
                  color: "#fff",
                  outline: "none"
                }}
                value={Login.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "5px",
                background: "linear-gradient(to right, #f7971e, #ffd200)",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer"
              }}
              onClick={handleSubmit}
            >
              LOGIN
            </button>
          </form>
          <p className="mt-3">Don't have an account? <Link to="/signup" className="text-primary fw-bold">Create one</Link></p>
          <Link to="/forgot-password" className="text-primary fw-bold">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
