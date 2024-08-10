import React, { useMemo } from 'react';

const AnimatedBackground: React.FC<{ className?: string }> = ({ className }) => {
  const blobs = useMemo(() => [
    { shape: 'circle', size: 'w-1/2 h-1/2', color: 'from-pink-300 to-purple-300' },
    { shape: 'ellipse', size: 'w-2/3 h-1/3', color: 'from-yellow-300 to-red-300' },
    { shape: 'rectangle', size: 'w-1/4 h-1/3', color: 'from-green-300 to-blue-300' },
    { shape: 'circle', size: 'w-1/3 h-1/3', color: 'from-indigo-300 to-cyan-300' },
    { shape: 'ellipse', size: 'w-1/2 h-1/4', color: 'from-orange-300 to-rose-300' },
    { shape: 'rectangle', size: 'w-1/3 h-1/4', color: 'from-teal-300 to-emerald-300' },
  ].map(blob => ({
    ...blob,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  })), []);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {blobs.map((blob, index) => (
        <div
          key={index}
          className={`
            absolute ${blob.size} bg-gradient-to-r ${blob.color}
            filter blur-3xl opacity-30 animate-blob-wide
            ${index % 2 === 0 ? 'animation-delay-2000' : 'animation-delay-4000'}
          `}
          style={{
            left: blob.left,
            top: blob.top,
            borderRadius: blob.shape === 'circle' ? '50%' : blob.shape === 'ellipse' ? '50%' : '10%',
          }}
        ></div>
      ))}
    </div>
  );
};

export default AnimatedBackground;