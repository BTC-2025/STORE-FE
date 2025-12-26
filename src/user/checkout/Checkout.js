import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/address/${user.id}`);
        setAddresses(response.data);
        if (response.data.length > 0) {
          // Ensure we're storing the address ID as a number
          setSelectedAddress(Number(response.data[0].id));
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/review/product/${id}`);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleAddressChange = (addressId) => {
    // Convert to number to ensure type consistency
    setSelectedAddress(Number(addressId));
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const addressData = {
        ...newAddress,
        userId: user.id
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/address`,
        addressData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Add the new address to the list and select it
      setAddresses([...addresses, response.data]);
      setSelectedAddress(Number(response.data.id)); // Ensure we store as number
      setShowAddressForm(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
      });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Create order with selected product and address
      const orderData = {
        userId: user.id,
        productId: product.id,
        addressId: selectedAddress,
        quantity: quantity,
        totalAmount: (product.price - (product.price * (product.discount / 100))) * quantity
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/order`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= (product.stock || 10)) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading-container">
        <div className="checkout-spinner"></div>
        <p>Loading your checkout experience...</p>
      </div>
    );
  }

  // Calculate price details
  const unitPrice = product.price - (product.price * (product.discount / 100));
  const subtotal = product.price * quantity;
  const discountAmount = (product.price * (product.discount / 100)) * quantity;
  const total = unitPrice * quantity;

  return (
    <div className="checkout-container">
      
      <div className="checkout-content mt-3">
        {/* Left Column - Product & Reviews */}
        <div className="checkout-left">
          {/* Product Card */}
          <div className="elegant-card">
            <div className="cards-header elegant-header">
              <h2>Product Details</h2>
            </div>
            <div className="card-body">
              {product && (
                <>
                  <div className="product-display">
                    <div className="products-image-container">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-image"
                      />
                      {product.discount > 0 && (
                        <div className="discounts-badge">-{product.discount}%</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">{product.description || "Premium quality product with excellent features and durability."}</p>
                      
                      <div className="price-details">
                        {product.discount > 0 ? (
                          <>
                            <div className="original-price">${product.price.toFixed(2)}</div>
                            <div className="final-price">${unitPrice.toFixed(2)}</div>
                            <div className="savings">You save ${(product.price * (product.discount / 100)).toFixed(2)}</div>
                          </>
                        ) : (
                          <div className="final-price">${product.price.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="quantity-selector">
                    <label htmlFor="quantity">Quantity:</label>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn" 
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        max={product.stock || 10}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="quantity-input"
                      />
                      <button 
                        className="quantity-btn" 
                        onClick={increaseQuantity}
                        disabled={quantity >= (product.stock || 10)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <span className="stock-info">{product.stock || 10} available</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="elegant-card reviews-section">
            <div className="cards-header elegant-header">
              <h2>Customer Reviews</h2>
              {reviews.length > 0 && (
                <div className="average-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas fa-star ${i < Math.floor(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length) ? 'active' : ''}`}
                      ></i>
                    ))}
                  </div>
                  <span>Based on {reviews.length} reviews</span>
                </div>
              )}
            </div>
            <div className="card-body">
              {reviews.length > 0 ? (
                <div className="reviews-container">
                  {reviews.slice(0, 3).map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="reviewer-details">
                            <h4>{review.user.name}</h4>
                            <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-star ${i < Math.floor(review.rating) ? 'active' : ''}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <button className="view-all-reviews">View All Reviews</button>
                  )}
                </div>
              ) : (
                <div className="no-reviews">
                  <i className="fas fa-comment-slash"></i>
                  <p>No reviews yet for this product.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Address & Order Summary */}
        <div className="checkout-right">
          {/* Address Selection */}
          <div className="elegant-card">
            <div className="cards-header elegant-header">
              <h2>Shipping Address</h2>
              <button 
                className="icon-button"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                <i className={`fas ${showAddressForm ? 'fa-times' : 'fa-plus'}`}></i>
                {showAddressForm ? 'Cancel' : 'Add New'}
              </button>
            </div>
            <div className="checkout-card-body">
              {/* Existing Addresses */}
              {addresses.length > 0 ? (
                <div className="address-list">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`address-item ${selectedAddress === address.id ? 'selected' : ''}`}
                      onClick={() => handleAddressChange(address.id)}
                    >
                      <div className="address-radio">
                        <input 
                          type="radio" 
                          name="address" 
                          checked={selectedAddress === address.id}
                          onChange={() => handleAddressChange(address.id)}
                          value={address.id}
                        />
                      </div>
                      <div className="address-details">
                        <div className="address-label">{address.label}</div>
                        <p className="address-text">
                          {address.street}, {address.city}, {address.state} - {address.postalCode}, {address.country}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-addresses">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>No addresses found. Please add a delivery address.</p>
                </div>
              )}

              {/* Add New Address Button */}
              <button 
                className="add-address-btn"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                <i className={`fas fa-${showAddressForm ? 'minus' : 'plus'} me-2`}></i>
                {showAddressForm ? 'Cancel' : 'Add New Address'}
              </button>

              {/* New Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="label">Address Label</label>
                      <select 
                        id="label"
                        name="label"
                        value={newAddress.label}
                        onChange={handleNewAddressChange}
                        className="form-control"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="street">Street Address *</label>
                    <textarea 
                      id="street"
                      name="street"
                      value={newAddress.street}
                      onChange={handleNewAddressChange}
                      className="form-control"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input 
                        type="text"
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={handleNewAddressChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input 
                        type="text"
                        id="state"
                        name="state"
                        value={newAddress.state}
                        onChange={handleNewAddressChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code *</label>
                      <input 
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={newAddress.postalCode}
                        onChange={handleNewAddressChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input 
                        type="text"
                        id="country"
                        name="country"
                        value={newAddress.country}
                        onChange={handleNewAddressChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <button type="submit" className="save-address-btn">
                    <i className="fas fa-save me-2"></i>
                    Save Address
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="elegant-card order-summary">
            <div className="cards-header elegant-header">
              <h2>Order Summary</h2>
            </div>
            <div className="card-body">
              {product && (
                <>
                  <div className="summary-item">
                    <span>Subtotal ({quantity} {quantity > 1 ? 'items' : 'item'})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {product.discount > 0 && (
                    <div className="summary-item discount">
                      <span>Discount ({product.discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-item">
                    <span>Shipping</span>
                    <span className="free-shipping">Free</span>
                  </div>
                  <div className="summary-item">
                    <span>Estimated Tax</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-total">
                    <span>Total</span>
                    <span>${(total * 1.08).toFixed(2)}</span>
                  </div>
                  
                  <button 
                    className="place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddress}
                  >
                    <i className="fas fa-lock"></i>
                    Complete Purchase
                  </button>
                  
                  <div className="security-assurance">
                    <i className="fas fa-shield-alt"></i>
                    <span>Secure checkout guaranteed</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;