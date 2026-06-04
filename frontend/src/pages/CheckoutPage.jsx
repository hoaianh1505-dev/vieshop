import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { authHeaders } from '../api/http';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { CreditCard, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { auth, cart, cartSubtotal, clearCart, pushToast } = useApp();
  const [form, setForm] = useState({
    customer_name: auth.user.name || '',
    customer_email: auth.user.email || '',
    customer_phone: auth.user.phone || '',
    shipping_address: auth.user.address || '',
    note: '',
  });
  const [error, setError] = useState('');

  const shippingThreshold = 500000;
  const shippingFee = cartSubtotal >= shippingThreshold ? 0 : 30000;
  const total = cartSubtotal + shippingFee;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.post(
        '/orders',
        {
          ...form,
          items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        },
        authHeaders(auth.token),
      );
      clearCart();
      pushToast('Đặt hàng thành công');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tiến hành đặt hàng');
    }
  };

  return (
    <section className="space-y-6">
      {/* Back button */}
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft size={16} />
        <span>Quay lại giỏ hàng</span>
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Side: Shipping Form */}
        <div className="rounded-[32px] bg-white border border-slate-200/80 p-8 shadow-panel">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-650">
              <CreditCard size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 font-sans">Thông tin thanh toán</h1>
              <p className="text-xs text-slate-400">Vui lòng nhập địa chỉ và số điện thoại nhận hàng</p>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Họ và tên</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
                  placeholder="Nhập họ và tên..."
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Số điện thoại</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
                  placeholder="Nhập số điện thoại..."
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Email liên hệ</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
                placeholder="Nhập email của bạn..."
                type="email"
                value={form.customer_email}
                onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Địa chỉ giao hàng</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
                rows="3"
                placeholder="Địa chỉ cụ thể (Số nhà, tên đường, phường/xã, quận/huyện...)"
                value={form.shipping_address}
                onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Ghi chú đơn hàng (Không bắt buộc)</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
                rows="2"
                placeholder="Lời nhắn cho shipper hoặc yêu cầu đặc biệt..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            {error ? <p className="text-xs font-semibold text-red-500">{error}</p> : null}
            
            <button className="w-full rounded-full bg-brand-500 hover:bg-brand-600 py-3.5 text-center text-sm font-semibold text-white shadow-soft transition duration-200">
              Xác nhận đặt hàng
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-panel space-y-6 self-start">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag size={18} className="text-slate-500" />
            <span>Tóm tắt đơn hàng ({cart.reduce((sum, item) => sum + item.quantity, 0)} sp)</span>
          </h2>

          {/* Mini items list */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-white p-1 flex items-center justify-center">
                  <img
                    src={item.image || 'https://placehold.co/100x100?text=VieShop'}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="mt-1 text-[10px] text-slate-400">SL: {item.quantity} × {formatCurrency(item.price)}</p>
                </div>
                <span className="text-xs font-bold text-slate-700 shrink-0">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold text-slate-700">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span className="font-semibold text-slate-700">
                {shippingFee === 0 ? <span className="text-emerald-600 font-semibold">Miễn phí</span> : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-bold text-slate-950">
              <span>Tổng thanh toán</span>
              <span className="text-brand-500 text-lg font-extrabold">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

