import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, options = {}) => {
    const id = Math.random().toString(36).slice(2);
    const { type = 'info', duration = 3000 } = options;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const api = useMemo(() => ({
    show,
    success: (msg, opts) => show(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => show(msg, { ...opts, type: 'error' }),
    info: (msg, opts) => show(msg, { ...opts, type: 'info' })
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[70] space-y-2 w-[calc(100%-2rem)] sm:w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'glass-strong rounded-xl px-4 py-3 shadow-lg animate-fade-in text-sm flex items-start space-x-3 border',
              t.type === 'success' && 'border-green-500/30 bg-green-500/10 text-green-300',
              t.type === 'error' && 'border-red-500/30 bg-red-500/10 text-red-300',
              t.type === 'info' && 'border-blue-500/30 bg-blue-500/10 text-blue-300'
            ].filter(Boolean).join(' ')}
          >
            <div className="pt-0.5">
              {t.type === 'success' ? '✅' : t.type === 'error' ? '⚠️' : 'ℹ️'}
            </div>
            <div className="flex-1">{t.message}</div>
            <button
              onClick={() => remove(t.id)}
              className="text-white/70 hover:text-white"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
