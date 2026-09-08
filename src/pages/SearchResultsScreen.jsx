import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import ProductCard from '../components/ProductCard';

export default function SearchResultsScreen() {
  const { searchQuery, products, categories, navigateTo } = useNavigation();
  const [filterTag, setFilterTag] = useState('All');

  const query = (searchQuery || '').toLowerCase().trim();
  const tagList = ['All', ...categories.map((c) => c.name).filter(Boolean)];

  const matchingProducts = products.filter((p) => {
    const category = (p.category || '').toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(query);
    const catMatch = category.includes(query);
    const descMatch = (p.description || '').toLowerCase().includes(query);
    const tagMatch = filterTag === 'All' || category.includes(filterTag.toLowerCase());
    return (titleMatch || catMatch || descMatch) && tagMatch;
  });

  return (
    <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest">
          Search Discovery
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#00151b] mt-1">
          Search Results {query ? `for "${searchQuery}"` : ''}
        </h1>
        <p className="text-xs text-[#71787b] mt-1">
          Found {matchingProducts.length} items matching your devotional search query.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
        {tagList.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterTag === tag
                ? 'bg-[#00151b] text-white shadow-sm'
                : 'bg-white text-[#00151b] border border-[#c1c7cb] hover:bg-[#f5f3ee]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {matchingProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#e4e2dd] max-w-lg mx-auto">
          <span className="material-symbols-outlined text-[64px] text-[#71787b]">
            search_off
          </span>
          <h2 className="text-xl font-serif font-bold text-[#00151b] mt-2">
            No items matched "{searchQuery}"
          </h2>
          <p className="text-xs text-[#71787b] mt-1">
            Try searching for "Poshakh", "Mukut", "Silk", or "Bansuri".
          </p>
          <button
            onClick={() => navigateTo(SCREENS.SHOP)}
            className="gold-gradient-bg text-[#00151b] px-6 py-3 rounded-full text-xs font-bold mt-6"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
