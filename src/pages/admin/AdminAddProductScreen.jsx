import React, { useState, useEffect } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminAddProductScreen() {
  const { navigateTo } = useNavigation();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [material, setMaterial] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const finalPrice = basePrice ? Number(basePrice) : 0;
      const compareAtPrice = discountPrice ? Number(discountPrice) : null;

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title: productName.trim(),
          description: description.trim(),
          price: finalPrice,
          compare_at_price: compareAtPrice,
          category_id: categoryId ? categoryId : null,
          sku: sku.trim() || null,
          tags: material ? [material.trim()] : [],
          is_published: true,
          stock: stock ? Number(stock) : 0,
          sold_count: 0,
          rating: 0,
          reviews_count: 0,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Add product image if provided
      if (product && imageUrl.trim()) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            url: imageUrl.trim(),
            alt_text: productName.trim() ? productName.trim() : null,
            display_order: 0,
          });
        if (imageError) throw imageError;
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        navigateTo(SCREENS.ADMIN_PRODUCTS);
      }, 1500);
    } catch (err) {
      console.error('Error saving product:', err);
      setSaveError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
      <AdminSidebar activeAdminTab={SCREENS.ADMIN_ADD_PRODUCT} />

      <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
        <form onSubmit={handleSave} className="pt-24 pb-16 px-4 md:px-16 max-w-[1280px] w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">
                <button type="button" onClick={() => navigateTo(SCREENS.ADMIN_PRODUCTS)} className="hover:text-[#00151b]">
                  Products
                </button>
                <span>/</span>
                <span className="text-[#735c00]">Add Product</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b]">Add New Product</h2>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigateTo(SCREENS.ADMIN_PRODUCTS)}
                className="px-6 py-2.5 rounded-full border border-[#c1c7cb] text-sm font-semibold hover:bg-[#f0eee9] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#fed65b] to-[#ffe088] text-[#00151b] text-sm font-bold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-4 mb-6 bg-[#002b36] text-[#fed65b] rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              Product successfully published! Redirecting to products list...
            </div>
          )}

          {saveError && (
            <div className="p-4 mb-6 bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{saveError}</span>
            </div>
          )}

          {/* 2-Column Grid Layout matching Stitch */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: General Info & Media */}
            <div className="lg:col-span-8 space-y-8">
              {/* General Information Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-6 border-b border-[#c1c7cb]/30 pb-2">
                  General Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      placeholder="e.g. Royal Crimson Silk Saree"
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-base text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed product specifications and sacred significance..."
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-sm text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                        Category
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-sm text-[#00151b] focus:ring-0 focus:border-[#735c00] py-2 px-1 outline-none"
                      >
                        <option value="">Select category...</option>
                        {categories.length === 0 ? (
                          <option disabled>No categories available yet.</option>
                        ) : (
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))
                        )}
                      </select>
                      {categories.length === 0 && (
                        <p className="text-[11px] text-[#71787b] mt-1">
                          No categories yet — add one from the Products section first.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="e.g. Pure Banarasi Silk"
                        className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-sm text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Media Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-6 border-b border-[#c1c7cb]/30 pb-2">Media</h3>
                <div>
                  <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-sm text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors"
                  />
                  <p className="text-[11px] text-[#71787b] mt-1">
                    Paste the hosted image URL. This will be saved to product_images.
                  </p>
                </div>

                {imageUrl && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="relative aspect-square rounded-lg bg-[#f0eee9] overflow-hidden border border-[#c1c7cb]/40">
                      <img
                        src={imageUrl}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 bg-[#ba1a1a] text-white rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column: Pricing & Inventory */}
            <div className="lg:col-span-4 space-y-8">
              {/* Pricing Section */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-6 border-b border-[#c1c7cb]/30 pb-2">Pricing</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                      Base Price (₹)
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      required
                      min="0"
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-lg font-bold text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                      Comparison Price (₹) (optional)
                    </label>
                    <input
                      type="number"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      min="0"
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-lg font-bold text-[#735c00] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Inventory & Sizes Section */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-6 border-b border-[#c1c7cb]/30 pb-2">
                  Inventory & Options
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                      SKU (Stock Keeping Unit)
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. VP-POSH-001"
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-sm font-mono text-[#00151b] focus:ring-0 focus:border-[#735c00] py-2 px-1 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      min="0"
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-base text-[#00151b] focus:ring-0 focus:border-[#735c00] py-2 px-1 outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}