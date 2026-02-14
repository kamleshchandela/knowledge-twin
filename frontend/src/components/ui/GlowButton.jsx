import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlowButton = ({ children, className, variant = 'primary', icon: Icon, ...props }) => {
    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)]',
        secondary: 'bg-white/10 hover:bg-white/20 border border-white/10',
        accent: 'bg-accent-500 hover:bg-accent-400 shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)]',
        ghost: 'bg-transparent hover:bg-white/5 border-transparent',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(
                clsx(
                    'relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2',
                    variants[variant],
                    className
                )
            )}
            {...props}
        >
            {Icon && <Icon size={18} />}
            {children}
        </motion.button>
    );
};

export default GlowButton;
