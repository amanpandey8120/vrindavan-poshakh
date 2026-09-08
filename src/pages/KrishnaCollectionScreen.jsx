import React, { useState, useMemo } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

export default function KrishnaCollectionScreen() {
  const { products, productLoading, navigateTo, setSelectedProduct } = useNavigation();
  const [activeFilter, setActiveFilter] = useState('All Materials');

  // Filter Krishna Poshakh category products
  const krishnaProducts = useMemo(
    () => products.filter((p) => p.category?.includes('Krishna')),
    [products]
  );

  if (productLoading) {
    return (
      <main className="min-h-screen bg-[#fbf9f4] flex flex-col pt-16 pb-20 md:pb-0">
        <div className="flex-1 flex items-center justify-center h-[500px]">
          <div className="material-symbols-outlined text-[48px] text-[#735c00] animate-spin">sync</div>
          <p className="mt-4 text-[#41484b]">Loading Krishna collection...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf9f4] flex flex-col pt-16 pb-20 md:pb-0">

      {/* Category Banner — matches Stitch: h-[353px] md:h-[442px] */}
      <section className="relative w-full h-[353px] md:h-[442px] min-h-[300px] bg-[#f0eee9] rounded-none md:rounded-xl overflow-hidden mb-8 md:mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full opacity-80"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBD1XArmsv4DajyceC1Ey19jErtSiAVAXLw9rHBioPbu666KJ6AgAc1YQFN57e5xIH7Y0aFH_SnjayNIUnSV0XjEvns_MHBTr_yz_ZnBYLDW2OqljGPq9AeE8KF9ebmgk0vgTX6W75MpF39cI8p_mwjkP-eKgoVJLN1qj1GOdmI5JfRjPoxUzs-3Nh8HDrJUFPKJ4fPwD6El6gxBfCgVFj5t0oJKDuMYMXb_yb-A0Nv4O5SfyOnIWvBCg')"
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00151b]/80 to-transparent flex items-end p-6 md:p-12">
          <div>
            <p className="text-[#ffe088] text-xs font-bold uppercase tracking-widest mb-2 opacity-90">
              Devotional Collection
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Krishna Poshakh
            </h1>
          </div>
        </div>
      </section>

      {/* Filters & Grid Container */}
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-16 w-full max-w-[1280px] mx-auto">

        {/* Sidebar Filters (Desktop only) — matches Stitch */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-base font-semibold text-[#00151b] mb-4 border-b border-[#c1c7cb]/30 pb-2">Material</h3>
            <ul className="space-y-3">
              {['Pure Silk', 'Cotton Blend', 'Premium Velvet', 'Georgette'].map((m) => (
                <li key={m}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#71787b] text-[#735c00] focus:ring-[#735c00]" />
                    <span className="text-sm text-[#41484b]">{m}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#00151b] mb-4 border-b border-[#c1c7cb]/30 pb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {['0', '1', '2', '3', '4', '5'].map((sz, i) => (
                <button
                  key={sz}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    i === 2
                      ? 'border border-[#735c00] bg-[#fed65b]/20 text-[#735c00]'
                      : 'border border-[#71787b] text-[#41484b] hover:border-[#735c00] hover:text-[#735c00]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">

          {/* Mobile Filter Pills — matches Stitch */}
          <div className="md:hidden flex overflow-x-auto gap-4 pb-4 mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {['All Materials', 'Silk', 'Cotton', 'Velvet'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-colors ${
                  activeFilter === f
                    ? 'bg-[#fed65b] text-[#745c00]'
                    : 'border border-[#c1c7cb] text-[#41484b]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Product Grid — 2 cols mobile, 3 cols desktop — matches Stitch */}
          {!productLoading && krishnaProducts.length === 0 && (
            <div className="py-16 text-center text-sm text-[#41484b] bg-white rounded-xl border border-[#e4e2dd]">
              No products available yet.
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
            {krishnaProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product);
                  navigateTo(SCREENS.PRODUCT_DETAIL);
                }}
              >
                <div className="relative w-full aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,21,27,0.05)] mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Wishlist button */}
                  <button className="absolute top-3 right-3 p-2 bg-[#fbf9f4]/90 backdrop-blur rounded-full text-[#41484b] hover:text-[#735c00] transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                  </button>
                  {/* Badge */}
                  {product.badge && (
                    <div
                      className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: product.badgeColor, color: product.badgeText }}
                    >
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-sm md:text-base text-[#00151b] mb-1 line-clamp-2">{product.title}</h4>
                  <p className="text-base font-semibold text-[#735c00] mt-auto">₹ {product.price.toLocaleString('en-IN')}</p>
                  <button className="mt-4 w-full py-2 border border-[#71787b] hover:border-[#735c00] hover:text-[#735c00] text-[#00151b] rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More button — matches Stitch */}
          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-[#ffe088] to-[#fed65b] text-[#00151b] rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all">
              Load More Divine Creations
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}