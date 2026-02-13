import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ user: propUser, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [localUser, setLocalUser] = useState(null); // Fallback if prop not used
  const [seller, setSeller] = useState(null); // Seller state
  const [cartCount, setCartCount] = useState(0);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  // Use propUser if available, otherwise fallback to localUser (but propUser is preferred for sync)
  const user = propUser || localUser;

  // Create refs for the input and dropdown
  const searchInputRef = useRef(null);
  const historyDropdownRef = useRef(null);

  useEffect(() => {
    // Check for local user logic fallback
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setLocalUser(storedUser);

    // Check for seller
    const storedSeller = JSON.parse(localStorage.getItem("sellerData"));
    if (storedSeller) setSeller(storedSeller);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (historyDropdownRef.current && !historyDropdownRef.current.contains(event.target) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // NOTE: Main user state is now managed by App.js and passed via propUser.
    // We only fetch cart count here if user exists
    if (user || storedUser) {
      fetchCartCount((user || storedUser).id);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]); // Re-run when user changes

  const fetchCartCount = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/cart/userid/${userId}`
      );
      setCartCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Also clear seller data if logged out from here? 
      // Usually disjoint, but for safety in this context:
      // localStorage.removeItem("sellerToken");
      // localStorage.removeItem("sellerData"); 

      setLocalUser(null);
      setCartCount(0);
      window.location.reload();
    }
    navigate('/');
  };

  // ... (keep fetchHistory, handleSearch, deleteSearchHistoryItem, clearSearchHistory as is)

  const fetchHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/searchbar/history`,
          { userId: user.id }
        );
        setHistory(res.data.history);
      }
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/searchbar/products?q=${query}&userId=${user?.id}`,
        { userId: user?.id },
        { headers: { "Content-Type": "application/json" } }
      );

      navigate("/products", { state: { products: res.data.results } });
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const deleteSearchHistoryItem = async (id, e) => {
    if (e) e.stopPropagation();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/searchbar/historybyid/?id=${id}&userId=${user.id}`
        );

        // Store the input element before state change
        const inputElement = searchInputRef.current;

        // Remove the item from local state
        setHistory(history.filter((item) => item.id !== id));

        // Restore focus after state update
        setTimeout(() => {
          if (inputElement) {
            inputElement.focus();
            setShowHistory(true);
          }
        }, 0);
      }
    } catch (error) {
      console.error("Error deleting search history item:", error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/searchbar/history?userId=${user.id}`
        );

        // Store the input element before state change
        const inputElement = searchInputRef.current;

        // Clear the local state
        setHistory([]);

        // Restore focus after state update
        setTimeout(() => {
          if (inputElement) {
            inputElement.focus();
            setShowHistory(true);
          }
        }, 0);
      }
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-md navbar-light shadow-sm sticky-top ${scrolled ? "scrolled" : ""
        }`}
    >
      <div className="container align-items-center">
        {/* Brand */}
        <a className="navbar-brand fw-bold me-5" href="/">
          My Shop
        </a>

        <form
          className="d-none d-lg-flex flex-grow-3 search-bar ms-lg-5 position-relative"
          onSubmit={handleSearch}
        >
          <input
            ref={searchInputRef}
            className="form-control"
            type="search"
            placeholder="Search for products, brands and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setShowHistory(true);
              fetchHistory();
            }}
          />
          <button className="btn ms-2" type="submit">
            <i className="bi bi-search"></i>
          </button>

          {/* Dropdown for history */}
          {showHistory && (
            <div
              ref={historyDropdownRef}
              className="list-group position-absolute w-100 shadow-sm rounded"
              style={{
                zIndex: 1050,
                maxHeight: "250px",
                overflowY: "auto",
                marginTop: "60px",
              }}
            >
              {history.length > 0 ? (
                <>
                  <div className="list-group-item d-flex justify-content-between align-items-center bg-light">
                    <span className="small fw-bold">Recent Searches</span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={clearSearchHistory}
                      title="Clear all history"
                    >
                      Clear All
                    </button>
                  </div>
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="d-flex align-items-center flex-grow-1"
                        onClick={() => {
                          setQuery(item.query);
                          setShowHistory(false);
                        }}
                      >
                        <i className="bi bi-clock-history me-2 text-muted"></i>
                        <span>{item.query}</span>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={(e) => deleteSearchHistoryItem(item.id, e)}
                        title="Delete this search"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="list-group-item text-center text-muted py-3">
                  No recent searches
                </div>
              )}
            </div>
          )}
        </form>

        {/* Toggler */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Items */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* 🔽 HIDE 'Become a Seller' if seller is logged in */}
            {!seller && (
              <li className="nav-item">
                <a className="nav-link" href="#seller">
                  <i className="bi bi-shop me-2"></i>Become a Seller
                </a>
              </li>
            )}

            {/* Profile dropdown */}
            <li className="nav-item dropdown profile-dropdown d-none d-lg-block">
              <a
                className="nav-link dropdown-toggle"
                href="#profile"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person me-1"></i>
                {/* 🔽 SHOW Seller Name if User is null but Seller exists */}
                {user
                  ? (user.name || user.fullName || "User")
                  : (seller ? (seller.name || seller.businessName || "Seller") : "Profile")
                }
              </a>

              <ul
                className="dropdown-menu"
                aria-labelledby="profileDropdown"
                style={{ minWidth: "250px" }}
              >
                {!user && !seller ? (
                  <li className="px-2 py-2">
                    <h6 className="fw-bold mb-1">Welcome</h6>
                    <p className="text-muted small mb-2">
                      To access account and manage orders
                    </p>
                    <Link
                      to="/login"
                      className="btn btn-outline-danger w-100 fw-bold"
                    >
                      LOGIN / SIGNUP
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person-circle me-2"></i>My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders">
                        <i className="bi bi-box-seam me-2"></i>Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/wishlist">
                        <i className="bi bi-heart me-2"></i>Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/rewards">
                        <i className="bi bi-trophy me-2"></i>Rewards
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#gift-cards">
                        <i className="bi bi-gift me-2"></i>Gift Cards
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger fw-bold"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>

            {/* Cart with badge */}
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                <i className="bi bi-cart me-1"></i>Cart
                {cartCount > 0 && (
                  <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle mt-2">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;