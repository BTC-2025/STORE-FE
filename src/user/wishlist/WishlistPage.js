import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [carted, setCarted] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const navigate = useNavigate();

  // Fetch user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  // Fetch wishlist items and recommended products
  useEffect(() => {
    if (user) {
      fetchWishlistItems();
      fetchRecommendedProducts();
    } else {
      // If no user, stop loading immediately
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const alreadyCarted = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/cart/userid/${user.id}`);
          setCarted(response.data);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      };
      alreadyCarted();
    }
  }, [user]);

  const isInCart = (productId) => {
    return carted.some(item => item.productId === productId);
  };

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}`
      );
      setWishlistItems(response.data);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      showMessage("Failed to load wishlist items", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/product`);
      // Get random 4 products for recommendations
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.error("Error fetching recommended products:", error);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!user) {
      navigate('/login', { state: { from: 'wishlist' } });
      return;
    }
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}/productid/${productId}`
      );
      navigate(0)
      setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
      showMessage("Removed from wishlist", "success");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      showMessage("Failed to remove item", "error");
    }
  };

  // Empty wishlist
  const emptyWishlist = async () => {
    if (!user) {
      navigate('/login', { state: { from: 'wishlist' } });
      return;
    }
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/wishlist/clear/userid/${user.id}`
      );
      navigate(0)
      setWishlistItems([]);
      showMessage("Wishlist cleared", "success");
    } catch (error) {
      console.error("Error emptying wishlist:", error);
      showMessage("Failed to clear wishlist", "error");
    }
  };

  // Add to cart
  const addToCart = async (productId) => {
    if (!user) {
      navigate('/login', { state: { from: 'wishlist' } });
      return;
    }
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/cart/add`,
        {
          userId: user.id,
          productId: productId,
          quantity: 1
        }
      );

      if (response.status === 200 || response.status === 201) {
        showMessage("Added to cart successfully!", "success");
        // Refresh cart data
        const cartResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/cart/userid/${user.id}`);
        navigate(0)
        setCarted(cartResponse.data);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showMessage("Failed to add to cart", "error");
    }
  };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => {
      setMessage({ show: false, text: "", type: "" });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="wishlist-loading-container">
        <div className="wishlist-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      {/* Message Toast */}
      {message.show && (
        <div className="wishlist-toast-container">
          <div className={`wishlist-toast wishlist-toast-${message.type}`}>
            <div className="wishlist-toast-content">
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
              {message.text}
            </div>
            <button 
              type="button" 
              className="wishlist-toast-close" 
              onClick={() => setMessage({ show: false, text: "", type: "" })}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="wishlist-header">
        <div className="wishlist-header-content">
          <div className="wishlist-title-section">
            <h1 className="wishlist-main-title">My Wishlist</h1>
            {user ? (
              <p className="wishlist-subtitle">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            ) : (
              <p className="wishlist-subtitle">Your favorite items</p>
            )}
          </div>
          
          {user && wishlistItems.length > 0 && (
            <div className="wishlist-actions">
              <button 
                className="wishlist-clear-btn"
                onClick={emptyWishlist}
              >
                <i className="fas fa-trash me-2"></i>
                Clear Wishlist
              </button>
            </div>
          )}
        </div>
        
        <nav className="wishlist-breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li className="active">Wishlist</li>
          </ol>
        </nav>
      </div>

      {/* Show different content based on authentication status */}
      {!user ? (
        <div className="wishlist-guest-container">
          <div className="wishlist-guest-content">
            <div className="wishlist-guest-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h2 className="wishlist-guest-title">Your Wishlist is Waiting</h2>
            <p className="wishlist-guest-text">
              Sign in to save your favorite items and access them from any device.
            </p>
            <div className="wishlist-guest-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/login', { state: { from: 'wishlist' } })}
              >
                <i className="fas fa-sign-in-alt me-2"></i>
                Sign In
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/register', { state: { from: 'wishlist' } })}
              >
                <i className="fas fa-user-plus me-2"></i>
                Create Account
              </button>
            </div>
          </div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="wishlist-empty-state">
          <div className="wishlist-empty-icon">
            <i className="fas fa-heart"></i>
          </div>
          <h3 className="wishlist-empty-title">Your wishlist is empty</h3>
          <p className="wishlist-empty-text">
            Save your favorite items here to easily find them later.
          </p>
          <a href="/products" className="wishlist-empty-btn">
            <i className="fas fa-shopping-bag me-2"></i>
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="wishlist-content">
          {/* Wishlist Items */}
          <div className="wishlist-items-container">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item-card">
                <div className="wishlist-item-image">
                  <img
                    src={item.product.image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(item.product.name)}`}
                    alt={item.product.name}
                    className="wishlist-item-img"
                  />
                  <button 
                    className="wishlist-remove-btn"
                    onClick={() => removeFromWishlist(item.productId)}
                    title="Remove from wishlist"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="wishlist-item-details">
                  <h3 className="wishlist-item-title">{item.product.name}</h3>
                  <p className="wishlist-item-category">{item.product.category}</p>
                  
                  <div className="wishlist-item-price">
                    <span className="wishlist-price-current">₹{item.product.price}</span>
                    {item.product.discount > 0 && (
                      <span className="wishlist-price-original">
                        ₹{(item.product.price / (1 - item.product.discount/100)).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="wishlist-item-actions">
                    {isInCart(item.productId) ? (
                      <button 
                        className="wishlist-action-btn wishlist-action-cart"
                        onClick={() => navigate('/cart')}
                      >
                        <i className="fas fa-shopping-cart me-2"></i>
                        View in Cart
                      </button>
                    ) : (
                      <button 
                        className="wishlist-action-btn wishlist-action-add"
                        onClick={() => addToCart(item.productId)}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Add to Cart
                      </button>
                    )}
                    
                    <button 
                      className="wishlist-action-btn wishlist-action-view"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Recommendations */}
          <div className="wishlist-recommendations">
            <div className="recommendations-header">
              <h2 className="recommendations-title">You might also like</h2>
              <a href="/products" className="recommendations-view-all">
                View All <i className="fas fa-chevron-right ms-1"></i>
              </a>
            </div>
            
            <div className="recommendations-grid">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="recommendation-card">
                  <div className="recommendation-image">
                    <img
                      src={product.image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="recommendation-img"
                    />
                    <button className="recommendation-wishlist-btn">
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                  <div className="recommendation-content">
                    <h4 className="recommendation-title">{product.name}</h4>
                    <p className="recommendation-category">{product.category}</p>
                    <div className="recommendation-price">
                      <span className="recommendation-price-current">₹{product.price}</span>
                      {product.discount > 0 && (
                        <span className="recommendation-price-original">
                          ₹{(product.price / (1 - product.discount/100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button 
                      className="recommendation-add-btn"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;