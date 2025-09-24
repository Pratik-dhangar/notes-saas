import apiClient from '../lib/api';
import type { LoginForm, RegisterForm, LoginResponse } from '../types';

export const authService = {
  login: async (data: LoginForm): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterForm): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  acceptInvite: async (token: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post(`/api/accept/${token}`, { password });
    return response.data;
  },
};