import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import ProductCard from '../components/ProductCard';

export default function ShringarBundlesScreen() {
  const { products } = useNavigation();

  // Filter Shringar Bundles
  const bundleProducts = products.filter(
    (p) => p.category === 'Shringar Bundles'
  );

  return (
    <main className="min-h-screen bg-[#fbf9f4] pt-20 pb-28 md:pb-16">
      {/* Banner */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden flex items-center justify-center">
        <img
          src="https://lh3.googleusercontent.com/aida/AEtjO1URuKw5fosuS0K_1h608p0e9ie-YkwurlaQ81ABAb3ukhxC4I2liy9x1hxkEO-kdoKUrdMVHcF-NtPX6dQ9qWlpHWdFfbSDqcbCvYYxOzaZM8OpcVFBbYVrfEEPy0TWU7bfpS4pjId17FcfnGf-XIZu1A47ko77CdGH25jJHWLiuUkJRBgdt3hA7nKHx6jOcsZxrHML0PHIUe7tfLvh7X3WV8FlBLseFAK0UMA6hXfiX0TtER2AurYore_Z"
          alt="Complete Shringar Bundles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#00151b]/70 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
          <span className="text-xs font-bold text-[#fed65b] uppercase tracking-[0.2em] mb-2">
            All-In-One Sacred Sets
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">
            Complete Shringar Bundles
          </h1>
          <p className="text-xs md:text-sm text-[#a7ccda] mt-2 max-w-lg">
            Harmonious combination of Poshakh, Mukut, Haar, Bansuri, and Shringar essentials in a single devotional kit.
          </p>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-10">
        {/* Bundle Breakdown Box */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e4e2dd] shadow-sm mb-10">
          <h2 className="text-xl font-serif font-bold text-[#00151b] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#735c00]">card_giftcard</span>
            <span>What's Inside Every Shringar Bundle?</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { label: 'Silk Poshakh', icon: 'apparel' },
              { label: 'Mor-Pankh Mukut', icon: 'workspace_premium' },
              { label: 'Pearl Haar', icon: 'grade' },
              { label: 'Brass Bansuri', icon: 'music_note' },
              { label: 'Silver Payal', icon: 'join_inner' },
              { label: 'Kundan Kundal', icon: 'auto_awesome' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 bg-[#f5f3ee] rounded-xl text-center border border-[#e4e2dd]"
              >
                <span className="material-symbols-outlined text-[24px] text-[#735c00] mb-1">
                  {item.icon}
                </span>
                <span className="text-xs font-serif font-semibold text-[#00151b]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundleProducts.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 py-16 text-center text-sm text-[#41484b] bg-white rounded-xl border border-[#e4e2dd]">
              No products available yet.
            </div>
          ) : (
            bundleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
