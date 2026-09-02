import React from 'react';

const Loader = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48,
  };
  const px = sizeMap[size] || sizeMap.md;
  return (
    <div
      aria-label="loading"
      style={{
        width: px,
        height: px,
        border: '3px solid #000',
        borderTopColor: 'transparent',
        borderRadius: '999px',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
};

export default Loader;
