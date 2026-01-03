import { ShoppingCart, Search, User, ChevronDown } from "lucide-react";
import { Button } from "./ui/button"; // Assuming this is your UI component
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-10">
          <Link 
            to="/" 
            className="text-xl font-bold text-slate-900 tracking-tight hover:opacity-80 transition-opacity"
          >
            Retail<span className="text-emerald-600">X</span>
          </Link>

          {/* Search Bar - Professional Refinement */}
          <div className="hidden lg:flex items-center group relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-within:text-emerald-600 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search products, brands..."
              className="bg-slate-50 border border-transparent focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none pl-10 pr-4 py-2 w-[320px] xl:w-[400px] text-sm rounded-xl transition-all duration-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Section / Navigation */}
        <div className="flex items-center gap-8">
          
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/">Home</NavLink>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                Categories <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </button>
              {/* Optional Dropdown placeholder */}
            </div>
            <NavLink to="/deals">Deals</NavLink>
            <NavLink to="/admin-auth" className="text-slate-500 italic">Admin</NavLink>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

          {/* Cart & Auth Actions */}
          <div className="flex items-center gap-5">
            <Link to="/cart" className="relative group p-2 rounded-full hover:bg-slate-50 transition-colors">
              <ShoppingCart className="h-5 w-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
              <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                2
              </span>
            </Link>

            <Link to="/auth">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 h-10 text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

// Helper Sub-component for clean links
function NavLink({ to, children, className = "" }) {
  return (
    <Link 
      to={to} 
      className={`relative text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors py-1 group ${className}`}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}