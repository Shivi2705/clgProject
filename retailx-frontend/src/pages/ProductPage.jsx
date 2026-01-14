import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, Zap, ChevronRight, ArrowRight, Plus, Check, ShieldCheck, Truck, RefreshCcw, Info, StarHalf } from 'lucide-react';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { CartContext } from "../App";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);
  
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const isInCart = cart.some(item => (item.id === id || item._id === id));

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        setCurrentProduct(data);
        window.scrollTo(0, 0);

        const resAddons = await fetch(`http://localhost:5000/api/products?category=accessories&limit=5`);
        const addonsData = await resAddons.json();
        setFrequentlyBought(Array.isArray(addonsData) ? addonsData.filter(p => p._id !== id && p.id !== id).slice(0, 3) : []);

        const resSimilar = await fetch(`http://localhost:5000/api/products?category=${data.category}&limit=10`);
        const similarData = await resSimilar.json();
        setSimilarProducts(Array.isArray(similarData) ? similarData.filter(p => p._id !== id && p.id !== id) : []);

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const toggleAddon = (prod) => {
    if (selectedAddons.find(a => (a.id === prod.id || a._id === prod._id))) {
      setSelectedAddons(selectedAddons.filter(a => (a.id !== prod.id && a._id !== prod._id)));
    } else {
      setSelectedAddons([...selectedAddons, prod]);
    }
  };

  const handleFullPurchase = () => {
    if (!isInCart && currentProduct) addToCart(currentProduct);
    selectedAddons.forEach(addon => addToCart(addon));
    navigate('/cart');
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading Experience</p>
    </div>
  );

  if (!currentProduct) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">
            <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
            <ChevronRight size={10} />
            <span>{currentProduct?.category}</span>
            <ChevronRight size={10} />
            <span className="text-slate-900">{currentProduct?.brand}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
            <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] flex items-center justify-center p-12 border border-slate-100 group overflow-hidden relative">
                <img 
                    src={currentProduct?.imageURL || currentProduct?.image} 
                    alt={currentProduct?.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold border border-slate-100 uppercase tracking-widest">New Arrival</span>
                    {currentProduct?.stock < 10 && <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-bold border border-red-100 uppercase tracking-widest">Limited Stock</span>}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
                <button 
                    onClick={() => { if(isInCart) navigate('/cart'); else addToCart(currentProduct); }} 
                    className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${isInCart ? 'bg-slate-100 text-slate-900 border border-slate-200' : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-200'}`}
                >
                    {isInCart ? "In Bag — View" : "Add to Bag"}
                </button>
                <button className="bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-100">
                    Express Buy
                </button>
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="w-full lg:w-[55%]">
            <div className="space-y-6 border-b border-slate-100 pb-10">
              <h1 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                {currentProduct?.name}
              </h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100">
                    <Star size={10} className="fill-current" />
                    <span>{currentProduct?.rating} / 5.0</span>
                </div>
                <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest underline underline-offset-4 decoration-slate-200">
                    {currentProduct?.reviewsCount || 0} Customer Reviews
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    ₹{currentProduct?.finalPrice?.toLocaleString() || '0'}
                </span>
                {currentProduct?.price > currentProduct?.finalPrice && (
                    <span className="text-slate-400 line-through text-lg font-medium">₹{currentProduct?.price?.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* NEW: DETAILED DESCRIPTION SECTION */}
            <div className="mt-10 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">The Story</h3>
                <p className="text-slate-600 leading-relaxed text-base font-medium">
                    {currentProduct?.description || "Experience uncompromising quality and cutting-edge design. This product is engineered for those who demand performance without sacrificing style. Every detail has been meticulously crafted to provide an unparalleled user experience, making it a definitive choice for enthusiasts."}
                </p>
            </div>

            {/* BUNDLE SECTION */}
            {frequentlyBought.length > 0 && (
                <div className="mt-12 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Pro-Curated Bundle</h3>
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    <div className="w-20 h-20 bg-white p-4 rounded-2xl border border-slate-100 flex-shrink-0">
                        <img src={currentProduct?.imageURL} className="h-full w-full object-contain" alt="" />
                    </div>
                    {frequentlyBought.map((item) => (
                    <React.Fragment key={item._id || item.id}>
                        <Plus size={16} className="text-slate-300 flex-shrink-0" />
                        <div 
                            className={`group relative w-20 h-20 bg-white p-4 rounded-2xl border transition-all cursor-pointer ${selectedAddons.find(a => (a.id === item.id || a._id === item._id)) ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg' : 'border-slate-100 hover:border-slate-300'}`}
                            onClick={() => toggleAddon(item)}
                        >
                            <img src={item?.imageURL || item?.image} className="h-full w-full object-contain" alt="" />
                            <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm ${selectedAddons.find(a => (a.id === item.id || a._id === item._id)) ? 'bg-emerald-500 text-white' : 'bg-white text-slate-200'}`}>
                                <Check size={12} />
                            </div>
                        </div>
                    </React.Fragment>
                    ))}
                </div>
                <div className="mt-8 flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Combined Value</p>
                        <p className="text-xl font-black text-slate-900">₹{((currentProduct?.finalPrice || 0) + selectedAddons.reduce((acc, curr) => acc + (curr?.finalPrice || 0), 0)).toLocaleString()}</p>
                    </div>
                    <button onClick={handleFullPurchase} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md">Add {selectedAddons.length + 1} Items</button>
                </div>
                </div>
            )}

            {/* RATINGS ANALYTICS SECTION */}
            <div className="mt-16 bg-white border border-slate-100 rounded-[2rem] p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-slate-100 pb-10">
                    <div className="space-y-1">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{currentProduct?.rating || '4.8'}</h2>
                        <div className="flex text-emerald-500 gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Based on {currentProduct?.reviewsCount || '120'} Verified Buys</p>
                    </div>
                    <div className="flex-grow max-w-xs w-full space-y-2">
                        {[5, 4, 3, 2, 1].map((num) => (
                            <div key={num} className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 w-2">{num}</span>
                                <div className="flex-grow h-1 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-900 rounded-full" style={{ width: `${num === 5 ? '85%' : num === 4 ? '10%' : '5%'}` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-emerald-600"><Check size={18}/></div>
                        <div><p className="text-xs font-black text-slate-900 uppercase">Durability</p><p className="text-[11px] text-slate-400">Rated Excellent for long-term use</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-emerald-600"><Check size={18}/></div>
                        <div><p className="text-xs font-black text-slate-900 uppercase">Value</p><p className="text-[11px] text-slate-400">Top 5% in category for price/performance</p></div>
                    </div>
                </div>
            </div>

            {/* TECH SPECS */}
            <div className="mt-16 space-y-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                    <Info size={16} className="text-emerald-500" /> Full Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentProduct?.specs && Object.entries(currentProduct.specs).map(([k, v]) => (
                        <div key={k} className="p-4 border border-slate-100 rounded-2xl flex flex-col gap-1 hover:bg-slate-50 transition-colors">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{k}</span>
                            <span className="text-sm text-slate-800 font-bold">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-32">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-10">Explore Similar</h3>
            <div className="flex overflow-x-auto gap-8 no-scrollbar pb-10">
              {similarProducts.map(p => (
                <Link key={p._id || p.id} to={`/product/${p._id || p.id}`} className="min-w-[220px] group">
                  <div className="aspect-square bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-5 p-8 group-hover:bg-slate-100 transition-all">
                    <img src={p?.imageURL || p?.image} className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-700" alt="" />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{p?.brand}</p>
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">{p?.name}</p>
                  <p className="text-sm font-black text-slate-900 mt-1">₹{p?.finalPrice?.toLocaleString() || '0'}</p>
                </Link>
              ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;