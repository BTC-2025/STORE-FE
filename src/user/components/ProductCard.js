import React from 'react'

const ProductCard = ({image,name,price}) => {
  return (
    <div className="card h-100 shadow-sm">
      <img src={image} className="card-img-top" alt={name} style={{ height: '300px', objectFit: 'cover' }} />
      <div className="card-body">
        <h6 className="card-title">{name}</h6>
        <p className="fw-bold text-primary">${price}</p>
        <button className="btn btn-sm btn-outline-primary w-100">Add to Cart</button>
      </div>
    </div>
  )
}

export default ProductCard
