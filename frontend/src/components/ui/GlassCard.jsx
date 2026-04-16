import React from 'react';
import clsx from 'clsx';

const GlassCard = ({ children, className, ...props }) => {
  return (
    <div className={clsx('glass-card', className)} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
