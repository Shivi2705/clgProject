import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cart = () => {
  // 1. Cart Items State (Items currently in the cart)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Apple iPhone 15 (Blue, 128 GB)",
      price: 72999,
      originalPrice: 79900,
      image: "https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg",
      seller: "APPARIO RETAIL",
      qty: 1
    }
  ]);

  const recommendations = [
    { id: 101, name: "iPhone 15 Clear Case with MagSafe", price: 4900, image: "https://m.media-amazon.com/images/I/719f6pmuE6L._SL1500_.jpg" },
    { id: 102, name: "Apple 20W USB-C Power Adapter", price: 1699, image: "https://m.media-amazon.com/images/I/61vtLhO6AYL._SL1500_.jpg" },
    { id: 103, name: "Apple AirPods Pro (2nd Gen)", price: 24900, image: "https://m.media-amazon.com/images/I/61SUj2W5yXL._SL1500_.jpg" },
    { id: 104, name: "Belkin Screen Protector", price: 999, image: "https://m.media-amazon.com/images/I/71239O9E-TL._SL1500_.jpg" },
  ];

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      updateQty(product.id, 1);
    } else {
      setCartItems([...cartItems, { ...product, originalPrice: product.price + 500, seller: "RetailX AI Seller", qty: 1 }]);
    }
  };

  const updateQty = (id, change) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalOriginalPrice = cartItems.reduce((acc, item) => acc + (item.originalPrice * item.qty), 0);
  const totalDiscountedPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalSavings = totalOriginalPrice - totalDiscountedPrice;

  return (
    <>
      <Navbar />
      {/* FIX: added pt-24 to push content below the fixed navbar */}
      <div className="bg-[#f1f3f6] min-h-screen font-sans pb-20 pt-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* LEFT SIDE - CART ITEMS */}
            <div className="lg:w-2/3 bg-white shadow-sm rounded-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">My Cart ({cartItems.length})</h2>
              </div>

              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="p-6 border-b flex flex-col sm:flex-row gap-6">
                    <div className="w-28 h-28 mx-auto sm:mx-0 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 uppercase font-bold">Seller: {item.seller}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                        <span className="text-gray-500 line-through text-sm">₹{item.originalPrice.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center border rounded-md">
                          <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 hover:bg-gray-100 font-bold">-</button>
                          <span className="px-4 text-sm font-bold border-x">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 hover:bg-gray-100 font-bold">+</button>
                        </div>
                        
                        <button onClick={() => removeItem(item.id)} className="text-gray-800 font-bold hover:text-red-500 text-sm uppercase transition-colors">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center">
                  <h2 className="text-2xl font-bold text-gray-400">Your cart is empty!</h2>
                </div>
              )}
            </div>

            {/* RIGHT SIDE - PRICE SUMMARY */}
            <div className="lg:w-1/3">
              <div className="bg-white shadow-sm rounded-sm sticky top-24">
                <h3 className="p-4 border-b text-gray-500 font-bold uppercase text-sm tracking-wider">Price Details</h3>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between text-base">
                    <span>Price ({cartItems.length} items)</span>
                    <span>₹{totalOriginalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Discount</span>
                    <span className="text-green-600">-₹{totalSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base border-b border-dashed pb-4">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total Amount</span>
                    <span>₹{totalDiscountedPrice.toLocaleString()}</span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="bg-green-50 p-3 text-green-700 text-sm font-bold rounded-sm">
                      You will save ₹{totalSavings.toLocaleString()} on this order
                    </div>
                  )}
                  
                  <button className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-bold text-lg shadow-md hover:bg-[#f4511e] transition uppercase">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RECOMMENDATIONS SECTION */}
          <div className="mt-8 bg-white p-6 rounded-sm shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-8">You might also be interested in</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {recommendations.map((prod) => (
                <div key={prod.id} className="flex flex-col h-full">
                  <div className="h-40 w-full mb-4 flex items-center justify-center">
                    <img src={prod.image} className="max-h-full max-w-full object-contain hover:scale-105 transition duration-300" alt={prod.name} />
                  </div>
                  <h4 className="text-sm font-medium text-gray-700 h-10 overflow-hidden leading-tight mb-2">{prod.name}</h4>
                  <div className="mt-auto">
                    <span className="font-bold text-lg text-gray-900">₹{prod.price.toLocaleString()}</span>
                    <button 
                      onClick={() => addToCart(prod)}
                      className="mt-4 w-full border border-gray-300 py-2 rounded-sm font-bold text-xs hover:bg-gray-50 transition uppercase"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;