import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';

const MOCK_ORDERS = [
  {
    id: 'ORD-2026-8942',
    customer: 'Aarav Sharma',
    city: 'New Delhi, DL',
    date: '26 Aug 2026, 01:15 PM',
    itemsCount: 3,
    total: '₹5,247',
    status: 'Processing',
    statusColor: 'bg-[#fed65b]/20 text-[#745c00] border-[#fed65b]',
    payment: 'Paid (UPI)',
  },
  {
    id: 'ORD-2026-8941',
    customer: 'Radhika Patel',
    city: 'Ahmedabad, GJ',
    date: '26 Aug 2026, 11:40 AM',
    itemsCount: 1,
    total: '₹2,499',
    status: 'Shipped',
    statusColor: 'bg-[#c3e8f7] text-[#002b36] border-[#a7ccda]',
    payment: 'Paid (Card)',
  },
  {
    id: 'ORD-2026-8940',
    customer: 'Meera Deshmukh',
    city: 'Varanasi, UP',
    date: '25 Aug 2026, 06:22 PM',
    itemsCount: 4,
    total: '₹8,340',
    status: 'Delivered',
    statusColor: 'bg-[#dcfce7] text-[#166534] border-[#86efac]',
    payment: 'Paid (NetBanking)',
  },
  {
    id: 'ORD-2026-8939',
    customer: 'Vikram Singh',
    city: 'Jaipur, RJ',
    date: '25 Aug 2026, 03:10 PM',
    itemsCount: 2,
    total: '₹3,749',
    status: 'Delivered',
    statusColor: 'bg-[#dcfce7] text-[#166534] border-[#86efac]',
    payment: 'Paid (UPI)',
  },
  {
    id: 'ORD-2026-8938',
    customer: 'Ananya Gupta',
    city: 'Bengaluru, KA',
    date: '24 Aug 2026, 09:05 AM',
    itemsCount: 1,
    total: '₹1,250',
    status: 'Cancelled',
    statusColor: 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]',
    payment: 'Refunded',
  },
];

export default function AdminOrdersScreen() {
  const { navigateTo } = useNavigation();
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_ORDERS.filter((ord) => {
    const matchStatus = filterStatus === 'All' || ord.status === filterStatus;
    const matchSearch = ord.id.toLowerCase().includes(search.toLowerCase()) || ord.customer.toLowerCase().includes(search.toLowerCase());
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
            <button className="px-6 py-2.5 rounded-full border border-[#c1c7cb] text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2 self-start md:self-auto">
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Orders</span>
            </button>
          </div>

          {/* Search & Status Filter Pills */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c1c7cb]/20 flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full lg:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71787b]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID, Customer name..."
                className="w-full pl-10 pr-4 py-2 bg-[#f5f3ee] border-b border-[#002b36] focus:border-[#735c00] focus:ring-0 text-sm rounded-t-md outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
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
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f5f3ee] border-b border-[#c1c7cb]/30">
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Order ID</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Customer</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Date</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Total</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c1c7cb]/20">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-[#f5f3ee]/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-sm font-bold text-[#00151b]">{order.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-sm text-[#00151b]">{order.customer}</div>
                        <div className="text-xs text-[#41484b]">{order.city}</div>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#41484b]">{order.date}</td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-[#00151b]">{order.total}</div>
                        <div className="text-xs text-[#735c00]">{order.payment}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigateTo(SCREENS.ADMIN_ORDER_DETAILS)}
                          className="px-4 py-1.5 rounded-full border border-[#735c00] text-xs font-bold text-[#735c00] hover:bg-[#fed65b]/20 transition-colors"
                        >
                          View Order
                        </button>
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
