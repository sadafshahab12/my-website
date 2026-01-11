"use client";

import React from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { CartItem } from "../types";
import Image from "next/image";

const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart();
    router.push("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-slideInRight">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-pearion-cream">
          <h2 className="font-serif text-xl font-medium">
            Your Shopping Bag ({cart.length})
          </h2>
          <button
            onClick={toggleCart}
            className="text-gray-400 hover:text-pearion-dark"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <p className="text-gray-500">Your bag is currently empty.</p>
              <button
                onClick={toggleCart}
                className="text-pearion-gold underline underline-offset-4 hover:text-pearion-dark transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <div key={item._id} className="flex space-x-4">
                <div className="w-20 h-24 bg-gray-100 shrink-0 overflow-hidden">
                  <Image
                    src={item.images[0]?.asset.url || ""}
                    alt={item.name}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-medium text-pearion-dark">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.material}
                    </p>
                    <p className="text-sm font-medium mt-2">
                      PKR {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-100 text-gray-500"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-100 text-gray-500"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-pearion-cream">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-serif text-lg font-bold">
                PKR {cartTotal.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">
              Shipping & taxes calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-pearion-dark text-white py-4 uppercase tracking-widest text-sm font-medium hover:bg-pearion-gold transition-colors duration-300"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
