import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, Tag, Search, ShoppingCart, ChevronDown } from "lucide-react";

const CATEGORIES = [
  "Fashion", "Electronics", "Grocery", "Beauty", "Home & Living", "Sports",
  "Books", "Toys", "Health & Wellness", "Jewelry", "Watches", "Shoes",
  "Bags & Accessories", "Kids & Baby", "Pet Supplies", "Automotive",
  "Music & Instruments", "Gaming", "Stationery", "Office Supplies",
  "Kitchen & Dining", "Furniture", "Garden & Outdoors", "Art & Craft",
  "Photography", "Travel & Luggage", "Footwear", "Mobile Accessories",
  "Smart Home", "Computer Accessories", "Cameras & Drones", "Fitness Equipment",
  "Camping & Hiking", "Cycling", "Swimming & Water Sports", "Sportswear",
  "Hair Care", "Skin Care", "Makeup", "Fragrances", "Eyewear", "Sunglasses",
  "Watches & Clocks", "Home Decor", "Lighting", "Bedding & Linen",
  "Cleaning Supplies", "Gourmet Food", "Beverages", "Snacks & Confectionery",
  "Vitamins & Supplements", "Stationery & Office Equipment", "Smartphones",
  "Tablets", "Laptops", "Printers & Scanners"
];

export default function PreferencesPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    if (selectedCategories.length < 3) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      console.log("Saved Preferences:", selectedCategories);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans">
      {/* ---------- NAVBAR (Fixed Height: 64px) ---------- */}
      

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 mb-4">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Personalize your feed
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-normal leading-relaxed">
              Help us tailor your experience. Select at least 3 categories.
            </p>
          </div>

          {/* Scrollable Categories Grid */}
          <div className="p-8 max-h-[380px] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((category, index) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    onClick={() => toggleCategory(category)}
                    className={`
                      group relative flex items-center justify-between px-4 py-3 rounded-xl border text-[13px] font-medium transition-all duration-200
                      ${isSelected 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span className="truncate">{category}</span>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                    ) : (
                      <Tag className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-400 transition-colors shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500 font-medium">
              <span className={selectedCategories.length >= 3 ? "text-emerald-600" : "text-slate-400"}>
                {selectedCategories.length}
              </span>
              {" "} categories selected
            </div>
            
            <motion.button
              onClick={handleSubmit}
              disabled={selectedCategories.length < 3 || isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full sm:w-auto px-10 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md
                ${selectedCategories.length >= 3
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }
              `}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Scoped CSS for Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}