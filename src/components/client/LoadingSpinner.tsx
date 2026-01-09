import React from 'react';
import Logo from '../../assets/images/Nepal-Designers-Builders-Logo.png'; // Import your logo

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="spinning-circle"></div>
        <img 
          src={Logo} 
          alt="Loading..." 
          className="static-logo"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;