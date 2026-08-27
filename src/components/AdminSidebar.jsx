import React from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar({ activeAdminTab }) {
  const { navigateTo } = useNavigation();
  const { signOut } = useAuth();

  const navItems = [
    { id: SCREENS.ADMIN_ANALYTICS, label: 'Analytics / Dashboard', icon: 'bar_chart' },
    { id: SCREENS.ADMIN_PRODUCTS, label: 'Products', icon: 'inventory_2' },
    { id: SCREENS.ADMIN_ADD_PRODUCT, label: 'Add Product', icon: 'add_box' },
    { id: SCREENS.ADMIN_ORDERS, label: 'Orders', icon: 'shopping_cart' },
    { id: SCREENS.ADMIN_ORDER_DETAILS, label: 'Order Details', icon: 'receipt_long' },
    { id: SCREENS.ADMIN_CUSTOMERS, label: 'Customers', icon: 'group' },
    { id: SCREENS.ADMIN_USERS, label: 'Users & Access', icon: 'manage_accounts' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigateTo(SCREENS.ADMIN_LOGIN);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex flex-col py-6 h-full w-72 md:w-80 bg-[#fbf9f4] border-r border-[#c1c7cb]/30 shadow-xl hidden md:flex">
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#00151b]">Vrindavan Poshakh</h1>
        <p className="text-xs font-bold text-[#41484b] tracking-widest uppercase mt-1">ADMIN PANEL</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1.5 px-3">
        {navItems.map((item) => {
          const isActive = activeAdminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all text-left font-semibold text-sm ${
                isActive
                  ? 'bg-[#fed65b] text-[#745c00] font-bold shadow-xs'
                  : 'text-[#41484b] hover:bg-[#f0eee9] hover:text-[#00151b]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Switch to Customer Storefront & Sign Out */}
      <div className="px-6 mt-auto pt-6 border-t border-[#c1c7cb]/30 flex flex-col gap-2">
        <button
          onClick={() => navigateTo(SCREENS.HOME)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold text-[#00151b] bg-white border border-[#c1c7cb] hover:border-[#735c00] hover:text-[#735c00] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          <span>View Customer Store</span>
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-[#ba1a1a] hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
