import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertCircle, CheckCircle, Save, Database } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/AuthContext';

export const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    lowStockThreshold: '20',
    criticalStockThreshold: '10',
  });

  // Fetch user settings from Supabase
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('low_stock_threshold, critical_stock_threshold')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings({
          lowStockThreshold: data.low_stock_threshold?.toString() || '20',
          criticalStockThreshold: data.critical_stock_threshold?.toString() || '10',
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const settingsData = {
        user_id: user.id,
        low_stock_threshold: parseInt(settings.lowStockThreshold),
        critical_stock_threshold: parseInt(settings.criticalStockThreshold),
        updated_at: new Date(),
      };

      // Check if settings exist
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let error;
      if (existingSettings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('user_settings')
          .update(settingsData)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert([settingsData]);
        error = insertError;
      }

      if (error) throw error;

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Configure your inventory thresholds</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save size={18} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={18} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="text-green-500 mt-0.5" size={18} />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Stock Threshold Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database size={20} className="text-gray-500" />
            Stock Threshold Settings
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Low Stock Threshold"
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
              helper="Products below this quantity are marked as Low"
              min="1"
            />
            <Input
              label="Critical Stock Threshold"
              type="number"
              value={settings.criticalStockThreshold}
              onChange={(e) => handleChange('criticalStockThreshold', e.target.value)}
              helper="Products below this quantity are marked as Critical"
              min="1"
            />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Products with stock below the critical threshold will be highlighted in red, 
              while products between critical and low threshold will be highlighted in yellow.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};