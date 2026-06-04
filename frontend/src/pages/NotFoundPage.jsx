import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-md rounded-[32px] border border-slate-200/80 bg-white p-12 text-center shadow-panel mt-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-6">
        <AlertCircle size={30} className="stroke-[1.5]" />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-red-500">Lỗi 404</p>
      <h1 className="mt-3 text-2xl font-extrabold text-slate-900">Trang không tồn tại</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">Đường dẫn bạn truy cập không hợp lệ hoặc nội dung đã bị thay đổi.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 hover:bg-brand-500 px-6 py-3 text-xs font-semibold text-white shadow-soft transition"
      >
        <Home size={14} />
        <span>Về trang chủ</span>
      </Link>
    </section>
  );
}

