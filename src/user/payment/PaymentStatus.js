import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentStatus.css'; // We will create this CSS file next

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, failure
    const [message, setMessage] = useState('Verifying your payment...');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!orderId) {
            setStatus('failure');
            setMessage('Invalid payment reference.');
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/payment/verify/${orderId}`);

                if (response.data.status === 'SUCCESS') {
                    setStatus('success');
                    setMessage('Payment successful! Redirecting you to orders...');
                } else {
                    setStatus('failure');
                    setMessage('Payment failed or is pending. Please check your orders.');
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                setStatus('failure');
                setMessage('Error verifying payment status. Please contact support if money was deducted.');
            }
        };

        verifyPayment();
    }, [orderId]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            const redirect = setTimeout(() => {
                navigate(`/order-success?orderId=${orderId}`);
            }, 5000);

            return () => {
                clearInterval(timer);
                clearTimeout(redirect);
            };
        }
    }, [status, navigate]);

    return (
        <div className="payment-status-container">
            <div className={`status-card ${status}`}>
                <div className="status-icon">
                    {status === 'verifying' && <i className="fas fa-spinner fa-spin"></i>}
                    {status === 'success' && <i className="fas fa-check-circle"></i>}
                    {status === 'failure' && <i className="fas fa-times-circle"></i>}
                </div>
                <h2>{status === 'verifying' ? 'Processing...' : status === 'success' ? 'Payment Successful!' : 'Payment Failed'}</h2>
                <p className="status-message">{message}</p>

                {status === 'success' && (
                    <p className="redirect-message">Redirecting to Orders in {countdown} seconds...</p>
                )}

                {status === 'failure' && (
                    <button className="retry-btn" onClick={() => navigate('/checkout')}>Try Again</button>
                )}
                {status === 'verifying' && (
                    <p>Please do not close this window.</p>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;
