import React, { useState, useEffect } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminProductsScreen() {
  const { navigateTo } = useNavigation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories (name), product_images (url)')
          .eq('is_published', true);

        if (error) throw error;
        const normalized = (data || []).map((p) => ({
          ...p,
          category: p.categories?.name || '',
          image: p.product_images?.[0]?.url || null
        }));
        setProducts(normalized);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoriesList = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
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
                {categoriesList.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c1c7cb]/20 overflow-hidden">
            {productLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="material-symbols-outlined text-[40px] text-[#735c00] animate-spin">sync</div>
              </div>
            ) : (
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-[#41484b]">
                        No products available yet.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f5f3ee]/50 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-[#e4e2dd] overflow-hidden shrink-0 flex items-center justify-center text-[#71787b]">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-[20px]">image</span>
                            )}
                          </div>
                          <span className="font-semibold text-sm text-[#00151b]">{item.title}</span>
                        </td>
                        <td className="py-4 px-6 text-xs text-[#41484b] font-mono">{item.sku || ''}</td>
                        <td className="py-4 px-6 text-xs text-[#41484b]">{item.category || ''}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-[#00151b]">{item.price !== undefined ? `₹${item.price.toLocaleString('en-IN')}` : ''}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              item.stock === 0 ? 'bg-[#e4e2dd] text-[#71787b]' :
                              item.stock < 5 ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6]' :
                              'bg-[#fed65b]/20 text-[#745c00] border border-[#fed65b]/50'
                            }`}
                          >
                            {item.stock !== undefined ? `${item.stock} in stock` : ''}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}