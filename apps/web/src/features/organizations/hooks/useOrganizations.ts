import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1/organizations';

export interface OrgMember {
  id: string;
  role: 'owner' | 'admin' | 'member';
  user: { id: string; name: string; email: string; avatarUrl?: string };
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  fontSize?: string;
  website?: string;
  members: OrgMember[];
  _count?: { members: number };
  createdAt: string;
}

export const useOrganizations = () => {
  const queryClient = useQueryClient();

  const orgsQuery = useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: async () => (await axios.get(API)).data,
  });

  const createOrg = useMutation({
    mutationFn: async (data: { name: string; slug: string }) =>
      (await axios.post(API, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizations'] }),
  });

  const updateOrg = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; logoUrl?: string; primaryColor?: string; website?: string }) =>
      (await axios.patch(`${API}/${id}`, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizations'] }),
  });

  const deleteOrg = useMutation({
    mutationFn: async (id: string) => axios.delete(`${API}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizations'] }),
  });

  const inviteMember = useMutation({
    mutationFn: async ({ orgId, email, role }: { orgId: string; email: string; role: string }) =>
      (await axios.post(`${API}/${orgId}/members`, { email, role })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizations'] }),
  });

  const removeMember = useMutation({
    mutationFn: async ({ orgId, memberId }: { orgId: string; memberId: string }) =>
      axios.delete(`${API}/${orgId}/members/${memberId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizations'] }),
  });

  const updateBranding = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; logoUrl?: string; bannerUrl?: string; primaryColor?: string; secondaryColor?: string; fontFamily?: string; fontSize?: string }) =>
      (await axios.patch(`${API}/${id}/branding`, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizations'] }),
  });

  return {
    organizations: orgsQuery.data ?? [],
    isLoading: orgsQuery.isLoading,
    createOrg: createOrg.mutate,
    updateOrg: updateOrg.mutate,
    deleteOrg: deleteOrg.mutate,
    inviteMember: inviteMember.mutate,
    removeMember: removeMember.mutate,
    updateBranding: updateBranding.mutate,
  };
};
