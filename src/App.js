import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from './user/components/Navbar';
import Footer from './user/components/Footer';
import Home from "./user/home/Home";
import ProductListing from "./user/products/ProductListing";
import ProductDetail from "./user/products/ProductDetail";
import CartPage from "./user/cart/CartPage";
import LoginPage from "./user/Login/LoginPage";
import SignupPage from "./user/signup/SignupPage";
import WishlistPage from "./user/wishlist/WishlistPage";
import Checkout from "./user/checkout/Checkout";
import ProfilePage from "./user/profile/ProfilePage";
import ForgotPassword from "./user/forgot-password/ForgotPassword";
import CheckoutPage from "./user/checkout/CheckOutPage";
import Admin from "./admin/Admin";
import Seller from "./seller/Seller";
import MyOrders from "./user/orders/MyOrders";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // delay modal by 3 seconds if no user
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = (data) => {
    // `data` comes from LoginModal → res.data
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    setShowLogin(false); // ✅ close modal after login
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowLogin(true); // show modal again after logout
  };

  return (
    <Router>
      {/* Navbar gets user info */}
      <Navbar 
        user={user} 
        onLoginClick={() => setShowLogin(true)} 
        onLogout={handleLogout} 
      />

      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              showLogin={showLogin} 
              setShowLogin={setShowLogin} 
              onLogin={handleLogin} 
            />
          } 
        />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart-checkout" element={<CheckoutPage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/seller' element={<Seller />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;