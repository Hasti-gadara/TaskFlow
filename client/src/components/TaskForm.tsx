import { Plus, Loader2 } from 'lucide-react';

interface TaskFormProps {
  title: string;
  setTitle: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ title, setTitle, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={onSubmit} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Plus className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write a new task..."
        disabled={isSubmitting}
        className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
      />
      <div className="absolute inset-y-0 right-0 p-2 flex items-center">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Task'}
        </button>
      </div>
    </form>
  );
};
