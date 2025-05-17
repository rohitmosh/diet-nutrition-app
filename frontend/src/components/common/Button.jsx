import React from 'react';
import '../../styles/button.css';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  onClick,
  disabled,
  className,
  ...rest 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
