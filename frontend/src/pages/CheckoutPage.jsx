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
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const shippingThreshold = 500000;
  const shippingFee = cartSubtotal >= shippingThreshold ? 0 : 30000;
  const total = cartSubtotal + shippingFee;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    if (!form.customer_name.trim() || form.customer_name.trim().length < 2)
      errors.customer_name = 'Họ tên phải có ít nhất 2 ký tự';
    if (!form.customer_phone.trim() || form.customer_phone.trim().length < 6)
      errors.customer_phone = 'Số điện thoại không hợp lệ (ít nhất 6 ký tự)';
    if (!form.customer_email.trim())
      errors.customer_email = 'Vui lòng nhập email';
    if (!form.shipping_address.trim() || form.shipping_address.trim().length < 10)
      errors.shipping_address = 'Địa chỉ phải có ít nhất 10 ký tự';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
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
      pushToast('Đặt hàng thành công! 🎉');
      navigate('/orders');
    } catch (err) {
      const data = err.response?.data;
      // Show field-level errors from Zod if available
      if (data?.details?.fieldErrors) {
        const fe = {};
        Object.entries(data.details.fieldErrors).forEach(([k, msgs]) => {
          fe[k] = msgs?.[0] || 'Không hợp lệ';
        });
        setFieldErrors(fe);
      }
      setError(data?.message || 'Không thể tiến hành đặt hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Họ và tên <span className="text-red-400">*</span></label>
                <input
                  className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm outline-none focus:bg-white transition ${
                    fieldErrors.customer_name ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-brand-500'
                  }`}
                  placeholder="Nhập họ và tên..."
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                />
                {fieldErrors.customer_name && (
                  <p className="text-[11px] text-red-500 font-medium">{fieldErrors.customer_name}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Số điện thoại <span className="text-red-400">*</span></label>
                <input
                  className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm outline-none focus:bg-white transition ${
                    fieldErrors.customer_phone ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-brand-500'
                  }`}
                  placeholder="VD: 0901 234 567"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                />
                {fieldErrors.customer_phone && (
                  <p className="text-[11px] text-red-500 font-medium">{fieldErrors.customer_phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Email liên hệ <span className="text-red-400">*</span></label>
              <input
                className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm outline-none focus:bg-white transition ${
                  fieldErrors.customer_email ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-brand-500'
                }`}
                placeholder="Nhập email của bạn..."
                type="email"
                value={form.customer_email}
                onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
              />
              {fieldErrors.customer_email && (
                <p className="text-[11px] text-red-500 font-medium">{fieldErrors.customer_email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Địa chỉ giao hàng <span className="text-red-400">*</span></label>
              <textarea
                className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm outline-none focus:bg-white transition ${
                  fieldErrors.shipping_address ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-brand-500'
                }`}
                rows="3"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                value={form.shipping_address}
                onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
              />
              {fieldErrors.shipping_address && (
                <p className="text-[11px] text-red-500 font-medium">{fieldErrors.shipping_address}</p>
              )}
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

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-semibold text-red-600 flex items-start gap-2">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed py-3.5 text-center text-sm font-bold text-white shadow-md shadow-brand-500/20 transition duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Đang xử lý...
                </>
              ) : 'Xác nhận đặt hàng'}
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

