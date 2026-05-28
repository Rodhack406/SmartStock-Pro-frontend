import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/AuthContext';

const categories = ['Electronics', 'Clothing', 'Appliances', 'Sports', 'Furniture', 'Food', 'Books', 'Tools'];
const suppliers = ['TechCorp', 'FashionInc', 'HomeGoods', 'FitLife', 'OfficePro', 'FoodDistro', 'BookWorld'];

export const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [thresholds, setThresholds] = useState({
    lowStockThreshold: 20,
    criticalStockThreshold: 10,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    supplier: '',
    price: '',
    stock: '',
  });

  // Fetch user settings thresholds
  const fetchThresholds = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('low_stock_threshold, critical_stock_threshold')
        .eq('user_id', user.id)
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

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchThresholds();
      fetchProducts();
    }
  }, [user]);

  // Calculate status based on stock and thresholds
  const getProductStatus = (stock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock < thresholds.criticalStockThreshold) return 'Critical';
    if (stock < thresholds.lowStockThreshold) return 'Low';
    return 'Normal';
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    try {
      setError('');
      const newProduct = {
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        supplier: formData.supplier,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();

      if (error) throw error;

      setProducts([data[0], ...products]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
      console.error('Error adding product:', err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      supplier: product.supplier,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleUpdateProduct = async () => {
    try {
      setError('');
      const updatedProduct = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        supplier: formData.supplier,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        updated_at: new Date(),
      };

      const { data, error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', editingProduct.id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === editingProduct.id ? data[0] : p
      ));
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setError('');
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      supplier: '',
      price: '',
      stock: '',
    });
    setEditingProduct(null);
    setError('');
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Normal': 'success',
      'Low': 'warning',
      'Critical': 'error',
      'Out of Stock': 'error',
    };
    return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
  };

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Supplier', accessor: 'supplier' },
    {
      header: 'Price',
      accessor: 'price',
      cell: (value) => `K${value?.toFixed(2) || '0.00'}`,
    },
    { header: 'Stock', accessor: 'stock' },
    {
      header: 'Status',
      accessor: 'stock',
      cell: (value) => getStatusBadge(getProductStatus(value)),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditProduct(row)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProduct(value)}
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Product
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

      {/* Search */}
      <Card>
        <CardBody>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search products by name, category, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardBody>
      </Card>

      {/* Products Table */}
      <Card>
        <CardBody>
          <Table columns={columns} data={filteredProducts} />
        </CardBody>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </CardFooter>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={categories.map(c => ({ value: c, label: c }))}
                placeholder="Select category"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier *
              </label>
              <Select
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                options={suppliers.map(s => ({ value: s, label: s }))}
                placeholder="Select supplier"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (K) *
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Status will be: {getProductStatus(parseInt(formData.stock) || 0)}
              </p>
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
              onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
              disabled={!formData.name || !formData.category || !formData.supplier || !formData.price || !formData.stock}
            >
              {editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};