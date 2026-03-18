import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/supabase';

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  const createProduct = useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, ...updates }) => api.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  return {
    products,
    isLoading,
    error,
    createProduct: createProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
  };
};