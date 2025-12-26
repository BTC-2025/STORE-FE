import React, { useState } from 'react'
import TopSelling from "../sections/TopSelling";
import NewArrivals from "../sections/NewArrivals";
import BestSellers from "../sections/BestSellers";
import CategoryMenu from '../components/CategoryMenu';
import LoginModal from "../Login/LoginModal";
import HeroCarousel from '../sections/HeroCarousel';
import ChatBot from '../components/ChatBot'; // Import the chatbot component

const Home = ({ showLogin, setShowLogin, onLogin }) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div>
      <CategoryMenu />
      <HeroCarousel />
      <BestSellers />
      <TopSelling />
      <NewArrivals />
      
      {/* Login Modal - now only shows on Home page */}
      <LoginModal
        show={showLogin}
        handleClose={() => setShowLogin(false)}
        onLogin={onLogin}
      />
      
      {/* AI Chatbot */}
      <ChatBot showChat={showChat} setShowChat={setShowChat} />
    </div>
  )
}

export default Home;