import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Animated Ring Loader */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-pearion-gold/30"></div>
        <div className="absolute w-16 h-16 rounded-full border-4 border-pearion-gold border-t-transparent animate-spin"></div>
      </div>

      {/* Brand Text */}
      <h2 className="mt-6 text-lg font-serif tracking-wide text-gray-700">
        Curating Your Collection
      </h2>

      {/* Elegant subtitle */}
      <p className="mt-2 text-sm text-gray-400 tracking-widest animate-pulse">
        Please wait…
      </p>
    </div>
  );
};

export default Loading;
