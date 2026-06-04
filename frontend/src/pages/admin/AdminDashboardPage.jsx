import { useEffect, useState } from 'react';
import api, { authHeaders } from '../../api/http';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { Package, ShoppingBag, Users, TrendingUp, BarChart3 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { auth } = useApp();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard', authHeaders(auth.token)).then((response) => setStats(response.data));
  }, [auth.token]);

  const cards = [
    { label: 'Tổng sản phẩm', value: stats?.total_products ?? 0, icon: Package, color: 'text-blue-600 bg-blue-50/50 border-blue-200' },
    { label: 'Tổng đơn hàng', value: stats?.total_orders ?? 0, icon: ShoppingBag, color: 'text-amber-600 bg-amber-50/50 border-amber-200' },
    { label: 'Tổng người dùng', value: stats?.total_users ?? 0, icon: Users, color: 'text-purple-600 bg-purple-50/50 border-purple-200' },
    { label: 'Tổng doanh thu', value: formatCurrency(stats?.total_revenue ?? 0), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="grid gap-4 border-b border-slate-100 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Báo cáo tổng hợp</p>
            <h1 className="mt-1 text-xl font-extrabold text-slate-900">Tổng quan hoạt động</h1>
            <p className="mt-1.5 text-xs text-slate-500">
              Số liệu thống kê thực tế về các hoạt động bán hàng và đăng ký thành viên trên hệ thống.
            </p>
          </div>
          
          <div className="flex items-center gap-3 rounded-xl bg-slate-950 p-3.5 text-white select-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-brand-500">
              <BarChart3 size={16} />
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Doanh thu hiện tại</p>
              <p className="text-sm font-extrabold text-white mt-0.5">{cards[3].value}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-250 bg-white p-5 shadow-soft hover:-translate-y-0.5 hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Số liệu 0{index + 1}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${card.color}`}>
                  <IconComponent size={14} />
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-500">{card.label}</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}


