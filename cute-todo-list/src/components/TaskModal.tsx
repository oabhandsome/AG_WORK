import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Task } from './TaskCard';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id'>) => Promise<void>;
  initialData?: Task | null;
  isLoading?: boolean;
  error?: string | null;
}

export function TaskModal({ isOpen, onClose, onSave, initialData, isLoading, error: externalError }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
    setLocalError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!title.trim()) {
      setLocalError("Title cannot be empty.");
      return;
    }
    
    if (title.length > 50) {
      setLocalError("Title is too long! Max 50 characters.");
      return;
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
      setLocalError("Invalid priority!");
      return;
    }

    await onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      completed: initialData ? initialData.completed : false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full card-shadow cute-border relative">
        <h2 className="text-2xl font-bold text-text-dark mb-4">
          {initialData ? 'Edit Task ✨' : 'New Task ✨'}
        </h2>
        
        {(localError || externalError) && (
          <div className="w-full bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-200">
            {localError || externalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Title" 
            required 
            value={title} 
            maxLength={50}
            onChange={e => setTitle(e.target.value)} 
            placeholder="What needs to be done? (Max 50 chars)"
          />
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-dark">Description</label>
            <textarea
              className="px-4 py-2 border-2 border-pastel-purple focus:border-purple-400 bg-white rounded-xl focus:outline-none transition-colors duration-200 resize-none h-24"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add some details... (optional)"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-dark">Priority</label>
            <select
              className="px-4 py-2 border-2 border-pastel-purple focus:border-purple-400 bg-white rounded-xl focus:outline-none transition-colors duration-200"
              value={priority}
              onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Input 
            label="Due Date (optional)" 
            type="date" 
            value={dueDate} 
            onChange={e => setDueDate(e.target.value)} 
          />
          
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? 'Saving...' : 'Save Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
