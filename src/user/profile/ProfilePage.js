import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Replace with actual user ID from your authentication system
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/profile/${userId}`
      );
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleEdit = (field, value) => {
    setEditingField(field);
    setFormData({ [field]: value });
  };

  const handleSave = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      setSaveLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/profile/${userId}`,
        formData
      );
      
      // Update local user data
      setUser(prevUser => ({
        ...prevUser,
        ...formData
      }));
      
      setEditingField(null);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSaveLoading(false);
    } catch (err) {
      setError('Failed to update profile');
      console.log(err)
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [editingField]: e.target.value
    });
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!user) return <div className="profile-error">User not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img 
            src={user.profileImage} 
            alt="Profile" 
            className="profile-image"
          />
          <button 
            className="edit-image-btn"
            onClick={() => handleEdit('profileImage', user.profileImage)}
          >
            <i className="fas fa-camera"></i>
          </button>
        </div>
        
        <div className="profile-basic-info">
          <h1>{user.fullName}</h1>
          <p>{user.email}</p>
          
          <div className="badges">
            {user.primeMembership && (
              <span className="badge prime-badge">
                <i className="fas fa-crown"></i> Prime Member
              </span>
            )}
            {user.kycVerified && (
              <span className="badge verified-badge">
                <i className="fas fa-check-circle"></i> Verified
              </span>
            )}
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat">
            <div className="stat-value">{user.addressesCount}</div>
            <div className="stat-label">Addresses</div>
          </div>
          <div className="stat">
            <div className="stat-value">{user.loyaltyPoints}</div>
            <div className="stat-label">Loyalty Points</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <div className="stat-label">Member Since</div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <InfoField 
              label="Full Name"
              value={user.fullName}
              onEdit={() => handleEdit('fullName', user.fullName)}
            />
            <InfoField 
              label="Email"
              value={user.email}
              onEdit={() => handleEdit('email', user.email)}
            />
            <InfoField 
              label="Phone"
              value={user.phone}
              onEdit={() => handleEdit('phone', user.phone)}
            />
            <InfoField 
              label="Alternate Phone"
              value={user.altPhone}
              onEdit={() => handleEdit('altPhone', user.altPhone)}
            />
            <InfoField 
              label="Gender"
              value={user.gender}
              onEdit={() => handleEdit('gender', user.gender)}
            />
            <InfoField 
              label="Date of Birth"
              value={new Date(user.dob).toLocaleDateString()}
              onEdit={() => handleEdit('dob', user.dob)}
            />
            <InfoField 
              label="GST Number"
              value={user.gstNumber}
              onEdit={() => handleEdit('gstNumber', user.gstNumber)}
            />
          </div>
        </div>

        <div className="profile-section">
          <h2>Preferences</h2>
          <div className="info-grid">
            <InfoField 
              label="Language"
              value={user.preferences.language}
              onEdit={() => handleEdit('preferences.language', user.preferences.language)}
            />
            <InfoField 
              label="Currency"
              value={user.preferences.currency}
              onEdit={() => handleEdit('preferences.currency', user.preferences.currency)}
            />
            {/* <InfoField 
              label="Wishlist Categories"
              value={user.preferences.wishlistCategories.join(',')}
              onEdit={() => handleEdit('preferences.wishlistCategories', user.preferences.wishlistCategories)}
            /> */}
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <InfoField 
              label="Last Login"
              value={new Date(user.lastLogin).toLocaleString()}
              onEdit={null}
            />
            <InfoField 
              label="Account Created"
              value={new Date(user.createdAt).toLocaleDateString()}
              onEdit={null}
            />
          </div>
        </div>
      </div>

      {editingField && (
        <EditModal 
          field={editingField}
          value={formData[editingField]}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={saveLoading}
        />
      )}
    </div>
  );
};

const InfoField = ({ label, value, onEdit }) => (
  <div className="info-field">
    <div className="info-label">{label}</div>
    <div className="info-value">{value}</div>
    {onEdit && (
      <button className="edit-btn" onClick={onEdit}>
        <i className="fas fa-edit"></i>
      </button>
    )}
  </div>
);

const EditModal = ({ field, value, onChange, onSave, onCancel, loading }) => {
  const getFieldLabel = (field) => {
    const labels = {
      'fullName': 'Full Name',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'altPhone': 'Alternate Phone',
      'gender': 'Gender',
      'dob': 'Date of Birth',
      'gstNumber': 'GST Number',
      'profileImage': 'Profile Image URL',
      'preferences.language': 'Language',
      'preferences.currency': 'Currency',
      'preferences.wishlistCategories': 'Wishlist Categories'
    };
    return labels[field] || field;
  };

  const getInputType = (field) => {
    if (field === 'dob') return 'date';
    if (field === 'email') return 'email';
    if (field === 'gender') return 'select';
    if (field === 'preferences.wishlistCategories') return 'textarea';
    return 'text';
  };

  return (
    <div className="modal-overlay">
      <div className="modals">
        <h2>Edit {getFieldLabel(field)}</h2>
        
        {getInputType(field) === 'select' ? (
          <select 
            className="form-input"
            value={value} 
            onChange={onChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to Say">Prefer not to Say</option>
          </select>
        ) : getInputType(field) === 'textarea' ? (
          <textarea
            className="form-input"
            value={Array.isArray(value) ? value.join(', ') : value}
            onChange={onChange}
            rows={3}
          />
        ) : (
          <input
            type={getInputType(field)}
            className="form-input"
            value={value}
            onChange={onChange}
          />
        )}
        
        <div className="modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;