import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const initialProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    supplier: 'TechCorp',
    price: 99.99,
    stock: 45,
    status: 'Normal',
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    supplier: 'FashionInc',
    price: 24.99,
    stock: 12,
    status: 'Low',
  },
  {
    id: 3,
    name: 'Coffee Maker',
    category: 'Appliances',
    supplier: 'HomeGoods',
    price: 79.99,
    stock: 5,
    status: 'Critical',
  },
  {
    id: 4,
    name: 'Yoga Mat',
    category: 'Sports',
    supplier: 'FitLife',
    price: 29.99,
    stock: 30,
    status: 'Normal',
  },
  {
    id: 5,
    name: 'Desk Lamp',
    category: 'Furniture',
    supplier: 'OfficePro',
    price: 45.00,
    stock: 18,
    status: 'Normal',
  },
];

const categories = ['Electronics', 'Clothing', 'Appliances', 'Sports', 'Furniture'];
const suppliers = ['TechCorp', 'FashionInc', 'HomeGoods', 'FitLife', 'OfficePro'];

export const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    supplier: '',
    price: '',
    stock: '',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: products.length + 1,
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: parseInt(formData.stock) < 10 ? 'Critical' : parseInt(formData.stock) < 20 ? 'Low' : 'Normal',
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: '',
      category: product.category,
      supplier: product.supplier,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleUpdateProduct = () => {
    const updatedProducts = products.map(p =>
      p.id === editingProduct.id
        ? {
            ...p,
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            status: parseInt(formData.stock) < 10 ? 'Critical' : parseInt(formData.stock) < 20 ? 'Low' : 'Normal',
          }
        : p
    );
    setProducts(updatedProducts);
    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
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
  };

  const getStatusBadge = (status) => {
    const variants = {
      Normal: 'success',
      Low: 'warning',
      Critical: 'error',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Supplier', accessor: 'supplier' },
    {
      header: 'Price',
      accessor: 'price',
      cell: (value) => `K${value.toFixed(2)}`,
    },
    { header: 'Stock', accessor: 'stock' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => getStatusBadge(value),
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
              Product Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
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
                Category
              </label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={categories.map(c => ({ value: c, label: c }))}
                placeholder="Select category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <Select
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                options={suppliers.map(s => ({ value: s, label: s }))}
                placeholder="Select supplier"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
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
            >
              {editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};