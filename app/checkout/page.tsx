"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart, isCartLoaded } = useCart();
  const SHIPPING_FEE = 250;

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shipping info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"easypaisa" | "bank">(
    "easypaisa"
  );
  const [receipt, setReceipt] = useState<File | null>(null);

  if (!isCartLoaded) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center bg-gray-50">
        {/* Animated spinner */}
        <div className="w-16 h-16 border-4 border-pearion-gold border-t-transparent rounded-full animate-spin mb-6"></div>

        {/* Loading text */}
        <p className="text-gray-700 text-lg font-serif tracking-wide">
          Loading your checkout...
        </p>

        {/* Optional subtle note */}
        <p className="text-gray-400 text-sm mt-2">
          Please wait a moment while we prepare your cart.
        </p>
      </div>
    );
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (!receipt) {
      alert(
        "Please upload your EasyPaisa or Bank receipt before placing the order."
      );
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("postalCode", postalCode);
      formData.append("paymentMethod", paymentMethod);
      formData.append("totalAmount", (cartTotal + SHIPPING_FEE).toString());
      formData.append("receipt", receipt);
      formData.append("products", JSON.stringify(cart));

      const res = await fetch("/api/order", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setIsCompleted(true);
        clearCart();
      } else {
        alert(data.error || "Error placing order. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-lg shadow-sm text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-serif mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for shopping with Pearion. Your order will be processed
            shortly.
          </p>
          <Link
            href="/"
            className="inline-block bg-pearion-dark text-white px-8 py-3 uppercase tracking-widest text-xs font-bold"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center">
        <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
        <Link href="/shop" className="text-pearion-gold underline">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-serif mb-8 border-b pb-4">
              {step === 1 ? "Shipping Information" : "Payment Details"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-pearion-gold"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-pearion-gold"
                    />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-pearion-gold"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-pearion-gold"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-pearion-gold"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-pearion-gold"
                    />
                    <input
                      required
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-pearion-gold"
                    />

                    <input
                      required
                      type="text"
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-pearion-gold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-pearion-dark text-white py-4 mt-6 uppercase tracking-widest text-sm font-semibold hover:bg-pearion-gold transition-colors"
                  >
                    Continue to Payment
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Payment Methods */}
                  <div className="bg-white p-4 border border-gray-200 rounded">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="easypaisa"
                        checked={paymentMethod === "easypaisa"}
                        onChange={() => setPaymentMethod("easypaisa")}
                        className="accent-pearion-dark"
                      />
                      <span>EasyPaisa</span>
                    </label>
                    {paymentMethod === "easypaisa" && (
                      <div className="mt-4 text-gray-600 text-sm">
                        Send payment to <b>03402195735 Sadaf Shahab</b> and
                        upload screenshot below.
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 border border-gray-200 rounded">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        className="accent-pearion-dark"
                      />
                      <span>Bank Transfer</span>
                    </label>
                    {paymentMethod === "bank" && (
                      <div className="mt-4 text-gray-600 text-sm">
                        Bank: MCB, Account #: 1234567890, Sadaf Shahab (Pearion
                        Collections) <br />
                        Upload transaction receipt below.
                      </div>
                    )}
                  </div>

                  {/* Upload Receipt */}
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Upload Receipt / Screenshot
                    </label>
                    <div className="relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-pearion-gold transition-colors bg-gray-50">
                      <svg
                        className="w-10 h-10 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4h10v12M5 20h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-500 text-sm mb-2">
                        Click to upload or drag & drop
                      </span>
                      <span className="text-gray-400 text-xs">
                        (Accepted: JPG, PNG, PDF)
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          setReceipt(e.target.files?.[0] || null)
                        }
                        required
                        className="absolute h-full w-full opacity-0 cursor-pointer"
                      />
                    </div>
                    {receipt && (
                      <p className="mt-2 text-green-600 text-sm font-medium">
                        Selected file: {receipt.name}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 border border-gray-300 text-gray-600 py-4 uppercase tracking-widest text-sm font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-2/3 bg-pearion-dark text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-pearion-gold transition-colors"
                    >
                      {isProcessing
                        ? "Processing..."
                        : `Place Order PKR ${(cartTotal + SHIPPING_FEE).toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 h-fit shadow-sm">
            <h3 className="font-serif text-xl mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 overflow-hidden relative">
                      <Image
                        src={urlFor(item.images[0]).url()}
                        alt={item.name}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        {item.category.title}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>PKR {SHIPPING_FEE.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <span className="font-serif text-lg font-bold">Total</span>
              <span className="font-serif text-lg font-bold">
                PKR {(cartTotal + SHIPPING_FEE).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
