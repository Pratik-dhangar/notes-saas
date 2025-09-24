import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, FileText, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { UpgradeBanner } from '../components/features/UpgradeBanner';
import { notesService } from '../services/notesService';
import { tenantService } from '../services/tenantService';
import type { Note, Tenant, NoteForm } from '../types';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
});

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tenantInfo, setTenantInfo] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesData, tenantData] = await Promise.all([
        notesService.getNotes(),
        tenantService.getTenantInfo(),
      ]);
      setNotes(notesData.notes);
      setTenantInfo(tenantData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: NoteForm) => {
    setIsSubmitting(true);
    try {
      if (editingNote) {
        const updatedNote = await notesService.updateNote(editingNote.id, data);
        setNotes(notes.map(note => 
          note.id === editingNote.id ? updatedNote : note
        ));
        setEditingNote(null);
      } else {
        const newNote = await notesService.createNote(data);
        setNotes([newNote, ...notes]);
        setShowCreateForm(false);
      }
      reset();
      setShowUpgradeBanner(false);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setShowUpgradeBanner(true);
      }
      console.error('Failed to save note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setValue('title', note.title);
    setValue('content', note.content);
    setShowCreateForm(true);
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesService.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleUpgradeSuccess = () => {
    setShowUpgradeBanner(false);
    fetchData(); // Refresh tenant info
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const isFreePlan = tenantInfo?.plan === 'FREE';
  const noteLimit = tenantInfo?.stats.noteLimit;
  const canCreateNotes = !isFreePlan || !noteLimit || notes.length < noteLimit;

  return (
    <DashboardLayout>
      {showUpgradeBanner && (
        <UpgradeBanner onUpgradeSuccess={handleUpgradeSuccess} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Notes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {notes.length}
                    {noteLimit && ` / ${noteLimit}`}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Plan
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tenantInfo?.plan}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Team Members
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tenantInfo?.stats.totalUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Note Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Your Notes</h2>
        <button
          onClick={() => {
            if (canCreateNotes) {
              setShowCreateForm(true);
              setEditingNote(null);
              reset();
            } else {
              setShowUpgradeBanner(true);
            }
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </button>
      </div>

      {/* Create/Edit Note Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                {...register('title')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter note title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                {...register('content')}
                rows={6}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter note content"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingNote(null);
                  reset();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingNote ? 'Update' : 'Create'} Note
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new note.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {note.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {note.content}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>By {note.author.email}</span>
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NotesPage;