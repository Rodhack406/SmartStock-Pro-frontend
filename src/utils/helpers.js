import { format } from 'date-fns';

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatString);
};

// Calculate stock status
export const getStockStatus = (stock, lowThreshold = 20, criticalThreshold = 10) => {
  if (stock <= criticalThreshold) return 'Critical';
  if (stock <= lowThreshold) return 'Low';
  return 'Normal';
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    Normal: 'green',
    Low: 'yellow',
    Critical: 'red',
  };
  return colors[status] || 'gray';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};