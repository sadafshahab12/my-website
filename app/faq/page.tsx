"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";


interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  // Product & Materials
  {
    category: "Product & Materials",
    question: "Are Pearion pearls real or imitation?",
    answer:
      'At Pearion, we celebrate the beauty of both worlds. Our "Ethereal" collection uses genuine freshwater pearls cultivated with care. Our fashion lines utilize high-grade shell pearls (mother-of-pearl core) for perfect shape and durability. Each product description specifies the pearl type.',
  },
  {
    category: "Product & Materials",
    question: "What materials are used in Pearion jewelry?",
    answer:
      "We are committed to quality. Our base metals are primarily 925 Sterling Silver or hypoallergenic Brass. We finish our pieces with thick 18k Gold Vermeil or Rhodium plating to ensure a luxurious, long-lasting shine.",
  },
  {
    category: "Product & Materials",
    question: "Is your jewelry hypoallergenic?",
    answer:
      "Yes. We ensure all our pieces are free from nickel and lead, making them safe for sensitive skin.",
  },
  {
    category: "Product & Materials",
    question: "Will the gold plating fade?",
    answer:
      "All gold-plated jewelry will naturally fade over time, but our 18k Gold Vermeil is much thicker than standard plating. With proper care (avoiding moisture and chemicals), your Pearion pieces will maintain their golden glow for years.",
  },

  // Care
  {
    category: "Care & Usage",
    question: "How do I care for my pearl jewelry?",
    answer:
      'Pearls are organic gemstones and need gentle love. Wipe them with a soft cloth after wearing to remove oils. Avoid direct contact with perfumes, hairspray, and lotions ("last on, first off"). Store them flat in your Pearion pouch.',
  },
  {
    category: "Care & Usage",
    question: "Is Pearion jewelry waterproof?",
    answer:
      "While our jewelry is crafted to be durable, we recommend removing it before swimming, showering, or exercising. Water, chlorine, and sweat can dull the luster of pearls and accelerate plating wear over time.",
  },

  // Service
  {
    category: "Services & Shipping",
    question: "Do you offer gift packaging?",
    answer:
      "Absolutely. Every Pearion order arrives in our signature cream and gold luxury box, perfect for gifting. We can also include a handwritten note upon request at checkout.",
  },
  {
    category: "Services & Shipping",
    question: "Shipping & delivery timelines",
    answer:
      "We process orders within 24 hours. Domestic shipping typically takes 2-4 business days. You will receive a tracking number via email/SMS as soon as your treasure is on its way.",
  },
  {
    category: "Services & Shipping",
    question: "Returns & exchanges policy",
    answer:
      "We want you to adore your purchase. If you are not completely satisfied, we accept returns within 14 days of delivery for unworn items in original packaging. Please note that earrings are non-returnable for hygiene reasons.",
  },
  {
    category: "Services & Shipping",
    question: "How can I contact Pearion?",
    answer:
      "We are here to help! You can reach us via our Contact page, email us at pearioncollections@gmail.com, or chat with us on WhatsApp during business hours.",
  },
];

const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-pearion-cream/30">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <p className="text-pearion-gold text-sm uppercase tracking-[0.2em] font-medium mb-3">
            Customer Care
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-pearion-dark mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-xl mx-auto">
            Everything you need to know about your Pearion jewelry, care
            instructions, and our services.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
      
            const showCategory =
              index === 0 || faqs[index - 1].category !== faq.category;

            return (
              <React.Fragment key={index}>
                {showCategory && (
                  <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-pearion-gold"></div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {faq.category}
                    </h3>
                  </div>
                )}

                <div className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-6 flex items-center justify-between text-left group transition-colors hover:bg-gray-50/50"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`font-serif text-lg transition-colors duration-300 ${isOpen ? "text-pearion-gold" : "text-pearion-dark group-hover:text-gray-700"}`}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`shrink-0 ml-4 ${isOpen ? "text-pearion-gold" : "text-gray-400"}`}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-8 pt-0 text-gray-600 leading-relaxed font-light">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-pearion-dark border-b border-pearion-dark pb-1 hover:text-pearion-gold hover:border-pearion-gold transition-colors duration-300"
          >
            <MessageCircle size={18} />
            <span className="uppercase text-sm tracking-widest font-semibold">
              Contact Support
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
