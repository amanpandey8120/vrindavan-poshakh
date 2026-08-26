import React from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

export default function BottomNavBar() {
  const { activeScreen, navigateTo, cartCount } = useNavigation();

  const navItems = [
    { screen: SCREENS.HOME, icon: 'home', label: 'Home' },
    { screen: SCREENS.CATEGORIES, icon: 'grid_view', label: 'Categories' },
    { screen: SCREENS.SHOP, icon: 'favorite', label: 'Wishlist' },
    { screen: SCREENS.CART, icon: 'shopping_bag', label: 'Cart', badge: cartCount },
    { screen: SCREENS.ACCOUNT, icon: 'person', label: 'Account' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 bg-[#fbf9f4]/90 backdrop-blur-md border-t border-[#c1c7cb]/30 shadow-sm">
      {navItems.map(({ screen, icon, label, badge }) => {
        const isActive = activeScreen === screen ||
          (screen === SCREENS.HOME && activeScreen === SCREENS.HOME_DESKTOP) ||
          (screen === SCREENS.SHOP && activeScreen === SCREENS.SHOP_DESKTOP);

        return (
          <button
            key={screen}
            onClick={() => navigateTo(screen)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-all duration-200 relative ${
              isActive ? 'text-[#735c00] font-bold -translate-y-[2px]' : 'text-[#41484b] hover:text-[#00151b]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {icon}
            </span>
            {badge > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-[#735c00] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {badge}
              </span>
            )}
            <span className="text-[10px] font-label-caps tracking-wider mt-0.5 uppercase">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
