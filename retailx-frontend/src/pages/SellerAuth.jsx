import { useState } from "react";
import { Mail, Lock, Store, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function SellerAuth() {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [registrationId, setRegistrationId] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        mode === "login"
          ? "http://127.0.0.1:5000/api/seller/login"
          : "http://127.0.0.1:5000/api/seller/register";

      const payload =
        mode === "login"
          ? { email, password }
          : { email, password, storeName, registrationId };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");

      // ✅ Store seller token
      localStorage.setItem("sellerToken", data.token);
      localStorage.setItem("role", "seller");

      navigate("/seller");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Store className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold">
            {mode === "login" ? "Seller Login" : "Seller Registration"}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Access your Seller Dashboard
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={Mail}
            placeholder="seller@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            setValue={setPassword}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />

          {mode === "register" && (
            <>
              <Input
                icon={Store}
                placeholder="Store Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
              <Input
                icon={Store}
                placeholder="Shop Registration ID"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
              />
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Seller Account"}
            <ArrowRight size={18} />
          </Button>
        </form>

        {/* TOGGLE */}
        <div className="mt-8 text-center text-sm text-slate-500">
          {mode === "login" ? "New seller?" : "Already registered?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-bold text-blue-600 hover:underline"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* INPUT */
function Input({ icon: Icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm"
      />
    </div>
  );
}

/* PASSWORD */
function PasswordInput({ value, setValue, show, toggle }) {
  return (
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type={show ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
