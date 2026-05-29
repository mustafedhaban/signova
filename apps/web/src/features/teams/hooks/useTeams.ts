import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ITeam } from '@signova/types';
import { API_BASE } from '@/lib/api';

const API_URL = `${API_BASE}/teams`;

export interface TeamWithCount extends ITeam {
  _count?: { signatures: number };
}

export const useTeams = () => {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery<TeamWithCount[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (newTeam: { name: string }) => {
      const response = await axios.post(API_URL, newTeam);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      await axios.delete(`${API_URL}/${teamId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['signatures'] });
    },
  });

  const importCsvMutation = useMutation({
    mutationFn: async ({ teamId, members }: { teamId: string; members: Record<string, string>[] }) => {
      const response = await axios.post(`${API_URL}/${teamId}/import`, { members });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['signatures'] });
    },
  });

  return {
    teams: teamsQuery.data ?? [],
    isLoading: teamsQuery.isLoading,
    createTeam: createTeamMutation.mutateAsync,
    deleteTeam: deleteTeamMutation.mutateAsync,
    importCsv: importCsvMutation.mutateAsync,
    isCreating: createTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
  };
};
