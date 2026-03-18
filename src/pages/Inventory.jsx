import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Search, Filter } from 'lucide-react';

const inventoryData = [
  {
    id: 1,
    product: 'Wireless Headphones',
    stockLevel: 45,
    status: 'Normal',
    lastUpdated: '2024-01-15',
    category: 'Electronics',
  },
  {
    id: 2,
    product: 'Cotton T-Shirt',
    stockLevel: 12,
    status: 'Low',
    lastUpdated: '2024-01-14',
    category: 'Clothing',
  },
  {
    id: 3,
    product: 'Coffee Maker',
    stockLevel: 5,
    status: 'Critical',
    lastUpdated: '2024-01-13',
    category: 'Appliances',
  },
  {
    id: 4,
    product: 'Yoga Mat',
    stockLevel: 30,
    status: 'Normal',
    lastUpdated: '2024-01-15',
    category: 'Sports',
  },
  {
    id: 5,
    product: 'Desk Lamp',
    stockLevel: 18,
    status: 'Low',
    lastUpdated: '2024-01-12',
    category: 'Furniture',
  },
  {
    id: 6,
    product: 'Smart Watch',
    stockLevel: 8,
    status: 'Critical',
    lastUpdated: '2024-01-15',
    category: 'Electronics',
  },
];

const categories = ['All', 'Electronics', 'Clothing', 'Appliances', 'Sports', 'Furniture'];
const statusFilters = ['All', 'Normal', 'Low', 'Critical'];

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const getStatusBadge = (status) => {
    const variants = {
      Normal: 'success',
      Low: 'warning',
      Critical: 'error',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getStockIndicator = (level) => {
    if (level < 10) return 'bg-red-500';
    if (level < 20) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    { header: 'Product', accessor: 'product' },
    {
      header: 'Stock Level',
      accessor: 'stockLevel',
      cell: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${getStockIndicator(value)}`} />
          <span>{value} units</span>
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-500">Monitor and manage your stock levels</p>
      </div>

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold">118</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-blue-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold">8</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-yellow-500 rounded-full" style={{ width: '30%' }} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Critical Stock</p>
            <p className="text-2xl font-bold">3</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-red-500 rounded-full" style={{ width: '15%' }} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Current Inventory</h2>
        </CardHeader>
        <CardBody>
          <Table columns={columns} data={filteredInventory} />
        </CardBody>
      </Card>
    </div>
  );
};