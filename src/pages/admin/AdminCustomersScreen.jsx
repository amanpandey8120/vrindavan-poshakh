import React, { useState, useEffect } from 'react';
import { SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminCustomersScreen() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [customers, setCustomers] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(true);

  // Fetch customers from Supabase profiles table
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            orders (*)
          `)
          .order('total_spent', { ascending: false });

        if (error) throw error;
        // Transform raw DB rows into customer display format
        const transformed = (data || []).map((profile) => {
          const userOrders = profile.orders || [];
          const totalSpent = userOrders.reduce(
            (sum, order) => sum + (order.total_amount || 0),
            0
          );
          const ordersCount = userOrders.length;

          // Determine tier based on total spent
          let tier = 'New Member';
          let tierColor = 'bg-[#e4e2dd] text-[#41484b]';
          if (totalSpent >= 50000) {
            tier = 'VIP Patron';
            tierColor = 'bg-[#fed65b]/30 text-[#745c00] border-[#fed65b]';
          } else if (totalSpent >= 20000) {
            tier = 'Devotee';
            tierColor = 'bg-[#c3e8f7] text-[#002b36] border-[#a7ccda]';
          }

          return {
            id: profile.id,
            name: profile.full_name || 'Devotee',
            email: profile.email || '',
            ordersCount,
            totalSpent: `₹${totalSpent.toLocaleString('en-IN')}`,
            tier,
            tierColor,
            lastOrder: userOrders.length > 0
              ? new Date(userOrders[userOrders.length - 1].created_at).toLocaleDateString()
              : 'Never'
          };
        });

        setCustomers(transformed);
        setCustomerLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setCustomers([]);
        setCustomerLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filtered = customers.filter((cust) => {
    const matchTier = tierFilter === 'All' || cust.tier === tierFilter;
    const matchSearch = cust.name.toLowerCase().includes(search.toLowerCase()) || cust.email.toLowerCase().includes(search.toLowerCase());
    return matchTier && matchSearch;
  });

  if (customerLoading) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
        <AdminSidebar activeAdminTab={SCREENS.ADMIN_CUSTOMERS} />
        <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
          <div className="pt-24 pb-16 px-4 md:px-16 max-w-[1280px] w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">Customer Management</h2>
                <p className="text-sm text-[#41484b]">Manage your registered devotees and patrons.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 rounded-full border border-[#c1c7cb] text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Export</span>
                </button>
                <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#fed65b] to-[#ffe088] text-[#00151b] text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
                  Add Customer
                </button>
              </div>
            </div>

            {/* Search & Filter bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c1c7cb]/20 flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
              <div className="relative w-full lg:w-96">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71787b]">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email or ID..."
                  className="w-full pl-10 pr-4 py-2 bg-[#f5f3ee] border-b border-[#002b36] focus:border-[#735c00] focus:ring-0 text-sm rounded-t-md outline-none"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {['All', 'VIP Patron', 'Devotee', 'New Member'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      tierFilter === t
                        ? 'bg-[#fed65b] text-[#745c00]'
                        : 'border border-[#c1c7cb] text-[#41484b] hover:bg-[#f0eee9]'
                    }`}
                  >
                    {t === 'All' ? 'All Customers' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-[#c1c7cb]/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f5f3ee] border-b border-[#c1c7cb]/30">
                      <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Devotee</th>
                      <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Tier</th>
                      <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Orders</th>
                      <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Total Spent</th>
                      <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Last Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c1c7cb]/20">
                    {filtered.map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#f5f3ee]/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-sm text-[#00151b]">{cust.name}</div>
                          <div className="text-xs text-[#41484b]">{cust.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cust.tierColor}`}>
                            {cust.tier}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-[#00151b]">{cust.ordersCount}</td>
                        <td className="py-4 px-6 text-sm font-bold text-[#735c00]">{cust.totalSpent}</td>
                        <td className="py-4 px-6 text-xs text-[#41484b]">{cust.lastOrder}</td>
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

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
      <AdminSidebar activeAdminTab={SCREENS.ADMIN_CUSTOMERS} />

      <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
        <div className="pt-24 pb-16 px-4 md:px-16 max-w-[1280px] w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">Customer Management</h2>
              <p className="text-sm text-[#41484b]">Manage your registered devotees and patrons.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 rounded-full border border-[#c1c7cb] text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export</span>
              </button>
              <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#fed65b] to-[#ffe088] text-[#00151b] text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
                Add Customer
              </button>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c1c7cb]/20 flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full lg:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71787b]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or ID..."
                className="w-full pl-10 pr-4 py-2 bg-[#f5f3ee] border-b border-[#002b36] focus:border-[#735c00] focus:ring-0 text-sm rounded-t-md outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {['All', 'VIP Patron', 'Devotee', 'New Member'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    tierFilter === t
                      ? 'bg-[#fed65b] text-[#745c00]'
                      : 'border border-[#c1c7cb] text-[#41484b] hover:bg-[#f0eee9]'
                  }`}
                >
                  {t === 'All' ? 'All Customers' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c1c7cb]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f5f3ee] border-b border-[#c1c7cb]/30">
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Devotee</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Tier</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Orders</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Total Spent</th>
                    <th className="py-4 px-6 text-xs font-bold text-[#41484b] uppercase tracking-wider">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c1c7cb]/20">
                  {filtered.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[#f5f3ee]/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-sm text-[#00151b]">{cust.name}</div>
                        <div className="text-xs text-[#41484b]">{cust.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cust.tierColor}`}>
                          {cust.tier}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-[#00151b]">{cust.ordersCount}</td>
                      <td className="py-4 px-6 text-sm font-bold text-[#735c00]">{cust.totalSpent}</td>
                      <td className="py-4 px-6 text-xs text-[#41484b]">{cust.lastOrder}</td>
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