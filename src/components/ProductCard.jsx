import React from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

export default function ProductCard({ product }) {
  const { navigateTo, addToCart, wishlist, toggleWishlist } = useNavigation();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group relative flex flex-col bg-[#ffffff] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e4e2dd]">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-[#f5f3ee] overflow-hidden cursor-pointer" onClick={() => navigateTo(SCREENS.PRODUCT_DETAIL, { product })}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Tag / Chip */}
        {product.tag && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-sm ${
              product.tagColor === 'pink'
                ? 'bg-[#ffd9e3] text-[#2c0015]'
                : 'bg-[#fed65b] text-[#745c00]'
            }`}
          >
            {product.tag}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all ${
            isWishlisted ? 'text-[#ba1a1a]' : 'text-[#71787b] hover:text-[#ba1a1a]'
          }`}
          aria-label="Wishlist"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#735c00]">
            {product.category}
          </span>
          <h3
            onClick={() => navigateTo(SCREENS.PRODUCT_DETAIL, { product })}
            className="text-base font-serif font-semibold text-[#00151b] mt-1 line-clamp-2 cursor-pointer hover:text-[#735c00] transition-colors"
          >
            {product.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f0eee9]">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-serif font-bold text-[#00151b]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#71787b] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="gold-gradient-bg text-[#00151b] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:shadow-md hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
