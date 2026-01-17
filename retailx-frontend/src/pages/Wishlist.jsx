import { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products") // or wishlist API later
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 px-8 py-10">
      <h1 className="text-4xl font-bold mb-8">
        💖 Your Wishlist
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition p-4 border"
            >
              <img
                src={product.imageURL}
                alt={product.name}
                className="h-48 w-full object-cover rounded-xl"
              />

              <div className="mt-4 space-y-2">
                <h2 className="font-semibold text-lg line-clamp-2">
                  {product.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {product.brand}
                </p>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold text-emerald-600">
                    ₹{product.finalPrice}
                  </span>

                  <button className="text-pink-500 hover:scale-110 transition">
                    <Heart fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}