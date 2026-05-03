"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Loader from "@/components/Loader";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success("Added to cart!");
  };

  if (loading) return <Loader />;
  if (!product)
    return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-100">
            {product.images && product.images[selectedImage] && (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded overflow-hidden border-2 ${
                    selectedImage === idx
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400">★</span>
            <span>
              {product.rating || 0} ({product.numReviews || 0} reviews)
            </span>
          </div>
          <p className="text-3xl font-bold text-primary mb-4">
            ${product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Size</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded-md"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="px-3 py-1 border rounded-md"
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-2">
                {product.stock} in stock
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary/90 transition"
          >
            Add to Cart
          </button>

          {/* Stock Status */}
          <div className="mt-4 text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600">✓ In Stock</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
