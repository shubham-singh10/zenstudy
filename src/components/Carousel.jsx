import axios from 'axios';
import React, { useState, useEffect, Fragment, useMemo } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [carouselData, setCarouselData] = useState([]);

  // Prepare image list based on screen size
  const images = useMemo(() => {
    return carouselData.map((item) => ({
      id: item._id,
      title: item.title,
      imageUrl: isMobile ? item.mobileImageUrl : item.pcImageUrl,
      link: item.link,
    }));
  }, [carouselData, isMobile]);

  // Fetch data and handle resize
  useEffect(() => {
    const getCarousel = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}zenstudy/api/carousel/active`);
        setCarouselData(response.data.data);
      } catch (error) {
        console.error("Error in getCarousel:", error);
      }
    };

    getCarousel();

    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto slide
  useEffect(() => {
    if (!isHovered && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);

  return (
    <Fragment>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-56 overflow-hidden bg-purple-50 rounded-lg lg:h-72 md:h-72">
          {images.map((im, index) => (
            <div
              key={im.id}
              className={`duration-700 ease-in-out ${currentSlide === index ? 'block' : 'hidden'}`}
              data-carousel-item
            >
              <a href={im.link} rel="noopener noreferrer" >
                <img
                  src={im.imageUrl}
                  loading="lazy"
                  className="absolute object-contain lg:object-fill md:object-fill block w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt={`Banner ${index + 1}`}
                />
              </a>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bgGredient-purple' : 'bg-gray-300'}`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
          onClick={prevSlide}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 6 10">
              <path d="M5 1 1 5l4 4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
          onClick={nextSlide}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 6 10">
              <path d="m1 9 4-4-4-4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </button>
      </div>
    </Fragment>
  );
};

export default Carousel;
