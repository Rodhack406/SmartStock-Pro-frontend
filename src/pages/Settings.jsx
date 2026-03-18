import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import {
  Save,
  Bell,
  Globe,
  DollarSign,
  Users,
  Shield,
  Mail,
  Smartphone,
  Building2,
  Palette,
  Key,
  Database,
} from 'lucide-react';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    businessName: 'SmartStock Pro',
    businessEmail: 'contact@smartstockpro.com',
    businessPhone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    lowStockAlerts: true,
    salesReports: true,
    dailySummary: false,
    
    // Appearance
    theme: 'light',
    primaryColor: '#4F46E5',
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: '30',
    
    // Preferences
    lowStockThreshold: '20',
    criticalStockThreshold: '10',
    autoReorder: false,
  });

  const handleSave = () => {
    // In a real app, this would save to Supabase
    console.log('Saving settings:', settings);
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Database },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your account and application preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save size={18} className="mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                transition-colors duration-200
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <>
            {/* Business Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 size={20} className="text-gray-500" />
                  Business Information
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Business Name"
                    value={settings.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    icon={<Building2 size={18} />}
                  />
                  <Input
                    label="Business Email"
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => handleChange('businessEmail', e.target.value)}
                    icon={<Mail size={18} />}
                  />
                  <Input
                    label="Business Phone"
                    value={settings.businessPhone}
                    onChange={(e) => handleChange('businessPhone', e.target.value)}
                    icon={<Smartphone size={18} />}
                  />
                  <Input
                    label="Address"
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    icon={<Globe size={18} />}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Regional Settings */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe size={20} className="text-gray-500" />
                  Regional Settings
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    label="Currency"
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    options={[
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'EUR', label: 'EUR (€)' },
                      { value: 'GBP', label: 'GBP (£)' },
                      { value: 'JPY', label: 'JPY (¥)' },
                      { value: 'CAD', label: 'CAD ($)' },
                      { value: 'AUD', label: 'AUD ($)' },
                    ]}
                    icon={<DollarSign size={18} />}
                  />
                  <Select
                    label="Timezone"
                    value={settings.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    options={[
                      { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                      { value: 'America/Denver', label: 'Mountain Time (MT)' },
                      { value: 'America/Chicago', label: 'Central Time (CT)' },
                      { value: 'America/New_York', label: 'Eastern Time (ET)' },
                      { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
                      { value: 'Europe/Paris', label: 'Central European Time (CET)' },
                    ]}
                    icon={<Globe size={18} />}
                  />
                  <Select
                    label="Date Format"
                    value={settings.dateFormat}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                    options={[
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                    ]}
                  />
                </div>
              </CardBody>
            </Card>
          </>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell size={20} className="text-gray-500" />
                Notification Preferences
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium mb-4">Alert Types</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Low Stock Alerts</p>
                        <p className="text-sm text-gray-500">Get notified when products are running low</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.lowStockAlerts}
                          onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sales Reports</p>
                        <p className="text-sm text-gray-500">Daily sales summary reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.salesReports}
                          onChange={(e) => handleChange('salesReports', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Daily Summary</p>
                        <p className="text-sm text-gray-500">End of day business summary</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.dailySummary}
                          onChange={(e) => handleChange('dailySummary', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'appearance' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette size={20} className="text-gray-500" />
                Appearance Settings
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleChange('theme', 'light')}
                      className={`
                        flex-1 p-4 rounded-lg border-2 transition-all
                        ${settings.theme === 'light'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="w-full h-20 bg-white rounded-lg shadow-soft mb-2"></div>
                      <p className="font-medium">Light</p>
                    </button>
                    <button
                      onClick={() => handleChange('theme', 'dark')}
                      className={`
                        flex-1 p-4 rounded-lg border-2 transition-all
                        ${settings.theme === 'dark'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="w-full h-20 bg-gray-900 rounded-lg shadow-soft mb-2"></div>
                      <p className="font-medium">Dark</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield size={20} className="text-gray-500" />
                Security Settings
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <Select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                    options={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' },
                      { value: '120', label: '2 hours' },
                      { value: '240', label: '4 hours' },
                    ]}
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <Button variant="outline" className="w-full">
                    <Key size={18} className="mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'preferences' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database size={20} className="text-gray-500" />
                System Preferences
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Low Stock Threshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
                    helper="Products below this quantity are marked as Low"
                  />
                  <Input
                    label="Critical Stock Threshold"
                    type="number"
                    value={settings.criticalStockThreshold}
                    onChange={(e) => handleChange('criticalStockThreshold', e.target.value)}
                    helper="Products below this quantity are marked as Critical"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Reorder</p>
                    <p className="text-sm text-gray-500">Automatically create purchase orders for low stock items</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.autoReorder}
                      onChange={(e) => handleChange('autoReorder', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end sticky bottom-6">
        <Button onClick={handleSave} size="lg">
          <Save size={18} className="mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
};