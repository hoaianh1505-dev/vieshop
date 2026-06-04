import { Link } from 'react-router-dom';
import {
  Smartphone, Tablet, Headphones, Camera,
  ShieldCheck, Truck, Clock, Tag, Flame,
  Star, Gift, Phone, Zap,
} from 'lucide-react';

const categories = [
  { to: '/products?category=smartphones', label: 'Điện thoại', icon: <Smartphone size={14} />, color: 'text-indigo-500 bg-indigo-50' },
  { to: '/products?category=tablets', label: 'Máy tính bảng', icon: <Tablet size={14} />, color: 'text-pink-500 bg-pink-50' },
  { to: '/products?category=audio', label: 'Âm thanh', icon: <Headphones size={14} />, color: 'text-orange-500 bg-orange-50' },
  { to: '/products?category=accessories', label: 'Phụ kiện', icon: <Camera size={14} />, color: 'text-teal-500 bg-teal-50' },
];

const guarantees = [
  { icon: <ShieldCheck size={13} />, text: '100% Chính Hãng' },
  { icon: <Truck size={13} />, text: 'Giao Hàng Hỏa Tốc' },
  { icon: <Clock size={13} />, text: 'Bảo Hành 12 Tháng' },
];

export function LeftSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-5 w-52 shrink-0 sticky top-[88px] self-start max-h-[calc(100vh-100px)] overflow-y-auto pb-4">
      {/* Category nav */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <Tag size={13} className="text-brand-500" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">Danh mục</span>
        </div>
        <ul className="py-1.5">
          {categories.map(({ to, label, icon, color }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors group"
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${color} transition-transform group-hover:scale-110`}>
                  {icon}
                </span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Guarantee badges */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Cam kết</p>
        {guarantees.map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-xs text-slate-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
              {icon}
            </span>
            {text}
          </div>
        ))}
      </div>

      {/* Hotline card */}
      <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-amber-50/60 p-4 space-y-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20">
          <Phone size={14} />
        </div>
        <p className="text-[11px] font-extrabold text-slate-800">Cần tư vấn?</p>
        <p className="text-xs text-slate-500 leading-relaxed">Gọi ngay để được hỗ trợ chọn máy miễn phí</p>
        <p className="text-sm font-extrabold text-brand-500">028 3930 1234</p>
      </div>
    </aside>
  );
}

const hotDeals = [
  {
    name: 'iPhone 17 Pro Max',
    badge: 'Hot 🔥',
    badgeColor: 'bg-red-100 text-red-600',
    discount: '-12%',
    stars: 5,
  },
  {
    name: 'Samsung Galaxy S26',
    badge: 'Mới',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    discount: '-8%',
    stars: 5,
  },
  {
    name: 'DJI Osmo Pocket 3',
    badge: 'Yêu thích',
    badgeColor: 'bg-blue-100 text-blue-600',
    discount: '-5%',
    stars: 4,
  },
];

export function RightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-5 w-52 shrink-0 sticky top-[88px] self-start max-h-[calc(100vh-100px)] overflow-y-auto pb-4">
      {/* Hot Deals */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <Flame size={13} className="text-brand-500" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">Hot Deals</span>
        </div>
        <ul className="divide-y divide-slate-100">
          {hotDeals.map(({ name, badge, badgeColor, discount, stars }) => (
            <li key={name}>
              <Link
                to="/products"
                className="flex flex-col gap-1.5 px-4 py-3 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                  <span className="text-[10px] font-extrabold text-brand-500">{discount}</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-700 group-hover:text-brand-500 transition-colors leading-snug line-clamp-2">
                  {name}
                </p>
                <div className="flex items-center gap-0.5">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} size={9} className="fill-amber-400 text-amber-400" />
                  ))}
                  {[...Array(5 - stars)].map((_, i) => (
                    <Star key={i} size={9} className="text-slate-200" />
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2.5 border-t border-slate-100">
          <Link to="/products" className="text-[11px] font-bold text-brand-500 hover:text-brand-600 transition-colors">
            Xem tất cả ưu đãi →
          </Link>
        </div>
      </div>

      {/* Promo code */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 space-y-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
          <Gift size={14} />
        </div>
        <p className="text-[11px] font-extrabold text-slate-800">Mã giảm giá hôm nay</p>
        <div className="rounded-xl border-2 border-dashed border-amber-300 bg-white py-2.5 text-center">
          <p className="text-base font-extrabold tracking-widest text-brand-500">VIE15</p>
          <p className="text-[10px] text-slate-500">Giảm 15% toàn bộ đơn hàng</p>
        </div>
        <p className="text-[10px] text-slate-400">Áp dụng cho đơn từ 2 triệu đồng</p>
      </div>

      {/* Flash sale countdown */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Zap size={13} className="text-brand-500" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">Flash Sale</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">Ưu đãi sốc kết thúc sau</p>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {[{ v: '08', l: 'Giờ' }, { v: '24', l: 'Phút' }, { v: '37', l: 'Giây' }].map(({ v, l }) => (
            <div key={l} className="rounded-lg bg-slate-950 text-white py-2">
              <p className="text-base font-extrabold">{v}</p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">{l}</p>
            </div>
          ))}
        </div>
        <Link
          to="/products"
          className="flex w-full items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 py-2 text-[11px] font-bold text-white transition"
        >
          Mua ngay kẻo lỡ
        </Link>
      </div>
    </aside>
  );
}
