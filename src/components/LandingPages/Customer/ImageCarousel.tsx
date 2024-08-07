import Image from 'next/image';
import { useState, useEffect } from 'react';

const images = [
  { src: '/LP1.jpeg', alt: 'Center image' },
  { src: '/LP2.jpeg', alt: 'Left image' },
  { src: '/LP3.jpeg', alt: 'Right image' },
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-56 overflow-hidden" onClick={handleClick}>
      {images.map((image, index) => {
        const position = (index - currentIndex + images.length) % images.length;
        let className = 'absolute transition-all duration-500 ease-in-out transform ';

        if (position === 0) {
          className += 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20';
        } else if (position === 1) {
          className += 'left-[calc(50%+140px)] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10';
        } else {
          className += 'left-[calc(50%-140px)] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10';
        }

        return (
          <div key={image.src} className={className}>
            <Image
              src={image.src}
              alt={image.alt}
              width={280}
              height={210}
              className={`rounded-lg shadow-lg transition-all duration-500 ${
                position !== 0 ? 'opacity-60 blur-[1px]' : 'opacity-100'
              }`}
              style={{
                transform: `scale(${position === 0 ? 1 : 0.85})`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImageCarousel;