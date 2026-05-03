"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const { cartItems, totalAmount, removeFromCart, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items yet
        </p>
        <Link
          href="/shop"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 bg-white p-4 rounded-lg shadow"
            >
              <div className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
                <p className="text-primary font-bold">${item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.productId,
                      item.size,
                      parseInt(e.target.value),
                    )
                  }
                  className="px-2 py-1 border rounded"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => removeFromCart(item.productId, item.size)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{totalAmount > 50 ? "Free" : "$5.00"}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ${(totalAmount + (totalAmount > 50 ? 0 : 5)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-primary text-white text-center py-3 rounded-md font-semibold hover:bg-primary/90 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="block w-full text-center mt-3 text-primary hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
