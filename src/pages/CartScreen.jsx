import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

// Stitch Cart images
const STITCH_CART_ITEMS = [
  {
    id: 'c1',
    title: 'Royal Blue Silk Poshakh',
    detail: 'Size: 4 | Color: Blue/Gold',
    price: 2499,
    qty: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBasXUrMIl04K0KHVSxK9APqpoEZ7Q_Go_ybbUsKshgIVJYghbjx-tS2FyHTtWl4rD52Yx-HaV6tpEpym1ZYy5u8hzBr27zMNL5RHbLs1c58PjFifTQzXWyeT0O6aAlercdcafHinowkTbZEqj2YiLPbJWVVnhW0Fszm9RKVwQXFR3xJtVFcAm5-wLutr1ySXmT0gbr6Xw2BY0EvGCbJTx9MjsS3tZB6p2sxbeAQTkb6BkqKez_UiyBsg',
  },
  {
    id: 'c2',
    title: 'Peacock Motif Haar',
    detail: 'Size: Standard | Color: Gold',
    price: 1299,
    qty: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCawTQLa4MjQBQPSE9x_5WPcRJ1sUlx8JORIWgtoJjhpApb_EExN3tqX9CsyfBTGkL7ZDgp4PHPuo5K7gOLboqUeLvP5rjctAh-xJ1cih0_nMw4EI9o9EfKHYGeGMQb_YL3iz_HOHGRCWp4nMkNKFgPQSjVt-GlASrb74KzCjEYXGSZLfnUrJFCqXFUB_KUIWgZOpFSBYQ9jhMn84jDXcv3X-aVHwxGG1tDubRtkK0-jWCQ7rFJzGT4zA',
  },
];

const RECOMMENDED = [
  {
    title: 'Brass Aarti Diya',
    price: '₹450',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkOAtDjJNu6khE1srKjxgNGWAmiJgR53fkr1584CxFcyfcOBcs1tS33eyQAasb0OAWh4qacXJplxncMjq13DXQk1B70TQsWrVPlfSjcoRxxiQ1-jj5iKANNE6XxzOzzGxDufsBJa0DVZI6VBOIHJa5qWXcOm5gVPJ1R1xmvBCcG9GgK4O5Cc3QLgsS76G1FpZIXjZi4P035E449rT2Wg61n3c9j8C6p5-iHCTWMPHqqph95vapnxy-5A',
  },
  {
    title: 'Sandalwood Dhoop',
    price: '₹299',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnhPQUVfJYrB9sBR_n9vcMA2eW6ioUi-mDWvNJ0FHZYMomCCgYApVyFDlNaEppb-8nWM39KVD2RCMRdLuc1RJB4FAr1xxKv60Yo_ZVQf82WJZ2D4aCK78c4WKSx1C8PxVLoknm8Q8qd-lew7SIg-n2nkPQo1NDhs2lHTX6IiwvxlZeH0loQ9q-DaPvhGDbezrxyjMjVNmlyJTdkyGz7cqIkZuS5EDeXST_Uaeahnj2TlzTE2XQa_2Tsw',
  },
];

