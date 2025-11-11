
import React from 'react';

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`
        relative inline-flex items-center justify-center px-6 py-2 
        bg-blue-600 text-white font-semibold rounded-lg shadow-md
        transition-all duration-300 ease-in-out
        hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500
        disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed
        overflow-hidden group
        ${className}
      `}
      {...props}
    >
      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default GlowingButton;
