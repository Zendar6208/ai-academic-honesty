import React, { useEffect, useRef } from 'react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Focus confirmation button when modal opens, handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div 
        className="w-full max-w-md bg-[#050807] border-2 border-[#00FF88]/40 rounded-xl p-6 shadow-[0_0_35px_rgba(0,255,136,0.18)] relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#071A10] border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] text-lg font-mono">
            ↺
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#00FF88] tracking-widest uppercase">
              SESSION MANAGEMENT
            </span>
            <h3 id="modal-title" className="text-lg font-display font-bold text-[#E4F0E8]">
              Start New Visitor Session?
            </h3>
          </div>
        </div>

        <p className="text-sm text-[#87968D] mb-6 leading-relaxed">
          Current progress, answers, and points earned will be completely cleared so the next exhibition visitor can start fresh from Exhibit 01.
        </p>

        <div className="flex items-center justify-end gap-3 font-mono text-xs">
          <button
            onClick={onCancel}
            type="button"
            className="px-4 py-2.5 rounded-lg border border-white/20 text-[#87968D] hover:text-[#E4F0E8] hover:border-white/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88]"
          >
            CANCEL
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            type="button"
            className="px-5 py-2.5 rounded-lg bg-[#00FF88] text-[#050807] font-bold hover:bg-[#8AFFB2] transition-colors shadow-[0_0_15px_rgba(0,255,136,0.3)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88] active:scale-95"
          >
            RESET SESSION →
          </button>
        </div>
      </div>
    </div>
  );
};
