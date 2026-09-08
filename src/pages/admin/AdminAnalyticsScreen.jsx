import React, { useState, useEffect } from 'react';
import { SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CATEGORY_COLORS = ['bg-[#735c00]', 'bg-[#fed65b]', 'bg-[#406370]', 'bg-[#a7ccda]', 'bg-[#ba1a1a]'];

export default function AdminAnalyticsScreen() {
  const [revenue, setRevenue] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [repeatCustomerRate, setRepeatCustomerRate] = useState(0);
  const [revenueDelta, setRevenueDelta] = useState(null);
  const [aovDelta, setAovDelta] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [hasOrders, setHasOrders] = useState(false);
  const [orderLoading, setOrderLoading] = useState(true);

  // Fetch orders, products & categories from Supabase to calculate real statistics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*, order_items (*)');

        if (ordersError) throw ordersError;

        const ordersData = orders || [];
        setHasOrders(ordersData.length > 0);

        // Total Revenue & AOV
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const avgOrder = ordersData.length > 0 ? totalRevenue / ordersData.length : 0;

        // Conversion Rate (orders / products ratio - simplified)
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        const conversion = productsCount > 0 ? (ordersData.length / productsCount) * 100 : 0;

        // Repeat Customer Rate
        const customerOrders = {};
        ordersData.forEach((order) => {
          const userId = order.user_id;
          if (!customerOrders[userId]) customerOrders[userId] = 0;
          customerOrders[userId] += 1;
        });
        const customerCount = Object.keys(customerOrders).length;
        const repeatRate = customerCount > 0
          ? (Object.values(customerOrders).filter((count) => count > 1).length / customerCount) * 100
          : 0;

        setRevenue(totalRevenue);
        setAvgOrderValue(Math.round(avgOrder));
        setConversionRate(Math.round(conversion));
        setRepeatCustomerRate(Math.round(repeatRate));

        // Monthly revenue buckets (last 8 months) + deltas
        const now = new Date();
        const buckets = {};
        const keys = [];
        for (let i = 7; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          buckets[key] = 0;
          keys.push(key);
        }

        ordersData.forEach((order) => {
          const key = order.created_at ? order.created_at.slice(0, 7) : null;
          if (key && key in buckets) buckets[key] += order.total_amount || 0;
        });

        const chartData = keys.map((key) => ({
          label: MONTHS[Number(key.slice(5)) - 1],
          value: buckets[key]
        }));

        const latest = buckets[keys[keys.length - 1]];
        const previous = keys.length >= 2 ? buckets[keys[keys.length - 2]] : 0;
        const calcDelta = (cur, prev) => {
          if (prev <= 0) return null;
          return ((cur - prev) / prev) * 100;
        };
        setRevenueDelta(calcDelta(latest, previous));

        const lastMonthOrders = ordersData.filter((o) => o.created_at && o.created_at.slice(0, 7) === keys[keys.length - 1]);
        const prevMonthOrders = ordersData.filter((o) => o.created_at && o.created_at.slice(0, 7) === keys[keys.length - 2]);
        const aovNow = lastMonthOrders.length > 0
          ? lastMonthOrders.reduce((s, o) => s + (o.total_amount || 0), 0) / lastMonthOrders.length
          : 0;
        const aovPrev = prevMonthOrders.length > 0
          ? prevMonthOrders.reduce((s, o) => s + (o.total_amount || 0), 0) / prevMonthOrders.length
          : 0;
        setAovDelta(aovPrev > 0 ? ((aovNow - aovPrev) / aovPrev) * 100 : null);

        setMonthlyRevenue(chartData);

        // Revenue by category
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('id, category_id');
        if (prodError) throw prodError;

        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('id, name');
        if (catError) throw catError;

        const productsById = {};
        (prodData || []).forEach((p) => { productsById[p.id] = p; });
        const catNameById = {};
        (catData || []).forEach((c) => { catNameById[c.id] = c.name; });

        const catRevenueMap = {};
        ordersData.forEach((order) => {
          (order.order_items || []).forEach((oi) => {
            const product = productsById[oi.product_id];
            const name = product
              ? (catNameById[product.category_id] || 'Uncategorized')
              : 'Uncategorized';
            if (!catRevenueMap[name]) catRevenueMap[name] = 0;
            catRevenueMap[name] += (oi.price || 0) * (oi.quantity || 1);
          });
        });

        const catList = Object.entries(catRevenueMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        setCategoryRevenue(catList);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setRevenue(0);
        setAvgOrderValue(0);
        setConversionRate(0);
        setRepeatCustomerRate(0);
        setRevenueDelta(null);
        setAovDelta(null);
        setMonthlyRevenue([]);
        setCategoryRevenue([]);
        setHasOrders(false);
      } finally {
        setOrderLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const maxMonthly = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  const maxCategory = Math.max(...categoryRevenue.map((c) => c.value), 1);

  const renderTrendBadge = (delta) => {
    if (delta === null || delta === undefined || !hasOrders || Number.isNaN(delta)) {
      return (
        <div className="flex items-center text-xs font-bold text-[#71787b]">
          <span className="material-symbols-outlined text-[16px] mr-1">trending_flat</span>
          <span>Awaiting more data</span>
        </div>
      );
    }
    const up = delta >= 0;
    return (
      <div className={`flex items-center text-xs font-bold ${up ? 'text-[#166534]' : 'text-[#ba1a1a]'}`}>
        <span className="material-symbols-outlined text-[16px] mr-1">{up ? 'trending_up' : 'trending_down'}</span>
        <span>{up ? '+' : ''}{delta.toFixed(1)}% vs previous period</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
      <AdminSidebar activeAdminTab={SCREENS.ADMIN_ANALYTICS} />
      <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
        <div className="pt-24 pb-16 px-4 md:px-16 max-w-[1280px] w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">Sales & Analytics</h2>
              <p className="text-sm text-[#41484b]">Real-time devotional commerce metrics and insights.</p>
            </div>
            <div className="flex gap-3">
              <select className="bg-white border border-[#c1c7cb] rounded-full px-4 py-2 text-xs font-bold text-[#00151b] outline-none">
                <option>Last 30 Days</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>All Time</option>
              </select>
              <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#fed65b] to-[#ffe088] text-[#00151b] text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
                Download Report
              </button>
            </div>
          </div>

          {orderLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="material-symbols-outlined text-[40px] text-[#735c00] animate-spin">sync</div>
              <p className="mt-4 text-xs text-[#41484b]">Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* KPI 1: Total Revenue */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Total Revenue</h3>
                    <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                      <span className="material-symbols-outlined text-[20px]">payments</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">
                      ₹{revenue.toLocaleString('en-IN')}
                    </div>
                    {renderTrendBadge(revenueDelta)}
                  </div>
                </div>

                {/* KPI 2: Average Order Value */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Average Order Value</h3>
                    <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">
                      ₹{avgOrderValue.toLocaleString('en-IN')}
                    </div>
                    {renderTrendBadge(aovDelta)}
                  </div>
                </div>

                {/* KPI 3: Conversion Rate */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Conversion Rate</h3>
                    <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                      <span className="material-symbols-outlined text-[20px]">data_usage</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">
                      {conversionRate}%
                    </div>
                    {renderTrendBadge(hasOrders ? 0 : null)}
                  </div>
                </div>

                {/* KPI 4: Repeat Customer Rate */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Repeat Customer Rate</h3>
                    <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                      <span className="material-symbols-outlined text-[20px]">group</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">
                      {repeatCustomerRate}%
                    </div>
                    {renderTrendBadge(hasOrders ? 0 : null)}
                  </div>
                </div>
              </div>

              {/* Charts Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Visual */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-base font-bold text-[#00151b]">Monthly Revenue Growth</h3>
                      <p className="text-xs text-[#41484b]">Last 8 months (in ₹)</p>
                    </div>
                  </div>
                  {!hasOrders ? (
                    <div className="h-48 flex flex-col items-center justify-center border-b border-[#c1c7cb]/30">
                      <span className="material-symbols-outlined text-[32px] text-[#735c00] mb-2">monitoring</span>
                      <p className="text-xs text-[#41484b]">No revenue data yet.</p>
                    </div>
                  ) : (
                    <div className="h-48 flex items-end gap-3 pt-4 border-b border-[#c1c7cb]/30 pb-2">
                      {monthlyRevenue.map((m, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <div
                            className="w-full bg-[#fed65b] rounded-t-md transition-all relative"
                            style={{ height: `${Math.max((m.value / maxMonthly) * 100, 4)}%` }}
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#00151b] text-white text-[10px] py-0.5 px-1.5 rounded transition-opacity whitespace-nowrap">
                              ₹{(m.value / 100000).toFixed(1)}L
                            </span>
                          </div>
                          <span className="text-[11px] text-[#41484b] font-semibold">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20">
                  <h3 className="text-base font-bold text-[#00151b] mb-4">Sales by Category</h3>
                  <div className="space-y-4">
                    {!hasOrders || categoryRevenue.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <span className="material-symbols-outlined text-[32px] text-[#735c00] mb-2">donut_large</span>
                        <p className="text-xs text-[#41484b]">No category sales yet.</p>
                      </div>
                    ) : (
                      categoryRevenue.map((cat, idx) => (
                        <div key={cat.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-[#00151b]">{cat.name}</span>
                            <span className="font-bold text-[#41484b]">₹{cat.value.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="w-full bg-[#f0eee9] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}`}
                              style={{ width: `${(cat.value / maxCategory) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}