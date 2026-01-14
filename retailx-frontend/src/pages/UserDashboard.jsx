import { useEffect, useState } from "react";
import { UserIcon, MapPinIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch("http://127.0.0.1:5000/api/user/dashboard-data", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError("Failed to load dashboard");
      }
    };
    fetchDashboard();
  }, []);

  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
  if (!data) return <div className="p-10 text-center">Loading Profile...</div>;

  // Logic to get the latest address:
  // 1. Pehle Latest Order ka address check karein
  // 2. Agar order nahi hai, to User Profile ke addresses array ka last address lein
  const latestAddress = data.orders.length > 0 
    ? data.orders[0].address_details 
    : (data.user.addresses && data.user.addresses.length > 0 
        ? data.user.addresses[data.user.addresses.length - 1] 
        : null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-sans bg-[#fbfbfd]">
      <h1 className="text-4xl font-bold mb-10 tracking-tight">Account Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Info Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-50 p-3 rounded-2xl">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Email</p>
              <p className="font-semibold text-gray-800">{data.user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-orange-50 p-3 rounded-2xl">
              <MapPinIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Latest Shipping</p>
              {latestAddress ? (
                <div className="text-sm mt-2 space-y-1 text-gray-600">
                  <p className="font-bold text-gray-900">{latestAddress.fullName}</p>
                  <p>{latestAddress.address}</p>
                  <p>{latestAddress.city}, {latestAddress.zipCode}</p>
                  <p className="mt-2 text-blue-600 font-medium">{latestAddress.phone}</p>
                </div>
              ) : (
                <p className="text-sm italic text-gray-400 mt-1">No address on file</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-2xl font-bold flex items-center gap-3">
               <ShoppingBagIcon className="w-7 h-7" /> Recent Orders
             </h3>
             <span className="text-sm text-blue-600 font-medium">View all</span>
          </div>

          {data.orders.length > 0 ? (
            data.orders.map(order => (
              <div key={order._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase">Order ID: #{order._id.slice(-6)}</p>
                    <p className="text-2xl font-black text-[#1d1d1f]">₹{order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      Confirmed
                    </span>
                    <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500">You haven't placed any orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;