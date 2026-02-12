'use client';

import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all transform animate-in slide-in-from-right-full",
            toast.type === 'success' && "bg-green-500",
            toast.type === 'error' && "bg-red-500",
            toast.type === 'info' && "bg-blue-500"
          )}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
