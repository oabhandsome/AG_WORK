import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-semibold text-text-dark">{label}</label>}
      <input
        className={`px-4 py-2 border-2 rounded-xl focus:outline-none transition-colors duration-200
          ${error ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-pastel-purple focus:border-purple-400 bg-white'}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
