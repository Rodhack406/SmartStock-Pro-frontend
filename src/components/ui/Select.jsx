import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  className,
  options = [],
  error,
  label,
  placeholder,
  icon,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <select
          className={clsx(
            'block w-full rounded-lg border border-gray-200 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'bg-white pr-10',
            'transition-all duration-200',
            icon && 'pl-10',
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown size={18} className="text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};