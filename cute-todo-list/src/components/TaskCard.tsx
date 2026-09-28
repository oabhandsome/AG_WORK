import React from 'react';
import { Button } from './ui/Button';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  isLoading?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete, isLoading }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-pastel-blue text-blue-800',
    medium: 'bg-pastel-yellow text-yellow-800',
    high: 'bg-pastel-pink text-pink-800',
  };

  return (
    <div className={`p-4 cute-border card-shadow bg-white flex flex-col gap-3 transition-opacity ${task.completed ? 'opacity-60' : 'opacity-100'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={() => onToggleComplete(task.id)}
            disabled={isLoading}
            className="w-5 h-5 accent-pastel-pink cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-text-light' : 'text-text-dark'}`}>
            {task.title}
          </h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-bold ${priorityColors[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
      </div>
      
      {task.description && (
        <p className={`text-sm ml-8 ${task.completed ? 'line-through text-text-light' : 'text-gray-600'}`}>
          {task.description}
        </p>
      )}
      
      {task.dueDate && (
        <p className="text-xs text-text-light ml-8">
          Due: {(() => {
            const [year, month, day] = task.dueDate.split('-');
            return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
          })()}
        </p>
      )}
      
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="ghost" className="text-sm px-3 py-1" onClick={() => onEdit(task.id)} disabled={isLoading}>Edit</Button>
        <Button variant="danger" className="text-sm px-3 py-1" onClick={() => onDelete(task.id)} disabled={isLoading}>
          {isLoading ? 'Wait...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}
