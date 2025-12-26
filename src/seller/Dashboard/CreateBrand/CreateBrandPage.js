// CreateBrandPage.js
import React, { useState } from 'react';
import { FaArrowLeft, FaUpload, FaCheck, FaStar, FaGlobe } from 'react-icons/fa';
import './CreateBrandPage.css'; // We'll create this CSS file

const CreateBrandPage = ({ sellerToken, onBackToDashboard, onBrandCreated }) => {
  const [newBrand, setNewBrand] = useState({
    name: '',
    logo: '',
    description: '',
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!newBrand.name.trim()) {
      newErrors.name = 'Brand name is required';
    } else if (newBrand.name.length < 2) {
      newErrors.name = 'Brand name must be at least 2 characters';
    }
    
    if (!newBrand.logo.trim()) {
      newErrors.logo = 'Logo URL is required';
    } else if (!isValidUrl(newBrand.logo)) {
      newErrors.logo = 'Please enter a valid URL';
    }
    
    if (!newBrand.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (newBrand.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleLogoChange = (e) => {
    const url = e.target.value;
    setNewBrand({...newBrand, logo: url});
    
    if (isValidUrl(url)) {
      setLogoPreview(url);
      setErrors({...errors, logo: ''});
    } else if (url.trim() === '') {
      setLogoPreview('');
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sellerToken}`
        },
        body: JSON.stringify([{
          name: newBrand.name.trim(),
          logo: newBrand.logo.trim(),
          description: newBrand.description.trim(),
          isFeatured: newBrand.isFeatured
        }])
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create brand');
      }
      
      const data = await response.json();
      
      // Show success message with animation
      document.querySelector('.success-message').classList.add('show');
      setTimeout(() => {
        onBrandCreated();
      }, 1500);
      
    } catch (error) {
      console.error('Error creating brand:', error);
      setErrors({ submit: error.message || 'Failed to create brand. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-brand-page">
      {/* Success Message Overlay */}
      <div className="success-message">
        <div className="success-content">
          <FaCheck className="success-icon" />
          <h3>Brand Created Successfully!</h3>
          <p>Your brand has been created and is now ready for products.</p>
        </div>
      </div>

      <div className="brand-container">
        {/* Header */}
        <header className="brand-header">
          <button className="btn-back" onClick={onBackToDashboard}>
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          <div className="header-content">
            <h1>Create New Brand</h1>
            <p>Build your brand identity and establish your presence in the marketplace</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="brand-content">
          <div className="brand-form-container">
            <form onSubmit={handleCreateBrand} className="brand-form">
              {/* Brand Name */}
              <div className="form-section">
                <div className="form-header">
                  <div className="form-icon">
                    <FaStar />
                  </div>
                  <h3>Brand Identity</h3>
                </div>
                
                <div className="form-group">
                  <label htmlFor="brand-name">
                    Brand Name *
                    <span className="label-desc">This will be displayed to customers</span>
                  </label>
                  <input
                    id="brand-name"
                    type="text"
                    value={newBrand.name}
                    onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                    placeholder="Enter your brand name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
              </div>

              {/* Logo Section */}
              <div className="form-section">
                <div className="form-header">
                  <div className="form-icon">
                    <FaGlobe />
                  </div>
                  <h3>Brand Logo</h3>
                </div>
                
                <div className="logo-section">
                  <div className="logo-preview">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" onError={() => setLogoPreview('')} />
                    ) : (
                      <div className="logo-placeholder">
                        <FaUpload />
                        <span>Logo Preview</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="logo-url">
                      Logo URL *
                      <span className="label-desc">Enter a direct image URL for your logo</span>
                    </label>
                    <input
                      id="logo-url"
                      type="url"
                      value={newBrand.logo}
                      onChange={handleLogoChange}
                      placeholder="https://example.com/logo.png"
                      className={errors.logo ? 'error' : ''}
                    />
                    {errors.logo && <span className="error-message">{errors.logo}</span>}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="brand-description">
                    Brand Description *
                    <span className="label-desc">Tell customers about your brand story and values</span>
                  </label>
                  <textarea
                    id="brand-description"
                    value={newBrand.description}
                    onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                    placeholder="Describe what makes your brand unique..."
                    rows="5"
                    className={errors.description ? 'error' : ''}
                  />
                  <div className="char-count">
                    {newBrand.description.length}/500 characters
                  </div>
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>
              </div>

              {/* Featured Option */}
              <div className="form-section">
                <div className="featured-option">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newBrand.isFeatured}
                      onChange={(e) => setNewBrand({...newBrand, isFeatured: e.target.checked})}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    <div className="checkbox-content">
                      <span className="checkbox-title">Feature this brand</span>
                      <span className="checkbox-desc">Highlight your brand on the homepage for increased visibility</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="form-error">
                  <span className="error-message">{errors.submit}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={onBackToDashboard} 
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating Brand...
                    </>
                  ) : (
                    'Create Brand'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Tips */}
          <div className="brand-tips">
            <div className="tips-header">
              <h3>Brand Creation Tips</h3>
            </div>
            <div className="tips-content">
              <div className="tip-item">
                <div className="tip-icon">💡</div>
                <div className="tip-text">
                  <h4>Choose a Memorable Name</h4>
                  <p>Your brand name should be unique, easy to remember, and relevant to your products.</p>
                </div>
              </div>
              
              <div className="tip-item">
                <div className="tip-icon">🎨</div>
                <div className="tip-text">
                  <h4>High-Quality Logo</h4>
                  <p>Use a high-resolution logo that looks good at all sizes and represents your brand well.</p>
                </div>
              </div>
              
              <div className="tip-item">
                <div className="tip-icon">📝</div>
                <div className="tip-text">
                  <h4>Compelling Description</h4>
                  <p>Write a clear description that explains your brand's story, values, and what makes it special.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBrandPage;