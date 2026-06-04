import { useEffect, useState } from 'react';
import api, { authHeaders } from '../../api/http';
import { useApp } from '../../context/AppContext';
import { formatCurrency, orderStatusOptions } from '../../utils/format';
import { Calendar, MapPin, Mail, User, ShoppingBag } from 'lucide-react';

export default function AdminOrdersPage() {
  const { auth, pushToast } = useApp();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const response = await api.get('/orders', authHeaders(auth.token));
    setOrders(response.data);
  };

  useEffect(() => {
    fetchOrders();
  }, [auth.token]);

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-650">
          <ShoppingBag size={18} />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900">Quản lý đơn hàng</h1>
          <p className="text-xs text-slate-400">Danh sách và cập nhật trạng thái đơn hàng của khách hàng</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-150 p-5 hover:border-slate-300 hover:bg-slate-50/30 transition duration-150">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mã đơn hàng</span>
                  <p className="text-sm font-bold text-brand-600">{order.order_code}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <User size={13} className="text-slate-400" />
                    <h2 className="text-sm font-bold text-slate-900">{order.customer_name}</h2>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-550">
                    <Mail size={13} className="text-slate-400" />
                    <span>{order.customer_email}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:items-end gap-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-right">Trạng thái vận đơn</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={order.status}
                      onChange={async (event) => {
                        await api.put(
                          `/orders/${order.id}`,
                          { status: event.target.value, payment_status: order.payment_status },
                          authHeaders(auth.token),
                        );
                        pushToast('Cập nhật trạng thái đơn hàng thành công');
                        fetchOrders();
                      }}
                      className="rounded-full border border-slate-200 bg-white hover:border-slate-350 px-3.5 py-1.5 text-xs font-semibold text-slate-700 outline-none transition"
                    >
                      {orderStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                    <strong className="text-base font-extrabold text-slate-900">{formatCurrency(order.total_amount)}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-550">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-450 shrink-0" />
                  <span>Địa chỉ: {order.shipping_address}</span>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <Calendar size={13} className="text-slate-450 shrink-0" />
                  <span>Ngày đặt: {new Date(order.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {order.note ? (
                <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-500 italic">
                  * Ghi chú khách hàng: {order.note}
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            Hệ thống chưa ghi nhận đơn mua nào từ khách hàng.
          </div>
        )}
      </div>
    </div>
  );
}


