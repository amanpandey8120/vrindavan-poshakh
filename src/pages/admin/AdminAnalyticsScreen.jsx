import React from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminAnalyticsScreen() {
  const { navigateTo } = useNavigation();

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

          {/* 4 KPI Cards matching Stitch Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* KPI 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Total Revenue</h3>
                <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">₹14,85,200</div>
                <div className="flex items-center text-xs font-bold text-[#166534]">
                  <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                  <span>+12.5% from last month</span>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Average Order Value</h3>
                <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                  <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">₹4,250</div>
                <div className="flex items-center text-xs font-bold text-[#166534]">
                  <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                  <span>+5.2% from last month</span>
                </div>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Conversion Rate</h3>
                <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                  <span className="material-symbols-outlined text-[20px]">data_usage</span>
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">3.8%</div>
                <div className="flex items-center text-xs font-bold text-[#ba1a1a]">
                  <span className="material-symbols-outlined text-[16px] mr-1">trending_down</span>
                  <span>-0.4% from last month</span>
                </div>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Repeat Customer Rate</h3>
                <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">42%</div>
                <div className="flex items-center text-xs font-bold text-[#166534]">
                  <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                  <span>+2.1% from last month</span>
                </div>
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
                  <p className="text-xs text-[#41484b]">Jan 2026 – Aug 2026 (in Lakhs ₹)</p>
                </div>
                <span className="text-xs font-bold text-[#735c00] bg-[#fed65b]/20 px-3 py-1 rounded-full border border-[#fed65b]/50">
                  +34% YoY
                </span>
              </div>
              <div className="h-48 flex items-end gap-4 pt-4 border-b border-[#c1c7cb]/30 pb-2">
                {[
                  { month: 'Jan', val: 40 },
                  { month: 'Feb', val: 55 },
                  { month: 'Mar', val: 70 },
                  { month: 'Apr', val: 65 },
                  { month: 'May', val: 85 },
                  { month: 'Jun', val: 90 },
                  { month: 'Jul', val: 110 },
                  { month: 'Aug', val: 148 },
                ].map((bar) => (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className="w-full bg-[#fed65b] group-hover:bg-[#735c00] rounded-t-md transition-all relative"
                      style={{ height: `${(bar.val / 150) * 100}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#00151b] text-white text-[10px] py-0.5 px-1.5 rounded transition-opacity whitespace-nowrap">
                        ₹{bar.val}L
                      </span>
                    </div>
                    <span className="text-[11px] text-[#41484b] font-semibold">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20">
              <h3 className="text-base font-bold text-[#00151b] mb-4">Sales by Category</h3>
              <div className="space-y-4">
                {[
                  { name: 'Krishna Poshakh (Silk & Velvet)', share: 58, color: 'bg-[#735c00]' },
                  { name: 'Mukut & Crowns', share: 22, color: 'bg-[#fed65b]' },
                  { name: 'Shringar Kits & Jewellery', share: 14, color: 'bg-[#406370]' },
                  { name: 'Puja Accessories', share: 6, color: 'bg-[#a7ccda]' },
                ].map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-[#00151b]">{cat.name}</span>
                      <span className="font-bold text-[#41484b]">{cat.share}%</span>
                    </div>
                    <div className="w-full bg-[#f0eee9] h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
