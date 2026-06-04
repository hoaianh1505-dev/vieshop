import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, cartSubtotal, removeCartItem, updateCartItem } = useApp();

  if (!cart.length) {
    return (
      <EmptyState
        title="Giỏ hàng đang trống"
        description="Hãy thêm sản phẩm vào giỏ hàng của bạn để tiến hành thanh toán."
        action={
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-650 px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition"
          >
            <ShoppingBag size={14} />
            <span>Mua sắm ngay</span>
          </Link>
        }
      />
    );
  }

  const shippingThreshold = 500000;
  const shippingFee = cartSubtotal >= shippingThreshold ? 0 : 30000;
  const total = cartSubtotal + shippingFee;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Giỏ hàng của bạn</h1>
      
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Cart items list */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-5 rounded-[24px] border border-slate-200/60 bg-white p-4 shadow-soft">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 flex items-center justify-center">
                <img
                  src={item.image || 'https://placehold.co/400x400?text=VieShop'}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              </div>
              
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-brand-600">{formatCurrency(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeCartItem(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Quantity Control inside Cart */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-450 font-medium">Số lượng:</span>
                  <div className="flex items-center rounded-full border border-slate-250 bg-white p-0.5 scale-95">
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Block */}
        <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-panel flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-brand-500/10 blur-2xl" />

          <div className="relative">
            <h2 className="text-lg font-bold">Tổng đơn hàng</h2>
            
            <div className="mt-6 space-y-4 text-xs text-white/70">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span>Tạm tính</span>
                <span className="font-semibold text-white">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-white">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">Miễn phí</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] text-white/40 italic">
                  * Miễn phí vận chuyển cho đơn hàng từ {formatCurrency(shippingThreshold)}
                </p>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-base font-bold">
                <span>Tổng cộng</span>
                <span className="text-brand-500 text-xl font-extrabold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 py-3.5 text-center text-xs font-semibold text-white shadow-soft transition duration-200"
          >
            <span>Tiến hành thanh toán</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

