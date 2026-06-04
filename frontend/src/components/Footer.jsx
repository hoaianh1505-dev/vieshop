import { ShoppingBag, Mail, Phone, MapPin, ArrowUpRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  shop: [
    { to: '/', label: 'Trang chủ' },
    { to: '/products', label: 'Tất cả sản phẩm' },
    { to: '/cart', label: 'Giỏ hàng' },
    { to: '/orders', label: 'Đơn hàng của tôi' },
  ],
  support: [
    { to: '/profile', label: 'Hồ sơ cá nhân' },
    { to: '#', label: 'Chính sách hoàn trả' },
    { to: '#', label: 'Bảo hành sản phẩm' },
    { to: '#', label: 'Hướng dẫn mua hàng' },
  ],
};

const SocialIcon = ({ href, title, children }) => (
  <a
    href={href}
    title={title}
    className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-brand-500/20"
  >
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="mt-24 bg-slate-50 text-slate-500 select-none border-t border-slate-200">

      {/* Top gradient accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

      <div className="mx-auto max-w-[1240px] px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: Brand */}
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-amber-400 text-white shadow-md shadow-brand-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <ShoppingBag size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900 group-hover:text-brand-500 transition-colors tracking-tight">
                  VieShop
                </p>
                <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Premium Retailer
                </p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-500">
              Trang thương mại điện tử cao cấp, chuyên phân phối thiết bị công nghệ chính hãng. Mua sắm tin cậy — giao hàng nhanh chóng.
            </p>

            <div className="flex items-center gap-2">
              <SocialIcon href="#" title="Facebook">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" title="Youtube">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.626-.246-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" title="Instagram">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" title="TikTok">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Column 2: Shop links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2 mb-6">
              <span className="h-3 w-0.5 rounded-full bg-brand-500" />
              Mua sắm
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-500 transition-colors duration-200"
                  >
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2 mb-6">
              <span className="h-3 w-0.5 rounded-full bg-brand-500" />
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 border border-brand-100">
                  <MapPin size={12} />
                </div>
                <span className="text-xs text-slate-500 leading-relaxed">
                  123 Đường Cách Mạng Tháng Tám,<br />Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 border border-brand-100">
                  <Phone size={12} />
                </div>
                <span className="text-xs text-slate-500">+84 (28) 3930 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 border border-brand-100">
                  <Mail size={12} />
                </div>
                <span className="text-xs text-slate-500">support@vieshop.vn</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2 mb-6">
              <span className="h-3 w-0.5 rounded-full bg-brand-500" />
              Đăng ký nhận tin
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Nhận ngay ưu đãi độc quyền và thông tin sản phẩm mới nhất từ VieShop.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2.5">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all duration-200"
              />
              <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/15 transition-all duration-200 hover:scale-[1.02]">
                <Send size={12} />
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} VieShop. Tất cả các quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6 text-[10px] text-slate-400">
            <a href="#" className="hover:text-brand-500 transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
