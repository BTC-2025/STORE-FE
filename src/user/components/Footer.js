import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real application, you would handle the subscription here
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">My Shop</h5>
            <p>Your trusted e-commerce platform for quality products and exceptional service since 2010.</p>
            <div className="mt-3">
              <h6>Verified by:</h6>
              <div className="d-flex gap-2 mt-2">
                <span className="badge bg-success">SSL Secured</span>
                <span className="badge bg-info">Trusted Store</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Shop</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#new-arrivals" className="text-white text-decoration-none">New Arrivals</a></li>
              <li className="mb-2"><a href="#best-sellers" className="text-white text-decoration-none">Best Sellers</a></li>
              <li className="mb-2"><a href="#discounts" className="text-white text-decoration-none">Discounts</a></li>
              <li className="mb-2"><a href="#gift-cards" className="text-white text-decoration-none">Gift Cards</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#contact" className="text-white text-decoration-none">Contact Us</a></li>
              <li className="mb-2"><a href="#faq" className="text-white text-decoration-none">FAQ</a></li>
              <li className="mb-2"><a href="#shipping" className="text-white text-decoration-none">Shipping Info</a></li>
              <li className="mb-2"><a href="#returns" className="text-white text-decoration-none">Returns & Exchanges</a></li>
              <li className="mb-2"><a href="#privacy" className="text-white text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Contact</h5>
            <address className="text-light">
              <p className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i> 123 Commerce St, City, Country</p>
              <p className="mb-2"><i className="bi bi-telephone-fill me-2"></i> +1 (555) 123-4567</p>
              <p className="mb-2"><i className="bi bi-envelope-fill me-2"></i> support@myshop.com</p>
            </address>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Newsletter</h5>
            <p>Subscribe to get special offers, free giveaways, and new product alerts.</p>
            {subscribed ? (
              <div className="alert alert-success mt-3" role="alert">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
                <small className="form-text text-muted">We respect your privacy. Unsubscribe anytime.</small>
              </form>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          {/* Payment Methods */}
          <div className="col-md-6 mb-3">
            <h6 className="mb-2">We Accept:</h6>
            <div className="d-flex flex-wrap gap-2">
              <i className="bi bi-credit-card-2-back-fill fs-4" title="Visa"></i>
              <i className="bi bi-credit-card-fill fs-4" title="Mastercard"></i>
              <i className="bi bi-paypal fs-4" title="PayPal"></i>
              <i className="bi bi-apple fs-4" title="Apple Pay"></i>
              <i className="bi bi-google fs-4" title="Google Pay"></i>
            </div>
          </div>

          {/* Social Media */}
          <div className="col-md-6 mb-3 text-md-end">
            <h6 className="mb-2">Follow Us:</h6>
            <div className="d-flex justify-content-md-end gap-3">
              <a href="/" className="text-white me-2 fs-5"><i className="bi bi-facebook"></i></a>
              <a href="/" className="text-white me-2 fs-5"><i className="bi bi-instagram"></i></a>
              <a href="/" className="text-white me-2 fs-5"><i className="bi bi-twitter-x"></i></a>
              <a href="/" className="text-white me-2 fs-5"><i className="bi bi-pinterest"></i></a>
              <a href="/" className="text-white me-2 fs-5"><i className="bi bi-youtube"></i></a>
              <a href="/" className="text-white me-2 fs-5"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>
        </div>

        <hr className="my-3" />

        {/* Copyright and Additional Links */}
        <div className="row">
          <div className="col-md-6 mb-2">
            <small>&copy; {new Date().getFullYear()} My Shop. All rights reserved.</small>
          </div>
          <div className="col-md-6 text-md-end mb-2">
            <small>
              <a href="#terms" className="text-white text-decoration-none me-3">Terms of Service</a>
              <a href="#privacy" className="text-white text-decoration-none me-3">Privacy Policy</a>
              <a href="#cookies" className="text-white text-decoration-none">Cookie Policy</a>
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;