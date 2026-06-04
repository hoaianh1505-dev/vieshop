import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="flex items-center gap-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-650 transition disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} />
        <span>Trước</span>
      </button>
      
      <span className="text-xs font-semibold text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full">
        Trang {page} / {totalPages}
      </span>
      
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="flex items-center gap-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-650 transition disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
      >
        <span>Sau</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

