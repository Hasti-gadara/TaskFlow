import { ClipboardList } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="text-center py-20 px-4">
      <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <ClipboardList className="w-10 h-10 text-blue-600" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Welcome to TaskFlow</h2>
      <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
        Your modern dashboard for simple and efficient task management. 
        Sign in with Google to start organizing your life.
      </p>
      <button 
        onClick={onLogin}
        className="inline-flex items-center gap-3 bg-white border border-slate-200 px-8 py-3 rounded-full text-base font-bold shadow-md hover:shadow-lg hover:border-blue-200 transition-all active:scale-95 group text-slate-700"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Continue with Google
      </button>
    </div>
  );
};
