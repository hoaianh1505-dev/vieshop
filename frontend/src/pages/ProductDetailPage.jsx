import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/http';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { ShoppingCart, Plus, Minus, Tag, Box, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        const firstImg = response.data.images?.[0]?.image_url || response.data.thumbnail_url || 'https://placehold.co/800x800?text=VieShop';
        setActiveImage(firstImg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton cards={1} />;
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock));
  };

  return (
    <section className="space-y-6">
      {/* Back button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft size={16} />
        <span>Quay lại danh sách</span>
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Side: Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-4 shadow-panel aspect-square flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImage(image.image_url)}
                  className={`overflow-hidden rounded-2xl border aspect-square p-2 bg-white shadow-soft transition-all flex items-center justify-center ${
                    activeImage === image.image_url
                      ? 'border-brand-500 ring-2 ring-brand-100'
                      : 'border-slate-200/80 hover:border-slate-350'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right Side: Product Details */}
        <div className="flex flex-col justify-between rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-panel">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                <Tag size={13} />
                <span>SKU: {product.sku || 'N/A'}</span>
              </span>
              
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} className="fill-current" />
                <span className="text-sm font-bold text-slate-700">5.0</span>
                <span className="text-xs text-slate-400 font-medium">(24 đánh giá)</span>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900 leading-snug">{product.name}</h1>
            
            <p className="mt-5 text-sm leading-relaxed text-slate-650 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            {/* Price & Stock Card */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-brand-50/50 border border-brand-100/50 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-650">Giá bán</p>
                <strong className="mt-1 block text-2xl font-extrabold text-brand-650">{formatCurrency(product.price)}</strong>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tình trạng</p>
                <strong className="mt-1 block text-lg font-bold text-slate-900">
                  {isOutOfStock ? (
                    <span className="text-red-500">Hết hàng</span>
                  ) : (
                    <span className="flex items-center justify-end gap-1.5 text-emerald-600">
                      <Box size={16} />
                      <span>Còn {product.stock} sp</span>
                    </span>
                  )}
                </strong>
              </div>
            </div>

            {/* Quantity Selector & Action */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {!isOutOfStock ? (
                <>
                  <div className="flex items-center rounded-full border border-slate-200 bg-white p-1">
                    <button
                      onClick={handleDecrease}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                      disabled={quantity <= 1}
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900 select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-slate-950 hover:bg-brand-500 px-8 py-3.5 font-semibold text-white shadow-soft transition-all duration-200"
                  >
                    <ShoppingCart size={16} />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full rounded-full bg-slate-100 py-3.5 font-semibold text-slate-400 cursor-not-allowed border border-slate-200"
                >
                  Hiện đã hết hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

