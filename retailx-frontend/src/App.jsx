import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import PreferencesPage from "./pages/PreferencesPage";
import AdminAuth from "./pages/AdminAuth";
import SellerDashboard from "./pages/SellerDashboard";
import SellerAuth from "./pages/SellerAuth";

// ✅ CONTEXT CREATE
export const CartContext = createContext();

function App() {
  const [cart, setCart] = useState([]); // ✅ global cart state

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/seller-auth" element={<SellerAuth />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
