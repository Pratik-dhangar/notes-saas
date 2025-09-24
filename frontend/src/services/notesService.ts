import apiClient from '../lib/api';
import type { Note, NotesResponse, NoteForm } from '../types';

export const notesService = {
  getNotes: async (page = 1, limit = 10): Promise<NotesResponse> => {
    const response = await apiClient.get('/api/notes', {
      params: { page, limit }
    });
    return response.data;
  },

  getNote: async (id: string): Promise<Note> => {
    const response = await apiClient.get(`/api/notes/${id}`);
    return response.data;
  },

  createNote: async (data: NoteForm): Promise<Note> => {
    const response = await apiClient.post('/api/notes', data);
    return response.data;
  },

  updateNote: async (id: string, data: NoteForm): Promise<Note> => {
    const response = await apiClient.put(`/api/notes/${id}`, data);
    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/notes/${id}`);
  },
};