import React from "react";

const Products = ({ product }) => {
  return (
    <div className="card mb-3" style={{ minHeight: "180px" }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={product.image || "/placeholder.png"} 
            className="img-fluid rounded-start"
            alt={product.name}
            style={{ height: "180px", objectFit: "cover", width: "100%" }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text" style={{ maxHeight: "100px", overflow: "hidden" }}>
              {product.details}
            </p>
            <p className="card-text">
              <strong>${product.price}</strong>{" "}
              <span className="text-success">{product.offer}</span>
            </p>
            <button className="btn btn-outline-primary w-100">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
