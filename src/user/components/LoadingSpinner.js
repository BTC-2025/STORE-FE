import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Reusable loading indicator with multiple variants and sizes
 * 
 * @param {string} variant - 'spinner' | 'dots' | 'skeleton' (default: 'spinner')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} fullPage - Show as fullpage overlay (default: false)
 * @param {string} message - Optional loading message
 * @param {string} color - 'primary' | 'secondary' | 'white' (default: 'primary')
 */
const LoadingSpinner = ({
    variant = 'spinner',
    size = 'md',
    fullPage = false,
    message = '',
    color = 'primary'
}) => {
    // Spinner variant
    if (variant === 'spinner') {
        const spinnerContent = (
            <div className={`loading-spinner-container ${fullPage ? 'fullpage' : ''}`}>
                <div className={`spinner spinner-${color} spinner-${size}`}></div>
                {message && <p className="loading-message">{message}</p>}
            </div>
        );

        return fullPage ? (
            <div className="loading-overlay">
                {spinnerContent}
            </div>
        ) : spinnerContent;
    }

    // Dots variant
    if (variant === 'dots') {
        return (
            <div className={`loading-dots-container ${fullPage ? 'fullpage' : ''}`}>
                <div className={`loading-dots loading-dots-${size}`}>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
                {message && <p className="loading-message">{message}</p>}
            </div>
        );
    }

    // Skeleton variant (for inline loading)
    if (variant === 'skeleton') {
        return (
            <div className="skeleton-loader">
                <div className="skeleton-line skeleton-line-lg"></div>
                <div className="skeleton-line skeleton-line-md"></div>
                <div className="skeleton-line skeleton-line-sm"></div>
            </div>
        );
    }

    return null;
};

// Button Loading State Component
export const ButtonLoading = ({ children, loading, ...props }) => {
    return (
        <button {...props} disabled={loading || props.disabled}>
            {loading ? (
                <>
                    <span className="spinner spinner-sm spinner-white me-2"></span>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
};

// Card Skeleton for Product Loading
export const ProductCardSkeleton = () => {
    return (
        <div className="product-card-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-line skeleton-line-md"></div>
                <div className="skeleton-line skeleton-line-lg"></div>
                <div className="skeleton-line skeleton-line-sm"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
