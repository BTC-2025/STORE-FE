import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './CategoryMenu.css';

const CategoryMenu = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [clickedCategory, setClickedCategory] = useState(null);
  const containerRef = useRef(null);

  const categories = [
    { id: 1, name: "Fashion", icon: "👗", subcategories: ["Men’s Clothing","Women’s Clothing","Kids’ Clothing","Ethnic / Traditional","Activewear & Sportswear","Sleepwear & Loungewear","Underwear & Socks","Occasion / Style"] },
    { id: 2, name: "Electronics", icon: "🔌", subcategories: ["Mobiles & Accessories","Laptops & Accessories","Computers & Components","Audio & Wearables","Cameras & Photography","TVs & Home Entertainment","Gaming","Home Appliances","Networking & Smart Devices","Electronic Accessories"] },
    { id: 3, name: "Groceries", icon: "🛒", subcategories: ["Fruits & Vegetables","Dairy & Eggs","Bakery & Breads","Snacks & Beverages","Packaged & Canned Foods","Spices & Condiments","Rice, Grains & Pulses","Oils & Ghee","Frozen Foods","Household Essentials"] },
    { id: 4, name: "Home & Kitchen", icon: "🏠", subcategories: ["Kitchen & Dining","Cookware & Bakeware","Home Appliances","Bedding & Bath","Home Décor","Lighting & Lamps","Storage & Organization","Cleaning Supplies","Tools & Home Improvement","Garden & Outdoor"] },
    { id: 5, name: "Sports & Fitness", icon: "⚽", subcategories: ["Exercise","Outdoor","Team Sports","Water Sports"] },
    { id: 6, name: "Books", icon: "📚", subcategories: ["Fiction","Non-Fiction","Children's Book","Educational & Academic","Comics & Graphic Novels","Biographies & Memoirs","Self-Help & Motivation","Religion & Spirituality","Cookbooks & Food Writing","Travel & Adventure"] },
    { id: 7, name: "Accessories", icon: "💄", subcategories: ["Bags & Wallets","Belts","Hats & Caps","Sunglasses & Eyewear","Watches","Jewelry & Ornaments","Scarves & Shawls","Hair Accessories","Gloves","Travel Accessories"] },
    { id: 8, name: "Furniture", icon: "🛋️", subcategories: ["Living Room Furniture","Bedroom Furniture","Dining Room Furniture","Office Furniture","Outdoor Furniture","Storage Furniture","Kid's Furniture","Entryway & Hallway Furniture"] },
    { id: 9, name: "Toys", icon: "🧸", subcategories: ["Action Figures & Collectibles","Dolls & Dollhouses","Building Sets & Blocks","Educational Toys","Puzzles & Games","Outdoor Play","Remote Control Toys","Arts & Crafts for Kids","Stuffed Animals & Plush Toys"] }
  ];

  const handleMouseEnter = (e, category) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setActiveDropdown(category.id);
    setActiveSubcategories(category.subcategories);
  };

  const handleMouseLeave = () => {
    if (clickedCategory === null) {
      setActiveDropdown(null);
      setActiveSubcategories([]);
    }
  };

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    if (clickedCategory === category.id) {
      setClickedCategory(null);
      setActiveDropdown(null);
      setActiveSubcategories([]);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
      setActiveDropdown(category.id);
      setActiveSubcategories(category.subcategories);
      setClickedCategory(category.id);
    }
  };

  // Effect for outside click detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
        setActiveSubcategories([]);
        setClickedCategory(null);
      }
    }
    if (activeDropdown !== null || clickedCategory !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, clickedCategory]);

  return (
    <div className="category-menu-container" ref={containerRef}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav categorys-list">
            {categories.map(category => (
              <li
                key={category.id}
                className="nav-item"
                onMouseEnter={(e) => handleMouseEnter(e, category)}
                onMouseLeave={handleMouseLeave}
              >
                <a className="nav-link" href="#" onClick={(e) => handleCategoryClick(e, category)}>
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {activeDropdown && activeSubcategories.length > 0 &&
        createPortal(
          <div
            className="dropdown-menu show"
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              minWidth: 220,
              zIndex: 2000,
            }}
            onMouseLeave={() => {
              if (clickedCategory === null) {
                setActiveDropdown(null);
                setActiveSubcategories([]);
              }
            }}
          >
            {activeSubcategories.map((sub, idx) => (
              <a key={idx} className="dropdown-item" href="#">{sub}</a>
            ))}
          </div>,
          document.body
        )
      }
    </div>
  );
};

export default CategoryMenu;