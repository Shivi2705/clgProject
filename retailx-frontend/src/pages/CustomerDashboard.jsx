import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, ChevronLeft, ChevronRight, Sparkles, 
  TrendingUp, Compass, Heart, ArrowRight, AlertCircle,
  Scan, Zap, Globe, Plus
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const API_BASE = "http://127.0.0.1:5000";

const CustomerDashboard = () => {
  const [feedData, setFeedData] = useState({ mind_reader: [], signature_styles: [], discovery_radar: [] });
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const navigate = useNavigate();

  const userName = localStorage.getItem("user_name") || "Guest";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/recommendations/feed`);
        setFeedData(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  const getImgUrl = (item) => {
    const path = item?.imageURL || item?.imageUrl || item?.image_url || item?.image;
    if (!path || path.includes("photo-1490481651871")) {
      return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop";
    }
    return path.startsWith("http") ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const nextHero = () => setHeroIdx((prev) => (prev + 1) % (feedData.mind_reader.length || 1));
  const prevHero = () => setHeroIdx((prev) => (prev - 1 + feedData.mind_reader.length) % (feedData.mind_reader.length || 1));

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main>
        {/* --- SECTION 1: THE SILENT HERO --- */}
        <section className="h-[90vh] w-full relative overflow-hidden flex items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={heroIdx}
              initial={{ opacity: 0, scale: 1.05 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img 
                src={getImgUrl(feedData.mind_reader[heroIdx])} 
                className="w-full h-full object-cover"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 px-6 md:px-20 w-full">
            <motion.div 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-10 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Curated for {userName}</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-serif italic mb-10 leading-none">
                {feedData.mind_reader[heroIdx]?.name || "The Core Piece"}
              </h1>
              <div className="flex items-center gap-10">
                
                <div className="flex gap-4">
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- SECTION 2: THE GALLERY GRID (SKEW LAYOUT) --- */}
        <section className="py-40 px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-32">
            <div className="md:col-span-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8C8C7F] mb-6 block">01 / The Edit</span>
               <h3 className="text-4xl font-serif italic leading-tight">A visual dialogue between texture and form.</h3>
            </div>
            <div className="md:col-span-8 h-[1px] bg-[#EBEBE9]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-32 gap-x-12">
            {feedData.signature_styles.slice(0, 6).map((p, idx) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group cursor-pointer ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="aspect-[2/3] overflow-hidden bg-[#F9F9F7] mb-8 relative">
                   <img src={getImgUrl(p)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                   <div className="absolute top-6 left-6 mix-blend-difference text-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest">№ 00{idx + 1}</span>
                   </div>
                </div>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-xs font-bold uppercase tracking-widest">{p.name}</h4>
                  <p className="text-sm italic font-serif opacity-50">₹{p.finalPrice}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: IMMERSIVE BANNER --- */}
        <section className="w-full h-[60vh] bg-[#1A1A1A] flex items-center justify-center text-center px-6">
            <div className="max-w-3xl">
                <Scan size={40} className="text-white/20 mx-auto mb-10 animate-pulse" />
                <h2 className="text-white text-4xl md:text-6xl font-serif italic leading-snug">
                    "Style is a silent language. <br/> We just help you speak it."
                </h2>
                <div className="mt-12 h-10 w-[1px] bg-white/30 mx-auto" />
            </div>
        </section>

        {/* --- SECTION 4: ARCHIVE GRID --- */}
        <section className="py-40 px-6 md:px-20 bg-[#F9F9F7]">
          <div className="flex justify-between items-center mb-20">
            <h3 className="text-2xl font-bold uppercase tracking-[0.4em]">The Archive</h3>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 cursor-pointer">View All</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {feedData.discovery_radar.map((p) => (
              <div key={p.id} className="group cursor-pointer bg-white p-4 pb-8 border border-transparent hover:border-[#D1D1CB] transition-all" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="aspect-square overflow-hidden mb-6">
                  <img src={getImgUrl(p)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8C8C7F] mb-2">{p.category}</p>
                    <h5 className="text-[11px] font-bold uppercase mb-1 truncate">{p.name}</h5>
                    <p className="text-xs font-serif italic">₹{p.finalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}} />
    </div>
  );
};

const Loader = () => (
  <div className="h-screen bg-white flex flex-col items-center justify-center">
    <div className="w-12 h-[1px] bg-black animate-scale-x mb-4" />
    <p className="text-[9px] font-bold uppercase tracking-[1em] text-black">Loading Boutique</p>
  </div>
);

export default CustomerDashboard;