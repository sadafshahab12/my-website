"use client";
import React, { useState } from "react";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    subject: "orderInquiry",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          subject: "orderInquiry",
          message: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-35 pb-20 bg-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-serif text-center mb-16">Get in Touch</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-serif mb-6">{`We're here to help`}</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Have a question about your order, shipping, or a specific product?
              Fill out the form or reach us via WhatsApp for instant support.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-pearion-cream p-3 rounded-full text-pearion-gold">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-pearion-dark">
                    WhatsApp Support
                  </h3>
                  <p className="text-gray-500 text-sm">+92 3473562371</p>
                  <p className="text-xs text-gray-400">
                    Available Mon-Sat, 9am - 9pm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-pearion-cream p-3 rounded-full text-pearion-gold">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-pearion-dark">Email Us</h3>
                  <p className="text-gray-500 text-sm">
                    pearioncollections@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-pearion-cream p-3 rounded-full text-pearion-gold">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-pearion-dark">Store</h3>
                  <p className="text-gray-500 text-sm">Karachi, Pakistan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-pearion-cream p-8 md:p-12 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors"
                    placeholder="Your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors"
                    placeholder="+92 300 0000000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors"
                    placeholder="Pakistan"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  name="subject"
                  required
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors text-gray-600"
                >
                  <option value="orderInquiry">Order Inquiry</option>
                  <option value="productQuestion">Product Question</option>
                  <option value="returnsExchange">Returns & Exchange</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors"
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={handleChange}
                  name="message"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pearion-dark text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-pearion-gold transition-colors duration-300"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
