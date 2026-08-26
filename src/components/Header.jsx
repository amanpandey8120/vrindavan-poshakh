import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const {
    activeScreen,
    navigateTo,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
  } = useNavigation();
  const { user, profile, signOut } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo(SCREENS.SEARCH, { query: searchQuery });
      setIsSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigateTo(SCREENS.HOME);
    setShowUserMenu(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isHome = activeScreen === SCREENS.HOME || activeScreen === SCREENS.HOME_DESKTOP;

  return (
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

      {/* Right side icons — matches Stitch: Search, Wishlist (desktop), Cart (desktop), User Menu */}
      <div className="flex items-center gap-2 md:gap-4 relative">

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

        {/* User Menu / Auth Buttons */}
        <div className="relative">
          {user ? (
            <>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#f0eee9] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#fed65b]/40 border-2 border-[#735c00] flex items-center justify-center text-[#735c00] text-sm font-bold">
                  <span className="text-[16px]">{getInitials(profile?.full_name || user.user_metadata?.full_name)}</span>
                </div>
                <span className="hidden sm:block text-xs font-bold text-[#00151b]">
                  {profile?.full_name || user.user_metadata?.full_name || 'Account'}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#41484b]">expand_more</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#c1c7cb]/20 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-[#c1c7cb]/20">
                    <p className="text-xs font-bold text-[#00151b] truncate">
                      {profile?.full_name || user.user_metadata?.full_name || 'Devotee'}
                    </p>
                    <p className="text-xs text-[#41484b] truncate">{user.email}</p>
                    {profile?.role === 'admin' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#00151b]/10 text-[#00151b] mt-1">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { navigateTo(SCREENS.ACCOUNT); setShowUserMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-[#00151b] hover:bg-[#f0eee9] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">account_circle</span>
                    My Account
                  </button>
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => { navigateTo(SCREENS.ADMIN_ANALYTICS); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-[#00151b] hover:bg-[#f0eee9] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">shield_person</span>
                      Admin Dashboard
                    </button>
                  )}
                  <hr className="my-2 border-[#c1c7cb]/20" />
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-[#ef4444] hover:bg-[#fee2e2] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigateTo(SCREENS.LOGIN)}
                className="text-xs font-bold text-[#41484b] hover:text-[#735c00] transition-colors px-3 py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo(SCREENS.SIGNUP)}
                className="gold-gradient-bg text-[#00151b] px-4 py-1.5 rounded-full text-xs font-bold"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}