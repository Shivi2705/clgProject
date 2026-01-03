import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Carts";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import Footer from "./components/Footer";
import PreferencesPage from "./pages/PreferencesPage";
import AdminAuth from "./pages/AdminAuth";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin-auth" element={<AdminAuth />} />

                <Route path="/preferences" element={<PreferencesPage />} />

        <Route path="/Cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
