import React, { useState, useRef, useEffect } from 'react';
import './CategoryMenu.css';

const CategoryMenu = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const categoryRefs = useRef([]);

  const categories = [
    {
      id: 1,
      name: "Fashion",
      icon: "fa-shirt",
      subcategories: ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Ethnic / Traditional", "Activewear & Sportswear", "Sleepwear & Loungewear", "Underwear & Socks", "Occasion / Style"]
    },
    {
      id: 2,
      name: "Electronics",
      icon: "fa-microchip",
      subcategories: ["Mobiles & Accessories", "Laptops & Accessories", "Computers & Components", "Audio & Wearables", "Cameras & Photography", "TVs & Home Entertainment", "Gaming", "Home Appliances", "Networking & Smart Devices", "Electronic Accessories"]
    },
    {
      id: 3,
      name: "Groceries",
      icon: "fa-cart-shopping",
      subcategories: ["Fruits & Vegetables", "Dairy & Eggs", "Bakery & Breads", "Snacks & Beverages", "Packaged & Canned Foods", "Spices & Condiments", "Rice, Grains & Pulses", "Oils & Ghee", "Frozen Foods", "Household Essentials"]
    },
    {
      id: 4,
      name: "Home & Kitchen",
      icon: "fa-house",
      subcategories: ["Kitchen & Dining", "Cookware & Bakeware", "Home Appliances", "Bedding & Bath", "Home Décor", "Lighting & Lamps", "Storage & Organization", "Cleaning Supplies", "Tools & Home Improvement", "Garden & Outdoor"]
    },
    {
      id: 5,
      name: "Sports & Fitness",
      icon: "fa-dumbbell",
      subcategories: ["Exercise", "Outdoor", "Team Sports", "Water Sports"]
    },
    {
      id: 6,
      name: "Books",
      icon: "fa-book",
      subcategories: ["Fiction", "Non-Fiction", "Children's Book", "Educational & Academic", "Comics & Graphic Novels", "Biographies & Memoirs", "Self-Help & Motivation", "Religion & Spirituality", "Cookbooks & Food Writing", "Travel & Adventure"]
    },
    {
      id: 7,
      name: "Accessories",
      icon: "fa-gem",
      subcategories: ["Bags & Wallets", "Belts", "Hats & Caps", "Sunglasses & Eyewear", "Watches", "Jewelry & Ornaments", "Scarves & Shawls", "Hair Accessories", "Gloves", "Travel Accessories"]
    },
    {
      id: 8,
      name: "Furniture",
      icon: "fa-couch",
      subcategories: ["Living Room Furniture", "Bedroom Furniture", "Dining Room Furniture", "Office Furniture", "Outdoor Furniture", "Storage Furniture", "Kid's Furniture", "Entryway & Hallway Furniture"]
    },
    {
      id: 9,
      name: "Toys",
      icon: "fa-gamepad",
      subcategories: ["Action Figures & Collectibles", "Dolls & Dollhouses", "Building Sets & Blocks", "Educational Toys", "Puzzles & Games", "Outdoor Play", "Remote Control Toys", "Arts & Crafts for Kids", "Stuffed Animals & Plush Toys"]
    }
  ];

  const handleMouseEnter = (index) => {
    setActiveDropdown(index);

    // Calculate dropdown position
    const element = categoryRefs.current[index];
    if (element) {
      const rect = element.getBoundingClientRect();
      const dropdownWidth = 280; // max-width of dropdown
      const viewportWidth = window.innerWidth;
      const padding = 16; // safety padding

      // Check if dropdown would overflow on the right
      const wouldOverflow = rect.left + dropdownWidth / 2 > viewportWidth - padding;

      setDropdownPosition({
        alignRight: wouldOverflow
      });
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="simple-category-menu">
      <div className="container-fluid">
        <ul className="simple-category-list">
          {categories.map((category, index) => (
            <li
              key={category.id}
              ref={el => categoryRefs.current[index] = el}
              className="simple-category-item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="simple-category-link">
                <i className={`fas ${category.icon}`}></i>
                <span>{category.name}</span>
              </div>

              {activeDropdown === index && category.subcategories.length > 0 && (
                <div className={`simple-dropdown ${dropdownPosition.alignRight ? 'align-right' : ''}`}>
                  {category.subcategories.map((sub, subIdx) => (
                    <a
                      key={subIdx}
                      className="simple-dropdown-item"
                      href={`/products?subcategory=${encodeURIComponent(sub)}`}
                    >
                      {sub}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryMenu;