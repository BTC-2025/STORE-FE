import React, { useState, useEffect } from 'react';
import { 
  FaSignOutAlt, 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaChartLine, 
  FaBell,
  FaSearch,
  FaCog,
  FaUserCircle,
  FaArrowLeft,
  FaUserCheck,
  FaUserSlash,
  FaTrash,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaTimes,
  FaStore,
  FaCheckCircle,
  FaTimesCircle,
  FaUserTie,
  FaExclamationTriangle
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSellers: 0,
    recentActivity: [],
    revenue: 0,
    growth: {
      users: 0,
      products: 0,
      orders: 0,
      sellers: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // User Management State
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userActionLoading, setUserActionLoading] = useState({});
  const [showUserConfirmDialog, setShowUserConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActionType, setUserActionType] = useState('');

  // Product Management State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productActionLoading, setProductActionLoading] = useState({});
  const [showProductConfirmDialog, setShowProductConfirmDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productActionType, setProductActionType] = useState('');

  // Seller Management State
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [sellerSearchTerm, setSellerSearchTerm] = useState('');
  const [sellerActionLoading, setSellerActionLoading] = useState({});
  const [showSellerConfirmDialog, setShowSellerConfirmDialog] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerActionType, setSellerActionType] = useState('');
  const [sellerRequests, setSellerRequests] = useState([]);
  const [showSellerRequests, setShowSellerRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetail, setShowRequestDetail] = useState(false);
  const [sellerDetail, setSellerDetail] = useState(null);

  // Complaints Management State
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [complaintSearchTerm, setComplaintSearchTerm] = useState('');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState('all');
  const [complaintPriorityFilter, setComplaintPriorityFilter] = useState('all');
  const [complaintActionLoading, setComplaintActionLoading] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintDetail, setShowComplaintDetail] = useState(false);
  const [showUpdateComplaintModal, setShowUpdateComplaintModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('Pending');
  const [updatePriority, setUpdatePriority] = useState('Medium');
  const [updateResolutionNote, setUpdateResolutionNote] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (currentView === 'users') {
      fetchUsers();
    } else if (currentView === 'products') {
      fetchProducts();
    } else if (currentView === 'sellers') {
      fetchSellers();
    } else if (currentView === 'complaints') {
      fetchComplaints();
    }
  }, [currentView]);

  useEffect(() => {
    filterUsers();
  }, [users, userSearchTerm]);

  useEffect(() => {
    filterProducts();
  }, [products, productSearchTerm]);

  useEffect(() => {
    filterSellers();
  }, [sellers, sellerSearchTerm]);

  useEffect(() => {
    filterComplaints();
  }, [complaints, complaintSearchTerm, complaintStatusFilter, complaintPriorityFilter]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setDashboardData({
          totalUsers: data.totalUsers || 0,
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalSellers: data.totalSellers || 0,
          recentActivity: data.recentActivity || [],
          revenue: data.revenue || 0,
          growth: data.growth || {
            users: 0,
            products: 0,
            orders: 0,
            sellers: 0
          }
        });
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.users) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/product`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
    }
  };

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/seller/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.data) {
        const approvedSellers = data.data.filter(seller => seller.isActive);
        const sellerRequests = data.data.filter(seller => !seller.isActive);
        
        setSellers(approvedSellers);
        setFilteredSellers(approvedSellers);
        setSellerRequests(sellerRequests);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to fetch sellers. Please try again.');
    }
  };

  const fetchSellerDetail = async (sellerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/get/sellerid/${sellerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSellerDetail(data);
    } catch (err) {
      setError('Failed to fetch seller details. Please try again.');
    }
  };

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/complaint/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.data) {
        setComplaints(data.data);
        setFilteredComplaints(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to fetch complaints. Please try again.');
    }
  };

  const updateComplaintStatus = async (complaintId, updateData) => {
    setComplaintActionLoading(prev => ({ ...prev, [complaintId]: true }));
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/complaint/update/status/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        fetchComplaints();
        setShowUpdateComplaintModal(false);
        setShowComplaintDetail(false);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update complaint');
      }
    } catch (err) {
      setError(err.message || 'Failed to update complaint. Please try again.');
    } finally {
      setComplaintActionLoading(prev => ({ ...prev, [complaintId]: false }));
    }
  };

  const handleBlockSeller = async (sellerId) => {
    setSellerActionLoading(prev => ({ ...prev, [sellerId]: true }));
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/admin/${sellerId}/block`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isBlocked: true }),
        }
      );

      if (response.ok) {
        setSellers(prevSellers =>
          prevSellers.map(seller =>
            seller.id === sellerId ? { ...seller, isBlocked: true } : seller
          )
        );
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to block seller');
      }
    } catch (err) {
      setError(err.message || 'Failed to block seller. Please try again.');
    } finally {
      setSellerActionLoading(prev => ({ ...prev, [sellerId]: false }));
    }
  };

  const handleUnblockSeller = async (sellerId) => {
    setSellerActionLoading(prev => ({ ...prev, [sellerId]: true }));
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/${sellerId}/block`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBlocked: false }),
      });

      if (response.ok) {
        setSellers(prevSellers => 
          prevSellers.map(seller => 
            seller.id === sellerId ? { ...seller, isBlocked: false } : seller
          )
        );
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to unblock seller');
      }
    } catch (err) {
      setError(err.message || 'Failed to unblock seller. Please try again.');
    } finally {
      setSellerActionLoading(prev => ({ ...prev, [sellerId]: false }));
    }
  };

  const handleRemoveSeller = async (sellerId) => {
    setSellerActionLoading(prev => ({ ...prev, [sellerId]: true }));
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/delete/${sellerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setSellers(prevSellers => prevSellers.filter(seller => seller.id !== sellerId));
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete seller');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete seller. Please try again.');
    } finally {
      setSellerActionLoading(prev => ({ ...prev, [sellerId]: false }));
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/seller/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setSellerRequests(prev => prev.filter(req => req.id !== requestId));
        setShowRequestDetail(false);
        fetchSellers();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to accept seller request');
      }
    } catch (err) {
      setError(err.message || 'Failed to accept seller request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setSellerRequests(prev => prev.filter(req => req.id !== requestId));
        setShowRequestDetail(false);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reject seller request');
      }
    } catch (err) {
      setError(err.message || 'Failed to reject seller request. Please try again.');
    }
  };

  const filterUsers = () => {
    if (!userSearchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = userSearchTerm.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phoneNumber.includes(term)
    );
    
    setFilteredUsers(filtered);
  };

  const filterProducts = () => {
    if (!productSearchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const term = productSearchTerm.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.subcategory.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term)
    );
    
    setFilteredProducts(filtered);
  };

  const filterSellers = () => {
    if (!sellerSearchTerm.trim()) {
      setFilteredSellers(sellers);
      return;
    }

    const term = sellerSearchTerm.toLowerCase();
    const filtered = sellers.filter(seller => 
      seller.name.toLowerCase().includes(term) ||
      seller.email.toLowerCase().includes(term) ||
      seller.businessName.toLowerCase().includes(term) ||
      seller.businessType.toLowerCase().includes(term)
    );
    
    setFilteredSellers(filtered);
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (complaintSearchTerm.trim()) {
      const term = complaintSearchTerm.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.complaintType.toLowerCase().includes(term) ||
        complaint.description.toLowerCase().includes(term) ||
        (complaint.raisedByUser && complaint.raisedByUser.name.toLowerCase().includes(term)) ||
        (complaint.raisedBySeller && complaint.raisedBySeller.name.toLowerCase().includes(term)) ||
        (complaint.againstUser && complaint.againstUser.name.toLowerCase().includes(term)) ||
        (complaint.againstSeller && complaint.againstSeller.name.toLowerCase().includes(term))
      );
    }

    if (complaintStatusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === complaintStatusFilter);
    }

    if (complaintPriorityFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === complaintPriorityFilter);
    }

    setFilteredComplaints(filtered);
  };

  const handleUserSearch = (e) => {
    setUserSearchTerm(e.target.value);
  };

  const handleProductSearch = (e) => {
    setProductSearchTerm(e.target.value);
  };

  const handleSellerSearch = (e) => {
    setSellerSearchTerm(e.target.value);
  };

  const handleComplaintSearch = (e) => {
    setComplaintSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setComplaintStatusFilter(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setComplaintPriorityFilter(e.target.value);
  };

  const handleBlockUser = async (userId) => {
    setUserActionLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/block/userid/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, isBlocked: true } : user
          )
        );
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to block user');
      }
    } catch (err) {
      setError(err.message || 'Failed to block user. Please try again.');
    } finally {
      setUserActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnblockUser = async (userId) => {
    setUserActionLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/unblock/userid/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, isBlocked: false } : user
          )
        );
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to unblock user');
      }
    } catch (err) {
      setError(err.message || 'Failed to unblock user. Please try again.');
    } finally {
      setUserActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeleteProduct = async (productId) => {
    setProductActionLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/product/productid/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product. Please try again.');
    } finally {
      setProductActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const confirmUserAction = (user, type) => {
    setSelectedUser(user);
    setUserActionType(type);
    setShowUserConfirmDialog(true);
  };

  const confirmProductAction = (product, type) => {
    setSelectedProduct(product);
    setProductActionType(type);
    setShowProductConfirmDialog(true);
  };

  const confirmSellerAction = (seller, type) => {
    setSelectedSeller(seller);
    setSellerActionType(type);
    setShowSellerConfirmDialog(true);
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) return;
    
    setUserActionLoading(prev => ({ ...prev, [selectedUser.id]: true }));
    setShowUserConfirmDialog(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to remove user. Please try again.');
    } finally {
      setUserActionLoading(prev => ({ ...prev, [selectedUser.id]: false }));
    }
  };

  const handleRemoveSellerConfirm = () => {
    if (!selectedSeller) return;
    handleRemoveSeller(selectedSeller.id);
    setShowSellerConfirmDialog(false);
  };

  const viewRequestDetails = async (request) => {
    setSelectedRequest(request);
    await fetchSellerDetail(request.id);
    setShowRequestDetail(true);
  };

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowComplaintDetail(true);
  };

  const openUpdateComplaintModal = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setUpdatePriority(complaint.priority);
    setUpdateResolutionNote(complaint.resolutionNote || '');
    setShowUpdateComplaintModal(true);
  };

  const handleUpdateComplaint = () => {
    const adminId = 1;
    const updateData = {
      status: updateStatus,
      priority: updatePriority,
      resolvedBy: updateStatus === 'Resolved' ? adminId : null,
      resolutionNote: updateResolutionNote
    };
    
    updateComplaintStatus(selectedComplaint.id, updateData);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const StatCard = ({ title, value, icon, growth, color, onClick }) => (
    <div className={`advanced-stat-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <div className="stat-card-header">
        <div className={`stat-icon ${color}`}>
          {icon}
        </div>
        <div className={`growth-indicator ${growth >= 0 ? 'positive' : 'negative'}`}>
          {growth > 0 ? `+${growth}%` : `${growth}%`}
        </div>
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
      <div className="stat-footer">
        <span className="view-details">View details →</span>
      </div>
    </div>
  );

  const switchToUserManagement = () => {
    setCurrentView('users');
    setActiveTab('users');
  };

  const switchToProductManagement = () => {
    setCurrentView('products');
    setActiveTab('products');
  };

  const switchToSellerManagement = () => {
    setCurrentView('sellers');
    setActiveTab('sellers');
  };

  const switchToComplaintsManagement = () => {
    setCurrentView('complaints');
    setActiveTab('complaints');
  };

  const switchToDashboard = () => {
    setCurrentView('dashboard');
    setActiveTab('overview');
  };

  if (loading && currentView === 'dashboard') {
    return (
      <div className="advanced-dashboard-loader">
        <div className="loader-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="advanced-dashboard-container">
      {/* Sidebar */}
      <div className={`advanced-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">AdminPanel</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ≡
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'overview' ? 'active' : ''}>
              <a href="#overview" onClick={() => { setActiveTab('overview'); switchToDashboard(); }}>
                <FaChartLine className="nav-icon" />
                <span className="nav-text">Overview</span>
              </a>
            </li>
            <li className={activeTab === 'users' ? 'active' : ''}>
              <a href="#users" onClick={() => { setActiveTab('users'); switchToUserManagement(); }}>
                <FaUsers className="nav-icon" />
                <span className="nav-text">Users</span>
              </a>
            </li>
            <li className={activeTab === 'products' ? 'active' : ''}>
              <a href="#products" onClick={() => { setActiveTab('products'); switchToProductManagement(); }}>
                <FaBox className="nav-icon" />
                <span className="nav-text">Products</span>
              </a>
            </li>
            <li className={activeTab === 'sellers' ? 'active' : ''}>
              <a href="#sellers" onClick={() => { setActiveTab('sellers'); switchToSellerManagement(); }}>
                <FaStore className="nav-icon" />
                <span className="nav-text">Sellers</span>
              </a>
            </li>
            <li className={activeTab === 'complaints' ? 'active' : ''}>
              <a href="#complaints" onClick={() => { setActiveTab('complaints'); switchToComplaintsManagement(); }}>
                <FaExclamationTriangle className="nav-icon" />
                <span className="nav-text">Complaints</span>
              </a>
            </li>
            <li className={activeTab === 'orders' ? 'active' : ''}>
              <a href="#orders" onClick={() => setActiveTab('orders')}>
                <FaShoppingCart className="nav-icon" />
                <span className="nav-text">Orders</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={onLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="advanced-main-content">
        {/* Header */}
        <header className="advanced-header">
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          
          <div className="header-actions">
            <button className="header-btn notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            <button className="header-btn settings-btn">
              <FaCog />
            </button>
            <div className="user-profile">
              <FaUserCircle className="user-avatar" />
              <span className="user-name">Admin User</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {currentView === 'dashboard' ? (
          <div className="dashboard-content">
            <div className="content-header">
              <h1 className="page-title">Dashboard Overview</h1>
              <p className="page-subtitle">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {error && (
              <div className="advanced-error-alert">
                <span>{error}</span>
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard 
                title="Total Users" 
                value={dashboardData.totalUsers} 
                icon={<FaUsers />} 
                growth={dashboardData.growth?.users || 0}
                color="blue"
                onClick={switchToUserManagement}
              />
              <StatCard 
                title="Total Products" 
                value={dashboardData.totalProducts} 
                icon={<FaBox />} 
                growth={dashboardData.growth?.products || 0}
                color="green"
                onClick={switchToProductManagement}
              />
              <StatCard 
                title="Total Orders" 
                value={dashboardData.totalOrders} 
                icon={<FaShoppingCart />} 
                growth={dashboardData.growth?.orders || 0}
                color="purple"
              />
              <StatCard 
                title="Total Sellers" 
                value={dashboardData.totalSellers} 
                icon={<FaStore />} 
                growth={dashboardData.growth?.sellers || 0}
                color="orange"
                onClick={switchToSellerManagement}
              />
            </div>

            {/* Additional Dashboard Sections */}
            <div className="dashboard-sections">
              <div className="section-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">
                          {activity.type === 'user' && <FaUsers />}
                          {activity.type === 'order' && <FaShoppingCart />}
                          {activity.type === 'product' && <FaBox />}
                          {activity.type === 'seller' && <FaStore />}
                        </div>
                        <div className="activity-content">
                          <p className="activity-text">{activity.text}</p>
                          <span className="activity-time">{activity.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-activity">No recent activity</p>
                  )}
                </div>
              </div>

              <div className="section-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions-grid">
                  <button className="action-btn" onClick={switchToUserManagement}>
                    <FaUsers className="action-icon" />
                    <span>Manage Users</span>
                  </button>
                  <button className="action-btn" onClick={switchToProductManagement}>
                    <FaBox className="action-icon" />
                    <span>Manage Products</span>
                  </button>
                  <button className="action-btn" onClick={switchToSellerManagement}>
                    <FaStore className="action-icon" />
                    <span>Manage Sellers</span>
                  </button>
                  <button className="action-btn" onClick={switchToComplaintsManagement}>
                    <FaExclamationTriangle className="action-icon" />
                    <span>Manage Complaints</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'users' ? (
          // User Management View
          <div className="user-management-view">
            <div className="user-management-header">
              <button className="back-button" onClick={switchToDashboard}>
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h1 className="page-title">
                <FaUsers className="title-icon" /> User Management
              </h1>
              <p className="page-subtitle">Manage all registered users</p>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={userSearchTerm}
                  onChange={handleUserSearch}
                  className="search-input"
                />
              </div>
              <div className="users-count">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            {/* Users Table */}
            <div className="users-table-container">
              {filteredUsers.length === 0 ? (
                <div className="no-users">
                  {userSearchTerm ? 'No users match your search' : 'No users found'}
                </div>
              ) : (
                <div className="users-grid">
                  {filteredUsers.map(user => (
                    <div key={user.id} className={`user-card ${user.isBlocked ? 'blocked' : ''}`}>
                      <div className="user-header">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <h3 className="user-name">{user.name}</h3>
                          <p className="user-email">{user.email}</p>
                        </div>
                        <div className={`user-status ${user.isBlocked ? 'blocked' : 'active'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </div>
                      </div>
                      
                      <div className="user-details">
                        <div className="user-detail">
                          <span className="detail-label">Phone:</span>
                          <span className="detail-value">{user.phoneNumber}</span>
                        </div>
                        <div className="user-detail">
                          <span className="detail-label">Registered:</span>
                          <span className="detail-value">{formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="user-actions">
                        {user.isBlocked ? (
                          <button
                            className="action-btn unblock-btn"
                            onClick={() => handleUnblockUser(user.id)}
                            disabled={userActionLoading[user.id]}
                          >
                            {userActionLoading[user.id] ? (
                              <div className="button-spinner"></div>
                            ) : (
                              <>
                                <FaUserCheck /> Unblock
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            className="action-btn block-btn"
                            onClick={() => confirmUserAction(user, 'block')}
                            disabled={userActionLoading[user.id]}
                          >
                            {userActionLoading[user.id] ? (
                              <div className="button-spinner"></div>
                            ) : (
                              <>
                                <FaUserSlash /> Block
                              </>
                            )}
                          </button>
                        )}
                        
                        <button
                          className="action-btn remove-btn"
                          onClick={() => confirmUserAction(user, 'remove')}
                          disabled={userActionLoading[user.id]}
                        >
                          {userActionLoading[user.id] ? (
                            <div className="button-spinner"></div>
                          ) : (
                            <>
                              <FaTrash /> Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmation Dialog */}
            {showUserConfirmDialog && (
              <div className="modal-overlay">
                <div className="confirmation-dialog">
                  <h3>
                    {userActionType === 'block' ? 'Block User' : 'Remove User'}
                  </h3>
                  <p>
                    {userActionType === 'block' 
                      ? `Are you sure you want to block ${selectedUser.name}? They will not be able to access their account.`
                      : `Are you sure you want to permanently remove ${selectedUser.name}? This action cannot be undone.`
                    }
                  </p>
                  <div className="dialog-actions">
                    <button
                      className="dialog-btn cancel-btn"
                      onClick={() => setShowUserConfirmDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`dialog-btn ${userActionType === 'block' ? 'confirm-block-btn' : 'confirm-remove-btn'}`}
                      onClick={userActionType === 'block' ? 
                        () => handleBlockUser(selectedUser.id) : 
                        handleRemoveUser
                      }
                    >
                      {userActionType === 'block' ? 'Block User' : 'Remove User'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : currentView === 'products' ? (
          // Product Management View
          <div className="product-management-view">
            <div className="product-management-header">
              <button className="back-button" onClick={switchToDashboard}>
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h1 className="page-title">
                <FaBox className="title-icon" /> Product Management
              </h1>
              <p className="page-subtitle">Manage all products in your store</p>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products by name, category, or SKU..."
                  value={productSearchTerm}
                  onChange={handleProductSearch}
                  className="search-input"
                />
              </div>
              <div className="products-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            {/* Products Table */}
            <div className="products-table-container">
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  {productSearchTerm ? 'No products match your search' : 'No products found'}
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-images-container">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="product-images"
                          onError={(e) => {
                            e.target.src = '';
                          }}
                        />
                        <div className="product-badges">
                          {product.isFeatured && <span className="badge featured">Featured</span>}
                          {product.discount > 0 && <span className="badge discount">{product.discount}% OFF</span>}
                          {!product.isAvailable && <span className="badge unavailable">Out of Stock</span>}
                        </div>
                      </div>
                      
                      <div className="product-content">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.shortDescription}</p>
                        
                        <div className="product-details">
                          <div className="product-detail">
                            <span className="detail-label">Price:</span>
                            <span className="detail-value">{formatPrice(product.price)}</span>
                          </div>
                          <div className="product-detail">
                            <span className="detail-label">Stock:</span>
                            <span className={`detail-value ${product.stock < 10 ? 'low-stock' : ''}`}>
                              {product.stock} units
                            </span>
                          </div>
                          <div className="product-detail">
                            <span className="detail-label">Category:</span>
                            <span className="detail-value">{product.category} › {product.subcategory}</span>
                          </div>
                          <div className="product-detail">
                            <span className="detail-label">SKU:</span>
                            <span className="detail-value">{product.sku}</span>
                          </div>
                          <div className="product-detail">
                            <span className="detail-label">Added:</span>
                            <span className="detail-value">{formatDate(product.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="product-tags">
                          {product.tagline.map((tag, index) => (
                            <span key={index} className="product-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="product-action">
                        <button className="action-btn edit-btn">
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => confirmProductAction(product, 'delete')}
                          disabled={productActionLoading[product.id]}
                        >
                          {productActionLoading[product.id] ? (
                            <div className="button-spinner"></div>
                          ) : (
                            <>
                              <FaTrash /> Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmation Dialog */}
            {showProductConfirmDialog && (
              <div className="modal-overlay">
                <div className="confirmation-dialog">
                  <h3>Delete Product</h3>
                  <p>
                    Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                  </p>
                  <div className="dialog-actions">
                    <button
                      className="dialog-btn cancel-btn"
                      onClick={() => setShowProductConfirmDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="dialog-btn confirm-delete-btn"
                      onClick={() => handleDeleteProduct(selectedProduct.id)}
                    >
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : currentView === 'sellers' ? (
          // Seller Management View
          <div className="seller-management-view">
            <div className="seller-management-header">
              <button className="back-button" onClick={switchToDashboard}>
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h1 className="page-title">
                <FaStore className="title-icon" /> Seller Management
              </h1>
              <p className="page-subtitle">Manage sellers and review new requests</p>
            </div>

            {/* Tabs for Seller Management */}
            <div className="seller-tabs">
              <button 
                className={`seller-tab ${!showSellerRequests ? 'active' : ''}`}
                onClick={() => setShowSellerRequests(false)}
              >
                <FaUserTie /> Approved Sellers
              </button>
              <button 
                className={`seller-tab ${showSellerRequests ? 'active' : ''}`}
                onClick={() => setShowSellerRequests(true)}
              >
                <FaBell /> New Requests
                {sellerRequests.length > 0 && (
                  <span className="request-badge">{sellerRequests.length}</span>
                )}
              </button>
            </div>

            {!showSellerRequests ? (
              <>
                {/* Search Bar */}
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search sellers by name, store, or business type..."
                      value={sellerSearchTerm}
                      onChange={handleSellerSearch}
                      className="search-input"
                    />
                  </div>
                  <div className="sellers-count">
                    {filteredSellers.length} {filteredSellers.length === 1 ? 'seller' : 'sellers'} found
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <span>{error}</span>
                    <button onClick={() => setError('')}>×</button>
                  </div>
                )}

                {/* Sellers Table */}
                <div className="sellers-table-container">
                  {filteredSellers.length === 0 ? (
                    <div className="no-sellers">
                      {sellerSearchTerm ? 'No sellers match your search' : 'No sellers found'}
                    </div>
                  ) : (
                    <div className="sellers-grid">
                      {filteredSellers.map(seller => (
                        <div key={seller.id} className={`seller-card ${seller.isBlocked ? 'blocked' : ''}`}>
                          <div className="seller-header">
                            <div className="seller-avatar">
                              <FaStore />
                            </div>
                            <div className="seller-info">
                              <h3 className="seller-name">{seller.name}</h3>
                              <p className="seller-email">{seller.email}</p>
                              <p className="seller-store">{seller.businessName}</p>
                            </div>
                            <div className={`seller-status ${seller.isBlocked ? 'blocked' : 'active'}`}>
                              {seller.isBlocked ? 'Blocked' : 'Active'}
                            </div>
                          </div>
                          
                          <div className="seller-details">
                            <div className="seller-detail">
                              <span className="detail-label">Business:</span>
                              <span className="detail-value">{seller.businessType}</span>
                            </div>
                            <div className="seller-detail">
                              <span className="detail-label">Phone:</span>
                              <span className="detail-value">{seller.phone}</span>
                            </div>
                            <div className="seller-detail">
                              <span className="detail-label">KYC Status:</span>
                              <span className="detail-value">{seller.kycStatus}</span>
                            </div>
                            <div className="seller-detail">
                              <span className="detail-label">Payment Status:</span>
                              <span className="detail-value">{seller.paymentStatus}</span>
                            </div>
                            <div className="seller-detail">
                              <span className="detail-label">Joined:</span>
                              <span className="detail-value">{formatDate(seller.createdAt)}</span>
                            </div>
                            <div className="seller-detail">
                              <span className="detail-label">Rating:</span>
                              <span className="detail-value">{seller.rating} ⭐</span>
                            </div>
                          </div>
                          
                          <div className="seller-actions">
                            {seller.isBlocked ? (
                              <button
                                className="action-btn unblock-btn"
                                onClick={() => handleUnblockSeller(seller.id)}
                                disabled={sellerActionLoading[seller.id]}
                              >
                                {sellerActionLoading[seller.id] ? (
                                  <div className="button-spinner"></div>
                                ) : (
                                  <>
                                    <FaUserCheck /> Unblock
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                className="action-btn block-btn"
                                onClick={() => confirmSellerAction(seller, 'block')}
                                disabled={sellerActionLoading[seller.id]}
                              >
                                {sellerActionLoading[seller.id] ? (
                                  <div className="button-spinner"></div>
                                ) : (
                                  <>
                                    <FaUserSlash /> Block
                                  </>
                                )}
                              </button>
                            )}
                            
                            <button
                              className="action-btn remove-btn"
                              onClick={() => confirmSellerAction(seller, 'remove')}
                              disabled={sellerActionLoading[seller.id]}
                            >
                              {sellerActionLoading[seller.id] ? (
                                <div className="button-spinner"></div>
                              ) : (
                                <>
                                  <FaTrash /> Remove
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirmation Dialog */}
                {showSellerConfirmDialog && (
                  <div className="modal-overlay">
                    <div className="confirmation-dialog">
                      <h3>
                        {sellerActionType === 'block' ? 'Block Seller' : 'Remove Seller'}
                      </h3>
                      <p>
                        {sellerActionType === 'block' 
                          ? `Are you sure you want to block ${selectedSeller.name}? They will not be able to access their seller account.`
                          : `Are you sure you want to permanently remove ${selectedSeller.name}? This action cannot be undone.`
                        }
                      </p>
                      <div className="dialog-actions">
                        <button
                          className="dialog-btn cancel-btn"
                          onClick={() => setShowSellerConfirmDialog(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className={`dialog-btn ${sellerActionType === 'block' ? 'confirm-block-btn' : 'confirm-remove-btn'}`}
                          onClick={sellerActionType === 'block' ? 
                            () => handleBlockSeller(selectedSeller.id) : 
                            handleRemoveSellerConfirm
                          }
                        >
                          {sellerActionType === 'block' ? 'Block Seller' : 'Remove Seller'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Seller Requests View
              <div className="seller-requests-view">
                <div className="requests-header">
                  <h3>New Seller Requests</h3>
                  <p>Review and approve new seller applications</p>
                </div>

                {sellerRequests.length === 0 ? (
                  <div className="no-requests">
                    <FaCheckCircle className="no-requests-icon" />
                    <p>No pending seller requests</p>
                  </div>
                ) : (
                  <div className="requests-grid">
                    {sellerRequests.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-header">
                          <div className="request-avatar">
                            <FaUserTie />
                          </div>
                          <div className="request-info">
                            <h4 className="request-name">{request.name}</h4>
                            <p className="request-email">{request.email}</p>
                            <p className="request-store">{request.businessName}</p>
                          </div>
                          <div className="request-status pending">
                            Pending
                          </div>
                        </div>
                        
                        <div className="request-details">
                          <div className="request-detail">
                            <span className="detail-label">Business Type:</span>
                            <span className="detail-value">{request.businessType}</span>
                          </div>
                          <div className="request-detail">
                            <span className="detail-label">Applied:</span>
                            <span className="detail-value">{formatDate(request.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="request-actions">
                          <button
                            className="action-btn view-btn"
                            onClick={() => viewRequestDetails(request)}
                          >
                            <FaEye /> View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Request Detail Modal */}
                {showRequestDetail && sellerDetail && (
                  <div className="modal-overlay">
                    <div className="request-detail-modal">
                      <div className="modal-header">
                        <h3>Seller Application Details</h3>
                        <button 
                          className="modal-close-btn"
                          onClick={() => setShowRequestDetail(false)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="modal-content">
                        <div className="applicant-info">
                          <h4>Applicant Information</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <span className="info-label">Full Name:</span>
                              <span className="info-value">{sellerDetail.name}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Email:</span>
                              <span className="info-value">{sellerDetail.email}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Phone:</span>
                              <span className="info-value">{sellerDetail.phone}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Store Name:</span>
                              <span className="info-value">{sellerDetail.businessName}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Business Type:</span>
                              <span className="info-value">{sellerDetail.businessType}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">GST Number:</span>
                              <span className="info-value">{sellerDetail.gstNumber || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">PAN Number:</span>
                              <span className="info-value">{sellerDetail.panNumber || 'Not provided'}</span>
                            </div>
                            <div className="info-item full-width">
                              <span className="info-label">Address:</span>
                              <span className="info-value">
                                {sellerDetail.address ? 
                                  `${sellerDetail.address}, ${sellerDetail.city}, ${sellerDetail.state}, ${sellerDetail.country} - ${sellerDetail.pincode}` : 
                                  'Not provided'
                                }
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Applied On:</span>
                              <span className="info-value">{formatDate(sellerDetail.createdAt)}</span>
                            </div>
                            {sellerDetail.documents && sellerDetail.documents.length > 0 && (
                              <div className="info-item full-width">
                                <span className="info-label">Documents:</span>
                                <div className="document-list">
                                  {sellerDetail.documents.map((doc, index) => (
                                    <a key={index} href={doc.url} className="document-link" target="_blank" rel="noopener noreferrer">
                                      {doc.name || `Document ${index + 1}`}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="modal-actions">
                        <button
                          className="dialog-btn reject-btn"
                          onClick={() => handleRejectRequest(sellerDetail.id)}
                        >
                          <FaTimesCircle /> Reject
                        </button>
                        <button
                          className="dialog-btn accept-btn"
                          onClick={() => handleAcceptRequest(sellerDetail.id)}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Complaints Management View
          <div className="complaints-management-view">
            <div className="complaints-management-header">
              <button className="back-button" onClick={switchToDashboard}>
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h1 className="page-title">
                <FaExclamationTriangle className="title-icon" /> Complaints Management
              </h1>
              <p className="page-subtitle">Manage and resolve customer complaints</p>
            </div>

            {/* Filters and Search */}
            <div className="complaints-filters">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search complaints by type, description, or involved parties..."
                    value={complaintSearchTerm}
                    onChange={handleComplaintSearch}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  <label htmlFor="status-filter">Status:</label>
                  <select 
                    id="status-filter" 
                    value={complaintStatusFilter} 
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="priority-filter">Priority:</label>
                  <select 
                    id="priority-filter" 
                    value={complaintPriorityFilter} 
                    onChange={handlePriorityFilterChange}
                  >
                    <option value="all">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="complaints-count">
                {filteredComplaints.length} {filteredComplaints.length === 1 ? 'complaint' : 'complaints'} found
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            {/* Complaints Table */}
            <div className="complaints-table-container">
              {filteredComplaints.length === 0 ? (
                <div className="no-complaints">
                  {complaintSearchTerm || complaintStatusFilter !== 'all' || complaintPriorityFilter !== 'all' 
                    ? 'No complaints match your filters' 
                    : 'No complaints found'
                  }
                </div>
              ) : (
                <div className="complaints-grid">
                  {filteredComplaints.map(complaint => (
                    <div key={complaint.id} className={`complaint-card ${complaint.status.toLowerCase().replace(' ', '-')}`}>
                      <div className="complaint-header">
                        <div className="complaint-type-badge">
                          {complaint.complaintType}
                        </div>
                        <div className={`complaint-status ${complaint.status.toLowerCase().replace(' ', '-')}`}>
                          {complaint.status}
                        </div>
                        <div className={`complaint-priority ${complaint.priority.toLowerCase()}`}>
                          {complaint.priority}
                        </div>
                      </div>
                      
                      <div className="complaint-content">
                        <p className="complaint-description">{complaint.description}</p>
                        
                        <div className="complaint-parties">
                          <div className="party-info">
                            <span className="party-label">Raised By:</span>
                            <span className="party-value">
                              {complaint.raisedByUser 
                                ? `${complaint.raisedByUser.name} (User)` 
                                : complaint.raisedBySeller 
                                  ? `${complaint.raisedBySeller.name} (Seller)` 
                                  : 'Unknown'
                              }
                            </span>
                          </div>
                          
                          <div className="party-info">
                            <span className="party-label">Against:</span>
                            <span className="party-value">
                              {complaint.againstUser 
                                ? `${complaint.againstUser.name} (User)` 
                                : complaint.againstSeller 
                                  ? `${complaint.againstSeller.name} (Seller)` 
                                  : 'Not specified'
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className="complaint-meta">
                          <div className="meta-info">
                            <span className="meta-label">Order ID:</span>
                            <span className="meta-value">{complaint.orderId || 'N/A'}</span>
                          </div>
                          <div className="meta-info">
                            <span className="meta-label">Product ID:</span>
                            <span className="meta-value">{complaint.productId || 'N/A'}</span>
                          </div>
                          <div className="meta-info">
                            <span className="meta-label">Created:</span>
                            <span className="meta-value">{formatDate(complaint.createdAt)}</span>
                          </div>
                          {complaint.resolvedByAdmin && (
                            <div className="meta-info">
                              <span className="meta-label">Resolved By:</span>
                              <span className="meta-value">{complaint.resolvedByAdmin.fullName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="complaint-actions">
                        <button
                          className="action-btn view-btn"
                          onClick={() => viewComplaintDetails(complaint)}
                        >
                          <FaEye /> View Details
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => openUpdateComplaintModal(complaint)}
                        >
                          <FaEdit /> Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Complaint Detail Modal */}
            {showComplaintDetail && selectedComplaint && (
              <div className="modal-overlay">
                <div className="complaint-detail-modal">
                  <div className="modal-header">
                    <h3>Complaint Details</h3>
                    <button 
                      className="modal-close-btn"
                      onClick={() => setShowComplaintDetail(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="modals-content px-2">
                    <div className="complaint-detail-section">
                      <h4>Basic Information</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">ID:</span>
                          <span className="detail-value">{selectedComplaint.id}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{selectedComplaint.complaintType}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Status:</span>
                          <span className={`detail-value status ${selectedComplaint.status.toLowerCase().replace(' ', '-')}`}>
                            {selectedComplaint.status}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Priority:</span>
                          <span className={`detail-value priority ${selectedComplaint.priority.toLowerCase()}`}>
                            {selectedComplaint.priority}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Created:</span>
                          <span className="detail-value">{formatDate(selectedComplaint.createdAt)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Last Updated:</span>
                          <span className="detail-value">{formatDate(selectedComplaint.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="complaint-detail-section">
                      <h4>Parties Involved</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Raised By:</span>
                          <span className="detail-value">
                            {selectedComplaint.raisedByUser 
                              ? `${selectedComplaint.raisedByUser.name} (User - ${selectedComplaint.raisedByUser.email})` 
                              : selectedComplaint.raisedBySeller 
                                ? `${selectedComplaint.raisedBySeller.name} (Seller)` 
                                : 'Unknown'
                            }
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Against:</span>
                          <span className="detail-value">
                            {selectedComplaint.againstUser 
                              ? `${selectedComplaint.againstUser.name} (User - ${selectedComplaint.againstUser.email})` 
                              : selectedComplaint.againstSeller 
                                ? `${selectedComplaint.againstSeller.name} (Seller)` 
                                : 'Not specified'
                            }
                          </span>
                        </div>
                        {selectedComplaint.resolvedByAdmin && (
                          <div className="detail-item">
                            <span className="detail-label">Resolved By:</span>
                            <span className="detail-value">
                              {selectedComplaint.resolvedByAdmin.fullName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="complaint-detail-section">
                      <h4>Related Items</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Order ID:</span>
                          <span className="detail-value">{selectedComplaint.orderId || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Product ID:</span>
                          <span className="detail-value">{selectedComplaint.productId || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="complaint-detail-section">
                      <h4>Description</h4>
                      <div className="complaint-description-full">
                        {selectedComplaint.description}
                      </div>
                    </div>
                    
                    {selectedComplaint.resolutionNote && (
                      <div className="complaint-detail-section">
                        <h4>Resolution Notes</h4>
                        <div className="resolution-notes">
                          {selectedComplaint.resolutionNote}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="modal-actions">
                    <button
                      className="dialog-btn close-btn"
                      onClick={() => setShowComplaintDetail(false)}
                    >
                      Close
                    </button>
                    <button
                      className="dialog-btn edit-btn"
                      onClick={() => {
                        setShowComplaintDetail(false);
                        openUpdateComplaintModal(selectedComplaint);
                      }}
                    >
                      <FaEdit /> Update Complaint
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Update Complaint Modal */}
            {showUpdateComplaintModal && selectedComplaint && (
              <div className="modal-overlay">
                <div className="update-complaint-modal">
                  <div className="modal-header">
                    <h3>Update Complaint #{selectedComplaint.id}</h3>
                    <button 
                      className="modal-close-btn"
                      onClick={() => setShowUpdateComplaintModal(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="modals-content">
                    <div className="form-group">
                      <label htmlFor="update-status">Status:</label>
                      <select 
                        id="update-status"
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Escalated">Escalated</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="update-priority">Priority:</label>
                      <select 
                        id="update-priority"
                        value={updatePriority}
                        onChange={(e) => setUpdatePriority(e.target.value)}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="resolution-notes">Resolution Notes:</label>
                      <textarea 
                        id="resolution-notes"
                        value={updateResolutionNote}
                        onChange={(e) => setUpdateResolutionNote(e.target.value)}
                        placeholder="Add notes about how this complaint was resolved..."
                        rows="4"
                      />
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <button
                      className="dialog-btn cancel-btn"
                      onClick={() => setShowUpdateComplaintModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="dialog-btn confirm-btn"
                      onClick={handleUpdateComplaint}
                      disabled={complaintActionLoading[selectedComplaint.id]}
                    >
                      {complaintActionLoading[selectedComplaint.id] ? (
                        <div className="button-spinner"></div>
                      ) : (
                        'Update Complaint'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;