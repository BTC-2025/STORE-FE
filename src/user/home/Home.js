import React, { useState } from 'react';
import TopSelling from "../sections/TopSelling";
import NewArrivals from "../sections/NewArrivals";
import BestSellers from "../sections/BestSellers";
import CategoryMenu from '../components/CategoryMenu';
import LoginModal from "../Login/LoginModal";
import HeroCarousel from '../sections/HeroCarousel';
import ChatBot from '../components/ChatBot';
import './Home.css';

const Home = ({ showLogin, setShowLogin, onLogin }) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="home-page">
      <CategoryMenu />

      <HeroCarousel />

      <div className="home-container">
        {/* Features Section */}
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-item">
              <i className="fas fa-shipping-fast feature-icon"></i>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-desc">On all orders over $50</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-shield-alt feature-icon"></i>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-desc">100% secure payment</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-undo feature-icon"></i>
              <h3 className="feature-title">30 Day Return</h3>
              <p className="feature-desc">Money back guarantee</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-headset feature-icon"></i>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-desc">Dedicated support</p>
            </div>
          </div>
        </section>

        {/* Product Sections */}
        <BestSellers />
        <TopSelling />
        <NewArrivals />
      </div>

      <LoginModal
        show={showLogin}
        handleClose={() => setShowLogin(false)}
        onLogin={onLogin}
      />

      <ChatBot showChat={showChat} setShowChat={setShowChat} />
    </div>
  )
}

export default Home;