import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaFilter, FaEye, FaTimes, FaCheck, FaEdit } from 'react-icons/fa';
import './OrdersList.css';

const OrdersList = ({ sellerToken, onBackToDashboard }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/ordereditems`, {
          headers: {
            'Authorization': `Bearer ${sellerToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sellerToken]);

  // Apply filter when filterStatus changes
  useEffect(() => {
    if (filterStatus === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(item => item.status === filterStatus));
    }
  }, [filterStatus, orders]);

  // Fetch order details when view is clicked
  const fetchOrderDetails = async (orderItemId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/order/orderitems/${orderItemId}`, {
        headers: {
          'Authorization': `Bearer ${sellerToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      setSelectedOrder(data);
      setNewStatus(data.status); // Set initial status for the form
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    }
  };

  // Update order status
  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/order/update/orderitem/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sellerToken}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Update the order in the local state
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setUpdatingStatus(false);
      
      // Show success message or close modal if needed
      alert('Order status updated successfully!');
      
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const updateStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <p>Error: {error}</p>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="orders-list-container">
      <div className="orders-header">
        <button className="btn-back" onClick={onBackToDashboard}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h2>Order Management</h2>
        <div className="filter-section">
          <FaFilter className="filter-icon" />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="orders-content">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found{filterStatus !== 'All' ? ` with status: ${filterStatus}` : ''}</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order Item ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(item => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.totalPrice)}</td>
                    <td>
                      <span className={`status-badge status-${item.status ? item.status.toLowerCase() : 'pending'}`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <button 
                        className="btn-view"
                        onClick={() => fetchOrderDetails(item.id)}
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order Details #{selectedOrder.id}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Product:</span>
                  <span className="detail-value">{selectedOrder.product?.name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">{selectedOrder.quantity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">{formatCurrency(selectedOrder.price)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Price:</span>
                  <span className="detail-value">{formatCurrency(selectedOrder.totalPrice)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Order Date:</span>
                  <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(selectedOrder.updatedAt)}</span>
                </div>
                <div className="detail-row status-update">
                  <span className="detail-label">Status:</span>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="status-select"
                  >
                    {updateStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-update"
                onClick={updateOrderStatus}
                disabled={updatingStatus || newStatus === selectedOrder.status}
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;