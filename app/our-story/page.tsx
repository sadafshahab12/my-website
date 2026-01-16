import Image from "next/image";
import React from "react";

const OurStoryPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="relative h-[60vh] mb-20">
        <Image
          src="/website image/about/about banner.png"
          alt="About Pearion"
          width={1000}
          height={1000}
          className="w-full h-full object-cover filter brightness-[0.9]"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              Our Story
            </h1>
            <p className="text-xl text-gray-200 font-light italic">
              {` "Jewelry is not just an accessory, it's a feeling."`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif text-pearion-dark mb-6">
              The Beginning
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {` Pearion Collections began with a simple vision: to bridge the gap
              between high-end luxury and everyday wearability. We believed that
              women shouldn't have to choose between quality and affordability.`}
            </p>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2025, our boutique brand has grown from a small passion
              project into a beloved destination for those seeking elegance that
              speaks volumes without saying a word.
            </p>
          </div>
          <div className="aspect-square bg-gray-100">
            <Image
              src="/website image/about/begining.jpg"
              alt="Workshop"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Brand Signature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <Image
              src="/website image/brand signature.png"
              alt="Pearion Brand Signature"
              width={800}
              height={800}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h2 className="text-3xl font-serif text-pearion-dark mb-6">
              Our Signature
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our signature shell and pearl mark is more than a symbol — it is
              the soul of Pearion. Inspired by the quiet beauty of the ocean,
              the open shell represents femininity, protection, and
              self-discovery.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The pearl within symbolizes inner strength, elegance, and timeless
              value. Just like a pearl is formed with patience and care, every
              Pearion piece is designed to celebrate individuality and refined
              beauty.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          <div className="order-2 md:order-1 aspect-square bg-gray-100">
            <Image
              src="/website image/about/craftymanship.jpg"
              alt="Design Process"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-serif text-pearion-dark mb-6">
              Craftsmanship
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Every piece in our collection is thoughtfully designed and
              meticulously crafted. We work with skilled artisans who use
              ethically sourced materials, including recycled silver and gold
              vermeil.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our plating process is rigorous, ensuring that the golden glow of
              your jewelry lasts through the memories you create while wearing
              them.
            </p>
          </div>
        </div>

        <div className="text-center py-12 bg-pearion-cream rounded-lg p-12">
          <h2 className="text-3xl font-serif text-pearion-dark mb-4">
            Our Promise
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We promise to deliver not just jewelry, but confidence. Each package
            is prepared with love, handled with care, and delivered to bring a
            smile to your face. Welcome to the Pearion family.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStoryPage;
