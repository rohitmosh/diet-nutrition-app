import React from 'react';
import '../../styles/loader.css';

const Loader = ({ size = 'medium' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
