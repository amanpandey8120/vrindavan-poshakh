import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

export default function Header() {
  const {
    activeScreen,
    navigateTo,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
  } = useNavigation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo(SCREENS.SEARCH, { query: searchQuery });
      setIsSearchOpen(false);
    }
  };

  const isHome = activeScreen === SCREENS.HOME || activeScreen === SCREENS.HOME_DESKTOP;

  return (
    // Matches Stitch: fixed, h-16, bg-surface/70 backdrop-blur-md, border-b border-outline-variant/30, flat no shadows
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-16 bg-[#fbf9f4]/90 backdrop-blur-md border-b border-[#c1c7cb]/30 transition-all duration-300">

      {/* Mobile: Menu icon (left) | Desktop: nav links (left) — matches Stitch */}
      <div className="flex items-center">
        {/* Mobile hamburger → goes to Categories */}
        <button
          onClick={() => navigateTo(SCREENS.CATEGORIES)}
          aria-label="Menu"
          className="md:hidden text-[#00151b] flex items-center justify-center p-2 hover:text-[#735c00] transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Desktop nav — matches Stitch: Home, Categories, New Arrivals */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigateTo(SCREENS.HOME)}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${
              isHome ? 'text-[#00151b]' : 'text-[#41484b] hover:text-[#735c00]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo(SCREENS.CATEGORIES)}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${
              activeScreen === SCREENS.CATEGORIES ? 'text-[#00151b]' : 'text-[#41484b] hover:text-[#735c00]'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => navigateTo(SCREENS.SHOP)}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${
              activeScreen === SCREENS.SHOP || activeScreen === SCREENS.SHOP_DESKTOP ? 'text-[#00151b]' : 'text-[#41484b] hover:text-[#735c00]'
            }`}
          >
            New Arrivals
          </button>
        </nav>
      </div>

      {/* Brand name — absolutely centered on all screen sizes, matches Stitch */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <button
          onClick={() => navigateTo(SCREENS.HOME)}
          className="text-base md:text-2xl font-serif font-bold uppercase tracking-widest text-[#00151b] text-center hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Vrindavan Poshakh
        </button>
      </div>

      {/* Right side icons — matches Stitch: Search, Wishlist (desktop), Cart (desktop) */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Search */}
        {isSearchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Search Poshakh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-32 sm:w-44 px-2 py-1 text-xs border-b-2 border-[#735c00] bg-transparent text-[#00151b] focus:outline-none"
            />
            <button type="submit" className="text-[#00151b] p-1 hover:text-[#735c00] transition-colors">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="text-[#71787b] p-1 hover:text-[#00151b] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="text-[#00151b] flex items-center justify-center p-2 hover:text-[#735c00] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
        )}

        {/* Wishlist — desktop only, matches Stitch */}
        <button
          onClick={() => navigateTo(SCREENS.SHOP)}
          aria-label="Wishlist"
          className="hidden md:flex text-[#00151b] items-center justify-center p-2 hover:text-[#735c00] transition-colors relative"
        >
          <span className="material-symbols-outlined text-[24px]">favorite</span>
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#735c00] rounded-full" />
          )}
        </button>

        {/* Cart — desktop only, matches Stitch */}
        <button
          onClick={() => navigateTo(SCREENS.CART)}
          aria-label="Cart"
          className="hidden md:flex text-[#00151b] items-center justify-center p-2 hover:text-[#735c00] transition-colors relative"
        >
          <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#735c00] rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
}
