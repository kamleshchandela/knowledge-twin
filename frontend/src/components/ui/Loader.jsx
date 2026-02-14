import React from 'react';

const Loader = ({ size = 'md' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`relative ${sizes[size]}`}>
            <div className="absolute inset-0 border-2 border-primary-500/30 rounded-full" />
            <div className="absolute inset-0 border-2 border-primary-500 rounded-full border-t-transparent animate-spin" />
        </div>
    );
};

export default Loader;
