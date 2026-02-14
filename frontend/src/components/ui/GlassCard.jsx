import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, hoverEffect = false, ...props }) => {
    return (
        <motion.div
            className={twMerge(
                clsx(
                    'glass-panel rounded-xl p-6 relative overflow-hidden',
                    hoverEffect && 'hover:bg-white/10 transition-colors duration-300',
                    className
                )
            )}
            {...props}
        >
            {hoverEffect && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}
            {children}
        </motion.div>
    );
};

export default GlassCard;
