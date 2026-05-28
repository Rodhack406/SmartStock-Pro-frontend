import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody } from '../components/ui/Card';
import { 
  Package, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 overflow-hidden">
          {/* Logo and Brand */}
          <div className="text-center mt-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-lg">
              <Package className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SmartStock Pro</h1>
            <p className="text-gray-500 mt-1">Inventory Management System</p>
          </div>
          
          <div className="p-6 md:p-8">
            {/* Welcome Message */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-500 mt-1">Sign in to access your dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-red-700 font-medium">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail size={18} />}
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<Lock size={18} />}
                    required
                    className="rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Min. 6 characters</p>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  onClick={() => alert('Password reset link will be sent to your email')}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                className="mt-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign In
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
              <div className="flex justify-center gap-4 text-xs">
                <code className="px-2 py-1 bg-white rounded text-gray-600">gorette@smartstockpro.com</code>
                <code className="px-2 py-1 bg-white rounded text-gray-600">Admin@Smart</code>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};