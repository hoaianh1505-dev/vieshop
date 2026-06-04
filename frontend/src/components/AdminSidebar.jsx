import { NavLink } from 'react-router-dom';
import { BarChart3, Package, ShoppingBag, Users, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/admin', label: 'Bảng điều khiển', icon: BarChart3, end: true },
  { to: '/admin/products', label: 'Quản lý sản phẩm', icon: Package },
  { to: '/admin/orders', label: 'Quản lý đơn hàng', icon: ShoppingBag },
  { to: '/admin/users', label: 'Quản lý người dùng', icon: Users },
];

export default function AdminSidebar({ onClose }) {
  const { auth } = useApp();

  return (
    <aside className="flex flex-col h-full bg-slate-950 text-white border-r border-slate-900 select-none">
      {/* Sidebar Header / Branding */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              VieShop Admin
            </h2>
            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-400 block mt-0.5">
              Hệ thống vận hành
            </span>
          </div>
        </div>

        {/* Close Button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              end={item.end}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <IconComponent size={16} className="shrink-0" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile Footer inside Sidebar */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/50">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-slate-900 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 font-extrabold text-sm border border-brand-500/20 shrink-0">
            {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-200">
              {auth?.user?.name || 'Administrator'}
            </p>
            <p className="truncate text-[10px] text-slate-500 font-semibold mt-0.5">
              {auth?.user?.email || 'admin@vieshop.com'}
            </p>
          </div>
        </div>
        <div className="mt-3 text-center text-[9px] font-semibold uppercase tracking-widest text-slate-600">
          VieShop Admin v1.0
        </div>
      </div>
    </aside>
  );
}


