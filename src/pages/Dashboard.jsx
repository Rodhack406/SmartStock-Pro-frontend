import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
} from '../components/ui/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Package, ShoppingCart, AlertTriangle, Wallet } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    salesToday: 0,
    lowStockItems: 0,
    revenueToday: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get user's products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, stock, category, price')

      if (productsError) throw productsError;

      // Get user's sales
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('*')

      if (salesError) throw salesError;

      // Calculate stats
      const totalProducts = products?.length || 0;
      const lowStockItems = products?.filter(p => p.stock < 20).length || 0;
      
      // Today's sales
      const today = new Date().toDateString();
      const todaySales = sales?.filter(sale => 
        new Date(sale.created_at).toDateString() === today
      ) || [];
      const salesToday = todaySales.length;
      const revenueToday = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);

      setStats({
        totalProducts,
        salesToday,
        lowStockItems,
        revenueToday,
      });

      // Prepare sales trend data (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const daySales = sales?.filter(sale => 
          new Date(sale.created_at).toDateString() === dateStr
        ) || [];
        const total = daySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
        last7Days.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          sales: total,
        });
      }
      setSalesData(last7Days);

      // Prepare top selling products
      const productSales = {};
      sales?.forEach(sale => {
        const product = products?.find(p => p.id === sale.product_id);
        const productName = product?.name || 'Unknown';
        if (!productSales[productName]) {
          productSales[productName] = 0;
        }
        productSales[productName] += sale.quantity || 0;
      });

      const topProductsData = Object.entries(productSales)
        .map(([name, quantity]) => ({ name, sales: quantity }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
      setTopProducts(topProductsData);

      // Prepare inventory distribution by category
      const categoryCount = {};
      products?.forEach(product => {
        const category = product.category || 'Uncategorized';
        if (!categoryCount[category]) {
          categoryCount[category] = 0;
        }
        categoryCount[category] += product.stock || 0;
      });

      const inventoryDistribution = Object.entries(categoryCount)
        .map(([name, value]) => ({ name, value }));
      setInventoryData(inventoryDistribution);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Set up real-time subscription for updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('dashboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales',
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Sales Today',
      value: stats.salesToday,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Revenue Today',
      value: `K${stats.revenueToday.toFixed(2)}`,
      icon: Wallet,
      color: 'bg-purple-500',
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your inventory.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Sales Trend (Last 7 Days)</h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#4F46E5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Top Selling Products</h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Inventory Distribution */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Inventory Distribution by Category</h2>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};