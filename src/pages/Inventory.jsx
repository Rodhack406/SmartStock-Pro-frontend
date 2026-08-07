import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/AuthContext';

const categories = ['All', 'Electronics', 'Clothing', 'Appliances', 'Sports', 'Furniture', 'Food', 'Books', 'Tools'];
const statusFilters = ['All', 'Normal', 'Low', 'Critical', 'Out of Stock'];

export const Inventory = () => {
  const { user } = useAuth();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [thresholds, setThresholds] = useState({
    lowStockThreshold: 20,
    criticalStockThreshold: 10,
  });

  // Fetch user settings thresholds
  const fetchThresholds = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('low_stock_threshold, critical_stock_threshold')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setThresholds({
          lowStockThreshold: data.low_stock_threshold || 20,
          criticalStockThreshold: data.critical_stock_threshold || 10,
        });
      }
    } catch (err) {
      console.error('Error fetching thresholds:', err);
    }
  };

  // Calculate status based on stock and thresholds
  const getStockStatus = (stock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock < thresholds.criticalStockThreshold) return 'Critical';
    if (stock < thresholds.lowStockThreshold) return 'Low';
    return 'Normal';
  };

  // Fetch inventory from Supabase
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError('');
      
      let query = supabase
        .from('products')
        .select('id, name, category, stock, updated_at')

      const { data, error } = await query.order('name');

      if (error) throw error;
      
      // Transform data for inventory display with dynamic status
      const inventory = data.map(item => ({
        id: item.id,
        product: item.name,
        stockLevel: item.stock,
        status: getStockStatus(item.stock),
        lastUpdated: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: item.category,
      }));
      
      setInventoryData(inventory);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchThresholds();
      fetchInventory();
    }
  }, [user]);

  // Refetch inventory when thresholds change
  useEffect(() => {
    if (user && thresholds) {
      fetchInventory();
    }
  }, [thresholds]);

  // Set up real-time subscription for inventory updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          // Refetch inventory when changes occur
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getStatusBadge = (status) => {
    const variants = {
      'Normal': 'success',
      'Low': 'warning',
      'Critical': 'error',
      'Out of Stock': 'error',
    };
    return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
  };

  const getStockIndicator = (level) => {
    if (level <= 0) return 'bg-gray-500';
    if (level < thresholds.criticalStockThreshold) return 'bg-red-500';
    if (level < thresholds.lowStockThreshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStockProgressWidth = (level, maxStock = 100) => {
    const percentage = Math.min((level / maxStock) * 100, 100);
    return `${percentage}%`;
  };

  const getProgressBarColor = (level) => {
    if (level <= 0) return 'bg-gray-500';
    if (level < thresholds.criticalStockThreshold) return 'bg-red-500';
    if (level < thresholds.lowStockThreshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate inventory stats
  const totalItems = inventoryData.length;
  const lowStockItems = inventoryData.filter(item => item.status === 'Low').length;
  const criticalStock = inventoryData.filter(item => item.status === 'Critical' || item.status === 'Out of Stock').length;
  const totalStockValue = inventoryData.reduce((sum, item) => sum + item.stockLevel, 0);

  const columns = [
    { header: 'Product', accessor: 'product' },
    {
      header: 'Stock Level',
      accessor: 'stockLevel',
      cell: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${getStockIndicator(value)}`} />
            <span className="font-medium">{value} units</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${getProgressBarColor(value)}`}
              style={{ width: getStockProgressWidth(value) }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => getStatusBadge(value),
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Last Updated', accessor: 'lastUpdated' },
  ];

  if (loading && inventoryData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Monitor and manage your stock levels</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchInventory}
          disabled={loading}
        >
          <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-red-700 font-medium">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categories.map(c => ({ value: c, label: c }))}
              placeholder="Filter by category"
              icon={<Filter size={18} />}
            />

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusFilters.map(s => ({ value: s, label: s }))}
              placeholder="Filter by status"
              icon={<Filter size={18} />}
            />
          </div>
        </CardBody>
      </Card>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-blue-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Total Stock Value</p>
            <p className="text-2xl font-bold text-gray-900">{totalStockValue} units</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-green-500 rounded-full" style={{ width: `${(totalStockValue / (totalStockValue || 1)) * 100}%` }} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-yellow-500 rounded-full" style={{ width: `${(lowStockItems / (totalItems || 1)) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Below {thresholds.lowStockThreshold} units
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Critical Stock</p>
            <p className="text-2xl font-bold text-red-600">{criticalStock}</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-red-500 rounded-full" style={{ width: `${(criticalStock / (totalItems || 1)) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Below {thresholds.criticalStockThreshold} units
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Current Inventory</h2>
            <p className="text-sm text-gray-500">
              Showing {filteredInventory.length} of {inventoryData.length} products
            </p>
          </div>
        </CardHeader>
        <CardBody>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <Table columns={columns} data={filteredInventory} />
          )}
        </CardBody>
      </Card>
    </div>
  );
};