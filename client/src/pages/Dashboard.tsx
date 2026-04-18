import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../services/firebase';
import { TaskForm } from '../components/TaskForm';
import { TaskCard } from '../components/TaskCard';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'done';
  userId: string;
  createdAt: any;
}

export const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(taskList);
    }, (err) => {
      console.error("Firestore error:", err);
      setError("Failed to load tasks. Check security rules.");
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTaskTitle.trim(),
        description: '',
        status: 'todo',
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewTaskTitle('');
    } catch (err: any) {
      console.error("Add task error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTask = async (id: string, currentStatus: string) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        status: currentStatus === 'todo' ? 'done' : 'todo',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Update task error:", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  const updateTask = async (id: string, newTitle: string) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        title: newTitle,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Update task title error:", err);
      throw err;
    }
  };

  return (
    <div className="space-y-8">
      <TaskForm 
        title={newTaskTitle} 
        setTitle={setNewTaskTitle} 
        onSubmit={addTask} 
        isSubmitting={isSubmitting} 
      />

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <p className="font-semibold mb-1">An error occurred</p>
            <p className="opacity-80">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your Tasks</h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl"
            >
              <p className="text-slate-400 font-medium italic">No tasks yet. Take a break or add one above!</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
                onUpdate={updateTask}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
