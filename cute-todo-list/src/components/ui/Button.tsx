import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  let bgClass = 'bg-pastel-pink hover:bg-pink-300 text-text-dark';
  if (variant === 'secondary') bgClass = 'bg-pastel-blue hover:bg-blue-300 text-text-dark';
  if (variant === 'danger') bgClass = 'bg-red-300 hover:bg-red-400 text-white';
  if (variant === 'ghost') bgClass = 'bg-transparent hover:bg-gray-100 text-text-dark';

  return (
    <button
      className={`px-4 py-2 rounded-xl font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${bgClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
