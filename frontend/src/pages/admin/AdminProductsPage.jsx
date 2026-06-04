import { useEffect, useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';
import api, { authHeaders } from '../../api/http';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { Plus, Edit, Trash2, Tag, Upload } from 'lucide-react';

const initialForm = {
  name: '',
  sku: '',
  description: '',
  price: '',
  stock: '',
  status: 'active',
  thumbnail_url: '',
  image_urls: '[]',
};

export default function AdminProductsPage() {
  const { auth, pushToast } = useApp();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchProducts = async () => {
    const response = await api.get('/products', {
      params: { limit: 24, includeDrafts: true },
      ...authHeaders(auth.token),
    });
    setProducts(response.data.items);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setSelectedFiles([]);
    setEditingId(null);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    
    // Auto-generate SKU if not present (since manual input is removed)
    const productSku = form.sku.trim() || 'SP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    
    const finalForm = {
      ...form,
      sku: productSku,
      status: form.status || 'active',
      image_urls: form.image_urls || '[]'
    };

    Object.entries(finalForm).forEach(([key, value]) => payload.append(key, value));
    selectedFiles.forEach((file) => payload.append('images', file));

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload, authHeaders(auth.token));
        pushToast('Cập nhật sản phẩm thành công');
      } else {
        await api.post('/products', payload, authHeaders(auth.token));
        pushToast('Tạo sản phẩm thành công');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      pushToast(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  return (
    <div className="space-y-6">
      {/* Form area */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-650">
            <Plus size={18} />
          </div>
          <h1 className="text-base font-bold text-slate-900">
            {editingId ? 'Cập nhật thông tin sản phẩm' : 'Đăng bán sản phẩm mới'}
          </h1>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {/* Tên sản phẩm */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tên sản phẩm</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs outline-none focus:border-brand-500 focus:bg-white transition"
              placeholder="Nhập tên sản phẩm..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Giá bán */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Giá bán (VND)</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs outline-none focus:border-brand-500 focus:bg-white transition"
                placeholder="Nhập giá bán sản phẩm..."
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            {/* Số lượng */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Số lượng tồn kho</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs outline-none focus:border-brand-500 focus:bg-white transition"
                placeholder="Nhập số lượng nhập kho..."
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Ảnh đại diện URL */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ảnh đại diện (URL)</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs outline-none focus:border-brand-500 focus:bg-white transition"
                placeholder="Ví dụ: https://link-anh.com/image.jpg..."
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              />
            </div>

            {/* Tải ảnh file */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Upload size={13} className="text-slate-450" />
                <span>Tải ảnh từ máy tính</span>
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-xs outline-none focus:border-brand-500 focus:bg-white transition"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mô tả sản phẩm</label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs outline-none focus:border-brand-500 focus:bg-white transition"
              rows="3"
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="hover-shine rounded-full bg-slate-950 hover:bg-brand-500 px-6 py-2.5 text-xs font-bold text-white shadow-soft transition">
              {editingId ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}
            </button>
            {editingId && (
              <button
                type="button"
                className="rounded-full border border-slate-250 hover:bg-slate-50 px-6 py-2.5 text-xs font-semibold text-slate-600 transition"
                onClick={resetForm}
              >
                Hủy sửa
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Danh sách sản phẩm</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            Tổng số: {products.length} sp
          </span>
        </div>

        {products.length ? (
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-150 text-slate-450 uppercase font-bold tracking-wider select-none">
                  <th className="pb-3 font-semibold">Sản phẩm</th>
                  <th className="pb-3 font-semibold">Giá bán</th>
                  <th className="pb-3 font-semibold">Tồn kho</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail_url || 'https://placehold.co/100x100?text=VieShop'}
                          alt=""
                          className="h-9 w-9 rounded-lg object-cover border border-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 font-bold text-slate-700">{formatCurrency(product.price)}</td>
                    <td className="py-3.5">
                      {product.stock <= 0 ? (
                        <span className="text-red-500 font-semibold">Hết hàng</span>
                      ) : (
                        <span className="font-semibold text-slate-600">{product.stock}</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          product.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {product.status === 'active' ? 'Đang bán' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:border-slate-355 bg-white hover:bg-slate-50 text-slate-500 transition"
                          title="Sửa"
                          onClick={() => {
                            setEditingId(product.id);
                            setForm({
                              name: product.name,
                              sku: product.sku,
                              description: product.description,
                              price: product.price,
                              stock: product.stock,
                              status: product.status,
                              thumbnail_url: product.thumbnail_url || '',
                              image_urls: '[]',
                            });
                          }}
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 hover:bg-red-500 hover:text-white text-white transition"
                          title="Xóa"
                          onClick={() => setConfirmId(product.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="Chưa có sản phẩm nào"
              description="Hãy sử dụng biểu mẫu phía trên để đăng sản phẩm đầu tiên lên hệ thống."
            />
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(confirmId)}
        title="Xóa sản phẩm"
        description="Hành động này sẽ xóa vĩnh viễn sản phẩm và không thể khôi phục lại. Bạn có chắc chắn muốn tiếp tục?"
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          await api.delete(`/products/${confirmId}`, authHeaders(auth.token));
          setConfirmId(null);
          pushToast('Xóa sản phẩm thành công');
          fetchProducts();
        }}
      />
    </div>
  );
}
