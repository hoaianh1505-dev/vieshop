import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const bannerSlides = [
  {
    title: 'iPhone 17 Pro Max',
    subtitle: 'Đỉnh cao công nghệ Apple với thiết kế titan siêu bền và chip A19 Pro mạnh mẽ.',
    image: 'http://localhost:5000/uploads/iphone-17-pro-max_3.webp',
    tag: 'Sản phẩm mới',
  },
  {
    title: 'DJI Osmo Pocket 3',
    subtitle: 'Quay phim 4K mượt mà với cảm biến 1-inch và chống rung 3 trục chuyên nghiệp.',
    image: 'http://localhost:5000/uploads/may-quay-chong-rung-dji-osmo-pocket-3-advanced-4k_1.webp',
    tag: 'Bán chạy nhất',
  },
  {
    title: 'Samsung Galaxy S26 Ultra',
    subtitle: 'Màn hình Gorilla Armor phản quang cực thấp và hệ thống camera zoom AI đỉnh cao.',
    image: 'http://localhost:5000/uploads/samsung-galaxy-s26-ultra-1.webp',
    tag: 'Flagship Android',
  },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % bannerSlides.length);
  };

  return (
    <div className="relative group overflow-hidden rounded-[28px] border border-slate-900 bg-slate-950 text-white shadow-xl shadow-brand-500/5 h-[280px] md:h-[320px] select-none">
      {/* Slides */}
      <div className="relative w-full h-full">
        {bannerSlides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.title}
              className={`absolute inset-0 grid md:grid-cols-[1.2fr_0.8fr] h-full transition-all duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 scale-100 visible' : 'opacity-0 z-0 scale-95 invisible'
              }`}
            >
              {/* Info Column (Left) */}
              <div className="relative flex flex-col justify-center p-8 md:p-12 z-20 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent md:bg-gradient-to-br md:from-slate-900 md:via-slate-950 md:to-slate-900">
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-400 transition-all duration-700 delay-100 transform ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  {slide.tag}
                </span>
                
                <h2
                  className={`mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-white transition-all duration-700 delay-200 transform ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  {slide.title}
                </h2>
                
                <p
                  className={`mt-2 max-w-md text-xs leading-relaxed text-slate-400 transition-all duration-700 delay-300 transform ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  {slide.subtitle}
                </p>
                
                <div
                  className={`mt-5 transition-all duration-700 delay-450 transform ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <Link
                    to="/products"
                    className="hover-shine inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-650 px-5 py-2 text-xs font-bold text-white transition shadow-lg shadow-brand-500/10"
                  >
                    <span>Khám phá ngay</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Image Column (Right / Background on mobile) */}
              <div className="absolute md:relative inset-0 md:inset-auto block md:flex bg-slate-950 md:bg-slate-900 border-l border-slate-900/50 overflow-hidden z-10 md:z-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-15 md:z-10" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-center transform transition-transform duration-10000 ease-out ${
                    isActive ? 'scale-105 opacity-30 md:opacity-100' : 'scale-100 opacity-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-25 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 border border-white/5 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition duration-300"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-25 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 border border-white/5 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition duration-300"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-25 flex gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: index === current ? '24px' : '6px',
              backgroundColor: index === current ? 'var(--brand-500, #ee4d2d)' : 'rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}


