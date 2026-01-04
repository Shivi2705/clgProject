import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, User, Plus, Trash2, Edit, 
  Bell, Search, Filter, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Box, DollarSign, Clock, ChevronRight, Settings, LogOut, 
  Layers, Zap, MoreHorizontal, Download, Calendar, Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  // --- DATA MOCKS ---
  const stats = [
    { title: 'Net Revenue', value: '₹1,25,000', change: '+12.5%', icon: DollarSign, trend: 'up' },
    { title: 'Active Orders', value: '42', change: '+5.2%', icon: ShoppingCart, trend: 'up' },
    { title: 'Inventory Value', value: '₹4.8L', change: '-2.1%', icon: Package, trend: 'down' },
    { title: 'Store Rating', value: '4.9/5', change: '+0.3%', icon: Zap, trend: 'up' },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- SIDEBAR (Standard Emerald Brand) --- */}
      <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col sticky top-0 h-screen">
        <div className="px-7 py-10 flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Command className="text-white h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 uppercase tracking-widest">RetailX</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={Box} label="Inventory" active={activeTab === 'Products'} onClick={() => setActiveTab('Products')} />
          <NavItem icon={ShoppingCart} label="Orders" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
          <NavItem icon={TrendingUp} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-semibold">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER (Glass Effect) */}
        <header className="h-20 border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1">
            <Search size={18} className="text-slate-400" />
            <input 
              placeholder="Quick search SKU or orders..." 
              className="text-sm font-medium outline-none w-72 placeholder:text-slate-400 bg-transparent" 
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div className="h-10 w-10 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12">
          <div className="max-w-7xl mx-auto">
            
            {/* PAGE TITLE */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">{activeTab}</h1>
                <p className="text-sm text-slate-500 mt-2 font-medium">Business performance summary and real-time operations.</p>
              </div>
              <button className="h-12 px-6 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-transform active:scale-95 flex items-center gap-2">
                <Plus size={18} /> Add New Listing
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group hover:shadow-xl transition-all duration-500">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{stat.title}</p>
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* MAIN DASHBOARD CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Table Area */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                       <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Recent Movements</h2>
                       <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
                    </div>
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-slate-50">
                        {[1, 2, 3].map((i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-900 rounded-xl text-white flex items-center justify-center font-bold text-[10px]">ORD</div>
                                <div>
                                  <p className="font-bold text-slate-900">#ORD-009{i}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">Customer Ref: Rahul K.</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase tracking-tighter">Processed</span>
                            </td>
                            <td className="px-8 py-5 text-right font-bold text-slate-900">₹4,200</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Sidebar Info Card */}
                 
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- REUSABLE NAV ITEM ---
const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all text-sm font-bold ${
      active 
        ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
    }`}
  >
    <Icon size={18} className={active ? "text-emerald-600" : "text-slate-400"} />
    <span>{label}</span>
    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </button>
);

export default SellerDashboard;