import React from 'react';
import './EmptyState.css';

/**
 * EmptyState Component
 * Reusable component for displaying empty states with icons, messages, and CTAs
 * 
 * @param {string} icon - FontAwesome icon class (e.g., 'fa-shopping-cart')
 * @param {string} title - Main heading text
 * @param {string} message - Descriptive message
 * @param {string} actionText - Button text (optional)
 * @param {function} onAction - Button click handler (optional)
 * @param {string} actionLink - Link href if using link instead of button (optional)
 * @param {string} variant - 'default' | 'search' | 'cart' | 'wishlist' | 'orders' (default: 'default')
 * @param {node} children - Custom content (optional)
 */
const EmptyState = ({
    icon = 'fa-inbox',
    title = 'Nothing here yet',
    message = 'It looks like there\'s nothing to display right now.',
    actionText,
    onAction,
    actionLink,
    variant = 'default',
    children
}) => {
    // Predefined variants for common empty states
    const variants = {
        search: {
            icon: 'fa-search',
            title: 'No results found',
            message: 'Try adjusting your search or filters to find what you\'re looking for.'
        },
        cart: {
            icon: 'fa-shopping-cart',
            title: 'Your cart is empty',
            message: 'Looks like you haven\'t added anything to your cart yet.'
        },
        wishlist: {
            icon: 'fa-heart',
            title: 'Your wishlist is empty',
            message: 'Save items you love to your wishlist for later.'
        },
        orders: {
            icon: 'fa-box',
            title: 'No orders yet',
            message: 'You haven\'t placed any orders yet. Start shopping to see your orders here.'
        },
        products: {
            icon: 'fa-tag',
            title: 'No products available',
            message: 'We couldn\'t find any products matching your criteria.'
        },
        default: {
            icon,
            title,
            message
        }
    };

    const selectedVariant = variants[variant] || variants.default;

    return (
        <div className="empty-state">
            <div className="empty-state-content">
                <div className="empty-state-icon">
                    <i className={`fas ${selectedVariant.icon}`}></i>
                </div>
                <h2 className="empty-state-title">{selectedVariant.title}</h2>
                <p className="empty-state-message">{selectedVariant.message}</p>

                {children && <div className="empty-state-custom">{children}</div>}

                {(actionText || actionLink) && (
                    <div className="empty-state-action">
                        {actionLink ? (
                            <a href={actionLink} className="btn-empty-state">
                                {actionText}
                            </a>
                        ) : (
                            <button onClick={onAction} className="btn-empty-state">
                                {actionText}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Specialized Empty State Components
export const EmptyCart = ({ onShopNow }) => (
    <EmptyState
        variant="cart"
        actionText="Start Shopping"
        actionLink="/products"
    />
);

export const EmptyWishlist = ({ onBrowseProducts }) => (
    <EmptyState
        variant="wishlist"
        actionText="Browse Products"
        actionLink="/products"
    />
);

export const EmptyOrders = ({ onShopNow }) => (
    <EmptyState
        variant="orders"
        actionText="Shop Now"
        actionLink="/products"
    />
);

export const NoSearchResults = ({ onReset }) => (
    <EmptyState
        variant="search"
        actionText="Reset Filters"
        onAction={onReset}
    />
);

export const NoProducts = ({ onReset }) => (
    <EmptyState
        variant="products"
        actionText="Clear Filters"
        onAction={onReset}
    />
);

export default EmptyState;
