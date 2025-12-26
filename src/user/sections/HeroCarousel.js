// HeroCarousel.jsx
import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles//HeroCarousel.css'; // Optional for custom stylingi
import electronics from '../../assests/elec.jpg'
import fashion from '../../assests/fash.jpg'
import home from '../../assests/home.jpg'

const HeroCarousel = () => {
  // Sample slides data
  const slides = [
    {
      id: 1,
      image: electronics,
      headline: 'Latest Electronics Collection',
      description: 'Discover the newest gadgets and devices.',
      buttonText: 'Shop Now',
      buttonLink: '#'
    },
    {
      id: 2,
      image: fashion,
      headline: 'Trendy Fashion Styles',
      description: 'Upgrade your wardrobe with our exclusive collection.',
      buttonText: 'Explore',
      buttonLink: '#'
    },
    {
      id: 3,
      image: home,
      headline: 'Beautiful Home Decor',
      description: 'Make your home elegant and cozy.',
      buttonText: 'Shop Home',
      buttonLink: '#'
    }
  ];

  return (
    <div className="hero-carousel">
      <Carousel indicators={true} controls={true} interval={4000}>
        {slides.map(slide => (
          <Carousel.Item key={slide.id}>
            <img
              className="d-block w-100 hero-image"
              src={slide.image}
              alt={slide.headline}
            />
            <Carousel.Caption className="hero-caption">
              <h2>{slide.headline}</h2>
              <p>{slide.description}</p>
              <Button href={slide.buttonLink} variant="primary">{slide.buttonText}</Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;