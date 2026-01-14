const PaymentButton = ({ total }) => {

  const handlePayment = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:5000/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: total   // 🔥 THIS FIXES KeyError
          })
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // ✅ STRIPE REDIRECT
      } else {
        alert("Stripe session not created");
      }

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-black text-white py-4 rounded-full font-semibold"
    >
      Pay ₹{total}
    </button>
  );
};

export default PaymentButton;
