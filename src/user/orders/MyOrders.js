import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedOrderItem, setExpandedOrderItem] = useState(null); // For Review
  const [expandedReturnItem, setExpandedReturnItem] = useState(null); // For Return
  const [expandedComplaintItem, setExpandedComplaintItem] = useState(null); // For Complaint

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [complaintData, setComplaintData] = useState({
    complaintType: "",
    description: ""
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/order/userid/${userId}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchOrders();
  }, [userId]);

  const deleteOrder = async (orderId) => {
    try {
      if (window.confirm("Are you sure want to cancel this order?")) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/order/orderid/${orderId}/cancel`
        );
        alert("Order cancelled Successfully");
        window.location.reload();
      }
    } catch (err) {
      console.error("Error in cancelling order", err);
    }
  };

  const handleReviewSubmit = async (productId) => {
    if (!rating || !comment) {
      alert("Please provide both rating and comment.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/review`, {
        productId,
        userId,
        rating,
        comment,
      });
      alert("Review submitted successfully!");
      setRating(0);
      setComment("");
      setExpandedOrderItem(null);
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Failed to submit review. Try again.");
    }
  };

  const handleReturnSubmit = async (orderId, itemId) => {
    if (!returnReason) {
      alert("Please provide a reason for return.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/return/create`, {
        orderId,
        userId,
        reason: returnReason,
        orderItemId: itemId,
      });
      alert("Return request submitted successfully!");
      setReturnReason("");
      setExpandedReturnItem(null);
    } catch (err) {
      console.error("Error submitting return request", err);
      alert("Failed to submit return. Try again.");
    }
  };

  const handleComplaintSubmit = async (orderItem) => {
    if (!complaintData.complaintType || !complaintData.description) {
      alert("Please fill in all complaint fields");
      return;
    }

    try {
      const complaintPayload = {
        raisedByUserId: parseInt(userId),
        againstSellerId: parseInt(orderItem.product.sellerId),
        orderId: parseInt(orderItem.orderId),
        productId: parseInt(orderItem.product.id),
        complaintType: complaintData.complaintType,
        description: complaintData.description
      };

      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/complaint/create/usertoseller`,
        complaintPayload
      );

      alert("Complaint submitted successfully!");
      setComplaintData({ complaintType: "", description: "" });
      setExpandedComplaintItem(null);
    } catch (err) {
      console.error("Error submitting complaint", err);
      alert("Failed to submit complaint. Try again.");
    }
  };

  const complaintTypes = ['Fraud', 'Defective Product', 'Wrong Item', 'Late Delivery', 'Poor Quality', 'Missing Item', 'Other'];

  // Check if action buttons should be visible (only for delivered orders)
  const shouldShowActionButtons = (orderItem) => {
    return orderItem.status === "Delivered";
  };

  // Check if cancel button should be visible (only for non-delivered and non-cancelled orders)
  const shouldShowCancelButton = (orderItem) => {
    return orderItem.status !== "Delivered" && orderItem.status !== "Cancelled";
  };

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <main className="my-orders-main">
        <div className="my-orders-header">
          <h1 className="my-orders-title">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p className="empty-state-text">No orders found</p>
            <p className="empty-state-subtext">
              Your orders will appear here once you make a purchase
            </p>
          </div>
        ) : (
          <div className="orders-list container">
            {orders.map((order) =>
              order.items.map((item) => (
                <div key={item.id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-image-container">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="order-image"
                      />
                      <div className="order-badge">Order #{order.id}</div>
                    </div>

                    <div className="order-content">
                      <h3 className="order-product-name">{item.product.name}</h3>
                      <p className="order-product-description">
                        {item.product.shortDescription}
                      </p>

                      <div className="order-details">
                        <span className="order-detail-item">
                          <span>Quantity:</span> {item.quantity}
                        </span>
                        <span className="order-detail-item">
                          <span>Amount:</span> ₹{item.totalPrice}
                        </span>
                        <span className="order-detail-item">
                          <span>Seller ID:</span> {item.product.sellerId}
                        </span>
                      </div>

                      <div
                        className={`order-status ${
                          item.status === "Delivered"
                            ? "status-delivered"
                            : item.status === "Pending"
                            ? "status-pending"
                            : item.status === "Cancelled"
                            ? "status-cancelled"
                            : "status-other"
                        }`}
                      >
                        {item.status}
                      </div>

                      <p className="order-date">
                        Ordered on: {new Date(order.createdAt).toDateString()}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="order-actions">
                      {/* Review Button - Only for Delivered orders */}
                      {shouldShowActionButtons(item) && (
                        <button
                          className="review-toggle-btn"
                          onClick={() =>
                            setExpandedOrderItem(
                              expandedOrderItem === item.id ? null : item.id
                            )
                          }
                        >
                          {expandedOrderItem === item.id
                            ? "Close Review"
                            : "Write a Review"}
                        </button>
                      )}

                      {/* Return Button - Only for Delivered orders */}
                      {shouldShowActionButtons(item) && (
                        <button
                          className="return-order-btn"
                          onClick={() =>
                            setExpandedReturnItem(
                              expandedReturnItem === item.id ? null : item.id
                            )
                          }
                        >
                          {expandedReturnItem === item.id
                            ? "Close Return"
                            : "Return"}
                        </button>
                      )}

                      {/* Complaint Button - Only for Delivered orders */}
                      {shouldShowActionButtons(item) && (
                        <button
                          className="complaint-btn"
                          onClick={() =>
                            setExpandedComplaintItem(
                              expandedComplaintItem === item.id ? null : item.id
                            )
                          }
                        >
                          {expandedComplaintItem === item.id
                            ? "Close Complaint"
                            : "File Complaint"}
                        </button>
                      )}

                      {/* Cancel Button - Only for non-Delivered and non-Cancelled orders */}
                      {shouldShowCancelButton(item) && (
                        <button
                          className="cancel-order-btn"
                          onClick={() => {
                            deleteOrder(order.id);
                          }}
                        >
                          Cancel Order
                        </button>
                      )}

                      {/* Status message for cancelled orders */}
                      {item.status === "Cancelled" && (
                        <span className="cancelled-message">Order Cancelled</span>
                      )}
                    </div>
                  </div>

                  {/* Review Form */}
                  {expandedOrderItem === item.id && (
                    <div className="review-form-container">
                      <div className="review-header">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="review-product-image"
                        />
                        <div>
                          <h4 className="review-product-name">
                            {item.product.name}
                          </h4>
                          <div className="rating-star">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                onClick={() => setRating(i + 1)}
                                className={`star ${
                                  i < rating ? "active" : "inactive"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>

                      <textarea
                        className="review-textarea"
                        placeholder="Share your experience with this product..."
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>

                      <div className="review-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => setExpandedOrderItem(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-submit"
                          onClick={() =>
                            handleReviewSubmit(item.product.id)
                          }
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Return Form */}
                  {expandedReturnItem === item.id && (
                    <div className="return-form-container">
                      <h4 className="return-form-title">Return Item</h4>
                      <textarea
                        className="return-textarea"
                        placeholder="Enter return reason..."
                        rows="3"
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                      ></textarea>

                      <div className="return-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => setExpandedReturnItem(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-submit"
                          onClick={() =>
                            handleReturnSubmit(order.id, item.id)
                          }
                        >
                          Submit Return
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Complaint Form */}
                  {expandedComplaintItem === item.id && (
                    <div className="complaint-form-container">
                      <h4 className="complaint-form-title">File Complaint</h4>
                      
                      <div className="complaint-info">
                        <p><strong>Product:</strong> {item.product.name}</p>
                        <p><strong>Seller ID:</strong> {item.product.sellerId}</p>
                        <p><strong>Order ID:</strong> {order.id}</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Complaint Type *</label>
                        <select 
                          value={complaintData.complaintType} 
                          onChange={(e) => setComplaintData({...complaintData, complaintType: e.target.value})}
                          className="complaint-select"
                        >
                          <option value="">Select Complaint Type</option>
                          {complaintTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea 
                          value={complaintData.description} 
                          onChange={(e) => setComplaintData({...complaintData, description: e.target.value})}
                          className="complaint-textarea"
                          placeholder="Please describe your complaint in detail..."
                          rows="4"
                        />
                      </div>

                      <div className="complaint-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => {
                            setExpandedComplaintItem(null);
                            setComplaintData({ complaintType: "", description: "" });
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-submit"
                          onClick={() => handleComplaintSubmit(item)}
                        >
                          Submit Complaint
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;