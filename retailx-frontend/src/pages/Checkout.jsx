import { useLocation } from "react-router-dom";
import { useState } from "react";
import PaymentButton from "../components/PaymentButton";
import {
  LockClosedIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const Checkout = () => {
  const location = useLocation();

  const total = location.state?.total || 0;
  const items = location.state?.items || [];

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 IMPORTANT: save data BEFORE payment
  const saveCheckoutData = () => {
    sessionStorage.setItem("checkout_address", JSON.stringify(formData));
    sessionStorage.setItem("checkout_cart", JSON.stringify(items));
    sessionStorage.setItem("checkout_total", total);
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] pb-20">
      <main className="max-w-5xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-10">
            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border rounded-xl px-4 py-4"
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  className="w-full border rounded-xl px-4 py-4"
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="md:col-span-2 border rounded-xl px-4 py-4"
                  name="fullName"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
                <input
                  className="md:col-span-2 border rounded-xl px-4 py-4"
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                />
                <input
                  className="border rounded-xl px-4 py-4"
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                />
                <input
                  className="border rounded-xl px-4 py-4"
                  name="zipCode"
                  placeholder="PIN Code"
                  onChange={handleChange}
                />
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="bg-[#f5f5f7] rounded-3xl p-8 sticky top-8">
              <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              {/* 🔥 PAYMENT BUTTON */}
              <div
                onClick={saveCheckoutData}
                className="rounded-full overflow-hidden"
              >
                <PaymentButton total={total} />
              </div>

              <div className="mt-6 text-xs text-gray-500 text-center">
                <div className="flex justify-center gap-2 mb-2">
                  <LockClosedIcon className="w-4 h-4" />
                  Secure Stripe Payments
                </div>
                <div className="flex justify-center gap-4 opacity-40">
                  <CreditCardIcon className="w-6 h-6" />
                  <ShieldCheckIcon className="w-6 h-6" />
                  <TruckIcon className="w-6 h-6" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
