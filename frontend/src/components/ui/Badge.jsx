import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, className, variant = 'info' }) => {
    const variants = {
        info: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
        success: 'bg-green-500/20 text-green-200 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
        error: 'bg-red-500/20 text-red-200 border-red-500/30',
        neutral: 'bg-gray-500/20 text-gray-200 border-gray-500/30',
    };

    return (
        <span
            className={twMerge(
                clsx(
                    'px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm',
                    variants[variant],
                    className
                )
            )}
        >
            {children}
        </span>
    );
};

export default Badge;
