import React, { useEffect } from 'react';
import { acquireScrollLock } from '../utils/scrollLock';

const ConfirmModal = ({ isOpen, title = 'Confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, loading = false }) => {
  useEffect(() => {
    if (!isOpen) return;
    const release = acquireScrollLock();
    return () => release();
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="glass-strong rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-display font-bold text-white">{title}</h3>
          <button onClick={onCancel} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all" aria-label="Close">✕</button>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-gray-300 text-sm sm:text-base">{message}</p>
        </div>
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <button onClick={onCancel} className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl w-full sm:w-auto">{cancelText}</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 sm:px-5 sm:py-2.5 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-xl disabled:opacity-60 w-full sm:w-auto">
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
