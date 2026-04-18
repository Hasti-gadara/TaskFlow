import { useState } from 'react';
import { Trash2, CheckCircle2, Circle, Pencil, X, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'done';
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => Promise<void>;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (editedTitle.trim() === '' || editedTitle === task.title) {
      setIsEditing(false);
      setEditedTitle(task.title);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(task.id, editedTitle.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-slate-300 ${
        task.status === 'done' ? 'bg-slate-50/50 opacity-75' : ''
      }`}
    >
      <button 
        onClick={() => onToggle(task.id, task.status)}
        disabled={isEditing}
        className={`shrink-0 transition-transform active:scale-90 ${
          task.status === 'done' ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'
        } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {task.status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </button>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-base font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button onClick={handleSave} disabled={isUpdating} className="p-1 text-green-600 hover:bg-green-50 rounded-md">
              <Check className="w-5 h-5" />
            </button>
            <button onClick={handleCancel} disabled={isUpdating} className="p-1 text-slate-400 hover:bg-slate-100 rounded-md">
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <p className={`text-base font-semibold truncate transition-all ${
            task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}>
            {task.title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all active:scale-90"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
