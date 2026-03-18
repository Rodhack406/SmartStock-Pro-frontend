import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

export const TopBar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products, sales, inventory..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={18} className="text-primary-600" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Gorette Mulundano</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>
    </header>
  );
};