"use client";

import Link from "next/link";
import { FileMinus, RotateCcw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-40 text-center bg-white">
      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border border-slate-200 flex items-center justify-center">
          <FileMinus className="w-10 h-10 text-slate-800" strokeWidth={1.5} />
        </div>
        <span className="absolute -top-2 -right-6 bg-slate-50 text-slate-400 text-xs px-2 py-1 rounded-full border border-slate-100 shadow-sm rotate-12">
          404
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
        Page Not Found
      </h1>

      {/* Description */}
      <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3 rounded-md hover:bg-black transition-colors font-medium text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Go to Home
        </Link>

        <Link
          href="/contact"
          className="flex items-center gap-2 border border-slate-200 px-8 py-3 rounded-md hover:bg-slate-50 transition-colors font-medium text-sm text-slate-700"
        >
          Contact Support
        </Link>
      </div>

      {/* Optional footer note */}
      <p className="mt-12 text-sm text-slate-400 hover:text-slate-600 transition-colors">
        Need help? Contact Support
      </p>
    </div>
  );
}
