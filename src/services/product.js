import { supabase } from "./supabase";

// Product API functions
export const productApi = {
  async getProducts(userId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateProduct(id, userId, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteProduct(id, userId) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  async getProductsByCategory(userId, category) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getLowStockProducts(userId, threshold = 20) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .lt('stock', threshold)
      .order('stock', { ascending: true });
    
    if (error) throw error;
    return data;
  },
};