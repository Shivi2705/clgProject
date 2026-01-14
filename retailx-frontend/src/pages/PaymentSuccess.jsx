import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../App";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const PaymentSuccess = () => {
  const { setCart } = useContext(CartContext);
  const [orderSummary, setOrderSummary] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState("processing"); // 'processing', 'success', 'error'
  
  const effectRan = useRef(false); // StrictMode preventer
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent double execution in React 18
    if (effectRan.current) return;

    const finalizeOrder = async () => {
      // 1. Get data from Session Storage
      const address = JSON.parse(sessionStorage.getItem("checkout_address"));
      const cart = JSON.parse(sessionStorage.getItem("checkout_cart"));
      const total = Number(sessionStorage.getItem("checkout_total"));
      const token = localStorage.getItem("userToken");

      // Validation
      if (!address || !cart || !token) {
        console.error("❌ Missing checkout data. Redirecting to home...");
        setDbStatus("error");
        setLoading(false);
        return;
      }

      setOrderSummary({ items: cart, total: total });

      try {
        const response = await fetch("http://127.0.0.1:5000/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ address, items: cart, total }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("✅ Order saved in MongoDB:", data.order_id);
          setDbStatus("success");
          
          // Cleanup
          setCart([]);
          localStorage.removeItem("cart");
          sessionStorage.removeItem("checkout_address");
          sessionStorage.removeItem("checkout_cart");
          sessionStorage.removeItem("checkout_total");
        } else {
          throw new Error(data.error || "DB Save Failed");
        }
      } catch (err) {
        console.error("❌ API Error:", err.message);
        setDbStatus("error");
      } finally {
        setLoading(false);
        effectRan.current = true;
      }
    };

    finalizeOrder();
  }, [setCart]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-[#1d1d1f]">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-xl font-medium">Recording your order...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${dbStatus === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {dbStatus === 'success' ? (
                  <CheckCircle2 className="text-emerald-500" size={40} />
                ) : (
                  <span className="text-red-500 text-4xl">⚠️</span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                {dbStatus === 'success' ? "Order Confirmed!" : "Something went wrong"}
              </h1>
              <p className="text-gray-500 mt-2">
                {dbStatus === 'success' 
                  ? "Thank you for your purchase. Your order has been recorded."
                  : "Payment was successful, but we couldn't save your order. Please contact support."}
              </p>
            </div>

            <div className="bg-[#f5f5f7] rounded-3xl p-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {orderSummary.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                      <p className="font-medium text-lg">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-center">
                <span className="text-lg font-medium text-gray-600">Total Paid</span>
                <span className="text-3xl font-black">₹{orderSummary.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-12">
              <Link to="/dashboard" className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all">
                View My Orders
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 border border-gray-300 px-8 py-4 rounded-full font-medium hover:bg-gray-50">
                <ArrowLeft size={16} /> Back to Shopping
              </Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;