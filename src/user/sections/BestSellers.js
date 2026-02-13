import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../home/Home.css";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/product?mode=highestDiscount`
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

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Top Deals</h2>
        <a href="/products?sort=discount" className="view-all-link">View All</a>
      </div>
      <div className="products-grid">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;