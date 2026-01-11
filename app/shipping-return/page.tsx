"use client";

import React from "react";

const ShippingReturns: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 md:px-8 bg-white">
      <h1 className="text-3xl md:text-4xl font-serif font-black text-pearion-dark mb-12">
        Shipping & Returns
      </h1>

      {/* Shipping */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-pearion-dark mb-4">
          Shipping
        </h2>
        <p className="text-gray-700 mb-4">
          At <strong>Pearion Collections</strong>, we strive to deliver your
          jewelry as quickly and safely as possible.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Free shipping on all orders over PKR 5,000 within Pakistan.</li>
          <li>
            Standard delivery typically takes <strong>3–5 business days</strong>
            .
          </li>
          <li>
            All orders are shipped with <strong>tracking information</strong>{" "}
            provided via email.
          </li>
          <li>
            Carefully packaged to ensure your jewelry arrives in perfect
            condition.
          </li>
        </ul>
      </section>

      {/* Returns */}
      <section>
        <h2 className="text-2xl font-semibold text-pearion-dark mb-4">
          Returns & Warranty
        </h2>
        <p className="text-gray-700 mb-4">
          We want you to love your Pearion jewelry. Please read our returns and
          warranty guidelines carefully:
        </p>

        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>
            <strong>Change of Mind:</strong> Items can be returned within{" "}
            <strong>7 days</strong> of delivery in original condition and
            packaging. Shipping charges are non-refundable.
          </li>
          <li>
            <strong>1-Year Warranty – Manufacturing Defects:</strong> Covers
            loose clasps, broken chains, or detached pearls/stones.
            <span className="italic">
              Accidental damage, wear-and-tear, or misuse are not covered.
            </span>
          </li>
          <li>
            To make a warranty claim, please contact{" "}
            <strong>pearioncollections@gmail.com</strong> with your order number
            and photos of the defect.
          </li>
          <li>
            Approved returns or warranty repairs will be replaced or repaired at
            our discretion.
          </li>
        </ul>

        <p className="text-gray-700">
          For any questions regarding shipping, returns, or warranty, our
          support team is here to help.
        </p>
      </section>
    </div>
  );
};

export default ShippingReturns;
