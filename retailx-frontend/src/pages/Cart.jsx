import React, { useContext } from 'react';
import { CartContext } from '../App'; // App.jsx se context import kiya
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cart = () => {
  // --- CHANGES START HERE: Global State Use Kar Rhe Hain ---
  const { cart, setCart } = useContext(CartContext);
  
  // Ab cartItems ki jagah 'cart' use hoga jo App.jsx se aa rha hai
  const cartItems = cart;
  // --- CHANGES END HERE ---

  // 2. Recommendations List (Same as before)
  const recommendations = [
    { id: 101, name: "iPhone 15 Clear Case with MagSafe", price: 4900, image: "https://m.media-amazon.com/images/I/719f6pmuE6L._SL1500_.jpg" },
    { id: 102, name: "Apple 20W USB-C Power Adapter", price: 1699, image: "https://m.media-amazon.com/images/I/61vtLhO6AYL._SL1500_.jpg" },
    { id: 103, name: "Apple AirPods Pro (2nd Gen)", price: 24900, image: "https://m.media-amazon.com/images/I/61SUj2W5yXL._SL1500_.jpg" },
    { id: 104, name: "Belkin Screen Protector", price: 999, image: "https://m.media-amazon.com/images/I/71239O9E-TL._SL1500_.jpg" },
  ];

  // LOGIC: Add recommended item to cart (Updated to use setCart)
  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      updateQty(product.id, 1);
    } else {
      setCart([...cartItems, { ...product, originalPrice: product.price + 500, seller: "RetailX AI Seller", qty: 1 }]);
    }
  };

  // LOGIC: Update Quantity (Updated to use setCart)
  const updateQty = (id, change) => {
    setCart(cartItems.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + change) } : item
    ));
  };

  // LOGIC: Remove Item (Updated to use setCart)
  const removeItem = (id) => {
    setCart(cartItems.filter(item => item.id !== id));
  };

  // LOGIC: Calculations for Price Summary
  // const totalOriginalPrice = cartItems.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.qty), 0);
  // const totalDiscountedPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  // const totalSavings = totalOriginalPrice - totalDiscountedPrice;
  const totalOriginalPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.originalPrice) || Number(item.price) || 0;
    return acc + (price * (item.qty || 1));
  }, 0);

  const totalDiscountedPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    return acc + (price * (item.qty || 1));
  }, 0);

  const totalSavings = totalOriginalPrice - totalDiscountedPrice;

  return (
    <div className="bg-[#f1f3f6] min-h-screen font-sans pb-20 pt-16">

      <Navbar />
      
      <br />

      <div className="max-w-6xl mx-auto px-2">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* LEFT SIDE - CART ITEMS */}
          <div className="lg:w-2/3 bg-white shadow-sm border border-gray-200 rounded-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">My Cart ({cartItems.length})</h2>
            </div>

            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b flex gap-6 hover:bg-gray-50 transition">
                  <div className="w-28 h-28 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 truncate max-w-md">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-tight font-bold">Seller: {item.seller || "RetailX Seller"}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                      <span className="text-gray-500 line-through text-sm">₹{(item.originalPrice || item.price + 500).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
                        <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 transition font-bold">-</button>
                        <span className="px-5 text-sm font-bold border-x bg-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 transition font-bold">+</button>
                      </div>
                      
                      <button onClick={() => removeItem(item.id)} className="text-gray-800 font-bold hover:text-red-500 text-sm tracking-wide transition-colors uppercase">Remove</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <h2 className="text-2xl font-bold text-gray-400">Your cart is empty!</h2>
                <p className="text-gray-500 mt-2">Search for products to add them here.</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - PRICE SUMMARY */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-sm border border-gray-200 rounded-sm sticky top-20">
              <h3 className="p-4 border-b text-gray-500 font-bold uppercase text-sm tracking-wider">Price Details</h3>
              <div className="p-4 space-y-4">
                <div className="flex justify-between text-base">
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹{totalOriginalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base text-gray-700">
                  <span>Discount</span>
                  <span className="text-green-600">-₹{totalSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base border-b border-dashed pb-4 text-gray-700">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total Amount</span>
                  <span>₹{totalDiscountedPrice.toLocaleString()}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="bg-green-50 p-2 text-green-700 text-sm font-bold rounded-sm border border-green-100">
                    You will save ₹{totalSavings.toLocaleString()} on this order
                  </div>
                )}
                
                <button className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-bold text-lg shadow-md hover:bg-[#f4511e] transition uppercase active:scale-95">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- RECOMMENDATIONS SECTION --- */}
        <div className="mt-12 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            You might also be interested in
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((prod) => (
              <div key={prod.id} className="bg-white rounded-lg group transition">
                <div className="h-40 w-full mb-3 flex items-center justify-center">
                  <img src={prod.image} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" alt={prod.name} />
                </div>
                <h4 className="text-sm font-medium text-gray-700 h-10 overflow-hidden leading-tight">{prod.name}</h4>
                <div className="mt-2 flex flex-col">
                    <span className="font-bold text-lg text-gray-900">₹{prod.price.toLocaleString()}</span>
                    <button 
                    onClick={() => addToCart(prod)}
                    className="mt-3 w-full border-2 border-blue-600 text-blue-600 py-1.5 rounded-sm font-bold text-xs hover:bg-blue-600 hover:text-white transition uppercase"
                    >
                    Add to Cart
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <br />
      <Footer/>
    </div>
  );
};

export default Cart;