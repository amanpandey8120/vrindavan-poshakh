import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

// Stitch images from Product Detail screen
const PRODUCT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDrmZaG3Yb5kXsT2spCgEF3WjquKeiEeVo4iuA51s1e2TilqasFHboSwEUD-BPnSOKClcGDnM-eCxEAZ9XZyg9aO3Bs_-3YHZa6dNrzxtz6OtMWlA-a5RbCLF3qSKnmTSHfoXudE34qpwX1sMhe8Bcw4R6zZoIgkiw11loOOeljeWAgCtwc1WqxVrhCjQH07_3znAJ9oErIRdUmPO2TBo0ukqupj9bgSaUoIMciCfy-XlpSQUAQpw3BsA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXCFmN60n9Rh7-AwyP9nH9W4RNWxSmQilQ9ahEdDTmh1KULucGK8OtrudntV6ATzW-o6llICj6FB7uoGDlLGDLMy1xK9BKw-3BHTbwFW21AACP05Jn0oYGf1cG1ZcGKz39iZIpUzawiIbUcGwAbq9OfO2TYf9oEKWW9pisAVpEfl5-L2Rp4V-ws_crOLY-uc3t3mzc27Kc1TJXnzKRbUl144B9EqfZ_91g7c9y2sNJQA6ZHT82gwmZw',
];

const RELATED_PRODUCTS = [
  {
    title: 'Golden Peacock Mukut',
    price: '₹899',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJw2KE621PYmtXC-FLfHuXoL8uWnnYMuKgNduHWZIAI00W2EFNkOYxVvRP4Z5dSC22cl5NdeWllrpKExxSgN009KVL0FBcVF6-7V4KEOIBJ4KWTTW3rCVg98T3vWtd7DPtKEWvF7j8m1d4-PSNgWqya46jfwOo8L13JXWEIUw1AfvfrDWT687b2wvaiu2hIMCjPhmBXKyhN04RPTE9M4nAV2F560-ujALfsYsrgt1UwLNykP--iv9cCQ',
  },
  {
    title: 'Pearl & Kundan Haar',
    price: '₹549',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD22itEMQwVdJtOWDYpVgYAqlnGoQ-6uMM1Cv3O2fiN28Dkpa_brrr9EvHdBKQO5cshk-oD47aK07mX8FTWK0qda77qNkaSG8tQL5f7LYUERJD1O7xoCL_nSxwYniv8ajACQJPKX-595a38WgK_fn_T3Dk-RohCJn9WkDxL1k5jEzWf7RbfLF_7tVpyvBx7tBHM64uupgFBTo9S6z-57sRw1wBxnMJZ2SlbSjdBp_VdAKOuq_ecuUvnLw',
  },
  {
    title: 'Royal Blue Silk Poshakh',
    price: '₹2,499',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBasXUrMIl04K0KHVSxK9APqpoEZ7Q_Go_ybbUsKshgIVJYghbjx-tS2FyHTtWl4rD52Yx-HaV6tpEpym1ZYy5u8hzBr27zMNL5RHbLs1c58PjFifTQzXWyeT0O6aAlercdcafHinowkTbZEqj2YiLPbJWVVnhW0Fszm9RKVwQXFR3xJtVFcAm5-wLutr1ySXmT0gbr6Xw2BY0EvGCbJTx9MjsS3tZB6p2sxbeAQTkb6BkqKez_UiyBsg',
  },
  {
    title: 'Brass Aarti Diya',
    price: '₹450',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkOAtDjJNu6khE1srKjxgNGWAmiJgR53fkr1584CxFcyfcOBcs1tS33eyQAasb0OAWh4qacXJplxncMjq13DXQk1B70TQsWrVPlfSjcoRxxiQ1-jj5iKANNE6XxzOzzGxDufsBJa0DVZI6VBOIHJa5qWXcOm5gVPJ1R1xmvBCcG9GgK4O5Cc3QLgsS76G1FpZIXjZi4P035E449rT2Wg61n3c9j8C6p5-iHCTWMPHqqph95vapnxy-5A',
  },
];

