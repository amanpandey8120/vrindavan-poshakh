import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminOrderDetailsScreen() {
  const { navigateTo } = useNavigation();
  const [orderStatus, setOrderStatus] = useState('Processing');
  const [trackingNumber, setTrackingNumber] = useState('DTDC-DEL-984210');
  const [copied, setCopied] = useState(false);

  const copyTracking = () => {
    navigator.clipboard?.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
      <AdminSidebar activeAdminTab={SCREENS.ADMIN_ORDER_DETAILS} />

      <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
        <div className="pt-24 pb-16 px-4 md:px-16 max-w-[1280px] w-full">
          {/* Back & Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">
                <button type="button" onClick={() => navigateTo(SCREENS.ADMIN_ORDERS)} className="hover:text-[#00151b]">
                  Orders
                </button>
                <span>/</span>
                <span className="text-[#735c00]">ORD-2026-8942</span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b]">Order ORD-2026-8942</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#fed65b]/30 text-[#745c00] border border-[#fed65b]">
                  {orderStatus}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-full border border-[#c1c7cb] text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setOrderStatus('Shipped')}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#fed65b] to-[#ffe088] text-[#00151b] text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                Mark as Shipped
              </button>
            </div>
          </div>

          {/* Grid Layout matching Stitch */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Items & Timeline */}
            <div className="lg:col-span-8 space-y-8">
              {/* Ordered Items Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-6 border-b border-[#c1c7cb]/30 pb-2">
                  Items Ordered (2 items)
                </h3>
                <div className="divide-y divide-[#c1c7cb]/20">
                  {/* Item 1 */}
                  <div className="py-4 flex gap-4 items-center">
                    <div className="w-16 h-20 bg-[#f0eee9] rounded-lg overflow-hidden shrink-0">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBasXUrMIl04K0KHVSxK9APqpoEZ7Q_Go_ybbUsKshgIVJYghbjx-tS2FyHTtWl4rD52Yx-HaV6tpEpym1ZYy5u8hzBr27zMNL5RHbLs1c58PjFifTQzXWyeT0O6aAlercdcafHinowkTbZEqj2YiLPbJWVVnhW0Fszm9RKVwQXFR3xJtVFcAm5-wLutr1ySXmT0gbr6Xw2BY0EvGCbJTx9MjsS3tZB6p2sxbeAQTkb6BkqKez_UiyBsg"
                        alt="Royal Blue Silk Poshakh"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-[#00151b]">Royal Blue Silk Poshakh</h4>
                      <p className="text-xs text-[#41484b] mt-0.5">Size: No. 4 | Color: Krishna Navy & Gold</p>
                      <p className="text-xs text-[#71787b] mt-1 font-mono">SKU: VP-POSH-004</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-[#00151b]">₹2,499</p>
                      <p className="text-xs text-[#41484b]">Qty: 1</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="py-4 flex gap-4 items-center">
                    <div className="w-16 h-20 bg-[#f0eee9] rounded-lg overflow-hidden shrink-0">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCawTQLa4MjQBQPSE9x_5WPcRJ1sUlx8JORIWgtoJjhpApb_EExN3tqX9CsyfBTGkL7ZDgp4PHPuo5K7gOLboqUeLvP5rjctAh-xJ1cih0_nMw4EI9o9EfKHYGeGMQb_YL3iz_HOHGRCWp4nMkNKFgPQSjVt-GlASrb74KzCjEYXGSZLfnUrJFCqXFUB_KUIWgZOpFSBYQ9jhMn84jDXcv3X-aVHwxGG1tDubRtkK0-jWCQ7rFJzGT4zA"
                        alt="Peacock Motif Haar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-[#00151b]">Peacock Motif Haar</h4>
                      <p className="text-xs text-[#41484b] mt-0.5">Size: Standard | Color: Brass Gold</p>
                      <p className="text-xs text-[#71787b] mt-1 font-mono">SKU: VP-HAAR-012</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-[#00151b]">₹2,598</p>
                      <p className="text-xs text-[#41484b]">Qty: 2 (₹1,299 ea)</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mt-6 pt-6 border-t border-[#c1c7cb]/30 space-y-2 text-sm text-[#41484b]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#00151b]">₹5,097</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#00151b]">₹150</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#00151b] pt-2 border-t border-[#c1c7cb]/20">
                    <span>Total</span>
                    <span className="text-[#735c00]">₹5,247</span>
                  </div>
                </div>
              </section>

              {/* Shipping & Tracking Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-4 border-b border-[#c1c7cb]/30 pb-2">
                  Fulfillment & Tracking
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="w-full sm:w-auto">
                    <p className="text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">Carrier & AWB</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#00151b]">{trackingNumber}</span>
                      <button onClick={copyTracking} className="text-[#735c00] hover:underline text-xs">
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => alert(`Tracking ${trackingNumber} on DTDC portal`)}
                      className="px-4 py-2 rounded-full border border-[#735c00] text-xs font-bold text-[#735c00] hover:bg-[#fed65b]/20"
                    >
                      Track Shipment
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Customer & Delivery Info */}
            <div className="lg:col-span-4 space-y-8">
              {/* Customer Info Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-4 border-b border-[#c1c7cb]/30 pb-2">
                  Customer Profile
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-bold text-[#00151b]">Aarav Sharma</p>
                    <p className="text-xs text-[#735c00] font-semibold">Devotee Patron (Tier: Gold)</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#41484b]">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    <span>aarav.sharma@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#41484b]">
                    <span className="material-symbols-outlined text-[16px]">phone</span>
                    <span>+91 98765 43210</span>
                  </div>
                </div>
              </section>

              {/* Delivery Address Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-4 border-b border-[#c1c7cb]/30 pb-2">
                  Delivery Address
                </h3>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  H3PQ+7W6, Gali Number 1, P Block,<br />
                  Sadh Nagar II, Palam,<br />
                  New Delhi, Delhi – 110045
                </p>
              </section>

              {/* Payment Summary Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-4 border-b border-[#c1c7cb]/30 pb-2">
                  Payment Status
                </h3>
                <div className="space-y-2 text-xs text-[#41484b]">
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="font-bold text-[#00151b]">UPI (Instant)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="font-mono">TXN_9841294871</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className="text-[#166534] font-bold">PAID</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
