import apiClient from '../lib/api';
import type { Tenant, User, Invitation, InviteForm } from '../types';

export const tenantService = {
  getTenantInfo: async (): Promise<Tenant> => {
    const response = await apiClient.get('/api/tenant/info');
    return response.data;
  },

  upgradeTenant: async (slug: string): Promise<{ message: string; tenant: any }> => {
    const response = await apiClient.post(`/tenants/${slug}/upgrade`);
    return response.data;
  },

  getTenantUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/api/tenant/users');
    return response.data;
  },

  inviteUser: async (data: InviteForm): Promise<{ message: string; invitation: any }> => {
    const response = await apiClient.post('/api/invite', data);
    return response.data;
  },

  getInvitations: async (): Promise<Invitation[]> => {
    const response = await apiClient.get('/api/invitations');
    return response.data;
  },
};