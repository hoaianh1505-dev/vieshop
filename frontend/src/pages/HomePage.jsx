import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/http';
import BannerSlider from '../components/BannerSlider';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Smartphone, Tablet, Headphones, Camera, ShieldCheck, Clock, Truck, ShoppingBag } from 'lucide-react';

const getCategory = (productName) => {
  const name = productName.toLowerCase();
  if (name.includes('matepad')) return 'tablets';
  if (name.includes('freeclip') || name.includes('freebuds') || name.includes('tai nghe')) return 'audio';
  if (name.includes('watch') || name.includes('pocket') || name.includes('osmo')) return 'accessories';
  return 'smartphones';
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const leadProducts = products.slice(0, 2);

  useEffect(() => {
    api
      .get('/products?limit=24')
      .then((response) => setProducts(response.data.items))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    {
      id: 'smartphones',
      name: 'Điện thoại di động',
      desc: 'Các dòng flagship cấu hình mạnh',
      icon: <Smartphone size={18} />,
      color: 'from-blue-500/10 to-indigo-500/10 text-indigo-650 border-indigo-200/50',
      iconBg: 'bg-indigo-500 text-white',
      count: products.filter(p => getCategory(p.name) === 'smartphones').length
    },
    {
      id: 'tablets',
      name: 'Máy tính bảng',
      desc: 'Màn hình PaperMatte chống mỏi mắt',
      icon: <Tablet size={18} />,
      color: 'from-purple-500/10 to-pink-500/10 text-pink-650 border-pink-200/50',
      iconBg: 'bg-pink-500 text-white',
      count: products.filter(p => getCategory(p.name) === 'tablets').length
    },
    {
      id: 'audio',
      name: 'Thiết bị âm thanh',
      desc: 'Tai nghe chụp/nhét tai vòm nổi 3D',
      icon: <Headphones size={18} />,
      color: 'from-amber-500/10 to-orange-500/10 text-orange-650 border-orange-200/50',
      iconBg: 'bg-orange-500 text-white',
      count: products.filter(p => getCategory(p.name) === 'audio').length
    },
    {
      id: 'accessories',
      name: 'Phụ kiện & Máy ảnh',
      desc: 'Đồng hồ thông minh & máy quay vlogger',
      icon: <Camera size={18} />,
      color: 'from-emerald-500/10 to-teal-500/10 text-teal-650 border-teal-200/50',
      iconBg: 'bg-teal-500 text-white',
      count: products.filter(p => getCategory(p.name) === 'accessories').length
    }
  ];

  return (
    <div className="space-y-16">
      {/* Highlights Banner */}
      <BannerSlider />

      {/* Category Quick Access */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-500">Khám phá nhanh</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Danh mục sản phẩm nổi bật</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className={`group flex flex-col justify-between rounded-3xl border bg-gradient-to-tr ${cat.color} p-6 shadow-soft hover:shadow-panel hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.iconBg} shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-extrabold bg-white/70 backdrop-blur-md rounded-full px-2.5 py-0.5 border border-slate-200/40 shadow-sm text-slate-650">
                  {cat.count} sản phẩm
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-brand-500 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Glass-Tinted Featured Picks Section */}
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/60 backdrop-blur-md shadow-soft grid lg:grid-cols-[0.7fr_1.3fr]">
        <div className="flex flex-col justify-center p-8 lg:p-10 border-b border-slate-250 lg:border-b-0 lg:border-r bg-white/40">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Sản phẩm nổi bật</p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900">Những lựa chọn hàng đầu được trưng bày trang trọng</h2>
          <p className="mt-3 text-xs leading-relaxed text-slate-550">
            Trưng bày theo phong cách tạp chí bán lẻ giúp tôn vinh chi tiết thiết kế và tính năng nổi bật của từng dòng sản phẩm dẫn đầu.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-150">
          {leadProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group flex flex-col justify-between p-6 transition hover:bg-white/80"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200/60 relative hover-shine p-4 flex items-center justify-center">
                <img
                  src={product.primary_image_url || product.thumbnail_url || 'https://placehold.co/600x450?text=VieShop'}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Được đề xuất nhiều nhất</p>
                <h3 className="mt-1 text-base font-extrabold text-slate-900 group-hover:text-brand-500 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-550 line-clamp-2">{product.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-500">Bộ sưu tập</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Sản phẩm mới nhất</h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-650 transition">
            <span>Xem tất cả</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có sản phẩm nào"
            description="Đăng nhập tài khoản admin để tạo sản phẩm đầu tiên hiển thị lên cửa hàng."
            action={
              <Link to="/admin/products" className="rounded-full bg-brand-500 hover:bg-brand-650 px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition">
                Mở khu quản trị
              </Link>
            }
          />
        )}
      </section>

      {/* Premium Promo Middle Banner */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white shadow-xl shadow-brand-500/5 p-8 md:p-12 border border-slate-800">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_top_right,var(--brand-500),transparent)] blur-3xl" />
        <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-400">
              Chương trình đặc biệt
            </span>
            <h2 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Siêu Sale Công Nghệ <br className="hidden sm:inline" />
              Lên Đời Flagship Nhận Ngay Ưu Đãi
            </h2>
            <p className="mt-3.5 max-w-lg text-xs leading-relaxed text-slate-400">
              Giảm trực tiếp lên đến 15% cho tất cả các thiết bị Apple & Samsung chính hãng. Miễn phí vận chuyển toàn quốc và hỗ trợ trả góp 0% lãi suất.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="hover-shine flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-650 px-6 py-2.5 text-xs font-bold text-white transition duration-200 shadow-lg shadow-brand-500/15"
              >
                <span>Khám phá bộ sưu tập</span>
                <ArrowRight size={14} />
              </Link>
              <div className="rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2 text-[10px] font-bold text-slate-300">
                MÃ GIẢM GIÁ: <span className="text-brand-400">VIE15</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-end select-none">
            <div className="relative flex items-center justify-center h-48 w-48 rounded-full bg-slate-900/30 border border-slate-800/80 p-8 backdrop-blur-sm animate-pulse-subtle">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/10 to-amber-500/10 blur-xl" />
              <ShoppingBag size={64} className="text-brand-500/80 stroke-[1.5]" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Propositions */}
      <section className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-10 shadow-soft">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-500">Cam kết chất lượng</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Vì sao bạn nên mua sắm tại VieShop?</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-550">
            Chúng tôi luôn đặt trải nghiệm khách hàng và chất lượng dịch vụ lên hàng đầu bằng những chính sách tối ưu nhất.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-200/50 hover:shadow-panel transition-all duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 group-hover:scale-110 transition duration-300">
              <ShieldCheck size={18} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">100% Hàng Chính Hãng</h3>
            <p className="mt-1.5 text-xs text-slate-550 leading-relaxed">
              Cam kết toàn bộ sản phẩm được phân phối chính ngạch, có nguồn gốc và chứng nhận kiểm định rõ ràng.
            </p>
          </div>

          <div className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-200/50 hover:shadow-panel transition-all duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 group-hover:scale-110 transition duration-300">
              <Clock size={18} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">Bảo Hành 12 Tháng</h3>
            <p className="mt-1.5 text-xs text-slate-550 leading-relaxed">
              Hỗ trợ đổi trả và chính sách bảo hành chính hãng toàn diện, xử lý nhanh chóng trong vòng 48 giờ làm việc.
            </p>
          </div>

          <div className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-200/50 hover:shadow-panel transition-all duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 group-hover:scale-110 transition duration-300">
              <Truck size={18} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">Giao Hàng Hỏa Tốc</h3>
            <p className="mt-1.5 text-xs text-slate-550 leading-relaxed">
              Vận chuyển siêu tốc nội thành trong 2 giờ và giao nhận toàn quốc an toàn, bọc chống sốc kỹ lưỡng.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
