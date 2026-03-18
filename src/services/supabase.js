import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export const TABLES = {
  PRODUCTS: 'products',
  SALES: 'sales',
  INVENTORY: 'inventory',
};

// API helpers
export const api = {
  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createProduct(product) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .insert([{ ...product, created_at: new Date() }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from(TABLES.PRODUCTS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Sales
  async getSales() {
    const { data, error } = await supabase
      .from(TABLES.SALES)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createSale(sale) {
    const { data, error } = await supabase
      .from(TABLES.SALES)
      .insert([{ ...sale, created_at: new Date() }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Inventory
  async getInventory() {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateInventory(id, updates) {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .update({ ...updates, last_updated: new Date() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
};