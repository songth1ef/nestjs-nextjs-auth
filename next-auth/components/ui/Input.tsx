'use client';

import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`space-y-1 ${widthClass}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          block rounded-md border border-gray-300 px-3 py-2
          text-sm placeholder-gray-400
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${widthClass}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 