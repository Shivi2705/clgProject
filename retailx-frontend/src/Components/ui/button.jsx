export function Button({ children, className = "", variant, ...props }) {
  // Base styles with physical feel (active:scale-95)
  const base = "inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  // Variant Mapping
  const variants = {
    // Primary Luxury Emerald (Default)
    primary: "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 hover:shadow-emerald-500/40",
    
    // Glassmorphism Outline (Used in Hero section)
    outline: "border-2 border-white/30 backdrop-blur-md text-white hover:bg-white hover:text-black hover:border-white",
    
    // Dark Minimalist (Used in Newsletter/Footer)
    dark: "bg-slate-950 text-white hover:bg-slate-800 shadow-2xl",
    
    // Subtle Ghost (Used for secondary actions)
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-emerald-600",

    // Secondary Gray (Professional default)
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200"
  };

  // Determine variant style
  const variantStyle = variants[variant] || variants.primary;

  // Default padding if not overridden in className
  const padding = className.includes("p-") ? "" : "px-15 py-10";

  return (
    <button 
      className={`${base} ${variantStyle} ${padding} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}