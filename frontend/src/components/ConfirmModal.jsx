export default function ConfirmModal({ open, title, description, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-md rounded-[28px] border border-slate-100 bg-white p-6 shadow-panel animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-full border border-slate-250 bg-white px-5 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 transition"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            className="rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-650 shadow-soft transition"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

