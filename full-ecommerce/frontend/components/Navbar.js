"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            FASHION<span className="text-accent">STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/shop"
              className="text-gray-700 hover:text-primary transition"
            >
              Shop
            </Link>
            <Link
              href="/shop?category=men"
              className="text-gray-700 hover:text-primary transition"
            >
              Men
            </Link>
            <Link
              href="/shop?category=women"
              className="text-gray-700 hover:text-primary transition"
            >
              Women
            </Link>
            <Link
              href="/shop?category=kids"
              className="text-gray-700 hover:text-primary transition"
            >
              Kids
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <FiShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <FiUser className="w-6 h-6 text-gray-700 hover:text-primary transition" />
                  <span className="text-sm text-gray-700">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center space-x-2">
                <FiUser className="w-6 h-6 text-gray-700 hover:text-primary transition" />
                <span className="hidden sm:inline text-sm">Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                href="/shop"
                className="text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/shop?category=men"
                className="text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Men
              </Link>
              <Link
                href="/shop?category=women"
                className="text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Women
              </Link>
              <Link
                href="/shop?category=kids"
                className="text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Kids
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
