import React from 'react';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-xl ${className}`}>
      <img 
        src="/logo.jpg" 
        alt="Prodea Logo" 
        className="w-full h-full object-contain relative z-10"
      />
    </div>
  );
};
