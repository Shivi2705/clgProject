import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Chatbot from "../Components/Chatbot";

const CustomerDashboard = () => {
  const [feedData, setFeedData] = useState({ mind_reader: [], signature_styles: [], discovery_radar: [] });
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const userPrefs = JSON.parse(localStorage.getItem("user_preferences")) || [];
  const userName = localStorage.getItem("user_name") || "Guest";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [allRes, recRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/products"),
          axios.get(`http://127.0.0.1:5000/api/recommendations/feed?prefs=${userPrefs.join(",")}`)
        ]);
        setAllProducts(allRes.data);
        setFeedData(recRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % Math.min(feedData.mind_reader.length, 5));
  }, [feedData.mind_reader.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.min(feedData.mind_reader.length, 5)) % Math.min(feedData.mind_reader.length, 5));
  };

  useEffect(() => {
    if (feedData.mind_reader.length > 0) {
      const timer = setInterval(nextSlide, 6000);
      return () => clearInterval(timer);
    }
  }, [nextSlide, feedData.mind_reader]);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id || product._id}`);
  };

  if (loading) return <LoadingScreen name={userName} />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] selection:bg-black selection:text-white">
      <Navbar />

      <main>
        {/* --- LUXURY EDITORIAL HERO --- */}
        <section className="relative h-[90vh] w-full overflow-hidden bg-[#111]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10" />
              <img 
                src={feedData.mind_reader[currentSlide]?.imageURL || "https://images.unsplash.com/photo-1441986300917-64674bd600d8"} 
                className="w-full h-full object-cover opacity-80"
                alt="Editorial"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={`text-${currentSlide}`}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-2xl"
            >
              <span className="text-white/70 text-[11px] font-bold tracking-[0.5em] uppercase mb-6 block">
                Edition 2026 • Personalized for You
              </span>
              <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] mb-8">
                The <span className="italic">Curated</span> <br /> 
                List for {userName}
              </h1>
              <p className="text-white/60 text-lg mb-10 max-w-md font-light leading-relaxed">
                Refining your wardrobe with intelligence. Our AI has selected this 
                {feedData.mind_reader[currentSlide]?.category} specifically for your profile.
              </p>
              <button 
                onClick={() => handleProductClick(feedData.mind_reader[currentSlide])}
                className="group flex items-center gap-4 bg-white text-black px-8 py-5 rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-2xl"
              >
                Explore Piece <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-12 right-12 z-30 flex items-center gap-6">
            <div className="flex gap-2">
               {feedData.mind_reader.slice(0, 5).map((_, i) => (
                <div key={i} className="relative h-[2px] w-12 bg-white/20 overflow-hidden">
                   {currentSlide === i && (
                     <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ duration: 6, ease: "linear" }}
                      className="absolute inset-0 bg-white" 
                     />
                   )}
                </div>
               ))}
            </div>
            <div className="flex gap-4 ml-4">
              <button onClick={prevSlide} className="p-3 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="p-3 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* --- MAIN CONTENT --- */}
        <div className="max-w-7xl mx-auto px-6 py-32 space-y-40">
          
          {/* SECTION 1: AI PREDICTIONS */}
          <section>
            <Header title="Neural Selection" subtitle="High-probability matches based on your aesthetic DNA." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {feedData.mind_reader.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} badge="98% Match" onClick={() => handleProductClick(p)} />
              ))}
            </div>
          </section>

          {/* SECTION 2: THE SIGNATURE BOX */}
          <section className="relative overflow-hidden bg-[#1A1A1A] text-white p-12 md:p-24 rounded-[40px]">
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 italic">Your Signature Stylings</h2>
                <p className="text-white/50 text-lg mb-8 leading-relaxed">
                  We've noticed your affinity for <strong>{userPrefs[0] || 'Minimalist'}</strong> elements. 
                  These selections mirror your most-viewed silhouettes.
                </p>
                <div className="h-[1px] w-20 bg-white/30 mb-8" />
                <button className="text-[11px] font-bold uppercase tracking-[0.3em] hover:text-white/70 transition-colors">
                  View Full Signature Gallery
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {feedData.signature_styles.slice(0, 2).map(p => (
                  <div key={p.id} onClick={() => handleProductClick(p)} className="cursor-pointer group">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4">
                      <img src={p.imageURL} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Background Decorative Text */}
            <div className="absolute -bottom-10 -right-10 text-[15rem] font-black text-white/[0.03] select-none pointer-events-none">
              STYLE
            </div>
          </section>

          {/* SECTION 3: GLOBAL RADAR */}
          <section>
            <Header title="Global Radar" subtitle="Real-time trending pieces from the community." />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {allProducts.slice(0, 5).map(p => (
                <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

// --- SUB-COMPONENTS ---

const Header = ({ title, subtitle }) => (
  <div className="mb-16">
    <div className="flex items-center gap-4 mb-2">
      <div className="h-[1px] w-8 bg-black" />
      <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-black">{title}</h2>
    </div>
    <p className="text-3xl font-serif italic text-gray-800">{subtitle}</p>
  </div>
);

const ProductCard = ({ product, badge, onClick }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    onClick={onClick} 
    className="group cursor-pointer"
  >
    <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F9F9] mb-6 rounded-sm">
      <img 
        src={product.imageURL || "https://via.placeholder.com/400x500"} 
        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        alt={product.name}
      />
      {badge && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black px-3 py-1 text-[10px] font-black tracking-tighter uppercase shadow-sm">
          {badge}
        </div>
      )}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="space-y-1">
      <div className="flex justify-between items-start">
        <h3 className="text-[13px] font-bold uppercase tracking-tight text-[#1A1A1A] leading-tight max-w-[70%]">
          {product.name}
        </h3>
        <span className="text-[13px] font-medium italic font-serif">₹{product.finalPrice}</span>
      </div>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
    </div>
  </motion.div>
);

const LoadingScreen = ({ name }) => (
  <div className="h-screen bg-white flex flex-col items-center justify-center">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: "200px" }}
      className="h-[1px] bg-black mb-6"
    />
    <p className="text-[11px] font-bold tracking-[0.5em] uppercase animate-pulse">
      Identifying Aesthetic for {name}
    </p>
  </div>
);

export default CustomerDashboard;