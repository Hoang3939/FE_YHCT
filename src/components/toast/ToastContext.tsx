'use client';

import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  position?: 'top-right' | 'bottom-right';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, position?: 'top-right' | 'bottom-right', duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'success',
    position: 'top-right' | 'bottom-right' = 'top-right',
    duration = 4000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, position, duration };
    
    setToasts((prev) => [...prev, toast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {/* Top Right */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-auto">
          {toasts
            .filter((t) => t.position === 'top-right' || !t.position)
            .map((toast) => (
              <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
        {/* Bottom Right */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-auto">
          {toasts
            .filter((t) => t.position === 'bottom-right')
            .map((toast) => (
              <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const styles = {
    success: 'bg-emerald-500 border-emerald-200 text-white',
    error: 'bg-red-500 border-red-200 text-white',
    info: 'bg-blue-500 border-blue-200 text-white',
    warning: 'bg-amber-500 border-amber-200 text-white',
  };

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xl animate-in slide-in-from-right fade-in duration-200 ${styles[toast.type]}`}
    >
      <div className="flex items-center gap-2">
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 opacity-70 hover:opacity-100"
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
