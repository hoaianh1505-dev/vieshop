import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { ShoppingCart, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useApp();
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-panel">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-white aspect-square hover-shine flex items-center justify-center border-b border-slate-100">
        <Link to={`/products/${product.id}`} className="block h-full w-full p-4">
          <img
            src={product.primary_image_url || product.thumbnail_url || 'https://placehold.co/600x600?text=VieShop'}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Stock Badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm select-none ${
            isOutOfStock
              ? 'bg-red-500 text-white'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {isOutOfStock ? 'Hết hàng' : `Tồn kho: ${product.stock}`}
        </span>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-1 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-current" />
          ))}
          <span className="ml-1 text-[11px] font-bold text-slate-400">5.0</span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="mt-2 block text-base font-extrabold text-slate-900 line-clamp-2 hover:text-brand-500 transition-colors"
        >
          {product.name}
        </Link>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2 flex-1">{product.description}</p>

        {/* Price & Add to Cart */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Giá Bán</p>
            <strong className="mt-0.5 block text-base font-extrabold text-brand-600">{formatCurrency(product.price)}</strong>
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`hover-shine flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-950 text-white hover:bg-brand-500 hover:scale-105 shadow-sm'
            }`}
            title="Thêm vào giỏ"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}


