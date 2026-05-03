"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "US",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create order first
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        })),
        shippingAddress,
        paymentMethod: "stripe",
        itemsPrice: totalAmount,
        shippingPrice: totalAmount > 50 ? 0 : 5,
        totalPrice: totalAmount + (totalAmount > 50 ? 0 : 5),
      };

      const orderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      // Create payment intent
      const paymentResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create-payment-intent`,
        {
          amount: orderData.totalPrice,
          orderId: orderResponse.data._id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: paymentResponse.data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        clearCart();
        router.push("/order-confirmation");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Shipping Information</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={shippingAddress.fullName}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                fullName: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                address: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              className="px-3 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  postalCode: e.target.value,
                })
              }
              className="px-3 py-2 border rounded-md"
              required
            />
          </div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, phone: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Payment Information</h3>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : `Pay $${(totalAmount + (totalAmount > 50 ? 0 : 5)).toFixed(2)}`}
      </button>
    </form>
  );
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { cartItems } = useCart();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [user, cartItems]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-20">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm mb-2">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                $
                {(
                  cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) +
                  (cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) >
                  50
                    ? 0
                    : 5)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
