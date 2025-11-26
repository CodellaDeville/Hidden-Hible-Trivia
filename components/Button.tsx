import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-sans tracking-wide active:scale-95";
  
  const variants = {
    primary: "bg-ancient-gold hover:bg-ancient-gold-hover text-ancient-bg shadow-[0_0_15px_rgba(212,175,55,0.4)] border-b-4 border-ancient-gold-dim",
    secondary: "bg-ancient-card text-ancient-gold hover:bg-zinc-800 shadow-md border border-ancient-gold-dim",
    outline: "border-2 border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-ancient-bg",
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};