import { useState } from "react";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function AdminAuth() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Fake auth success (replace with backend later)
    localStorage.setItem("isAdmin", "true");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-slate-100"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Admin {mode === "login" ? "Login" : "Register"}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Secure access to RetailX Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input icon={Mail} placeholder="admin@retailx.com" />
          <Input icon={Lock} type="password" placeholder="••••••••" />

          <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
            {mode === "login" ? "Login" : "Create Account"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-8 text-center text-sm text-slate-500">
          {mode === "login" ? "No admin account?" : "Already an admin?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-bold text-emerald-600 hover:underline"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ icon: Icon, type = "text", placeholder }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm"
        required
      />
    </div>
  );
}
