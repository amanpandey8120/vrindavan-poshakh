import React from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import ProductCard from '../components/ProductCard';

export default function HomeScreen() {
  const { navigateTo, products, categories } = useNavigation();

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-24 md:pb-12">
      {/* Hero Section — matches Stitch h-[751px] min-h-[600px] */}
      <section className="relative w-full h-[751px] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJhjdCw8ciLoxMtgvJ592S5dYPacuWLMeo6Q-IGLkQVGfUdh84426ZPksVvBmDrXyiWeFQYKr1xQEb-MRjOnTCoFxW3kzE1XPk0VkBNgLOSx7wAFBQKgY6IrAKhdszsYfZLYzQBzq5aAgfjVsEdzWANMElvNlNkeoPxuGzuHCpQXcs2WD_B4de8Fuu6j30aPAJI1wY_AO7wbtRbuzNzl6W2t1PfLNkh18GW7rUypH9LYFQdHCyjATmfw=s0')" }}
          />
          {/* Gradient overlay — matches Stitch: from-background via-background/40 to-transparent */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fbf9f4] via-[#fbf9f4]/40 to-transparent" />
        </div>

        {/* Content — mt-20 to match Stitch */}
        <div className="relative z-10 container mx-auto px-4 md:px-16 flex flex-col items-center text-center mt-20">
          <span className="text-xs font-bold text-[#735c00] tracking-[0.2em] uppercase mb-4">
            Divine Elegance
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#00151b] max-w-3xl mb-6 leading-tight">
            Shringar Mein Bhakti,<br />
            <span className="gold-gradient-text italic">Har Din Vrindavan Ki</span>
          </h1>
          <p className="text-base text-[#41484b] max-w-xl mb-10 leading-relaxed">
            Discover beautiful Poshakh, Mukut, Jewellery and Shringar essentials for your Krishna, crafted with devotion and premium quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigateTo(SCREENS.KRISHNA_COLLECTION)}
              className="gold-gradient-bg text-[#00151b] px-8 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Shop Poshakh
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <button
              onClick={() => navigateTo(SCREENS.CATEGORIES)}
              className="bg-transparent border border-[#735c00] text-[#00151b] px-8 py-4 rounded-full text-sm font-bold flex items-center justify-center hover:bg-[#f0eee9] transition-colors duration-300"
            >
              Explore Collections
            </button>
          </div>
        </div>
      </section>

      {/* Spacer — matches Stitch h-24 md:h-32 with vertical line */}
      <div className="h-24 md:h-32 w-full bg-[#fbf9f4] flex justify-center items-center">
        <div className="w-px h-16 bg-gradient-to-b from-[#735c00]/50 to-transparent" />
      </div>

      {/* Categories Grid */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest">
            Curated Categories
          </span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#00151b] mt-2">
            Choose Sacred Adornments
          </h2>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.slug || cat.name}
                onClick={() => navigateTo(SCREENS.SHOP)}
                className="group relative h-64 md:h-80 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e4e2dd]"
              >
                <img
                  src={cat.url || '/placeholder.svg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00151b]/90 via-[#00151b]/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-bold text-[#fed65b] uppercase tracking-widest">
                    {cat.description || 'View Items'}
                  </span>
                  <h3 className="text-lg md:text-xl font-serif font-bold mt-1 group-hover:text-[#fed65b] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-xs text-[#71787b] py-12">
            No categories available yet.
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest">
              Divine Collection
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#00151b] mt-1">
              Bestselling Poshakh & Shringar
            </h2>
          </div>
          <button
            onClick={() => navigateTo(SCREENS.SHOP)}
            className="text-xs font-bold uppercase tracking-widest text-[#735c00] flex items-center gap-1 hover:underline"
          >
            <span>View All Products</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Fit Guide Promo Banner */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-8">
        <div className="bg-[#002b36] rounded-2xl p-6 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-[#735c00]/30 shadow-xl">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold text-[#fed65b] uppercase tracking-widest">
              Need Help with Deity Sizing?
            </span>
            <h3 className="text-2xl md:text-4xl font-serif font-bold mt-2 mb-4 leading-tight">
              Find the Perfect Fit for Laddu Gopal (No. 0 to 6+)
            </h3>
            <p className="text-sm text-[#6f93a0] mb-6 leading-relaxed">
              Measure your deity accurately using our quick size selection assistant to ensure comfortable and graceful fitting.
            </p>
            <button
              onClick={() => navigateTo(SCREENS.FIT_ASSISTANT)}
              className="gold-gradient-bg text-[#00151b] px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">straighten</span>
              <span>Launch Fit Assistant</span>
            </button>
          </div>
          <div className="relative z-10 w-full md:w-auto flex justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-[#fed65b]/40 overflow-hidden shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJhjdCw8ciLoxMtgvJ592S5dYPacuWLMeo6Q-IGLkQVGfUdh84426ZPksVvBmDrXyiWeFQYKr1xQEb-MRjOnTCoFxW3kzE1XPk0VkBNgLOSx7wAFBQKgY6IrAKhdszsYfZLYzQBzq5aAgfjVsEdzWANMElvNlNkeoPxuGzuHCpQXcs2WD_B4de8Fuu6j30aPAJI1wY_AO7wbtRbuzNzl6W2t1PfLNkh18GW7rUypH9LYFQdHCyjATmfw"
                alt="Deity Fit Guide"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
