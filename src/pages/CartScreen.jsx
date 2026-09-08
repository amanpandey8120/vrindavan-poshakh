import React, { useState, useEffect } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import { supabase } from '../lib/supabase';

export default function CartScreen() {
  const { navigateTo, user } = useNavigation();
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  // Fetch cart items from Supabase
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setItems([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('*, products (title, price, product_images (url))')
          .eq('user_id', user.id);

        if (error) throw error;
        const normalized = (data || []).map((item) => ({
          id: item.id,
          title: item.products?.title || '',
          price: item.products?.price || 0,
          image: item.products?.product_images?.[0]?.url || null,
          quantity: item.quantity,
          detail: ''
        }));
        setItems(normalized);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setItems([]);
      } finally {
        setLoadingCoupons(false);
      }
    };

    fetchCartItems();
  }, [user]);

  // Fetch coupons from Supabase
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        setCoupons(data || []);
      } catch (err) {
        console.error('Error fetching coupons:', err);
        setCoupons([]);
      } finally {
        setLoadingCoupons(false);
      }
    };

    fetchCoupons();
  }, []);

  const updateQty = (index, delta) => {
    setItems(prev => {
      const updated = [...prev];
      const newQty = prev[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      // Also update in Supabase
      if (user) {
        const itemId = prev[index].id;
        try {
          supabase
            .from('cart_items')
            .update({ quantity: newQty })
            .eq('id', itemId)
            .eq('user_id', user.id);
        } catch (e) {
          console.error('Error updating cart item:', e);
        }
      }
      return updated;
    });
  };

  const removeItem = (index) => {
    setItems(prev => {
      const removed = prev.filter((_, i) => i !== index);
      // Also remove from Supabase
      if (user && prev[index]) {
        try {
          supabase
            .from('cart_items')
            .delete()
            .eq('id', prev[index].id)
            .eq('user_id', user.id);
        } catch (e) {
          console.error('Error removing cart item:', e);
        }
      }
      return removed;
    });
  };

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === code);
    if (coupon) {
      setDiscount(Math.round(coupon.discount_value));
      setPromoError('');
      // Update current_uses in Supabase
      try {
        supabase
          .from('coupons')
          .update({ current_uses: coupon.current_uses + 1 })
          .eq('code', code);
      } catch (e) {
        console.error('Error updating coupon uses:', e);
      }
    } else {
      setPromoError('Invalid code');
    }
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 150;
  const total = subtotal - discount + shipping;

  if (loadingCoupons) {
    return (
      <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16">
        <div className="flex-1 flex items-center justify-center h-[400px]">
          <div className="material-symbols-outlined text-[48px] text-[#735c00] animate-spin">sync</div>
          <p className="mt-4 text-[#41484b]">Loading cart...</p>
        </div>
      </main>
    );
  }

  if (checkoutSuccess) {
    return (
      <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 md:p-12 text-center border border-[#c1c7cb]/20 max-w-md shadow-sm">
          <span className="material-symbols-outlined text-[56px] text-[#735c00]">check_circle</span>
          <h2 className="text-2xl font-serif font-bold text-[#00151b] mt-4">Order Placed!</h2>
          <p className="text-sm text-[#41484b] mt-2 leading-relaxed">
            Your order has been placed successfully. You can track it from your account.
          </p>
          <button
            onClick={() => navigateTo(SCREENS.HOME)}
            className="gold-gradient-bg text-[#00151b] px-6 py-3 rounded-full text-xs font-bold mt-6"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-32 md:pb-40 px-4 md:px-16 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen">
        {/* Cart Items Section */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e4e2dd]">
            <span className="material-symbols-outlined text-[64px] text-[#71787b]">shopping_bag</span>
            <h2 className="text-xl font-serif font-bold text-[#00151b] mt-2">Your cart is empty</h2>
            <p className="text-base text-[#41484b] mt-2">
              Add products from the shop to your cart.
            </p>
            <button onClick={() => navigateTo(SCREENS.SHOP)} className="gold-gradient-bg text-[#00151b] px-6 py-3 rounded-full text-xs font-bold mt-4">
              Browse Products
            </button>
          </div>
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
        <div className="space-y-4">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="flex gap-4 p-4 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,43,54,0.05)] relative"
            >
              {/* Close button */}
              <button
                onClick={() => removeItem(index)}
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
                  <p className="text-sm text-[#41484b] mt-1">{item.detail || ''}</p>
                  <p className="text-base font-semibold text-[#735c00] mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-[#c1c7cb] rounded-md overflow-hidden bg-[#fbf9f4]">
                    <button onClick={() => updateQty(index, -1)} className="px-3 py-1 text-[#00151b] hover:bg-[#e4e2dd] transition-colors">-</button>
                    <span className="px-3 py-1 text-sm border-x border-[#c1c7cb] bg-white">{item.quantity}</span>
                    <button onClick={() => updateQty(index, 1)} className="px-3 py-1 text-[#00151b] hover:bg-[#e4e2dd] transition-colors">+</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
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