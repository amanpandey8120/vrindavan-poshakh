import React, { useState, useEffect } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

const STATUS_PILLS = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersScreen() {
  const { navigateTo } = useNavigation();
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              product_id,
              quantity,
              price
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setOrderLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-[#fed65b]/20 text-[#745c00] border-[#fed65b]';
      case 'shipped':
        return 'bg-[#c3e8f7] text-[#002b36] border-[#a7ccda]';
      case 'delivered':
        return 'bg-[#dcfce7] text-[#166534] border-[#86efac]';
      case 'cancelled':
        return 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]';
      default:
        return 'bg-[#f0eee9] text-[#41484b] border-[#c1c7cb]';
    }
  };

  const filtered = orders.filter((ord) => {
    const matchStatus = filterStatus === 'All' || (ord.status || 'pending') === filterStatus;
    const matchSearch = !search || ord.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
      <AdminSidebar activeAdminTab={SCREENS.ADMIN_ORDERS} />

      <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
        <div className="pt-24 pb-16 px-4 md:px-16 max-w-[1280px] w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">Order Management</h2>
              <p className="text-sm text-[#41484b]">Track and fulfill deity attire orders across India.</p>
            </div>
          </div>

          {/* Search & Status Filter Pills */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c1c7cb]/20 flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full lg:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71787b]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID..."
                className="w-full pl-10 pr-4 py-2 bg-[#f5f3ee] border-b border-[#002b36] focus:border-[#735c00] focus:ring-0 text-sm rounded-t-md outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {STATUS_PILLS.map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors capitalize ${
                    filterStatus === st
                      ? 'bg-[#fed65b] text-[#745c00]'
                      : 'border border-[#c1c7cb] text-[#41484b] hover:bg-[#f0eee9]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c1c7cb]/20 overflow-hidden">
            {orderLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="material-symbols-outlined text-[40px] text-[#735c00] animate-spin">sync</div>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f5f3ee] border-b border-[#c1c7cb]/30">
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Order ID</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Date</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Items</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Total</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c1c7cb]/20">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-[#41484b]">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => {
                      const items = order.order_items || [];
                      const itemsCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                      const status = order.status || 'pending';

                      return (
                        <tr key={order.id} className="hover:bg-[#f5f3ee]/50 transition-colors">
                          <td className="py-4 px-6 font-mono text-sm font-bold text-[#00151b]">{order.id.slice(0, 8)}</td>
                          <td className="py-4 px-6 text-xs text-[#41484b]">
                            {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-sm font-semibold text-[#00151b]">{itemsCount}</td>
                          <td className="py-4 px-6">
                            <div className="text-sm font-bold text-[#00151b]">
                              {order.total_amount ? `₹${order.total_amount.toLocaleString('en-IN')}` : '₹0'}
                            </div>
                            <div className="text-xs text-[#735c00]">{order.payment_method || 'Not specified'}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${getStatusColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => navigateTo(SCREENS.ADMIN_ORDER_DETAILS, { orderId: order.id })}
                              className="px-4 py-1.5 rounded-full border border-[#735c00] text-xs font-bold text-[#735c00] hover:bg-[#fed65b]/20 transition-colors"
                            >
                              View Order
                            </button>
                          </td>
                        </tr>
                      );
                    })
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