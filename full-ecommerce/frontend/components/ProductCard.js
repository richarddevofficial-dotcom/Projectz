"use client";

import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";

export default function ProductCard({ product }) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-80 overflow-hidden bg-gray-200">
          {product.images && product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {product.isFeatured && (
            <span className="absolute top-4 left-4 bg-accent text-white text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {product.description.substring(0, 60)}...
          </p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              ${product.price}
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">
                {product.rating || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <button
        className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={() => {
          // Add to cart functionality will be implemented
          console.log("Add to cart:", product);
        }}
      >
        <FiShoppingBag className="w-5 h-5" />
      </button>
    </div>
  );
}
