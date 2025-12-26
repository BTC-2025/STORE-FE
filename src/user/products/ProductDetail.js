import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        console.log(id, user.id)
        // Fetch product, cart, wishlist, and reviews data in parallel
        const [productResponse, cartResponse, wishlistResponse, reviewsResponse] = await Promise.allSettled([
          // Product data
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/product/${id}${user ? `?userId=${user.id}` : ''}`),
          
          // Cart data (only if user is logged in)
          user ? axios.get(`${process.env.REACT_APP_BASE_URL}/api/cart/userid/${user.id}`) : Promise.resolve({data: []}),
          
          // Wishlist data (only if user is logged in)
          user ? axios.get(`${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}`) : Promise.resolve({data: []}),
          
          // Reviews data
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/review/product/${id}`)
        ]);

        // Handle product response
        if (productResponse.status === 'fulfilled') {
          setProduct(productResponse.value.data);
        } else {
          console.error("Error fetching product:", productResponse.reason);
          setError("Product not found");
        }

        // Handle cart response
        if (cartResponse.status === 'fulfilled') {
          setCartItems(cartResponse.value.data);
        } else {
          console.error('Error fetching cart items:', cartResponse.reason);
        }

        // Handle wishlist response
        if (wishlistResponse.status === 'fulfilled') {
          setWishlistItems(wishlistResponse.value.data);
        } else {
          console.error('Error fetching wishlist items:', wishlistResponse.reason);
        }

        // Handle reviews response
        // if (reviewsResponse.status === 'fulfilled' && reviewsResponse.value.data.success) {
        //   setReviews(reviewsResponse.value.data.reviews);
        // } else {
        //   console.error('Error fetching reviews:', reviewsResponse.reason);
        // }

        // if (reviewsResponse.status === "fulfilled") {
        //   if (reviewsResponse.value.data.success) {
        //     setReviews(reviewsResponse.value.data.reviews);
        //   } else {
        //     console.error("Reviews API returned success=false:", reviewsResponse.value.data);
        //   }
        // } else {
        //   console.error("Error fetching reviews:", reviewsResponse.reason);
        // }
        if (reviewsResponse.status === "fulfilled") {
  const data = reviewsResponse.value.data;

  if (Array.isArray(data)) {
    // Case 1: API returned reviews directly
    setReviews(data);
  } else if (data.reviews) {
    // Case 2: API returned { reviews: [...] }
    setReviews(data.reviews);
  } else if (data.success) {
    // Case 3: API returned { success: true, reviews: [...] }
    setReviews(data.reviews || []);
  } else {
    console.error("Unexpected reviews response:", data);
  }
} else {
  console.error("Error fetching reviews:", reviewsResponse.reason);
}




      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, user]);

  // Check if product is in cart
  const isInCart = () => {
    return cartItems.some(item => item.productId === parseInt(id));
  };

  // Check if product is in wishlist
  const isInWishlist = () => {
    return wishlistItems.some(item => item.productId === parseInt(id));
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    if (product && newQuantity > product.stock) newQuantity = product.stock;
    setQuantity(newQuantity);
  };

  // Add to cart function
  const addToCart = async () => {
    try {
      if (!user) {
        showMessage("Please login to add items to cart", "error");
        navigate('/login');
        return;
      }

      const cartData = {
        userId: user.id,
        productId: product.id,
        quantity: quantity,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/cart/add`,
        cartData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        showMessage(`Added ${quantity} item(s) to cart successfully!`, 'success');
        // Refresh cart items after adding to cart
        const cartResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/cart/userid/${user.id}`);
        navigate(0)
        setCartItems(cartResponse.data);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showMessage('Failed to add to cart. Please try again.', 'error');
    }
  };

  // Buy now function
  const buyNow = async () => {
    if (!isInCart()) {
      await addToCart();
    }
    navigate('/cart');
  };

  // Add to wishlist function
  const addToWishlist = async () => {
    try {
      if (!user) {
        showMessage("Please login to add items to wishlist", "error");
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/wishlist`,
        {
          userId: user.id,
          productId: product.id
        }
      );

      if (response.status === 200 || response.status === 201) {
        showMessage('Added to wishlist successfully!', 'success');
        // Refresh wishlist items after adding
        const wishlistResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}`);
        setWishlistItems(wishlistResponse.data);
      } else {
        throw new Error('Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showMessage('Failed to add to wishlist. Please try again.', 'error');
    }
  };

  // Remove from wishlist function
  const removeFromWishlist = async () => {
    try {
      if (!user) {
        showMessage("Please login to manage your wishlist", "error");
        navigate('/login');
        return;
      }

      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}/productid/${product.id}`
      );

      showMessage('Removed from wishlist successfully!', 'success');
      // Refresh wishlist items after removing
      const wishlistResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}`);
      setWishlistItems(wishlistResponse.data);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showMessage('Failed to remove from wishlist. Please try again.', 'error');
    }
  };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setMessage({ show: false, text: '', type: '' });
    }, 3000);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-warning"></i>);
      }
    }
    
    return stars;
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
    
    reviews.forEach(review => {
      const roundedRating = Math.round(review.rating);
      if (roundedRating >= 1 && roundedRating <= 5) {
        distribution[roundedRating]++;
      }
    });
    
    return distribution;
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <i className="fas fa-exclamation-circle fa-3x text-muted mb-3"></i>
          <h2>Product not found</h2>
          <p className="text-muted">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Generate image gallery
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`];

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Get rating distribution
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="product-detail-page">
      {/* Toast Notification */}
      {message.show && (
        <div className={`toast-notification ${message.type}`} style={{zIndex:1000}}>
          <i className={`icon ${message.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}`}></i>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ show: false, text: '', type: '' })}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="breadcrumb-wrapper">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="divider">/</span>
            <Link to="/products">Products</Link>
            <span className="divider">/</span>
            <Link to={`/products?category=${product.category}`}>{product.category}</Link>
            <span className="divider">/</span>
            <span className="current">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container main-content">
        <div className="product-detail-layout">
          {/* Image Gallery Section */}
          <div className="gallery-section">
            <div className="main-image-container">
              <div className="image-wrapper">
                <img 
                  src={images[selectedImage]} 
                  alt={product.name}
                  className="main-product-image"
                />
                {product.stock <= 0 && (
                  <div className="out-of-stock-banner">
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="thumbnail-gallery">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="rating-badge">
                <div className="stars">{renderStars(averageRating)}</div>
                <span className="rating-text">({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="price-container">
              <div className="current-price">₹{product.price}</div>
              {product.discount > 0 && (
                <div className="price-details">
                  <span className="original-price">₹{(product.price / (1 - product.discount/100)).toFixed(2)}</span>
                  <span className="discount-tag">{product.discount}% off</span>
                </div>
              )}
            </div>

            {product.stock > 0 ? (
              <div className="stock-status in-stock">
                <i className="fas fa-check-circle"></i>
                <span>In stock</span>
              </div>
            ) : (
              <div className="stock-status out-of-stock">
                <i className="fas fa-times-circle"></i>
                <span>Out of stock</span>
              </div>
            )}

            <div className="short-description">
              <p>{product.description?.substring(0, 150)}...</p>
            </div>

            {/* Quantity Selector */}
            {!isInCart() && product.stock > 0 && (
              <div className="quantity-selector-container">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              {isInCart() ? (
                <>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/cart')}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    View in Cart
                  </button>
                  
                  <button 
                    className="btn-secondary"
                    onClick={buyNow}
                    disabled={product.stock <= 0}
                  >
                    <i className="fas fa-bolt"></i>
                    Buy Now
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn-primary"
                    onClick={addToCart}
                    disabled={product.stock <= 0}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Add to Cart
                  </button>
                  
                  <button 
                    className="btn-secondary"
                    onClick={buyNow}
                    disabled={product.stock <= 0}
                  >
                    <i className="fas fa-bolt"></i>
                    Buy Now
                  </button>
                </>
              )}
              
              {/* Wishlist Button */}
              {isInWishlist() ? (
                <button 
                  className="btn-wishlist active"
                  onClick={removeFromWishlist}
                >
                  <i className="fas fa-heart"></i>
                  Remove from Wishlist
                </button>
              ) : (
                <button 
                  className="btn-wishlist"
                  onClick={addToWishlist}
                >
                  <i className="far fa-heart"></i>
                  Add to Wishlist
                </button>
              )}
            </div>

            {/* Services & Delivery */}
            <div className="services-container">
              <div className="service-item">
                <i className="fas fa-truck"></i>
                <div>
                  <h4>Free Delivery</h4>
                  <p>On orders above ₹499</p>
                </div>
              </div>
              <div className="service-item">
                <i className="fas fa-sync-alt"></i>
                <div>
                  <h4>10 Days Return</h4>
                  <p>Easy return policy</p>
                </div>
              </div>
              <div className="service-item">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <h4>1 Year Warranty</h4>
                  <p>Manufacturer warranty</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="sidebar-section">
            <div className="sidebar-card">
              <h3>Delivery Options</h3>
              <div className="delivery-check">
                <input type="text" placeholder="Enter pincode" />
                <button>Check</button>
              </div>
              <div className="delivery-info">
                <i className="fas fa-map-marker-alt"></i>
                <span>Delivery to your location</span>
              </div>
              <div className="delivery-time">
                <i className="fas fa-clock"></i>
                <span>Delivery by Tomorrow, 10 AM</span>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Seller Information</h3>
              <div className="seller-info">
                <span className="seller-name">{product.brand || "Generic Seller"}</span>
                <div className="seller-rating">
                  <i className="fas fa-star"></i>
                  <span>4.5/5</span>
                </div>
              </div>
              <button className="view-seller-btn">View Seller Profile</button>
            </div>

            <div className="sidebar-card">
              <h3>Product Specifications</h3>
              <div className="specs-list">
                <div className="spec-item">
                  <span className="spec-name">Brand</span>
                  <span className="spec-value">{product.brand || "Not specified"}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-name">Model</span>
                  <span className="spec-value">{product.sku || `PRD-${product.id}`}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-name">Color</span>
                  <span className="spec-value">{product.color || "Not specified"}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-name">Material</span>
                  <span className="spec-value">{product.material || "Not specified"}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-name">Weight Capacity</span>
                  <span className="spec-value">{product.weightCapacity || "Not specified"}</span>
                </div>
              </div>
              <button className="view-all-specs">View All Specifications</button>
            </div>
          </div>
        </div>

        {/* Details Tabs Section */}
        <div className="details-tabs-section">
          <div className="tabs-header">
            <button className="tab-btn active">Description</button>
            <button className="tab-btn">Specifications</button>
            <button className="tab-btn">Reviews ({reviews.length})</button>
          </div>
          
          <div className="tab-content">
            <div className="tab-panel active">
              <h3>Product Description</h3>
              <p>{product.description || "No description available."}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section - OLD STYLE */}
        <div className="reviews-section-old">
          <div className="reviews-container">
            <h3>Ratings & Reviews</h3>
            
            <div className="reviews-content">
              {/* Rating Summary */}
              <div className="rating-overview-old">
                <div className="average-rating-old">
                  <h2>{averageRating} <span>/5</span></h2>
                  <div className="rating-stars-old">{renderStars(averageRating)}</div>
                  <div className="rating-count-old">{reviews.length} Ratings & Reviews</div>
                </div>
                
                <div className="rating-bars-old">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="rating-bar-old">
                      <span className="star-value-old">{star} star</span>
                      <div className="progress-container-old">
                        <div 
                          className="progress-fill-old" 
                          style={{ width: `${(ratingDistribution[star] / reviews.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="bar-count-old">{ratingDistribution[star]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reviews List */}
              <div className="reviews-list-old">
                {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
                  <div key={review.id} className="review-item-old">
                    <div className="review-header-old">
                      <div className="reviewer-info-old">
                        <div className="reviewer-name-old">{review.user.name}</div>
                        <div className="review-date-old">
                          Certified Buyer • {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="review-rating-old">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <div className="review-content-old">
                      <div className="review-title-old">
                        {review.rating >= 4 ? 'Excellent' : 
                         review.rating >= 3 ? 'Good' : 
                         review.rating >= 2 ? 'Average' : 'Poor'}
                      </div>
                      <p className="review-comment-old">{review.comment}</p>
                    </div>
                    
                    <div className="review-actions-old">
                      <button className="helpful-btn-old">
                        <i className="fas fa-thumbs-up"></i> Helpful
                      </button>
                      <button className="report-btn-old">
                        <i className="fas fa-flag"></i> Report
                      </button>
                    </div>
                  </div>
                ))}
                
                {reviews.length > 2 && (
                  <button 
                    className="view-all-reviews-btn-old"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
                  </button>
                )}
                
                {reviews.length === 0 && (
                  <div className="no-reviews-old">
                    <i className="fas fa-comments"></i>
                    <h4>No reviews yet</h4>
                    <p>Be the first to review this product</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;