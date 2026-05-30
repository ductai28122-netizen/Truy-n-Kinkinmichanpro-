import { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            let bgColor = 'bg-zinc-900 border-zinc-800';
            let icon = <Info className="w-5 h-5 text-purple-400" />;
            
            if (toast.type === 'success') {
              bgColor = 'bg-zinc-900 border-emerald-500/30';
              icon = <CheckCircle className="w-5 h-5 text-emerald-400" />;
            } else if (toast.type === 'error') {
              bgColor = 'bg-zinc-900 border-rose-500/30';
              icon = <AlertCircle className="w-5 h-5 text-rose-400" />;
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`flex items-start justify-between p-4 rounded-xl border ${bgColor} shadow-lg backdrop-blur-md text-white`}
              >
                <div id={`toast-content-${toast.id}`} className="flex items-center gap-3">
                  <div className="flex-shrink-0">{icon}</div>
                  <p className="text-sm font-medium pr-2 text-zinc-100">{toast.message}</p>
                </div>
                <button
                  id={`toast-close-${toast.id}`}
                  onClick={() => removeToast(toast.id)}
                  className="text-zinc-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
