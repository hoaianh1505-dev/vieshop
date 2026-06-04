import { useEffect, useState } from 'react';
import api, { authHeaders } from '../api/http';
import { useApp } from '../context/AppContext';
import { User, Phone, MapPin, Mail, ShieldAlert } from 'lucide-react';

export default function ProfilePage() {
  const { auth, pushToast, setAuth } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    api.get('/auth/profile', authHeaders(auth.token)).then((response) => {
      setForm({
        name: response.data.name || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
      });
    });
  }, [auth.token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.put(`/users/${auth.user.id}`, form, authHeaders(auth.token));
    setAuth({ ...auth, user: { ...auth.user, ...form } });
    pushToast('Cập nhật hồ sơ thành công');
  };

  return (
    <section className="mx-auto max-w-2xl rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-panel">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-650">
          <User size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Hồ sơ cá nhân</h1>
          <p className="text-xs text-slate-400">Quản lý thông tin tài khoản của bạn</p>
        </div>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {/* Read-only Account Info */}
        <div className="grid gap-4 sm:grid-cols-2 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <Mail size={14} className="text-slate-400" />
            <div>
              <span className="block font-medium">Email tài khoản</span>
              <span className="font-bold text-slate-700">{auth?.user?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <ShieldAlert size={14} className="text-slate-400" />
            <div>
              <span className="block font-medium">Vai trò hệ thống</span>
              <span className="font-bold text-slate-700 capitalize">
                {auth?.user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
              </span>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <User size={13} className="text-slate-400" />
              <span>Họ và tên</span>
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
              placeholder="Họ và tên của bạn..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Phone size={13} className="text-slate-400" />
              <span>Số điện thoại</span>
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
              placeholder="Số điện thoại của bạn..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400" />
              <span>Địa chỉ liên hệ</span>
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
              rows="3"
              placeholder="Địa chỉ giao nhận hàng mặc định..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>
        </div>

        <button className="w-full rounded-full bg-brand-500 hover:bg-brand-650 py-3.5 text-center text-sm font-semibold text-white shadow-soft transition duration-200">
          Lưu thông tin
        </button>
      </form>
    </section>
  );
}

