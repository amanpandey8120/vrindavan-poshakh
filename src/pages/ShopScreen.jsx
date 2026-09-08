import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import ProductCard from '../components/ProductCard';

export default function ShopScreen() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    categories,
    selectedSize,
    setSelectedSize
  } = useNavigation();

  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const sizesList = ['All', 'No. 0', 'No. 1', 'No. 2', 'No. 3', 'No. 4', 'No. 5', 'No. 6'];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSize = selectedSize === 'All' || (p.sizes && p.sizes.includes(selectedSize));
    return matchCategory && matchSize;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  return (
    <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#e4e2dd] pb-6">
        <div>
          <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest">
            Devotional Catalog
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#00151b] mt-1">
            Shop All Products
          </h1>
          <p className="text-xs text-[#71787b] mt-1">
            Showing {sortedProducts.length} handcrafted items
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#c1c7cb] text-xs font-bold text-[#00151b]"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#41484b] hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#c1c7cb] rounded-full px-4 py-2 text-xs font-semibold text-[#00151b] focus:outline-none focus:border-[#735c00]"
            >
              <option value="featured">Featured / Bestselling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters (Desktop + Mobile Drawer) */}
        <aside
          className={`md:col-span-3 bg-white p-6 rounded-2xl border border-[#e4e2dd] shadow-sm flex flex-col gap-6 h-fit ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex justify-between items-center border-b border-[#f0eee9] pb-4">
            <h3 className="text-base font-serif font-bold text-[#00151b] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#735c00]">
                tune
              </span>
              <span>Filter Options</span>
            </h3>
            {(selectedCategory !== 'All' || selectedSize !== 'All') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSize('All');
                }}
                className="text-[11px] font-bold text-[#ba1a1a] hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs font-bold text-[#735c00] uppercase tracking-wider mb-3">
              Categories
            </h4>
            {categories.length > 0 ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'All'
                      ? 'bg-[#fed65b] text-[#745c00] font-bold'
                      : 'text-[#41484b] hover:bg-[#f5f3ee]'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug || cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.name
                        ? 'bg-[#fed65b] text-[#745c00] font-bold'
                        : 'text-[#41484b] hover:bg-[#f5f3ee]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.name && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#71787b] pt-3">
                Loading categories...
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div className="pt-4 border-t border-[#f0eee9]">
            <h4 className="text-xs font-bold text-[#735c00] uppercase tracking-wider mb-3">
              Deity Size (No.)
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {sizesList.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-xs py-1.5 rounded-md font-medium text-center transition-all ${
                    selectedSize === sz
                      ? 'bg-[#00151b] text-white font-bold'
                      : 'bg-[#f5f3ee] text-[#41484b] hover:bg-[#e4e2dd]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="md:col-span-9">
          {products.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center border border-[#e4e2dd]">
              <span className="material-symbols-outlined text-[48px] text-[#71787b]">
                inventory_2
              </span>
              <h3 className="text-lg font-serif font-bold text-[#00151b] mt-2">
                No products available yet.
              </h3>
              <p className="text-xs text-[#71787b] mt-1">
                Check back soon — new items are added regularly.
              </p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center border border-[#e4e2dd]">
              <span className="material-symbols-outlined text-[48px] text-[#71787b]">
                search_off
              </span>
              <h3 className="text-lg font-serif font-bold text-[#00151b] mt-2">
                No matching items found
              </h3>
              <p className="text-xs text-[#71787b] mt-1">
                Try selecting a different size or category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSize('All');
                }}
                className="gold-gradient-bg text-[#00151b] px-6 py-2 rounded-full text-xs font-bold mt-4"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
