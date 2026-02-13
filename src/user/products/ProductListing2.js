import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductListing2.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const ProductListing2 = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Data matching the reference image style structure
    const [categories, setCategories] = useState([
        { name: 'Electronics', count: 320 },
        { name: 'Clothing', count: 112 },
        { name: 'Home & Kitchen', count: 32 },
        { name: 'Beauty', count: 48 },
        { name: 'Sports', count: 14 },
        { name: 'Books', count: 85 },
        { name: 'Toys', count: 140 },
        { name: 'Accessories', count: 55 }
    ]);

    const [selectedCategory, setSelectedCategory] = useState('');
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

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    // --- Data Fetching Logic (Same as original) ---
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/product`);
            setProducts(response.data);
            setFilteredProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
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
        if (user) alreadyCarted();
    }, [user]);

    const alreadyCarted = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/cart/userid/${user.id}`);
            setCarted(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const isInCart = (productId) => carted.some(item => item.productId === productId);

    useEffect(() => {
        if (user) fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}`);
            setWishlist(response.data.map(item => item.productId));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const isInWishlist = (productId) => wishlist.includes(productId);

    const toggleWishlist = async (productId, e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            if (isInWishlist(productId)) {
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/wishlist/userid/${user.id}/productid/${productId}`);
                setWishlist(prev => prev.filter(id => id !== productId));
            } else {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/wishlist`, { userId: user.id, productId: productId });
                setWishlist(prev => [...prev, productId]);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const addToCart = async (product) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/cart/add`, {
                userId: user.id,
                productId: product.id,
                quantity: 1,
            });
            showCartMessage('Added to cart successfully!', 'success');
            alreadyCarted(); // Refresh cart state
        } catch (error) {
            console.error('Error adding to cart:', error);
            showCartMessage('Failed to add to cart.', 'error');
        }
    };

    const showCartMessage = (text, type) => {
        setCartMessage({ show: true, text, type });
        setTimeout(() => setCartMessage({ show: false, text: '', type: '' }), 3000);
    };

    // --- Filtering Logic ---
    useEffect(() => {
        let result = [...products];
        if (selectedCategory) result = result.filter(product => product.category === selectedCategory);
        result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
        if (selectedBrands.length > 0) result = result.filter(product => selectedBrands.includes(product.brand));
        if (selectedRatings.length > 0) result = result.filter(product => selectedRatings.includes(Math.floor(product.averageRating)));

        if (sortOption === 'priceLowToHigh') result.sort((a, b) => a.price - b.price);
        if (sortOption === 'priceHighToLow') result.sort((a, b) => b.price - a.price);
        if (sortOption === 'topRating') result.sort((a, b) => b.averageRating - a.averageRating);
        if (sortOption === 'newestFirst') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sortOption === 'popular') result.sort((a, b) => b.soldCount - a.soldCount);

        setFilteredProducts(result);
    }, [products, selectedCategory, sortOption, priceRange, selectedBrands, selectedRatings, selectedDiscounts]);

    const getUniqueBrands = () => [...new Set(products.map(p => p.brand))];
    const getCategoryCount = (name) => products.filter(p => p.category === name).length;

    const handleBrandToggle = (brand) => {
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    };

    const handleRatingToggle = (rating) => {
        setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);
    };

    if (loading) return <div className="pl2-loading">Loading...</div>;

    return (
        <div className="pl2-page-container">
            {/* Toast */}
            {cartMessage.show && (
                <div className={`pl2-toast ${cartMessage.type}`}>
                    {cartMessage.text}
                </div>
            )}

            {/* Header Section */}
            <div className="pl2-header">
                <h1 className="pl2-title">{selectedCategory || 'All Products'}</h1>

                <div className="pl2-controls-row">
                    <div className="pl2-filter-chips">
                        <button
                            className={`pl2-chip ${sortOption === 'popular' ? 'active' : ''}`}
                            onClick={() => setSortOption(sortOption === 'popular' ? '' : 'popular')}
                        >
                            Most Popular
                        </button>
                        <button
                            className={`pl2-chip ${sortOption === 'priceLowToHigh' ? 'active' : ''}`}
                            onClick={() => setSortOption(sortOption === 'priceLowToHigh' ? '' : 'priceLowToHigh')}
                        >
                            Cheapest
                        </button>
                        {/* Dynamic Brand Chips to mimic 'Farm 328' look */}
                        {getUniqueBrands().slice(0, 3).map(brand => (
                            <button
                                key={brand}
                                className={`pl2-chip ${selectedBrands.includes(brand) ? 'active' : ''}`}
                                onClick={() => handleBrandToggle(brand)}
                            >
                                {brand} <span className="pl2-chip-count">{products.filter(p => p.brand === brand).length}</span>
                            </button>
                        ))}
                    </div>

                    <div className="pl2-view-controls">
                        <div className="pl2-view-toggle">
                            <button
                                className={`pl2-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <i className="fas fa-th"></i> Grid view
                            </button>
                            <button
                                className={`pl2-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <i className="fas fa-list"></i> List view
                            </button>
                        </div>
                        <div className="pl2-product-count-badge">
                            {filteredProducts.length} Products
                        </div>
                    </div>
                </div>

                {/* Applied Filters Row */}
                {(selectedBrands.length > 0 || selectedRatings.length > 0) && (
                    <div className="pl2-applied-filters">
                        <span className="pl2-applied-label">Applied Filters:</span>
                        {selectedBrands.map(b => (
                            <span key={b} className="pl2-applied-tag">
                                {b} <i className="fas fa-times" onClick={() => handleBrandToggle(b)}></i>
                            </span>
                        ))}
                        {selectedRatings.map(r => (
                            <span key={r} className="pl2-applied-tag">
                                {r} Stars <i className="fas fa-times" onClick={() => handleRatingToggle(r)}></i>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="pl2-content-layout">
                {/* Sidebar */}
                <aside className="pl2-sidebar">
                    <div className="pl2-sidebar-group">
                        <h3 className="pl2-sidebar-title">Categories</h3>
                        <div className="pl2-category-list">
                            {categories.map(cat => (
                                <div
                                    key={cat.name}
                                    className={`pl2-category-item ${selectedCategory === cat.name ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    <span className="name">{cat.name}</span>
                                    <span className="count">{getCategoryCount(cat.name) || cat.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pl2-sidebar-group">
                        <h3 className="pl2-sidebar-title">Brands</h3>
                        <div className="pl2-checkbox-list">
                            {getUniqueBrands().map(brand => (
                                <label key={brand} className="pl2-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleBrandToggle(brand)}
                                    />
                                    <span className="pl2-custom-check"></span>
                                    {brand}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pl2-sidebar-group">
                        <h3 className="pl2-sidebar-title">Rating</h3>
                        <div className="pl2-checkbox-list">
                            {[5, 4, 3, 2, 1].map(star => (
                                <label key={star} className="pl2-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedRatings.includes(star)}
                                        onChange={() => handleRatingToggle(star)}
                                    />
                                    <span className="pl2-custom-check"></span>
                                    <div className="pl2-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fas fa-star ${i < star ? 'filled' : 'empty'}`}></i>
                                        ))}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pl2-sidebar-group">
                        <h3 className="pl2-sidebar-title">Price</h3>
                        <div className="pl2-price-slider">
                            <input
                                type="range"
                                min="0"
                                max="1000000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            />
                            <div className="pl2-price-values">
                                <span>Min: {priceRange[0]}</span>
                                <span>Max: {priceRange[1]}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className={`pl2-products-area ${viewMode}`}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="pl2-product-card"
                                onClick={() => navigate(`/product/${product.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="pl2-card-image">
                                    <img src={product.image} alt={product.name} />
                                    {product.discount > 0 && <span className="pl2-discount-tag">- {product.discount}%</span>}

                                    <div className="pl2-image-overlay">
                                        <button
                                            className="pl2-quick-view-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Functionality to be added later
                                                console.log("Quick view for", product.name);
                                            }}
                                        >
                                            Quick View
                                        </button>
                                    </div>

                                    <button
                                        className={`pl2-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                        onClick={(e) => toggleWishlist(product.id, e)}
                                    >
                                        <i className={isInWishlist(product.id) ? "fas fa-heart" : "far fa-heart"}></i>
                                    </button>
                                </div>

                                <div className="pl2-card-details">
                                    <h3 className="pl2-card-title">{product.name}</h3>
                                    <p className="pl2-card-desc">{product.shortDescription || 'Fresh and healthy product for your daily needs.'}</p>

                                    <div className="pl2-card-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa-star ${i < Math.floor(product.averageRating) ? 'fas filled' : 'far empty'}`}></i>
                                        ))}
                                    </div>

                                    <div className="pl2-card-bottom">
                                        <div className="pl2-prices">
                                            <div className="pl2-price-current">{product.price} USD</div>
                                            {product.discount > 0 && <div className="pl2-price-old">48.56</div>}
                                        </div>

                                        {isInCart(product.id) ? (
                                            <button
                                                className="pl2-buy-btn in-cart"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/cart');
                                                }}
                                            >
                                                In Cart
                                            </button>
                                        ) : (
                                            <button
                                                className="pl2-buy-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product);
                                                }}
                                            >
                                                Buy now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="pl2-no-products">
                            <h3>No products found</h3>
                            <button onClick={() => { setSelectedBrands([]); setSelectedRatings([]); setPriceRange([0, 1000000]); }}>Reset Filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductListing2;
