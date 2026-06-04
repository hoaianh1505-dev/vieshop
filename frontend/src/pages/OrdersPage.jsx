import { useEffect, useState } from 'react';
import api, { authHeaders } from '../api/http';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { Calendar, MapPin, ClipboardList, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const { auth } = useApp();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders', authHeaders(auth.token)).then((response) => setOrders(response.data));
  }, [auth.token]);

  if (!orders.length) {
    return (
      <EmptyState
        title="Chưa có đơn hàng"
        description="Sau khi hoàn tất thanh toán, các đơn hàng của bạn sẽ xuất hiện tại đây."
        action={
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-650 px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition"
          >
            <span>Mua sắm ngay</span>
          </Link>
        }
      />
    );
  }

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'shipped':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-55 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-650">
          <ClipboardList size={18} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Lịch sử đơn hàng</h1>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-soft hover:shadow-panel transition duration-200">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mã đơn hàng</span>
                <p className="text-sm font-bold text-brand-600 mt-0.5">{order.order_code}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider select-none ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
                
                <div className="text-right">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Tổng thanh toán</span>
                  <strong className="block text-base font-extrabold text-slate-950 mt-0.5">
                    {formatCurrency(order.total_amount)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span>{order.shipping_address}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <span>Ngày đặt: {new Date(order.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {order.note ? (
              <div className="mt-3.5 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 italic">
                * Ghi chú: {order.note}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

