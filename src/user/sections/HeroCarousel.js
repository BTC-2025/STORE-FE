// HeroCarousel.jsx
import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../home/Home.css'; // Use new Home.css
import electronics from '../../assests/elec.jpg'
import fashion from '../../assests/fash.jpg'
import home from '../../assests/home.jpg'

const HeroCarousel = () => {
  const slides = [
    {
      id: 1,
      image: electronics,
      headline: 'Latest Electronics',
      description: 'Discover the newest gadgets and high-performance devices.',
      buttonText: 'Shop Electronics',
      buttonLink: '/products?category=Electronics'
    },
    {
      id: 2,
      image: fashion,
      headline: 'Trendy Fashion',
      description: 'Upgrade your wardrobe with our cursor-curated collection.',
      buttonText: 'Shop Fashion',
      buttonLink: '/products?category=Clothing'
    },
    {
      id: 3,
      image: home,
      headline: 'Modern Home Decor',
      description: 'Transform your living space with elegant furniture.',
      buttonText: 'Shop Home',
      buttonLink: '/products?category=Home%20%26%20Kitchen'
    }
  ];

  return (
    <div className="hero-section">
      <Carousel
        indicators={true}
        controls={true}
        interval={5000}
        fade={true}
        className="hero-carousel"
      >
        {slides.map(slide => (
          <Carousel.Item key={slide.id}>
            <div className="overlay"></div>
            <img
              className="d-block w-100 hero-image"
              src={slide.image}
              alt={slide.headline}
            />
            <Carousel.Caption className="hero-caption">
              <h2>{slide.headline}</h2>
              <p>{slide.description}</p>
              <a href={slide.buttonLink} className="hero-btn hero-btn-primary">
                {slide.buttonText}
              </a>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;