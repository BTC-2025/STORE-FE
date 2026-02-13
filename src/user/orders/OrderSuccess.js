import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();

    return (
        <div className="order-success-container">
            <div className="success-card">
                <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                </div>
                <h2>Order Placed Successfully!</h2>
                <p className="success-message">Thank you for your purchase. Your order has been confirmed.</p>

                {orderId && (
                    <div className="order-id-display">
                        <span>Order ID:</span>
                        <strong>#{orderId}</strong>
                    </div>
                )}

                <div className="action-buttons">
                    <button className="view-order-btn" onClick={() => navigate(`/orders`)}>
                        View My Orders
                    </button>
                    <button className="continue-shopping-btn" onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
