import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ISignature } from '@signova/types';

const API_URL = 'http://localhost:3000/api/v1/signatures';

export const useSignatures = () => {
  const queryClient = useQueryClient();

  const signaturesQuery = useQuery<ISignature[]>({
    queryKey: ['signatures'],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
  });

  const createSignatureMutation = useMutation({
    mutationFn: async (newSignature: Partial<ISignature>) => {
      const response = await axios.post(API_URL, newSignature);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signatures'] });
    },
  });

  const deleteSignatureMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signatures'] });
    },
  });

  return {
    signatures: signaturesQuery.data ?? [],
    isLoading: signaturesQuery.isLoading,
    isError: signaturesQuery.isError,
    createSignature: createSignatureMutation.mutate,
    deleteSignature: deleteSignatureMutation.mutate,
  };
};
