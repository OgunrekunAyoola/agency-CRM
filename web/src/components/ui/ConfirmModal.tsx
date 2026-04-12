'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

/**
 * Accessible confirmation dialog for destructive or irreversible actions.
 *
 * Usage:
 *   <ConfirmModal
 *     isOpen={isDeleteOpen}
 *     onClose={() => setIsDeleteOpen(false)}
 *     onConfirm={handleDelete}
 *     title="Delete Client"
 *     description="This will permanently remove the client and all associated data. This cannot be undone."
 *     confirmLabel="Delete"
 *     isDestructive
 *     isLoading={isDeleting}
 *   />
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}: ConfirmModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open (safer default focus for destructive dialogs)
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => cancelRef.current?.focus());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="relative w-full max-w-md bg-background rounded-xl shadow-2xl border border-border p-6 focus:outline-none"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0
            ${isDestructive ? 'bg-destructive/10' : 'bg-amber-100'}`}>
            <AlertTriangle className={`h-5 w-5 ${isDestructive ? 'text-destructive' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="confirm-title" className="text-base font-semibold leading-6">
              {title}
            </h2>
            <p id="confirm-description" className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground
              hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Cancel and close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 justify-end">
          <Button ref={cancelRef} variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            aria-busy={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
