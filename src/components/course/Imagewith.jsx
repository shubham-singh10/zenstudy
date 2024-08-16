import React, { useState } from 'react';

const ImageWithPlaceholder = ({ src, placeholderSrc, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={className}>
      <img
        src={placeholderSrc}
        alt="Placeholder"
        crossOrigin="anonymous"  
        className={`w-full h-52 rounded-2xl ${loaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <img
        src={src}
        crossOrigin="anonymous"  
        alt={alt}
        className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithPlaceholder;
