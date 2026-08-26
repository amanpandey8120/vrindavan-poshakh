import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminAddProductScreen() {
  const { navigateTo } = useNavigation();
  const [productName, setProductName] = useState('Royal Crimson Silk Saree');
  const [description, setDescription] = useState('Handcrafted pure silk with 24k gold zari embroidery, suitable for festive occasions and deities.');
  const [category, setCategory] = useState('Traditional Silk');
  const [material, setMaterial] = useState('Pure Banarasi Silk');
  const [basePrice, setBasePrice] = useState('24500');
  const [discountPrice, setDiscountPrice] = useState('21999');
  const [sku, setSku] = useState('VP-SLK-001');
  const [stock, setStock] = useState('45');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      navigateTo(SCREENS.ADMIN_PRODUCTS);
    }, 1500);
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
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#fed65b] to-[#ffe088] text-[#00151b] text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                Save Product
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-4 mb-6 bg-[#002b36] text-[#fed65b] rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              Product successfully published! Redirecting to products list...
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
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-sm text-[#00151b] focus:ring-0 focus:border-[#735c00] py-2 px-1 outline-none"
                      >
                        <option>Traditional Silk</option>
                        <option>Gold Embroidery</option>
                        <option>Accessories</option>
                        <option>Mukut & Jewellery</option>
                        <option>Shringar Bundles</option>
                      </select>
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

              {/* Media Upload Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-6 border-b border-[#c1c7cb]/30 pb-2">Media</h3>
                <div className="border-2 border-dashed border-[#c1c7cb] rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#f5f3ee] transition-colors group">
                  <div className="w-16 h-16 rounded-full bg-[#f0eee9] flex items-center justify-center mb-4 group-hover:bg-[#fed65b] transition-colors">
                    <span className="material-symbols-outlined text-[32px] text-[#41484b] group-hover:text-[#00151b]">
                      cloud_upload
                    </span>
                  </div>
                  <p className="text-base font-semibold text-[#00151b] mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#41484b]">High-resolution PNG, JPG, or WEBP</p>
                </div>

                {/* Uploaded Thumbnail Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="relative aspect-square rounded-lg bg-[#f0eee9] overflow-hidden border border-[#c1c7cb]/40">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEhgZgoo8y56-4Jyh_OmK5_d1VkfHIOERqB576Y_V--3Z68yqohg98c8PABxrZNfpQ7z8vJg5yemKs2qeZAxacBTkN0ySdZ28vLx8apFUbjHRULR8A2gHy6Q9YNX5P1scbzxqkXzI7zDTEYyF6GrBCpemF11TnrssEUW234ypYCi4CZzH1GZ5cHhh7oNLInBHy8iEcHcr8I9oVy52gkp8n1j3GD3gGCtUatuP3Kxo3AiDI5Wu_883nwQ"
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-[#ba1a1a] text-white rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
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
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-lg font-bold text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-2">
                      Discounted Price (₹)
                    </label>
                    <input
                      type="number"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
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
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-base text-[#00151b] focus:ring-0 focus:border-[#735c00] py-2 px-1 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-3">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['No. 0', 'No. 1', 'No. 2', 'No. 3', 'No. 4', 'No. 5'].map((sz, i) => (
                        <label key={sz} className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={i < 4} className="sr-only peer" />
                          <span className="px-3 py-1.5 border border-[#c1c7cb] rounded-full text-xs font-semibold peer-checked:bg-[#00151b] peer-checked:text-white peer-checked:border-[#00151b] transition-colors">
                            {sz}
                          </span>
                        </label>
                      ))}
                    </div>
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
