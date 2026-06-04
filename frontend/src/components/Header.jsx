import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag, User, LogOut, LogIn, LayoutDashboard,
  Menu, X, ChevronRight, ShoppingCart, Package, Settings,
  Shield, ChevronDown,
} from 'lucide-react';

const linkClass = ({ isActive }) =>
  `relative text-[11px] font-bold uppercase tracking-widest py-2 px-1 transition-all duration-300
  after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-3
  after:scale-x-0 after:bg-brand-500 after:transition-transform after:duration-300
  hover:after:scale-x-100 ${
    isActive ? 'text-brand-500 after:scale-x-100' : 'text-slate-600 hover:text-brand-500'
  }`;

function UserDropdown({ auth, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = auth.user.name
    ? auth.user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const menuItems = [
    { to: '/profile', label: 'Hồ sơ cá nhân', icon: <Settings size={14} /> },
    { to: '/orders', label: 'Đơn hàng của tôi', icon: <Package size={14} /> },
    { to: '/cart', label: 'Giỏ hàng', icon: <ShoppingCart size={14} /> },
    ...(auth.user.role === 'admin'
      ? [{ to: '/admin', label: 'Quản trị viên', icon: <Shield size={14} /> }]
      : []),
  ];

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-2.5 py-1.5 transition-all duration-200 group"
      >
        {/* Avatar circle */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-brand-500 to-amber-400 text-white text-[10px] font-extrabold shadow-sm">
          {initials}
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-slate-800 max-w-[80px] truncate leading-tight">
            {auth.user.name}
          </p>
          <p className="text-[9px] text-slate-400 leading-tight capitalize">
            {auth.user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
          </p>
        </div>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2.5 w-64 z-50 origin-top-right">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
            {/* Profile summary */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-brand-50 to-amber-50/40 border-b border-slate-100 px-4 py-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-amber-400 text-white text-sm font-extrabold shadow-md shadow-brand-500/20">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-900 truncate">{auth.user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{auth.user.email}</p>
                <span className={`inline-flex items-center mt-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  auth.user.role === 'admin'
                    ? 'bg-brand-100 text-brand-600'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {auth.user.role === 'admin' ? '⚡ Admin' : '✓ Khách hàng'}
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              {menuItems.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors group"
                >
                  <span className="text-slate-400 group-hover:text-brand-500 transition-colors">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 py-1.5">
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-semibold text-red-500 hover:bg-red-50 transition-colors group"
              >
                <LogOut size={14} className="text-red-400" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { auth, cartCount, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement bar */}
      <div className="bg-brand-500 text-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] lg:px-8">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-ping" />
            Miễn phí vận chuyển đơn hàng trên 500.000₫
          </span>
          <span className="hidden md:block text-white/90">Hotline: 028 3930 1234</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-3.5 lg:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group select-none shrink-0">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-amber-400 text-white shadow-md shadow-brand-500/25 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <ShoppingBag size={17} className="stroke-[2.5]" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-brand-500 transition-colors">
                VieShop
              </p>
              <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Premium Retailer
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" className={linkClass}>Trang chủ</NavLink>
            <NavLink to="/products" className={linkClass}>Sản phẩm</NavLink>
            {auth && (
              <NavLink to="/orders" className={linkClass}>Đơn hàng</NavLink>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="group relative flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-all duration-200 shadow-sm"
            >
              <ShoppingBag size={14} className="text-slate-500 group-hover:text-brand-500 transition" />
              <span className="hidden sm:inline text-[11px]">Giỏ hàng</span>
              <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-extrabold text-white shadow-sm transition group-hover:scale-110">
                {cartCount}
              </span>
            </button>

            {auth ? (
              /* User dropdown replaces old profile link */
              <UserDropdown auth={auth} logout={logout} />
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 rounded-full bg-brand-500 hover:bg-brand-600 px-4 py-2 text-[11px] font-bold text-white shadow-md shadow-brand-500/20 transition-all duration-200 hover:scale-[1.03]"
              >
                <LogIn size={13} />
                Đăng nhập
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-brand-500 transition-all"
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-5 space-y-1">
            {auth && (
              /* Mobile profile summary */
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-brand-50 to-amber-50/40 border border-brand-100/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-amber-400 text-white text-xs font-extrabold">
                  {auth.user.name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{auth.user.name}</p>
                  <p className="text-[10px] text-slate-500">{auth.user.email}</p>
                </div>
              </div>
            )}

            {[
              { to: '/', label: 'Trang chủ' },
              { to: '/products', label: 'Sản phẩm' },
              ...(auth ? [
                { to: '/profile', label: 'Hồ sơ' },
                { to: '/orders', label: 'Đơn hàng' },
                ...(auth.user.role === 'admin' ? [{ to: '/admin', label: 'Quản trị viên' }] : []),
              ] : []),
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-500'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-500'
                  }`
                }
              >
                {label}
                <ChevronRight size={13} className="opacity-40" />
              </NavLink>
            ))}

            <div className="pt-3 border-t border-slate-100">
              {auth ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-100 transition"
                >
                  <LogOut size={13} /> Đăng xuất
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-[11px] font-bold text-white"
                >
                  <LogIn size={13} /> Đăng nhập
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
