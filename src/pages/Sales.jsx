import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { ShoppingCart, DollarSign, Plus, Search, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/AuthContext';

export const Sales = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .gt('stock', 0)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    }
  };

  // Fetch sales from Supabase with product name
  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select(`
          id,
          product_id,
          quantity,
          price,
          total,
          created_at,
          products:product_id (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Transform data to include product_name
      const transformedSales = data.map(sale => ({
        ...sale,
        product_name: sale.products?.name || 'Unknown Product'
      }));
      
      setRecentSales(transformedSales);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchSales();
    }
  }, [user]);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      setPrice(product.price);
    }
  };

  const total = quantity * price;

  const handleRecordSale = async () => {
    if (!selectedProduct || quantity < 1) return;

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    // Check if enough stock
    if (quantity > product.stock) {
      setError(`Only ${product.stock} units available in stock`);
      return;
    }

    try {
      setError('');
      const newSale = {
        product_id: product.id,
        quantity: quantity,
        price: price,
        total: total,
      };

      const { data, error } = await supabase
        .from('sales')
        .insert([newSale])
        .select(`
          id,
          product_id,
          quantity,
          price,
          total,
          created_at,
          products:product_id (
            name
          )
        `);

      if (error) throw error;

      // Transform the new sale to include product_name
      const newSaleWithName = {
        ...data[0],
        product_name: data[0].products?.name || 'Unknown Product'
      };

      // Add new sale to the list
      setRecentSales([newSaleWithName, ...recentSales]);
      
      // Update product stock in the products list
      setProducts(products.map(p => 
        p.id === product.id 
          ? { ...p, stock: p.stock - quantity }
          : p
      ));
      
      // Reset form and close modal
      setSelectedProduct('');
      setQuantity(1);
      setPrice(0);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
      console.error('Error recording sale:', err);
    }
  };

  const resetForm = () => {
    setSelectedProduct('');
    setQuantity(1);
    setPrice(0);
    setError('');
  };

  // Filter sales based on search and filters
  const filteredSales = recentSales.filter(sale => {
    // Search filter
    const matchesSearch = sale.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Product filter
    const matchesProduct = productFilter === 'all' || sale.product_name === productFilter;
    
    // Date filter
    let matchesDate = true;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (dateFilter === 'today') {
      matchesDate = new Date(sale.created_at).toDateString() === today;
    } else if (dateFilter === 'yesterday') {
      matchesDate = new Date(sale.created_at).toDateString() === yesterday;
    } else if (dateFilter === 'thisWeek') {
      const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
      matchesDate = new Date(sale.created_at) >= oneWeekAgo;
    }
    
    return matchesSearch && matchesProduct && matchesDate;
  });

  const columns = [
    { header: 'Product', accessor: 'product_name' },
    { header: 'Quantity', accessor: 'quantity' },
    {
      header: 'Total',
      accessor: 'total',
      cell: (value) => `K${value?.toFixed(2) || '0.00'}`,
    },
    {
      header: 'Date',
      accessor: 'created_at',
      cell: (value) => format(new Date(value), 'MMM dd, yyyy HH:mm'),
    },
  ];

  // Calculate today's stats - just count entries
  const today = new Date().toDateString();
  const todaySales = recentSales.filter(sale => 
    new Date(sale.created_at).toDateString() === today
  );
  const totalSalesToday = todaySales.length; // Just count the sales
  const productsSoldToday = todaySales.reduce((sum, sale) => sum + sale.quantity, 0);

  // Get unique products for filter dropdown
  const uniqueProducts = ['all', ...new Set(recentSales.map(sale => sale.product_name).filter(Boolean))];

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-500">Track and record your sales transactions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="lg">
          <Plus size={18} className="mr-2" />
          New Sale
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

      {/* Today's Summary - Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

        {/* Products Sold Today */}
        <Card className="hover:shadow-md transition-shadow">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Products Sold Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {productsSoldToday}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ShoppingCart className="text-orange-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Total Sales Value Today */}
        <Card className="hover:shadow-md transition-shadow">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sales Value Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  K{todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Filter */}
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Dates' },
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'thisWeek', label: 'This Week' },
              ]}
              icon={<Calendar size={18} />}
            />

            {/* Product Filter */}
            <Select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              options={uniqueProducts.map(p => ({ 
                value: p, 
                label: p === 'all' ? 'All Products' : p 
              }))}
              icon={<ShoppingCart size={18} />}
            />
          </div>
        </CardBody>
      </Card>

      {/* Recent Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Sales</h2>
            <Button variant="ghost" size="sm" onClick={fetchSales}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Table columns={columns} data={filteredSales} />
        </CardBody>
      </Card>

      {/* Record Sale Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Record New Sale"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Product
            </label>
            <Select
              value={selectedProduct}
              onChange={handleProductChange}
              options={products.map(p => ({
                value: p.id.toString(),
                label: `${p.name} - K${p.price} (Stock: ${p.stock})`,
              }))}
              placeholder="Choose a product..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <Input
              type="number"
              min="1"
              max={selectedProduct ? products.find(p => p.id === parseInt(selectedProduct))?.stock : 1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            {selectedProduct && (
              <p className="mt-1 text-xs text-gray-500">
                Available stock: {products.find(p => p.id === parseInt(selectedProduct))?.stock} units
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Price per unit:</span>
              <span className="font-semibold">K{price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary-600">
                K{total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecordSale}
              disabled={!selectedProduct || quantity < 1}
            >
              <ShoppingCart size={18} className="mr-2" />
              Record Sale
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};