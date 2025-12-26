import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // ✅ import Link
import "../styles/BestSellers.css";
import fas from '../../assests/elec.jpg'
const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://store-kedb.onrender.com/api/product?mode=highestDiscount"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="best-sellers-container">Loading...</div>;

  return (
    <div className="best-sellers-container">
      <h2>Top Deals</h2>
      <div className="best-sellers-scroll">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`} // ✅ Navigate on click
            className="product-card-link"
          >
            <div className="product-card">
              <img src={fas} alt={product.name} />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="price">
                  ₹{product.price}{" "}
                  {product.discount > 0 && (
                    <span className="discount">{product.discount}% OFF</span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;