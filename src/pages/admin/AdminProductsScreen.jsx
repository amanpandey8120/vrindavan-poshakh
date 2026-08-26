import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';

const ADMIN_PRODUCTS = [
  {
    id: 'p1',
    name: 'Royal Crimson Silk Saree',
    sku: 'VP-SILK-001',
    category: 'Traditional Silk',
    price: '₹24,500',
    stock: 'In Stock (45)',
    stockStatus: 'in-stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6tni2BXmK5TEL69BRUHQm91YVEUbpBPPEFatb5QejJNXjU0QAkBNldPQH4krOw21gmf5D9W_iSxWlB8so723BHB6gbvKCO-6Hlq6PcP7J3zb51SJkcJ3N3aYYLGWtJnLzj1PnbwAJkePkwZ5_z9YyppoFI-UPKjCCiYBD6KURGJBCFVRkngFZTBsrDnC8IHm3sBbQYX_ZW_NLdfS3vLpRXZpn_lX_2RudlI96zQhreKtPwd8AvMCptg'
  },
  {
    id: 'p2',
    name: 'Golden Peacock Silk Poshakh',
    sku: 'VP-POSH-002',
    category: 'Traditional Silk',
    price: '₹1,250',
    stock: 'In Stock (28)',
    stockStatus: 'in-stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBslFOIdh9nPDVqcOO8pr-JpIt5DM7cNjgOK_ikXWn0N3QkgU1eRW_XU9FYVdwZg9jJv7wzwfGkCtk3JjVyWYNhXVxNxPF_Z5ESCIMJXkfgrYPKLjoFfRvxNsMaef3QTrwu1CEGNKujgvPk_CX9s8H-FwmuiFkf4SCh5ZOqy_BGMXRRk62WRLWdG_gbZju8XEuN43qV1ccWXetzUy11fLYEtndZkVPQ7Dp623063xgzihGq4uUGtVz6Ow'
  },
  {
    id: 'p3',
    name: 'Crimson Zardozi Velvet Set',
    sku: 'VP-VEL-008',
    category: 'Gold Embroidery',
    price: '₹2,400',
    stock: 'Low Stock (4)',
    stockStatus: 'low-stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4xK0H4wrW7vxlc5cXpAU03_EqEcD0BP6LWrZqM7bQbkxiQjI9o0AW7ERquWo7oCk-QSf7xJZc0kc1lpdX1IeEEAAZzUSgVTWMxhwH60EDkKIkw-GoSO_zEeHut4E3MhS-KIAsxSpv1fPlDLhZ8i02aQd47lq6pvGkABYfVwR_6bv5So03lIbXjo5PKIqDGrI7NobacEokVXFGATAwy49-iLWPoNRyyZfbin3M3eqK1wdZiTyBSoLLqA'
  },
  {
    id: 'p4',
    name: 'Mor-Pankh Mukut & Chandrika',
    sku: 'VP-MUK-015',
    category: 'Accessories',
    price: '₹1,850',
    stock: 'In Stock (12)',
    stockStatus: 'in-stock',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1USSgO_u9Y5UTOuCkzXRtYMyzXk3bcg2wWvBQ99cZGx7qhlWZegaGPd8_68BUfd0CsiIt2-G9N-PpEHGjd_mveiiB6vwxn_zhc7ZcN7B8kHJG8khDFdTg2kg-hQ_V5te9XZ9Et-Q_6Xb7FUotAVg3U18TuDf5Gto7Y6Nvvfn0i3vTN5UWATiRtwGxCyTmrGxz6ZCWC5PxKvVDh_VzY43-ts6hqsgFgwHp8fVblKbpa2VCGp-2Aunib0UdY'
  },
  {
    id: 'p5',
    name: 'Carved Brass Bansuri',
    sku: 'VP-BAN-003',
    category: 'Accessories',
    price: '₹890',
    stock: 'Out of Stock (0)',
    stockStatus: 'out-stock',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UoTBK6kJlWjX_3xcpwXGN3P_hFi0kMCCT-lwy8WA5Qq9hSkyKojYs4MtgBhiYayOQh3ngS2XkgR4jwP1vxpCCY2KjU4uDAI7Plhu8GXye-Vnb3Wgy4IUVbQ3nQ_OK-dYtWq3KGe0vX175WaOwmgRL6RUJGbAjIO0usd4RwupBZdBca1d9VgqzEbYO-CdfZ5g1d-Dt0E8paNqtXddMx3MBqCGzwodFEafBIvxV1vor82Rd4QEB4o5LO5qk'
  }
];

export default function AdminProductsScreen() {
  const { navigateTo } = useNavigation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const filtered = ADMIN_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All Categories' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
      <AdminSidebar activeAdminTab={SCREENS.ADMIN_PRODUCTS} />

      <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
        <div className="pt-24 pb-16 px-4 md:px-16 max-w-[1280px] w-full">
          {/* Header & Action Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">Products</h2>
              <p className="text-sm text-[#41484b]">Manage your inventory, pricing, and product details.</p>
            </div>
            <button
              onClick={() => navigateTo(SCREENS.ADMIN_ADD_PRODUCT)}
              className="bg-gradient-to-r from-[#fed65b] to-[#ffe088] text-[#00151b] px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity text-sm font-bold shadow-md self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c1c7cb]/20 flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71787b]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or SKU..."
                className="w-full pl-10 pr-4 py-2 bg-[#f5f3ee] border-b border-[#406370] focus:border-[#fed65b] focus:ring-0 focus:outline-none transition-colors text-sm rounded-t-md"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#f5f3ee] border-b border-[#406370] focus:border-[#fed65b] focus:ring-0 focus:outline-none transition-colors text-sm px-4 py-2 rounded-t-md"
              >
                <option>All Categories</option>
                <option>Traditional Silk</option>
                <option>Gold Embroidery</option>
                <option>Accessories</option>
              </select>
            </div>
          </div>

          {/* Products Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c1c7cb]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f5f3ee] border-b border-[#c1c7cb]/30">
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Product</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">SKU</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Price</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Stock Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c1c7cb]/20">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f5f3ee]/50 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-[#e4e2dd] overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-sm text-[#00151b]">{item.name}</span>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#41484b] font-mono">{item.sku}</td>
                      <td className="py-4 px-6 text-xs text-[#41484b]">{item.category}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-[#00151b]">{item.price}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.stockStatus === 'in-stock'
                              ? 'bg-[#fed65b]/20 text-[#745c00] border border-[#fed65b]/50'
                              : item.stockStatus === 'low-stock'
                              ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6]'
                              : 'bg-[#e4e2dd] text-[#71787b]'
                          }`}
                        >
                          {item.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigateTo(SCREENS.ADMIN_ADD_PRODUCT)}
                            className="p-1 text-[#41484b] hover:text-[#735c00] transition-colors"
                            title="Edit Product"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            className="p-1 text-[#41484b] hover:text-[#ba1a1a] transition-colors"
                            title="Delete Product"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
