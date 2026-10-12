"use client";

import { CheckCircle2, X } from "lucide-react";

type FormSuccessDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export default function FormSuccessDialog({
  open,
  title,
  message,
  onClose,
}: FormSuccessDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-success-title"
        className="w-full max-w-[420px] rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          aria-label="Close success message"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mt-1 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={36} strokeWidth={2.4} />
        </div>

        <h2
          id="form-success-title"
          className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-slate-900"
        >
          {title}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-slate-600">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
