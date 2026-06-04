import { ShoppingBag, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-900 bg-slate-950 text-slate-400 select-none">
      <div className="mx-auto max-w-[1240px] px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Branding & Intro */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white shadow-md shadow-brand-500/10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <ShoppingBag size={18} className="stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold text-white group-hover:text-brand-400 transition-colors tracking-tight">VieShop</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              Trang bán lẻ trực tuyến cao cấp, vận hành minh bạch và chuyên nghiệp. Nơi mua sắm thiết bị công nghệ tin cậy của mọi gia đình.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-450 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all duration-300" title="Facebook">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-450 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all duration-300" title="Youtube">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.626-.246-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-450 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all duration-300" title="Instagram">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-brand-500 pl-3">Liên Kết Nhanh</h3>
            <ul className="mt-5 space-y-3.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-400 transition-colors">Danh sách sản phẩm</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-400 transition-colors">Giỏ hàng</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-400 transition-colors">Hồ sơ cá nhân</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-brand-500 pl-3">Thông Tin Liên Hệ</h3>
            <ul className="mt-5 space-y-4 text-xs text-slate-400">
              <li className="flex items-start gap-3.5">
                <MapPin size={15} className="mt-0.5 text-brand-400 shrink-0" />
                <span className="leading-relaxed">123 Đường Cách Mạng Tháng Tám, Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3.5">
                <Phone size={15} className="text-brand-400 shrink-0" />
                <span>+84 (28) 3930 1234</span>
              </li>
              <li className="flex items-center gap-3.5">
                <Mail size={15} className="text-brand-400 shrink-0" />
                <span>support@vieshop.vn</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-brand-500 pl-3">Bản Tin</h3>
            <p className="mt-5 text-xs text-slate-550 leading-relaxed">
              Đăng ký để nhận các chương trình ưu đãi và thông tin sản phẩm mới nhất từ chúng tôi.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900/50 transition-all duration-200"
              />
              <button className="hover-shine rounded-xl bg-brand-500 hover:bg-brand-650 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/10 transition-all">
                Gửi
              </button>
            </form>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-16 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-650">
          <p>© {new Date().getFullYear()} VieShop. Tất cả các quyền được bảo lưu. Thiết kế giao diện cao cấp.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-500">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-slate-500">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
