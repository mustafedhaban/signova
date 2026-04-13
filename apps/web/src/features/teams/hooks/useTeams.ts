import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ITeam } from '@signova/types';

const API_URL = 'http://localhost:3000/api/v1/teams';

export const useTeams = () => {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery<ITeam[]>({
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

  const importCsvMutation = useMutation({
    mutationFn: async ({ teamId, members }: { teamId: string, members: any[] }) => {
      const response = await axios.post(`${API_URL}/${teamId}/import`, { members });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signatures'] });
    },
  });

  return {
    teams: teamsQuery.data ?? [],
    isLoading: teamsQuery.isLoading,
    createTeam: createTeamMutation.mutateAsync,
    importCsv: importCsvMutation.mutateAsync,
  };
};
