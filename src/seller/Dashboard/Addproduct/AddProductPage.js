// AddProductPage.js
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaUpload, FaInfoCircle } from 'react-icons/fa';
import './AddProductPage.css';

const AddProductPage = ({ sellerToken, onBackToDashboard }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    image: '',
    price: '',
    stock: '',
    sku: '',
    category: '',
    subcategory: '',
    isAvailable: true,
    isFeatured: false,
    createdBy: '',
    tagline: [''],
    discount: 0
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const getSellerIdFromToken = () => {
    try {
      const tokenPayload = sellerToken.split('.')[1];
      const decodedPayload = atob(tokenPayload);
      const payloadObj = JSON.parse(decodedPayload);
      return payloadObj.id || payloadObj.sellerId;
    } catch (error) {
      console.error('Error extracting seller ID from token:', error);
      return null;
    }
  };

  const fetchBrands = async () => {
    try {
      const sellerId = getSellerIdFromToken();
      if (!sellerId) {
        throw new Error('Could not determine seller ID');
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/brands/seller/${sellerId}`, {
        headers: {
          'Authorization': `Bearer ${sellerToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      alert('Failed to load brands. Please try again.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const taglineArray = newProduct.tagline[0] 
        ? newProduct.tagline[0].split(',').map(tag => tag.trim()) 
        : [];
      
      const productData = [{
        name: newProduct.name,
        slug: newProduct.slug || newProduct.name.toLowerCase().replace(/\s+/g, '-'),
        shortDescription: newProduct.shortDescription,
        description: newProduct.description,
        image: newProduct.image,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        sku: newProduct.sku,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        brandId: parseInt(selectedBrand),
        isAvailable: newProduct.isAvailable,
        isFeatured: newProduct.isFeatured,
        createdBy: newProduct.createdBy || 'Seller',
        tagline: taglineArray,
        discount: parseFloat(newProduct.discount) || 0
      }];

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sellerToken}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      
      const data = await response.json();
      alert('Product added successfully!');
      onBackToDashboard();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please check all fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-container">
      <div className="ap-header">
        <button className="ap-back-btn" onClick={onBackToDashboard}>
          <FaArrowLeft />
        </button>
        <h1 className="ap-title">Add New Product</h1>
        <div className="ap-header-actions">
          <button className="ap-save-btn" onClick={handleAddProduct} disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="ap-content">
        {brands.length === 0 ? (
          <div className="ap-no-brands">
            <div className="ap-no-brands-icon">
              <FaInfoCircle />
            </div>
            <h2>Create a Brand First</h2>
            <p>You need to create a brand before you can add products.</p>
            <button className="ap-primary-btn" onClick={onBackToDashboard}>
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="ap-form-container">
            <form onSubmit={handleAddProduct} className="ap-form">
              <div className="ap-form-grid">
                {/* Basic Information */}
                <div className="ap-form-section">
                  <h3 className="ap-section-title">Basic Information</h3>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Product Name *</label>
                    <input
                      type="text"
                      className="ap-input"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Slug</label>
                    <input
                      type="text"
                      className="ap-input"
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})}
                      placeholder="Will be generated from name if empty"
                    />
                  </div>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Short Description *</label>
                    <textarea
                      className="ap-textarea"
                      value={newProduct.shortDescription}
                      onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
                      required
                      placeholder="Brief description of the product"
                      rows="2"
                    />
                  </div>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Full Description *</label>
                    <textarea
                      className="ap-textarea"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      required
                      placeholder="Detailed description of the product"
                      rows="4"
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="ap-form-section">
                  <h3 className="ap-section-title">Pricing & Inventory</h3>
                  
                  <div className="ap-input-row">
                    <div className="ap-input-group">
                      <label className="ap-label">Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="ap-input"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="ap-input-group">
                      <label className="ap-label">Stock Quantity *</label>
                      <input
                        type="number"
                        className="ap-input"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        required
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">SKU (Stock Keeping Unit)</label>
                    <input
                      type="text"
                      className="ap-input"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      placeholder="Unique identifier for the product"
                    />
                  </div>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Discount (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      className="ap-input"
                      value={newProduct.discount}
                      onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Media & Categorization */}
                <div className="ap-form-section">
                  <h3 className="ap-section-title">Media & Categorization</h3>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Image URL *</label>
                    <div className="ap-file-upload">
                      <input
                        type="url"
                        className="ap-input"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        required
                        placeholder="https://example.com/product-image.jpg"
                      />
                      <button type="button" className="ap-upload-btn">
                        <FaUpload /> Upload
                      </button>
                    </div>
                  </div>
                  
                  <div className="ap-input-row">
                    <div className="ap-input-group">
                      <label className="ap-label">Category *</label>
                      <input
                        type="text"
                        className="ap-input"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        required
                        placeholder="e.g., Snacks, Electronics"
                      />
                    </div>
                    
                    <div className="ap-input-group">
                      <label className="ap-label">Subcategory</label>
                      <input
                        type="text"
                        className="ap-input"
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                        placeholder="e.g., Chips, Mobile Phones"
                      />
                    </div>
                  </div>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Brand *</label>
                    <select
                      className="ap-select"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      required
                    >
                      <option value="">Select a brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Tagline (comma separated)</label>
                    <input
                      type="text"
                      className="ap-input"
                      value={newProduct.tagline[0] || ''}
                      onChange={(e) => setNewProduct({...newProduct, tagline: [e.target.value]})}
                      placeholder="creamy, organic, fresh, etc."
                    />
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="ap-form-section">
                  <h3 className="ap-section-title">Additional Settings</h3>
                  
                  <div className="ap-checkbox-group">
                    <label className="ap-checkbox-label">
                      <input
                        type="checkbox"
                        className="ap-checkbox"
                        checked={newProduct.isAvailable}
                        onChange={(e) => setNewProduct({...newProduct, isAvailable: e.target.checked})}
                      />
                      <span className="ap-checkbox-custom"></span>
                      Product is available for purchase
                    </label>
                  </div>
                  
                  <div className="ap-checkbox-group">
                    <label className="ap-checkbox-label">
                      <input
                        type="checkbox"
                        className="ap-checkbox"
                        checked={newProduct.isFeatured}
                        onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                      />
                      <span className="ap-checkbox-custom"></span>
                      Feature this product
                    </label>
                  </div>
                  
                  <div className="ap-input-group">
                    <label className="ap-label">Created By</label>
                    <input
                      type="text"
                      className="ap-input"
                      value={newProduct.createdBy}
                      onChange={(e) => setNewProduct({...newProduct, createdBy: e.target.value})}
                      placeholder="Your name or identifier"
                    />
                  </div>
                </div>
              </div>

              <div className="ap-form-actions">
                <button type="button" onClick={onBackToDashboard} className="ap-cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="ap-submit-btn" disabled={loading}>
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;