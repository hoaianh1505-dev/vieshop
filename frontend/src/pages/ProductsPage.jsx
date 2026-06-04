import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/http';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ProductCard from '../components/ProductCard';
import { Search, Smartphone, Tablet, Headphones, Camera, Layers } from 'lucide-react';

const getCategory = (productName) => {
  const name = productName.toLowerCase();
  if (name.includes('matepad')) return 'tablets';
  if (name.includes('freeclip') || name.includes('freebuds') || name.includes('tai nghe')) return 'audio';
  if (name.includes('watch') || name.includes('pocket') || name.includes('osmo')) return 'accessories';
  return 'smartphones';
};

const categoryTabs = [
  { id: 'all', name: 'Tất cả', icon: <Layers size={14} /> },
  { id: 'smartphones', name: 'Điện thoại', icon: <Smartphone size={14} /> },
  { id: 'tablets', name: 'Máy tính bảng', icon: <Tablet size={14} /> },
  { id: 'audio', name: 'Âm thanh', icon: <Headphones size={14} /> },
  { id: 'accessories', name: 'Phụ kiện', icon: <Camera size={14} /> },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'all';

  const fetchProducts = async (nextKeyword = keyword) => {
    setLoading(true);
    const response = await api.get('/products', {
      params: { page: 1, limit: 24, search: nextKeyword },
    });
    setProducts(response.data.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts('');
  }, []);

  const filteredProducts = products.filter((product) => {
    if (currentCategory === 'all') return true;
    return getCategory(product.name) === currentCategory;
  });

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    setSearchParams(params);
  };

  return (
    <section className="space-y-8">
      {/* Header & Search Panel */}
      <div className="rounded-[32px] bg-white border border-slate-200/80 p-6 lg:p-8 shadow-panel">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-500">Bộ sưu tập</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Danh sách sản phẩm</h1>
          </div>
          <form
            className="relative flex w-full gap-3 lg:max-w-xl"
            onSubmit={(event) => {
              event.preventDefault();
              setKeyword(search);
              fetchProducts(search);
            }}
          >
            <div className="relative w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên, mô tả, SKU..."
                className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-3 pl-12 pr-5 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>
            <button className="rounded-full bg-brand-500 hover:bg-brand-650 px-6 py-3 text-xs font-semibold text-white shadow-soft transition">
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Premium Category Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2.5 border-t border-slate-100 pt-6">
          {categoryTabs.map((tab) => {
            const isActive = currentCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-bold transition duration-200 select-none ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-md shadow-slate-950/15'
                    : 'border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-650 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div>
        {loading ? (
          <LoadingSkeleton cards={8} />
        ) : filteredProducts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Không tìm thấy sản phẩm"
            description="Hãy thử đổi từ khóa khác, chọn danh mục khác hoặc liên hệ admin để bổ sung thêm dữ liệu."
          />
        )}
      </div>
    </section>
  );
}

