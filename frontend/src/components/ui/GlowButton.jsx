import React from 'react';
import clsx from 'clsx';

const GlowButton = ({ children, className, variant = 'primary', icon: Icon, ...props }) => {
  const baseClass = variant === 'primary' ? 'btn-submit' : 'action-btn';
  return (
    <button className={clsx(baseClass, className)} {...props}>
      {Icon ? <Icon size={16} style={{ marginRight: 6 }} /> : null}
      {children}
    </button>
  );
};

export default GlowButton;
