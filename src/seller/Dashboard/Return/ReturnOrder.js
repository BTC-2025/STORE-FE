import React, { useEffect, useState } from "react";
import {
  FaUndo,
  FaBox,
  FaRupeeSign,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import "./ReturnOrder.css";

const COMPLAINT_TYPES = [
  "Fraud",
  "Counterfeit",
  "Payment",
  "Harassment",
  "PolicyViolation",
  "Other",
];

const ReturnOrder = ({ onBackToDashboard }) => {
  const [returnItems, setReturnItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [complaintType, setComplaintType] = useState("Fraud");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const sellerData = JSON.parse(localStorage.getItem("sellerData"));
    if (!sellerData || !sellerData.id) {
      console.error("Seller ID not found in localStorage");
      setLoading(false);
      return;
    }

    const fetchReturns = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.5:3009/api/return/sellerid/${sellerData.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch return items");
        }

        const data = await response.json();
        setReturnItems(data.returnItems || []);
      } catch (err) {
        console.error("Error fetching return items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const handleRaiseComplaint = (item) => {
    setSelectedItem(item);
    setComplaintType("Fraud");
    setDescription("");
    setShowComplaintForm(true);
  };

  const submitComplaint = async () => {
    if (!selectedItem) return;

    const sellerData = JSON.parse(localStorage.getItem("sellerData"));
    const payload = {
      raisedBySellerId: sellerData.id,
      againstUserId: selectedItem.userId,
      orderId: selectedItem.orderId,
      productId: selectedItem.productId,
      complaintType,
      description,
    };

    try {
      setSubmitting(true);
      const response = await fetch(
        "http://192.168.1.5:3009/api/complaint/create/sellertouser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Complaint raised successfully!");
        setShowComplaintForm(false);
      } else {
        alert(result.message || "Failed to raise complaint.");
      }
    } catch (error) {
      console.error("Error raising complaint:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="return-orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading return orders...</p>
      </div>
    );
  }

  return (
    <div className="return-orders-page">
      <header className="return-orders-header">
        <h2>
          <FaUndo /> Returned Orders
        </h2>
        <button className="btn-back" onClick={onBackToDashboard}>
          Back to Dashboard
        </button>
      </header>

      <div className="return-orders-list">
        {returnItems.length > 0 ? (
          returnItems.map((item) => (
            <div key={item.id} className="return-order-card">
              <div className="return-item-image">
                <img src={item.product.image} alt={item.product.name} />
              </div>
              <div className="return-item-info">
                <h3>{item.product.name}</h3>
                <p>
                  <FaRupeeSign /> {item.product.price} × {item.quantity} ={" "}
                  <strong>₹{item.product.price * item.quantity}</strong>
                </p>
                <p>
                  <FaBox /> Order Item ID: {item.orderItemId}
                </p>
                <p>
                  <FaCalendarAlt />{" "}
                  {new Date(item.order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  {item.status === "Pending" ? (
                    <span className="status-pending">
                      <FaExclamationTriangle /> {item.status}
                    </span>
                  ) : (
                    <span className="status-success">{item.status}</span>
                  )}
                </p>
                <button
                  className="btn-complaint"
                  onClick={() => handleRaiseComplaint(item)}
                >
                  <FaExclamationCircle /> Raise Complaint
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-returns">No returned items found</p>
        )}
      </div>

      {/* Complaint Modal */}
      {showComplaintForm && (
        <div className="complaint-modal">
          <div className="complaint-content">
            <h3>Raise Complaint</h3>
            <label>Complaint Type</label>
            <select
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
            >
              {COMPLAINT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label>Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter complaint details..."
            />

            <div className="modal-actions">
              <button onClick={() => setShowComplaintForm(false)}>
                Cancel
              </button>
              <button
                onClick={submitComplaint}
                disabled={submitting || !description}
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnOrder;