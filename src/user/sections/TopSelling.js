import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TopSelling.css";
import fas from '../../assests/elec.jpg'

const TopSelling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const res = await axios.get(
          "https://store-kedb.onrender.com/api/product/top/selling"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch top selling products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSelling();
  }, []);

  if (loading) return <div className="top-selling-container">Loading...</div>;

  return (
    <div className="top-selling-container">
      <h2>Top Selling Products</h2>
      <div className="top-selling-grid">
        {products.map((product) => (
          <div key={product.id} className="top-selling-card">
            <div className="image-container">
              <img src={fas} alt={product.name} />
              {product.discount > 0 && (
                <span className="discount-badge">{product.discount}% OFF</span>
              )}
            </div>
            <div className="product-overlay">
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSelling;