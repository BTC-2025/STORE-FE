// NewArrivals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/NewArrivals.css";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://store-kedb.onrender.com/api/product/new"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch new arrivals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <div className="new-arrivals-container">Loading...</div>;

  return (
    <div className="new-arrivals-container">
      <h2>New Arrivals</h2>
      <div className="products-grid">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="product-item">
            <Link to={`/product/${product.id}`} className="arrival-link">
              <img
                src={product.image}
                alt={product.name}
                className="arrival-image"
              />
              <div className="arrival-info">
                <h4 className="arrival-name">{product.name}</h4>
                <p className="arrival-discount">
                  {product.discount > 0
                    ? `Min. ${product.discount}% Off`
                    : "Special offer"}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;