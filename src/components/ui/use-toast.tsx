// ShadCN use-toast utility (simplified)
import { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toast: (toast: Toast) => void;
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

  const toast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  // Expose toast globally for compatibility with the toast() import
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__TOAST__ = toast;
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t, i) => (
          <div
            key={i}
            className={`rounded px-4 py-2 shadow-lg text-white ${
              t.variant === 'destructive' ? 'bg-red-500' : 'bg-neutral-800'
            }`}
          >
            <div className="font-bold">{t.title}</div>
            {t.description && <div className="text-sm">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Re-export for compatibility
export const toast = (toast: Toast) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__TOAST__?.(toast);
  }
}; 