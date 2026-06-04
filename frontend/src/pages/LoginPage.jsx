import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/http';
import { useApp } from '../context/AppContext';
import { Mail, KeyRound, LogIn, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, pushToast } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/login', form);
      setAuth(response.data);
      pushToast('Đăng nhập thành công');
      navigate(response.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-4 md:p-8 relative overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 select-none">
      {/* Background gradients */}
      <div className="absolute -left-48 -bottom-48 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -right-48 -top-48 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Back to store button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-white/5 border border-white/10 rounded-full px-4.5 py-2 backdrop-blur-md hover:bg-white/10"
      >
        <ArrowLeft size={14} />
        <span>Quay lại cửa hàng</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white shadow-lg shadow-brand-500/20 transform transition hover:scale-105 hover:rotate-3">
            <ShoppingBag size={22} className="stroke-[2.5]" />
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-white tracking-tight">Đăng nhập VieShop</h1>
          <p className="mt-2 text-xs text-slate-400">Trải nghiệm không gian mua sắm công nghệ cao cấp</p>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl relative">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Địa chỉ Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-500 focus:bg-white/10 transition"
                  placeholder="name@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mật khẩu</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-500 focus:bg-white/10 transition"
                  placeholder="••••••••"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {error ? <p className="text-xs font-semibold text-red-400">{error}</p> : null}
            
            <button className="hover-shine w-full rounded-full bg-brand-500 hover:bg-brand-600 py-3.5 text-center text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all duration-200 mt-2 flex items-center justify-center gap-2">
              <LogIn size={14} />
              <span>Đăng nhập ngay</span>
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-slate-450">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-brand-400 hover:text-brand-300 transition hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
