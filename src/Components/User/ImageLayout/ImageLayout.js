import React from 'react';
import './ImageLayout.css';

const ImageLayout = ({ images }) => {
  if (images.length === 0) {
    return <p>Please provide at least one image.</p>;
  }

  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <div className="image-card">
            <img src={image} alt={`Image ${index + 1}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageLayout;

