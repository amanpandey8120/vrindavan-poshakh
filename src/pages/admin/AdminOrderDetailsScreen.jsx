import React, { useState, useEffect } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminOrderDetailsScreen() {
  const { navigateTo, selectedOrderId } = useNavigation();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedOrderId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        // Fetch order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', selectedOrderId)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);

        // Fetch order items with product info
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            quantity,
            price,
            product_id,
            products (title)
          `)
          .eq('order_id', selectedOrderId);

        if (itemsError) throw itemsError;
        setItems(itemsData || []);

        // Fetch customer profile
        if (orderData?.user_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', orderData.user_id)
            .single();
          setCustomer(profileData || null);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setOrder(null);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [selectedOrderId]);

  const copyTracking = () => {
    navigator.clipboard?.writeText('');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
        <AdminSidebar activeAdminTab={SCREENS.ADMIN_ORDER_DETAILS} />
        <main className="flex-1 md:ml-80 flex flex-col min-h-screen items-center justify-center">
          <div className="material-symbols-outlined text-[48px] text-[#735c00] animate-spin">sync</div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
        <AdminSidebar activeAdminTab={SCREENS.ADMIN_ORDER_DETAILS} />
        <main className="flex-1 md:ml-80 flex flex-col min-h-screen items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl border border-[#c1c7cb]/20 max-w-md shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-[#41484b]">receipt_long</span>
            <h2 className="text-xl font-serif font-bold text-[#00151b] mt-4">No orders yet.</h2>
            <p className="text-xs text-[#41484b] mt-2 leading-relaxed">
              Select an order from the Order Management screen to view its details.
            </p>
            <button
              onClick={() => navigateTo(SCREENS.ADMIN_ORDERS)}
              className="mt-6 gold-gradient-bg text-[#00151b] px-6 py-2.5 rounded-full text-xs font-bold shadow-sm"
            >
              View Orders
            </button>
          </div>
        </main>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal >= 999 ? 0 : 150;
  const total = order.total_amount || subtotal + shipping;
  const orderIdShort = order.id ? order.id.slice(0, 8) : 'N/A';

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
                <span className="text-[#735c00]">{orderIdShort}</span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b]">Order {orderIdShort}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                  order.status === 'shipped' ? 'bg-[#c3e8f7] text-[#002b36] border-[#a7ccda]' :
                  order.status === 'delivered' ? 'bg-[#dcfce7] text-[#166534] border-[#86efac]' :
                  order.status === 'cancelled' ? 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]' :
                  'bg-[#fed65b]/30 text-[#745c00] border-[#fed65b]'
                }`}>
                  {(order.status || 'pending').toUpperCase()}
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
            </div>
          </div>

          {/* Grid Layout matching Stitch */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Items & Timeline */}
            <div className="lg:col-span-8 space-y-8">
              {/* Ordered Items Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-6 border-b border-[#c1c7cb]/30 pb-2">
                  Items Ordered ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>
                <div className="divide-y divide-[#c1c7cb]/20">
                  {items.length > 0 ? items.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-[#00151b]">
                          {item.products?.title || `Product ${item.product_id ? item.product_id.slice(0, 8) : ''}`}
                        </h4>
                        <p className="text-xs text-[#41484b] mt-0.5">Product ID: {item.product_id ? item.product_id.slice(0, 8) : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-[#00151b]">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-[#41484b]">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="py-4 text-center text-xs text-[#41484b]">No items found for this order.</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="mt-6 pt-6 border-t border-[#c1c7cb]/30 space-y-2 text-sm text-[#41484b]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#00151b]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#00151b]">₹{shipping.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#00151b] pt-2 border-t border-[#c1c7cb]/20">
                    <span>Total</span>
                    <span className="text-[#735c00]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </section>

              {/* Fulfillment & Tracking Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-4 border-b border-[#c1c7cb]/30 pb-2">
                  Fulfillment & Tracking
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="w-full sm:w-auto">
                    <p className="text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">Order Date</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#00151b]">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                      </span>
                      <button onClick={copyTracking} className="text-[#735c00] hover:underline text-xs">
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
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
                    <p className="font-bold text-[#00151b]">{customer?.full_name || 'Devotee'}</p>
                    <p className="text-xs text-[#735c00] font-semibold">{customer?.role === 'admin' ? 'Administrator' : 'Devotee Patron'}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#41484b]">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>User ID: {order.user_id ? order.user_id.slice(0, 8) : 'N/A'}</span>
                  </div>
                  {customer?.city && (
                    <div className="flex items-center gap-2 text-xs text-[#41484b]">
                      <span className="material-symbols-outlined text-[16px]">place</span>
                      <span>{customer.city}{customer.state ? `, ${customer.state}` : ''}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Delivery Address Card */}
              <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20">
                <h3 className="text-base font-bold text-[#00151b] mb-4 border-b border-[#c1c7cb]/30 pb-2">
                  Delivery Details
                </h3>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  {customer?.city ? `${customer.city}${customer.state ? `, ${customer.state}` : ''}` : 'No delivery address on file.'}
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
                    <span className="font-bold text-[#00151b]">{order.payment_method || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-bold text-[#00151b]">{(order.status || 'pending').toUpperCase()}</span>
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