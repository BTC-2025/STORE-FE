import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductListing.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const ProductListing = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([
    { 
      name: 'Electronics', 
      subCategories: ['Mobiles & Accessories', 'Laptops & Accessories', 'Computers & Components', 'Audio & Wearables', 'Cameras & Photography', 'TVs & Home Entertainment', 'Gaming', 'Home Appliances', 'Networking & Smart Devices', 'Electronic Accessories'] 
    },
    { 
      name: 'Clothing', 
      subCategories: ['Men Top Wear', 'Men Bottom Wear', 'Women Ethnic', 'Women Western', 'Men Footwear', 'Women Footwear'] 
    },
    { 
      name: 'Home & Kitchen', 
      subCategories: ['Furniture', 'Kitchen & Dining', 'Home Decor', 'Bed Linens', 'Bath'] 
    },
    { 
      name: 'Beauty', 
      subCategories: ['Makeup', 'Skincare', 'Haircare', 'Fragrances', 'Personal Care'] 
    },
    { 
      name: 'Sports', 
      subCategories: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Cycling'] 
    },
    { 
      name: 'Books', 
      subCategories: ['Fiction', 'Non-Fiction', 'Academic', 'Children Books', 'Best Sellers'] 
    },
    { 
      name: 'Toys', 
      subCategories: ['Action Figures', 'Educational', 'Outdoor Toys', 'Board Games', 'Puzzles'] 
    },
    {
      name:'Accessories',
      subCategories: ['Watches', 'Bags', 'Jewelry', 'Sunglasses', 'Belts']
    },
    { 
      name: 'Grocery', 
      subCategories: ['Food Cupboard', 'Beverages', 'Snacks', 'Dairy', 'Frozen Foods'] 
    },
    { 
      name: 'Furniture', 
      subCategories: ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor'] 
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: '' });
  const [carted, setCarted] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/product`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // New function to fetch products by subcategory
  const fetchProductsBySubCategory = async (subcategory) => {

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/product/subcategory/filter?subcategory=${encodeURIComponent(subcategory)}`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      setSelectedSubCategory(subcategory);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products by subcategory:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
      setFilteredProducts(location.state.products);
      setLoading(false);
    } else {
      fetchProducts();
    }
  }, [location.state]);

  useEffect(() => {
    if (user) {
      alreadyCarted();
    }
  }, [user]);

  const alreadyCarted = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/cart/userid/${user.id}`);
      setCarted(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const isInCart = (productId) => {
    return carted.some(item => item.productId === productId);
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}`
      );
      const productIds = response.data.map(item => item.productId);
      setWishlist(productIds);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = async (productId, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      if (isInWishlist(productId)) {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}/productid/${productId}`
        );
        setWishlist(prev => prev.filter(id => id !== productId));
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
        setWishlist(prev => [...prev, productId]);
        navigate(0)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }

    if (selectedRatings.length > 0) {
      result = result.filter(product => 
        selectedRatings.includes(Math.floor(product.averageRating))
      );
    }

    if (selectedDiscounts.length > 0) {
      result = result.filter(product => 
        selectedDiscounts.some(discount => product.discount >= discount)
      );
    }

    if (sortOption) {
      switch(sortOption) {
        case 'priceLowToHigh':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'priceHighToLow':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'topRating':
          result.sort((a, b) => b.averageRating - a.averageRating);
          break;
        case 'newestFirst':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'popular':
          result.sort((a, b) => b.soldCount - a.soldCount);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result);
  }, [
    products, selectedCategory, sortOption, priceRange, 
    selectedBrands, selectedRatings, selectedDiscounts,
  ]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory('');
    // Reset to all products when selecting a main category
    fetchProducts();
  };

  // New function to handle subcategory selection
  const handleSubCategorySelect = (subCategory) => {
    fetchProductsBySubCategory(subCategory);
    setHoveredCategory(null); // Close the dropdown
  };

  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleRatingToggle = (rating) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter(r => r !== rating));
    } else {
      setSelectedRatings([...selectedRatings, rating]);
    }
  };

  const handleDiscountToggle = (discount) => {
    if (selectedDiscounts.includes(discount)) {
      setSelectedDiscounts(selectedDiscounts.filter(d => d !== discount));
    } else {
      setSelectedDiscounts([...selectedDiscounts, discount]);
    }
  };

  const getUniqueBrands = () => {
    const brands = products.map(product => product.brand);
    return [...new Set(brands)];
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSubCategories([]);
    setSortOption('');
    setPriceRange([0, 1000000]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedDiscounts([]);
    fetchProducts(); // Reset to all products
  };

  const addToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const cartData = {
        userId: user.id,
        productId: product.id,
        quantity: 1,
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
        showCartMessage('Added to cart successfully!', 'success');
        navigate(0);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showCartMessage('Failed to add to cart. Please try again.', 'error');
    }
  };

  const showCartMessage = (text, type) => {
    setCartMessage({ show: true, text, type });
    
    setTimeout(() => {
      setCartMessage({ show: false, text: '', type: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-fluid pb-4 ecommerce-container">
      {/* Toast Notification */}
      {cartMessage.show && (
        <div className={`enhanced-toast ${cartMessage.type}`}>
          <div className="toast-content">
            <i className={`fas ${cartMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{cartMessage.text}</span>
          </div>
          <button onClick={() => setCartMessage({ show: false, text: '', type: '' })}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Top Category Navigation Bar */}
      {/* <div className="top-category-nav">
        <div className="container">
          <div className="category-nav-inner">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="category-nav-item"
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleCategorySelect(category.name)}
              >
                <span className={selectedCategory === category.name ? 'active' : ''}>
                  {category.name}
                </span>

                {hoveredCategory === index && (
                  <div className="subcategory-dropdown">
                    <div className="subcategory-grid">
                      {category.subCategories.map((subCategory, subIndex) => (
                        <div 
                          key={subIndex} 
                          className="subcategory-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubCategorySelect(subCategory);
                          }}
                        >
                          {subCategory}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <div className="top-category-nav p-0">
  <div className="">
    <div className="category-nav-inner">
      {categories.map((category, index) => (
        <div 
          key={index}
          className="category-nav-item"
          onMouseEnter={() => setHoveredCategory(index)}
          onMouseLeave={() => setHoveredCategory(null)}
          onClick={() => handleCategorySelect(category.name)}
        >
          <span className={selectedCategory === category.name ? 'active' : ''}>
            {category.name}
          </span>

          {hoveredCategory === index && (
            <div className="subcategory-dropdown">
              <div className="subcategory-grid">
                {category.subCategories.map((subCategory, subIndex) => (
                  <div 
                    key={subIndex} 
                    className="subcategory-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubCategorySelect(subCategory);
                    }}
                  >
                    {subCategory}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>


      {/* Page Header */}
      <div className="page-header-section mb-5 mt-4">
        <div className="header-content text-center">
          <h1 className="page-title">Discover Our Products</h1>
          <p className="page-subtitle">Find the perfect items for your needs</p>
          {selectedSubCategory && (
            <div className="selected-subcategory-badge">
              Showing results for: <strong>{selectedSubCategory}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        {/* Mobile Filter Toggle */}
        <div className="col-12 d-lg-none mb-4">
          <button 
            className="enhanced-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className={`fas fa-${showFilters ? 'times' : 'filter'}`}></i>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <span className="filter-badge">{filteredProducts.length}</span>
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className={`col-lg-3 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
          <div className="enhanced-sidebar">
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="reset-filters-btn" onClick={resetFilters}>
                <i className="fas fa-redo"></i>
                Reset
              </button>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Sort By</h4>
              <select 
                className="enhanced-select" 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Select Option</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="topRating">Top Rating</option>
                <option value="newestFirst">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-range-container">
                <div className="price-display">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  className="price-slider" 
                  min="0" 
                  max="1000000" 
                  step="10000"
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Brand</h4>
              <div className="brand-list">
                {getUniqueBrands().map(brand => (
                  <div className="checkbox-item" key={brand}>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                      />
                      <span className="checkmark"></span>
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Customer Ratings</h4>
              <div className="rating-list">
                {[4, 3, 2, 1].map(rating => (
                  <div className="checkbox-item" key={rating}>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingToggle(rating)}
                      />
                      <span className="checkmark"></span>
                      <span className="rating-stars">
                        {Array(rating).fill().map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                        {rating < 5 && Array(5 - rating).fill().map((_, i) => (
                          <i key={i} className="far fa-star"></i>
                        ))} & Up
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Discount</h4>
              <div className="discount-list">
                {[10, 20, 30, 40, 50].map(discount => (
                  <div className="checkbox-item" key={discount}>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedDiscounts.includes(discount)}
                        onChange={() => handleDiscountToggle(discount)}
                      />
                      <span className="checkmark"></span>
                      {discount}% or more
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Listing */}
        <div className="col-lg-9 mt-2">
          <div className="listing-header">
            <p className="results-count">
              Showing <span>{filteredProducts.length}</span> products
              {selectedCategory && (
                <span> in <strong>{selectedCategory}</strong></span>
              )}
              {selectedSubCategory && (
                <span> / <strong>{selectedSubCategory}</strong></span>
              )}
            </p>
            <div className="view-toggle">
              <button 
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th"></i>
              </button>
              <button 
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? "products-grid" : "products-list"}>
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card-enhanced"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="img-fluid"  />

                    {product.discount > 0 && (
                      <div className="discount-badge">
                        -{product.discount}% OFF
                      </div>
                    )}
                    
                    <button 
                      className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(product.id, e)}
                    >
                      <i className={isInWishlist(product.id) ? "fas fa-heart" : "far fa-heart"}></i>
                    </button>

                    <div className="product-actions">
                      {isInCart(product.id) ? (
                        <button 
                          className="action-btn go-to-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/cart');
                          }}
                        >
                          <i className="fas fa-shopping-cart"></i>
                          Go to Cart
                        </button>
                      ) : (
                        <>
                          <button 
                            className="action-btn add-to-cart-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            <i className="fas fa-shopping-cart"></i>
                            Add to Cart
                          </button>
                          <button 
                            className="action-btn buy-now-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                              navigate(`/checkout/${product.id}`);
                            }}
                          >
                            <i className="fas fa-bolt"></i>
                            Buy Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="product-meta">
                      <span className="product-category">{product.category}</span>
                      <div className="product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-star ${i < Math.floor(product.averageRating) ? 'filled' : 'empty'}`}
                            ></i>
                          ))}
                        </div>
                        <span>({product.averageRating.toFixed(1)})</span>
                      </div>
                    </div>
                    
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.shortDescription}</p>
                    
                    <div className="product-price">
                      <span className="current-price">${product.price}</span>
                      {product.discount > 0 && (
                        <span className="original-price">
                          ${(product.price / (1 - product.discount/100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products-found">
              <div className="no-products-content">
                <i className="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters to find what you're looking for</p>
                <button className="primary-btn" onClick={resetFilters}>
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="enhanced-pagination">
              <button className="pagination-btn" disabled>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;