import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge'; // Add this import
import { RevenueChart } from '../components/charts/RevenueChart';
import { SalesTrendChart } from '../components/charts/SalesTrendChart';
import { TopProductsChart } from '../components/charts/TopProductsChart';
import { Download, Calendar, FileText, TrendingUp, Package, DollarSign } from 'lucide-react';

const monthlyRevenue = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
  { name: 'Jul', revenue: 72000 },
  { name: 'Aug', revenue: 68000 },
  { name: 'Sep', revenue: 79000 },
  { name: 'Oct', revenue: 85000 },
  { name: 'Nov', revenue: 91000 },
  { name: 'Dec', revenue: 98000 },
];

const productComparison = [
  { name: 'Electronics', sales: 45000 },
  { name: 'Clothing', sales: 32000 },
  { name: 'Home & Garden', sales: 28000 },
  { name: 'Sports', sales: 21000 },
  { name: 'Books', sales: 15000 },
  { name: 'Toys', sales: 12000 },
];

const inventoryTrends = [
  { month: 'Jan', inbound: 1200, outbound: 980, stock: 4200 },
  { month: 'Feb', inbound: 1100, outbound: 1050, stock: 4250 },
  { month: 'Mar', inbound: 1300, outbound: 1150, stock: 4400 },
  { month: 'Apr', inbound: 1400, outbound: 1250, stock: 4550 },
  { month: 'May', inbound: 1250, outbound: 1300, stock: 4500 },
  { month: 'Jun', inbound: 1500, outbound: 1400, stock: 4600 },
];

const summaryCards = [
  {
    title: 'Total Revenue',
    value: '$847,000',
    change: '+15.3%',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    title: 'Total Orders',
    value: '12,345',
    change: '+8.2%',
    icon: TrendingUp,
    color: 'bg-blue-500',
  },
  {
    title: 'Avg. Order Value',
    value: '$68.50',
    change: '+5.7%',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    title: 'Products Sold',
    value: '23,456',
    change: '+12.4%',
    icon: Package,
    color: 'bg-orange-500',
  },
];

const dateRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '12m', label: 'Last 12 Months' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'custom', label: 'Custom Range' },
];

export const Reports = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('all');

  const handleExport = (format) => {
    // In a real app, this would generate and download a report
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download size={18} className="mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download size={18} className="mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={dateRanges}
              icon={<Calendar size={18} />}
            />
            
            {dateRange === 'custom' && (
              <>
                <Input
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </>
            )}
  
            <Select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'all', label: 'All Reports' },
                { value: 'sales', label: 'Sales Reports' },
                { value: 'inventory', label: 'Inventory Reports' },
                { value: 'financial', label: 'Financial Reports' },
              ]}
            />
          </div>
        </CardBody>
      </Card>
  
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-sm text-green-600 mt-1">{card.change}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="text-white" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
  
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={monthlyRevenue} title="Monthly Revenue" height={350} />
        <SalesTrendChart 
          data={monthlyRevenue.map(item => ({ name: item.name, sales: item.revenue / 1000 }))} 
          title="Sales Trend" 
          height={350} 
        />
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart data={productComparison} title="Product Category Sales" height={350} />
        
        {/* Inventory Trends Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Inventory Trends</h3>
          </CardHeader>
          <CardBody>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={inventoryTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.6}
                  />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
  
      {/* Detailed Reports Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Detailed Reports</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { name: 'Monthly Sales Report', date: '2024-01-15', size: '2.4 MB', type: 'PDF' },
              { name: 'Inventory Status Report', date: '2024-01-14', size: '1.8 MB', type: 'Excel' },
              { name: 'Product Performance Analysis', date: '2024-01-13', size: '3.1 MB', type: 'PDF' },
              { name: 'Supplier Performance Review', date: '2024-01-12', size: '1.2 MB', type: 'PDF' },
              { name: 'Sales by Category Report', date: '2024-01-11', size: '2.0 MB', type: 'Excel' },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      Generated on {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{report.type}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};