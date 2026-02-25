'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Transaction, TransactionCreateInput, TransactionFilters } from '@/types';

const TRANSACTIONS_KEY = 'transactions';

export const useTransactions = (filters?: TransactionFilters) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [TRANSACTIONS_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.accountId) params.append('accountId', filters.accountId.toString()); // number to string
      if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
      if (filters?.type) params.append('type', filters.type);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/transactions?${params.toString()}`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TransactionCreateInput) => {
      const response = await api.post('/transactions', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TransactionCreateInput> }) => {
      const response = await api.patch(`/transactions/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    transactions: data?.data || [],
    meta: data?.meta,
    isLoading,
    createTransaction: createMutation.mutateAsync,
    updateTransaction: updateMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};