export default function ProductDetailScreen() {
  const { selectedProduct, addToCart, navigateTo, wishlist, toggleWishlist } = useNavigation();
  const product = selectedProduct;

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('7 inch');
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const sizes = ['5 inch', '7 inch', '9 inch', '12 inch'];
  const colors = [
    { hex: '#FFD700', label: 'Golden Yellow' },
    { hex: '#E34234', label: 'Vermillion Red' },
    { hex: '#000080', label: 'Royal Blue' },
  ];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 md:pb-0">
      {/* Back button header for mobile — matches Stitch */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-16 bg-[#fbf9f4]/90 backdrop-blur-md border-b border-[#c1c7cb]/30 text-[#00151b] md:hidden">
        <button onClick={() => navigateTo(SCREENS.HOME)} className="p-2 hover:text-[#735c00] transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-base font-serif font-bold uppercase tracking-widest text-[#00151b] flex-1 text-center">
          Vrindavan Poshakh
        </h1>
        <button onClick={() => navigateTo(SCREENS.SEARCH)} className="p-2 hover:text-[#735c00] transition-colors">
          <span className="material-symbols-outlined text-[24px]">search</span>
        </button>
      </div>

      {/* Swipeable Gallery Section — matches Stitch */}
      <section className="relative w-full aspect-[4/5] md:aspect-video bg-[#eae8e3] overflow-hidden pt-16 md:pt-0">
        <div className="relative w-full h-full">
          <img
            src={PRODUCT_IMAGES[currentImageIdx]}
            alt={`${product.title} View ${currentImageIdx + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {/* Gallery dot indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {PRODUCT_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentImageIdx ? 'bg-[#00151b]' : 'bg-[#00151b]/30'}`}
              />
            ))}
          </div>
          {/* Wishlist floating button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Add to Wishlist"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#fbf9f4]/80 backdrop-blur shadow-sm flex items-center justify-center text-[#00151b] hover:text-[#735c00] transition-colors"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>
      </section>

      <div className="md:grid md:grid-cols-12 md:gap-6 md:px-16 md:pt-12 max-w-[1280px] md:mx-auto">
        {/* Product Info Column */}
        <div className="px-4 py-6 md:col-span-5 md:px-0 md:py-0">
          {/* Title & Price on same row — Stitch design */}
          <div className="flex justify-between items-start mb-2 gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#00151b] leading-tight">
              Premium Silk Krishna Poshakh
            </h2>
            <p className="text-2xl md:text-3xl font-serif font-semibold text-[#00151b] shrink-0">₹2,499</p>
          </div>

          {/* Rating row */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-[#fed65b]">
              {[1,2,3,4].map(i => (
                <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
            </div>
            <span className="text-sm text-[#41484b]">4.8 (124 reviews)</span>
          </div>

          <hr className="border-[#c1c7cb]/30 my-6" />

          <div className="space-y-6">
            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <h3 className="text-base font-semibold text-[#00151b]">Perfect For Your Krishna</h3>
                <button
                  onClick={() => navigateTo(SCREENS.FIT_ASSISTANT)}
                  className="text-xs font-bold text-[#735c00] underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedSize === sz
                        ? 'border-2 border-[#735c00] bg-[#fed65b]/10 text-[#00151b] font-semibold'
                        : 'border border-[#c1c7cb] bg-[#fbf9f4] text-[#41484b] hover:border-[#00151b]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <h3 className="text-base font-semibold text-[#00151b] mb-3">Color</h3>
              <div className="flex gap-4">
                {colors.map(({ hex, label }) => (
                  <button
                    key={hex}
                    aria-label={label}
                    onClick={() => setSelectedColor(hex)}
                    className={`w-10 h-10 rounded-full shadow-sm transition-all ${
                      selectedColor === hex
                        ? 'ring-2 ring-offset-2 ring-[#735c00]'
                        : 'ring-1 ring-offset-2 ring-[#c1c7cb] hover:ring-[#00151b]'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2">
              <h3 className="text-base font-semibold text-[#00151b]">Quantity</h3>
              <div className="flex items-center border border-[#c1c7cb] rounded-full bg-[#fbf9f4]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center text-[#00151b] hover:text-[#735c00] rounded-l-full"
                >
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <span className="w-10 text-center text-base text-[#00151b]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-[#00151b] hover:text-[#735c00] rounded-r-full"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Add to Cart (Sticky Panel) — matches Stitch col-span-3 */}
        <div className="hidden md:block md:col-span-3 md:col-start-9 relative">
          <div className="sticky top-24 bg-white p-6 rounded-xl shadow-[0_4px_24px_rgba(0,43,54,0.06)] border border-[#c1c7cb]/20">
            <div className="mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#735c00] text-[18px]">local_shipping</span>
              <span className="text-sm text-[#41484b]">Free shipping on orders over ₹999</span>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#ffe088] to-[#735c00] text-[#00151b] font-bold text-base mb-4 shadow-sm hover:shadow-md transition-shadow"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full border border-[#735c00] text-[#00151b] font-bold text-base hover:bg-[#f5f3ee] transition-colors"
            >
              Add to Cart
            </button>
            {addedToast && (
              <div className="mt-3 p-2 bg-[#002b36] text-[#fed65b] rounded-lg text-xs font-bold text-center">
                Added to cart!
              </div>
            )}
          </div>
        </div>

        {/* Expandable Details Section — matches Stitch <details> accordion */}
        <div className="px-4 py-8 md:col-span-7 md:col-start-1 md:px-0">
          <hr className="border-[#c1c7cb]/30 mb-8 md:hidden" />
          <div className="space-y-0">
            {[
              {
                title: 'Product Details',
                defaultOpen: true,
                content: (
                  <div className="mt-4 text-base text-[#41484b] space-y-4 leading-relaxed">
                    <p>Adorn your beloved deity in the sheer elegance of our Premium Silk Poshakh. Handcrafted by master artisans in Vrindavan, this attire features exquisite zari work and delicate bead detailing, designed to elevate the spiritual ambiance of your home temple.</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Material: 100% Pure Silk</li>
                      <li>Embellishments: Gold Zari & Hand Embroidery</li>
                      <li>Includes: Lehnga, Patka, and Choli</li>
                    </ul>
                  </div>
                )
              },
              {
                title: 'Care Instructions',
                content: <p className="mt-4 text-base text-[#41484b] leading-relaxed">Dry clean only. Store in a soft cotton cloth to preserve the zari work. Avoid direct exposure to perfumes or harsh sunlight.</p>
              },
              {
                title: 'Shipping & Returns',
                content: <p className="mt-4 text-base text-[#41484b] leading-relaxed">Dispatched within 24 hours. Delivery in 3-5 business days. 7-day easy returns if the product is unused and in original packaging.</p>
              }
            ].map(({ title, defaultOpen, content }) => (
              <details key={title} open={defaultOpen} className="group border-b border-[#c1c7cb]/30 pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none py-4">
                  <h3 className="text-base font-semibold text-[#00151b]">{title}</h3>
                  <span className="material-symbols-outlined text-[#00151b] group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                {content}
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Complete the Shringar — related products section from Stitch */}
      <section className="py-12 bg-[#f5f3ee] px-4 md:px-16 mt-8 rounded-t-3xl md:rounded-3xl">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] text-center mb-8">
          Complete the Shringar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-[1280px] mx-auto">
          {RELATED_PRODUCTS.map((item, idx) => (
            <div
              key={idx}
              className="group cursor-pointer"
              onClick={() => navigateTo(SCREENS.JEWELLERY)}
            >
              <div className="relative aspect-square bg-[#eae8e3] rounded-xl overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button aria-label="Add to Wishlist" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#fbf9f4]/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#00151b]">
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                </button>
              </div>
              <h3 className="text-sm font-sans text-[#00151b] truncate">{item.title}</h3>
              <p className="text-sm font-semibold text-[#41484b] mt-0.5">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Sticky Bottom Actions — matches Stitch exactly */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-[#fbf9f4]/95 backdrop-blur-lg border-t border-[#c1c7cb]/30 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] flex gap-3 z-40 md:hidden">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 rounded-full border border-[#735c00] text-[#00151b] font-bold text-base hover:bg-[#f5f3ee] transition-colors"
        >
          Add to Cart
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#ffe088] to-[#735c00] text-[#00151b] font-bold text-base shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </main>
  );
}
