import React, { useState, useEffect, Fragment } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const desktopImages = [
    {
      imgurl: "assets/newBanner1.webp",
      link: "https://zenstudy.in/courseDetailslive/UPSC-Foundation-Batch"
    },
    {
      imgurl: "assets/newBanner2.webp",
      link: "https://zenstudy.in/courseDetailslive/UPSC-Foundation-Batch"
    },
    {
      imgurl: "assets/newBanner3.webp",
      link: "https://zenstudy.in/courseDetailslive/UPSC-Foundation-Batch"
    }
  ];

  const mobileImages = [
    {
      imgurl: "assets/mobileBanner1.webp",
      link: "https://zenstudy.in/courseDetailslive/UPSC-Foundation-Batch"
    },
    {
      imgurl: "assets/mobileBanner2.webp",
      link: "https://zenstudy.in/courseDetailslive/UPSC-Foundation-Batch"
    },
    {
      imgurl: "assets/mobileBanner3.webp",
      link: "https://zenstudy.in/courseDetailslive/UPSC-Foundation-Batch"
    }
  ];

  const images = isMobile ? mobileImages : desktopImages;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 786);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  return (
    <Fragment>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-60 overflow-hidden bg-black rounded-lg md:h-64">
          {images.map((im, index) => (
            <div
              key={index}
              className={`duration-700 ease-in-out ${currentSlide === index ? 'block' : 'hidden'}`}
              data-carousel-item
            >
              <a href={im.link} rel="noopener noreferrer">
                <img
                  src={im.imgurl}
                  className="absolute block w-[100%] h-[100%] lg:w-[100%] lg:h-[100%] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt={`Banner ${index + 1}`}
                />
              </a>
            </div>
          ))}
        </div>

        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bgGredient-purple' : 'bg-gray-300'}`}
              aria-current={currentSlide === index}
              aria-label={`Slide ${index + 1}`}
              data-carousel-slide-to={index}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>

        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
          onClick={prevSlide}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
          onClick={nextSlide}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </Fragment>
  );
};

export default Carousel;
