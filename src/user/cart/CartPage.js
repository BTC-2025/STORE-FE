import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });

  const navigate = useNavigate();

  // Fetch user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  // Fetch cart items and wishlist when user is available
  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchWishlist();
    } else {
      // If no user, stop loading immediately
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/cart/userid/${user.id}`
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      showMessage("Failed to load cart items", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}`
      );
      const productIds = response.data.map(item => item.productId);
      setWishlist(productIds);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Check if a product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Toggle wishlist status
  const toggleWishlist = async (productId) => {
    try {
      if (isInWishlist(productId)) {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}/productid/${productId}`
        );
        navigate(0)
        setWishlist(prev => prev.filter(id => id !== productId));
        showMessage("Removed from wishlist", "success");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/wishlist`,
          {
            userId: user.id,
            productId: productId
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        navigate(0)
        setWishlist(prev => [...prev, productId]);
        showMessage("Added to wishlist", "success");
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showMessage("Failed to update wishlist", "error");
    }
  };

  // Update quantity
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/cart/update/cardid/${cartId}`,
        { quantity: newQuantity }
      );
      
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
      showMessage("Quantity updated", "success");
    } catch (error) {
      console.error("Error updating quantity:", error);
      showMessage("Failed to update quantity", "error");
    }
  };

  // Remove item from cart
  const removeItem = async (cartId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/cart/remove/cartid/${cartId}`
      );
      navigate(0)
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartId));
      showMessage("Item removed from cart", "success");
    } catch (error) {
      console.error("Error removing item:", error);
      showMessage("Failed to remove item", "error");
    }
  };

  // Empty cart
  const emptyCart = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/cart/clear/userid/${user.id}`
      );
      navigate(0)
      setCartItems([]);
      showMessage("Cart emptied", "success");
    } catch (error) {
      console.error("Error emptying cart:", error);
      showMessage("Failed to empty cart", "error");
    }
  };

  // Move to wishlist
  // const moveToWishlist = async (productId) => {
  //   try {
  //     await axios.post(
  //       `${process.env.REACT_APP_BASE_URL}/api/wishlist`,
  //       {
  //         userId: user.id,
  //         productId: productId
  //       },
  //       {
  //         headers:{
  //           "Content-Type":"application/json"
  //         }
  //       }
  //     );
      
  //     const cartItem = cartItems.find(item => item.productId === productId);
  //     if (cartItem) {
  //       await removeItem(cartItem.id);
  //     }
  //     showMessage("Moved to wishlist", "success");
  //   } catch (error) {
  //     console.error("Error moving to wishlist:", error);
  //     showMessage("Failed to move to wishlist", "error");
  //   }
  // };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => {
      setMessage({ show: false, text: "", type: "" });
    }, 3000);
  };

  // Calculate prices
  const calculatePrices = () => {
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const totalDiscount = cartItems.reduce((acc, item) => {
      const discountPercent = item.discount / 100 || 0;
      return acc + (item.price * discountPercent * item.quantity);
    }, 0);
    
    const deliveryFee = totalPrice > 50 ? 0 : 9.99;
    const protectFee = cartItems.length > 0 ? 9 : 0;
    const finalAmount = cartItems.length > 0 ? totalPrice - totalDiscount + deliveryFee + protectFee : 0;
    
    return { totalPrice, totalDiscount, deliveryFee, protectFee, finalAmount };
  };

  const { totalPrice, totalDiscount, deliveryFee, protectFee, finalAmount } = calculatePrices();

  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-loading-container">
        <div className="cart-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Message Toast */}
      {message.show && (
        <div className="cart-toast-container">
          <div className={`cart-toast cart-toast-${message.type}`}>
            <div className="cart-toast-content">
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
              {message.text}
            </div>
            <button 
              type="button" 
              className="cart-toast-close" 
              onClick={() => setMessage({ show: false, text: "", type: "" })}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="cart-header">
        <div className="cart-header-content">
          <div className="cart-title-section">
            <h1 className="cart-main-title">Shopping Cart</h1>
            {user ? (
              <p className="cart-subtitle">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            ) : (
              <p className="cart-subtitle">Your shopping cart</p>
            )}
          </div>
          
          {user && cartItems.length > 0 && (
            <div className="cart-actions">
              <button 
                className="cart-empty-btn"
                onClick={emptyCart}
              >
                <i className="fas fa-trash me-2"></i>
                Empty Cart
              </button>
            </div>
          )}
        </div>
        
        <nav className="cart-breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li className="active">Cart</li>
          </ol>
        </nav>
      </div>

      {/* Show different content based on authentication status */}
      {!user ? (
        // <div className="cart-guest-container">
        //   <div className="cart-guest-content">
        //     <div className="cart-guest-icon">
        //       <i className="fas fa-shopping-cart"></i>
        //     </div>
        //     <h2 className="cart-guest-title">Your Cart is Waiting</h2>
        //     <p className="cart-guest-text">
        //       Sign in to view your saved items and access your shopping cart across all your devices.
        //     </p>
        //     <div className="cart-guest-buttons">
        //       <button 
        //         className="btn btn-primary btn-lg"
        //         onClick={() => navigate('/login', { state: { from: 'cart' } })}
        //       >
        //         <i className="fas fa-sign-in-alt me-2"></i>
        //         Sign In to View Cart
        //       </button>
        //       <button 
        //         className="btn btn-outline-primary btn-lg"
        //         onClick={() => navigate('/register', { state: { from: 'cart' } })}
        //       >
        //         <i className="fas fa-user-plus me-2"></i>
        //         Create Account
        //       </button>
        //     </div>
        //     <div className="cart-guest-features">
        //       <div className="feature">
        //         <i className="fas fa-sync-alt"></i>
        //         <span>Sync your cart across devices</span>
        //       </div>
        //       <div className="feature">
        //         <i className="fas fa-heart"></i>
        //         <span>Save items to your wishlist</span>
        //       </div>
        //       <div className="feature">
        //         <i className="fas fa-bolt"></i>
        //         <span>Faster checkout experience</span>
        //       </div>
        //     </div>
        //   </div>
        // </div>

              <div className="cart-guest-container">
        <div className="cart-guest-content">
          <div className="cart-guest-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2 className="cart-guest-title">Missing Cart Items?</h2>
          <p className="cart-guest-text">
            Please log in to view your cart items and continue shopping.
          </p>
          <div className="cart-guest-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login', { state: { from: 'cart' } })}
            >
              <i className="fas fa-sign-in-alt me-2"></i>
              Login
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/register', { state: { from: 'cart' } })}
            >
              <i className="fas fa-user-plus me-2"></i>
              Create Account
            </button>
          </div>
        </div>
      </div>
      ) : (
        <div className="cart-content">
          {/* Left: Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-card">
              <div className="cart-items-header">
                <h2 className="cart-items-title">Cart Items ({cartItems.length})</h2>
              </div>
              
              <div className="cart-items-body">
                {cartItems.length === 0 ? (
                  <div className="cart-empty-state">
                    <div className="cart-empty-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <h3 className="cart-empty-title">Your cart is empty</h3>
                    <p className="cart-empty-text">
                      Looks like you haven't added anything to your cart yet.
                    </p>
                    <a href="/products" className="cart-empty-btn">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Continue Shopping
                    </a>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img
                          src={item.Product?.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.Product?.name || 'Product')}`}
                          alt={item.Product?.name}
                          className="cart-item-img"
                        />
                      </div>
                      
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{item.Product?.name}</h3>
                        <p className="cart-item-category">{item.Product?.category}</p>
                        
                        {item.discount > 0 && (
                          <span className="cart-item-discount-badge">
                            -{item.discount}% OFF
                          </span>
                        )}
                        
                        <div className="cart-item-stock">
                          <span className="stock-badge in-stock">
                            <i className="fas fa-box me-1"></i>
                            In Stock
                          </span>
                        </div>
                      </div>
                      
                      <div className="cart-item-quantity">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          
                          <span className="quantity-value">{item.quantity}</span>
                          
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        
                        <div className="cart-item-price">
                          <span className="price-current">₹{(item.price * item.quantity).toFixed(2)}</span>
                          
                          {item.discount > 0 && (
                            <div className="price-discount">
                              <span className="price-original">
                                ₹{(item.price * item.quantity / (1 - item.discount/100)).toFixed(2)}
                              </span>
                              <span className="price-save">
                                Save ₹{(item.price * item.quantity * item.discount/100).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="cart-item-actions">
                        <button
                          className="cart-action-btn cart-action-remove"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        
                        <button
                          className={`cart-action-btn ${isInWishlist(item.productId) ? 'cart-action-wishlist-active' : 'cart-action-wishlist'}`}
                          onClick={() => toggleWishlist(item.productId)}
                          title={isInWishlist(item.productId) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <i className={isInWishlist(item.productId) ? "fas fa-heart" : "far fa-heart"}></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Price Details */}
          <div className="cart-summary-section">
            <div className="cart-summary-card">
              <div className="cart-summary-header">
                <h2 className="cart-summary-title">Order Summary</h2>
              </div>
              
              <div className="cart-summary-body">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>- ₹{totalDiscount.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Delivery Charges</span>
                  <span className={deliveryFee === 0 ? "free-delivery" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span>Protection Fee</span>
                  <span>₹{protectFee.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-total">
                  <span>Total Amount</span>
                  <span className="total-amount">₹{finalAmount.toFixed(2)}</span>
                </div>
                
                <div className="summary-savings">
                  <i className="fas fa-tags me-2"></i>
                  You save <strong>₹{totalDiscount.toFixed(2)}</strong> on this order
                </div>
                
                <button
                  className="checkout-btn"
                  disabled={cartItems.length === 0}
                  onClick={handleCheckout}
                >
                  <i className="fas fa-lock me-2"></i>
                  PROCEED TO CHECKOUT
                </button>
                
                <div className="security-notice">
                  <i className="fas fa-shield-alt me-2"></i>
                  Your transaction is secure and encrypted
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="security-badges">
              <div className="security-badge">
                <i className="fas fa-shield-check"></i>
                <span>Secure Payment</span>
              </div>
              <div className="security-badge">
                <i className="fas fa-truck"></i>
                <span>Free Delivery*</span>
              </div>
              <div className="security-badge">
                <i className="fas fa-undo"></i>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;