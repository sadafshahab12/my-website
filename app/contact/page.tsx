import React from "react";
import { Mail, MapPin, MessageCircle } from "lucide-react";

const ContactPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 bg-white">
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
                    hello@pearioncollections.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-pearion-cream p-3 rounded-full text-pearion-gold">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-pearion-dark">Studio</h3>
                  <p className="text-gray-500 text-sm">
                    123 Luxury Lane, Fashion District,
                    <br />
                    Lahore, Pakistan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-pearion-cream p-8 md:p-12 rounded-lg">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Subject
                </label>
                <select className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-pearion-gold transition-colors text-gray-600">
                  <option>Order Inquiry</option>
                  <option>Product Question</option>
                  <option>Returns & Exchange</option>
                  <option>Other</option>
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
                ></textarea>
              </div>

              <button className="w-full bg-pearion-dark text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-pearion-gold transition-colors duration-300">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
