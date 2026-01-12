"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Mail, FileX } from "lucide-react";

interface ErrorProps {
  error: unknown; // accept anything
  reset?: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  // Type guard to safely check if an object has a string 'message' property
  function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    );
  }

  // Convert any error to a string message
  let errorMessage = "Unknown error";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = (error as Error).message;
  } else if (isErrorWithMessage(error)) {
    errorMessage = error.message;
  } else {
    try {
      errorMessage = JSON.stringify(error);
    } catch {
      errorMessage = String(error);
    }
  }

  // Log error for debugging
  useEffect(() => {
    console.error("Caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border border-slate-200 flex items-center justify-center">
          <FileX className="w-10 h-10 text-slate-800" strokeWidth={1.5} />
        </div>
        <span className="absolute -top-2 -right-6 bg-slate-50 text-slate-400 text-xs px-2 py-1 rounded-full border border-slate-100 shadow-sm rotate-12">
          Err
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
        Something went wrong
      </h1>
      <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
        {errorMessage}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {reset && (
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3 rounded-md hover:bg-black transition-colors font-medium text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </button>
        )}

        <Link
          href="/contact"
          className="flex items-center gap-2 border border-slate-200 px-8 py-3 rounded-md hover:bg-slate-50 transition-colors font-medium text-sm text-slate-700"
        >
          <Mail className="w-4 h-4" />
          Contact Support
        </Link>
      </div>

      <Link
        href="/contact"
        className="mt-12 text-sm text-slate-400 hover:text-slate-600 transition-colors"
      >
        Need help? Contact Support
      </Link>
    </div>
  );
}
