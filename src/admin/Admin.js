// src/admin/Admin.js
import React, { useState } from 'react';
import Login from './Login/Login';
import Register from '../admin/Register/Register'
import Dashboard from '../admin/Dashboard/Dashboard'
import ForgotPassword from './Forgot/ForgotPassword';
import './Admin.css';

const Admin = () => {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleRegister = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <>
      {currentView === 'login' ? (
        <Login 
          onLogin={handleLogin} 
          switchToRegister={() => setCurrentView('register')} 
          switchToForgot={() => setCurrentView("forgot")}
        />
      ) : currentView === 'register' ? (
        <Register 
          onRegister={handleRegister} 
          switchToLogin={() => setCurrentView('login')} 
        />
      ) : (
        <ForgotPassword switchToLogin={() => setCurrentView("login")} />
      )}
    </>
  );
};

export default Admin;