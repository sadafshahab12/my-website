"use client";

import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 md:px-8 bg-white">
      <h1 className="text-3xl md:text-4xl font-serif font-black text-pearion-dark mb-12">
        Privacy Policy
      </h1>

      <p className="text-gray-700 mb-4">
        Your privacy is important to us at <strong>Pearion Collections</strong>.
        This policy explains how we collect, use, and protect your personal
        information.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-pearion-dark mb-4">
          Information We Collect
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            Personal details like name, email, phone number, and shipping
            address.
          </li>
          <li>Order and payment information.</li>
          <li>
            Browsing behavior and preferences on our website (cookies and
            analytics).
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-pearion-dark mb-4">
          How We Use Your Information
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>To process and deliver your orders efficiently.</li>
          <li>To communicate about order updates, promotions, and events.</li>
          <li>To improve our website and your shopping experience.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-pearion-dark mb-4">
          Data Protection
        </h2>
        <p className="text-gray-700 mb-2">
          We take your privacy seriously and implement technical and
          organizational measures to protect your personal data from
          unauthorized access, disclosure, or loss.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-pearion-dark mb-4">
          Sharing Your Information
        </h2>
        <p className="text-gray-700">
          We do not sell or share your personal information with third parties,
          except for:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
          <li>
            Service providers who help us fulfill orders (couriers, payment
            gateways).
          </li>
          <li>When required by law or legal process.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-pearion-dark mb-4">
          Your Rights
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Access, correct, or delete your personal information.</li>
          <li>Opt-out of marketing communications at any time.</li>
          <li>
            Contact us at <strong>pearioncollections@gmail.com</strong> for
            privacy concerns.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
