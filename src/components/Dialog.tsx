'use client';

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

/** Native modal dialog: focus trapping, Escape and the backdrop come from the browser. */
export default function Dialog({ open, onClose, labelledBy, children, className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === ref.current) onClose();
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100%-2rem))] overflow-y-auto rounded-3xl bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/45 backdrop:backdrop-blur-[2px] open:animate-pop-in ${className}`}
    >
      {open && children}
    </dialog>
  );
}
