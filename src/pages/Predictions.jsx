import React from 'react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Calendar, Package, AlertCircle} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const predictedSalesData = [
  { month: 'Jan', actual: 4000, predicted: 4200 },
  { month: 'Feb', actual: 4500, predicted: 4600 },
  { month: 'Mar', actual: 5000, predicted: 5100 },
  { month: 'Apr', actual: 4800, predicted: 5000 },
  { month: 'May', actual: 5200, predicted: 5400 },
  { month: 'Jun', actual: 5800, predicted: 6000 },
  { month: 'Jul', predicted: 6200 },
  { month: 'Aug', predicted: 6500 },
  { month: 'Sep', predicted: 6800 },
];

const demandForecast = [
  { week: 'W1', demand: 120 },
  { week: 'W2', demand: 135 },
  { week: 'W3', demand: 150 },
  { week: 'W4', demand: 165 },
  { week: 'W5', demand: 180 },
  { week: 'W6', demand: 200 },
];

const predictions = [
  {
    title: 'Expected Sales Next Week',
    value: 'K45,200',
    change: '+8%',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    title: 'Expected Sales Next Month',
    value: 'K189,500',
    change: '+12%',
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  {
    title: 'Recommended Restock Items',
    value: '23 products',
    change: 'Critical',
    icon: Package,
    color: 'bg-purple-500',
  },
];

const restockRecommendations = [
  { product: 'Wireless Headphones', currentStock: 12, recommended: 50, priority: 'High' },
  { product: 'Coffee Maker', currentStock: 5, recommended: 30, priority: 'Critical' },
  { product: 'Yoga Mat', currentStock: 18, recommended: 40, priority: 'Medium' },
  { product: 'Desk Lamp', currentStock: 8, recommended: 35, priority: 'High' },
];

export const Predictions = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Predictions</h1>
        <p className="text-gray-500">
          Predictions generated from historical sales data using machine learning models
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardBody className="flex items-start gap-3">
          <AlertCircle className="text-blue-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900">AI-Powered Predictions</h3>
            <p className="text-sm text-blue-800">
              These predictions are based on historical sales data, seasonal trends, and market analysis.
              Actual results may vary. Updated daily.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {predictions.map((prediction, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{prediction.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{prediction.value}</p>
                  <p className={`text-sm ${
                    prediction.change.includes('+') ? 'text-green-600' : 'text-orange-600'
                  } mt-1`}>
                    {prediction.change}
                  </p>
                </div>
                <div className={`${prediction.color} p-1 rounded-lg`}>
                  <prediction.icon className="text-white" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predicted Sales Trend */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Predicted Sales Trend</h2>
            <p className="text-sm text-gray-500">6-month forecast with confidence interval</p>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictedSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    name="Actual Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Demand Forecast */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Demand Forecast</h2>
            <p className="text-sm text-gray-500">Weekly demand prediction</p>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Restock Recommendations */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recommended Restock Items</h2>
          <p className="text-sm text-gray-500">Based on predicted demand and current stock levels</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {restockRecommendations.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.product}</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-sm text-gray-500">
                      Current: {item.currentStock} units
                    </span>
                    <span className="text-sm text-gray-500">
                      Recommended: {item.recommended} units
                    </span>
                  </div>
                </div>
                <div>
                  <Badge
                    variant={
                      item.priority === 'Critical'
                        ? 'error'
                        : item.priority === 'High'
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {item.priority} Priority
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};