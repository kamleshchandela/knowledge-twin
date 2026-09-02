import React from 'react';
import clsx from 'clsx';

const variantMap = {
  info: { bg: '#f4f4f5', text: '#000000' },
  success: { bg: '#000000', text: '#ffffff' },
  warning: { bg: '#e4e4e7', text: '#000000' },
  error: { bg: '#000000', text: '#ffffff' },
  neutral: { bg: '#ffffff', text: '#000000' },
};

const Badge = ({ children, className, variant = 'info' }) => {
  const style = variantMap[variant] || variantMap.info;
  return (
    <span
      className={clsx('mono', className)}
      style={{
        border: '2px solid #000',
        padding: '2px 8px',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        background: style.bg,
        color: style.text,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