export default function CartScreen() {
  const { navigateTo } = useNavigation();

  const [items, setItems] = useState(STITCH_CART_ITEMS);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const updateQty = (id, delta) => {
    setItems(prev => prev
      .map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
      .filter(item => item.qty > 0)
    );
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 150;
  const total = subtotal - discount + shipping;

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'VRINDAVAN10' || code === 'BHAKTI10') {
      setDiscount(Math.round(subtotal * 0.1));
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "VRINDAVAN10"');
    }
  };

  if (checkoutSuccess) {
    return (
      <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 text-center border border-[#e4e2dd] max-w-lg w-full shadow-xl">
          <div className="w-16 h-16 bg-[#fed65b] rounded-full flex items-center justify-center text-[#745c00] mx-auto mb-4">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#00151b]">Order Placed Successfully!</h2>
          <p className="text-xs text-[#41484b] mt-2 leading-relaxed">
            Thank you for choosing Vrindavan Poshakh. Your divine items are being packed with devotion.
          </p>
          <button
            onClick={() => { setCheckoutSuccess(false); navigateTo(SCREENS.HOME); }}
            className="gold-gradient-bg text-[#00151b] px-8 py-3 rounded-full text-xs font-bold mt-6"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-32 md:pb-40 px-4 md:px-16 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen">

      {/* Cart Items Section */}
      <section className="lg:col-span-8 space-y-6">
        {/* Free Shipping Progress Bar — matches Stitch */}
        <div className="bg-[#f5f3ee] p-4 rounded-lg border border-[#c1c7cb]/30 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-semibold text-[#00151b]">
              {subtotal >= 999
                ? 'You qualify for FREE delivery!'
                : `Add ₹${(999 - subtotal).toLocaleString('en-IN')} more for free delivery`}
            </span>
            <span className="material-symbols-outlined text-[#735c00]">local_shipping</span>
          </div>
          <div className="w-full bg-[#e4e2dd] rounded-full h-2">
            <div
              className="bg-[#735c00] h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e4e2dd]">
            <span className="material-symbols-outlined text-[64px] text-[#71787b]">shopping_bag</span>
            <h2 className="text-xl font-serif font-bold text-[#00151b] mt-2">Your cart is empty</h2>
            <button onClick={() => navigateTo(SCREENS.SHOP)} className="gold-gradient-bg text-[#00151b] px-6 py-3 rounded-full text-xs font-bold mt-4">Browse Products</button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,43,54,0.05)] relative"
              >
                {/* Close button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-[#41484b] hover:text-[#ba1a1a] transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>

                {/* Product image */}
                <div className="w-24 h-32 md:w-32 md:h-40 flex-shrink-0 bg-[#f0eee9] rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Product info */}
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <h3 className="text-base font-semibold text-[#00151b]">{item.title}</h3>
                    <p className="text-sm text-[#41484b] mt-1">{item.detail}</p>
                    <p className="text-base font-semibold text-[#735c00] mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-[#c1c7cb] rounded-md overflow-hidden bg-[#fbf9f4]">
                      <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 text-[#00151b] hover:bg-[#e4e2dd] transition-colors">-</button>
                      <span className="px-3 py-1 text-sm border-x border-[#c1c7cb] bg-white">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 text-[#00151b] hover:bg-[#e4e2dd] transition-colors">+</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Recommended for You section — from Stitch */}
        <section className="mt-16 border-t border-[#c1c7cb]/30 pt-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-8 text-center">Recommended for You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RECOMMENDED.map((item, idx) => (
              <div key={idx} className="group cursor-pointer" onClick={() => navigateTo(SCREENS.SHOP)}>
                <div className="aspect-[4/5] bg-[#f0eee9] rounded-xl overflow-hidden mb-3 relative shadow-sm">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-[#41484b] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                  </button>
                </div>
                <h4 className="text-sm text-[#00151b] truncate">{item.title}</h4>
                <p className="text-base font-semibold text-[#735c00] mt-1">{item.price}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* Order Summary Section */}
      <section className="lg:col-span-4">
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,43,54,0.05)] p-6 sticky top-24">
          <h2 className="text-2xl font-serif font-bold text-[#00151b] mb-6 border-b border-[#c1c7cb]/30 pb-4">
            Order Summary
          </h2>

          {/* Coupon Input */}
          <form onSubmit={applyPromo} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Coupon code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 bg-[#f5f3ee] border-b border-[#002b36] focus:border-b-2 focus:border-[#735c00] focus:ring-0 text-sm px-3 py-2 rounded-t-md outline-none transition-all"
            />
            <button type="submit" className="bg-[#00151b] text-white px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase hover:bg-[#002b36] transition-colors">
              Apply
            </button>
          </form>
          {promoError && <p className="text-xs text-[#ba1a1a] mb-4 -mt-4">{promoError}</p>}
          {discount > 0 && <p className="text-xs text-[#735c00] font-bold mb-4 -mt-4">Discount applied: -₹{discount.toLocaleString('en-IN')}</p>}

          {/* Price Breakdown */}
          <div className="space-y-3 text-sm text-[#41484b] border-b border-[#c1c7cb]/30 pb-6 mb-6">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span className="text-[#00151b] font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-[#735c00]">-₹{discount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-[#00151b] font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-semibold text-[#00151b]">Total</span>
            <span className="text-2xl font-serif font-bold text-[#735c00]">₹{total.toLocaleString('en-IN')}</span>
          </div>

          {/* Desktop Checkout Button */}
          <button
            onClick={() => setCheckoutSuccess(true)}
            className="hidden md:block w-full bg-gradient-to-r from-[#fed65b] to-[#735c00] text-[#00151b] text-base font-bold py-4 rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Proceed to Checkout
          </button>
        </div>
      </section>

      {/* Mobile Sticky Checkout Button */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#c1c7cb]/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <button
          onClick={() => setCheckoutSuccess(true)}
          className="w-full bg-gradient-to-r from-[#fed65b] to-[#735c00] text-[#00151b] text-base font-bold py-4 rounded-full shadow-md"
        >
          Proceed to Checkout – ₹{total.toLocaleString('en-IN')}
        </button>
      </div>
    </main>
  );
}
