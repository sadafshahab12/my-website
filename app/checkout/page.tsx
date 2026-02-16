"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart, isCartLoaded, cartCount } = useCart();
  const SHIPPING_FEE = cartCount >= 3 ? 0 : 300;
  const isFreeShipping = cartCount >= 3;
  const [orderNumber, setOrderNumber] = useState<string>("");
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
    "easypaisa",
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
      alert("Please upload your payment receipt before placing the order.");
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
      formData.append("products", JSON.stringify(cart)); // Sanity will handle _type automatically

      // Ab hamesha isi endpoint par bhejain
      const res = await fetch("/api/order", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.orderNumber);
        setIsCompleted(true);
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
  const downloadReceipt = () => {
    const doc = new jsPDF();
    const goldColor = [184, 134, 11]; // Pearion Gold RGB
    const darkColor = [33, 33, 33]; // Dark Text

    // --- Header Section ---
    doc.setFont("serif", "bold");
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setFontSize(24);
    doc.text("PEARION COLLECTIONS", 105, 25, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 32, 190, 32); // Horizontal Line

    // --- Order Info ---
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 190, 42, {
      align: "right",
    });

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(11);
    doc.text("BILL TO:", 20, 45);
    doc.setFont("helvetica", "bold");
    doc.text(`${firstName.toUpperCase()} ${lastName.toUpperCase()}`, 20, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`${address}`, 20, 58);
    doc.text(`${city}, ${postalCode}`, 20, 64);
    doc.text(`Phone: ${phone}`, 20, 70);

    doc.setFont("helvetica", "bold");
    doc.text(`ORDER ID: #${orderNumber}`, 190, 52, { align: "right" });

    // --- Table Section ---
    const tableData = cart.map((item) => [
      {
        content: item.name,
        styles: { fontStyle: "bold" as const },
      },
      item.quantity,
      `PKR ${(item.discountPrice || item.originalPrice).toLocaleString()}`,
      `PKR ${((item.discountPrice || item.originalPrice) * item.quantity).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 80,
      head: [["PRODUCT DETAILS", "QTY", "UNIT PRICE", "TOTAL"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [33, 33, 33],
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: "center",
      },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      styles: { fontSize: 9, cellPadding: 5 },
    });

    // --- Summary Section ---
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Subtotal:", 140, finalY);
    doc.text(`PKR ${cartTotal.toLocaleString()}`, 190, finalY, {
      align: "right",
    });

    doc.text("Shipping Fee:", 140, finalY + 7);
    doc.text(`PKR ${SHIPPING_FEE.toLocaleString()}`, 190, finalY + 7, {
      align: "right",
    });

    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 12, 190, finalY + 12);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("Grand Total:", 140, finalY + 20);
    doc.text(
      `PKR ${(cartTotal + SHIPPING_FEE).toLocaleString()}`,
      190,
      finalY + 20,
      { align: "right" },
    );

    // --- Footer ---
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Thank you for choosing Pearion Collections!", 105, 280, {
      align: "center",
    });

    doc.save(`Pearion-Invoice-${orderNumber}.pdf`);
  };
  if (isCompleted) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-lg shadow-sm text-center max-w-md w-full border-t-4 border-pearion-gold">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-serif mb-2">Order Confirmed!</h2>
          <p className="text-pearion-gold font-bold mb-4 tracking-widest uppercase">
            ID: {orderNumber}
          </p>
          <p className="text-gray-600 mb-8">
            Thank you for shopping with Pearion. We have sent a confirmation
            email to <b>{email}</b>.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={downloadReceipt}
              className="bg-pearion-gold text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-opacity-90"
            >
              Download PDF Receipt
            </button>
            <Link
              href="/"
              onClick={() => clearCart()}
              className="inline-block bg-pearion-dark text-white px-8 py-3 uppercase tracking-widest text-xs font-bold"
            >
              Return Home
            </Link>
          </div>
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

                  {/* <div className="bg-white p-4 border border-gray-200 rounded">
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
                  </div> */}

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
          {/* Order Summary */}
          <div className="bg-white p-8 h-fit shadow-sm">
            <h3 className="font-serif text-xl mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              {cart.map((item) => {
                const activePrice =
                  item.discountPrice && item.discountPrice > 0
                    ? item.discountPrice
                    : item.originalPrice;

                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 overflow-hidden relative">
                        <Image
                          src={urlFor(item.images[0]).url()}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-500 text-xs">
                          {item.category?.title}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {/* Display Active Price */}
                      <p className="font-medium text-gray-900">
                        PKR {(activePrice * item.quantity).toLocaleString()}
                      </p>

                      {/* Display Struck-through Original Price if Discounted */}
                      {item.discountPrice && item.discountPrice > 0 && (
                        <p className="text-[10px] text-gray-400 line-through">
                          PKR{" "}
                          {(
                            item.originalPrice * item.quantity
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal, Shipping and Total Logic */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {cartTotal.toLocaleString()}</span>
              </div>

              {/* Optional: Show Total Savings in Summary too */}
              {cart.some((item) => item.discountPrice) && (
                <div className="flex justify-between text-red-600">
                  <span>Discount Savings</span>
                  <span>
                    - PKR{" "}
                    {cart
                      .reduce((acc, item) => {
                        const saving = item.discountPrice
                          ? item.originalPrice - item.discountPrice
                          : 0;
                        return acc + saving * item.quantity;
                      }, 0)
                      .toLocaleString()}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>PKR {cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  {isFreeShipping ? (
                    <div className="flex flex-col items-end">
                      <span className="text-green-600 font-bold tracking-tight uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        Free Shipping Applied
                      </span>
                      <span className="text-gray-400 line-through text-xs">
                        PKR 300
                      </span>
                    </div>
                  ) : (
                    <span>PKR {SHIPPING_FEE.toLocaleString()}</span>
                  )}
                </div>

                {/* Agar 3 items nahi hain to promo dikhaein */}
                {!isFreeShipping && (
                  <p className="text-[10px] text-pearion-gold italic">
                    Tip: Add {3 - cartCount} more items to get FREE shipping!
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <span className="font-serif text-lg font-bold">Total</span>
              <span className="font-serif text-lg font-bold text-pearion-dark">
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
