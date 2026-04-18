"use client";

export function MoltenBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020408]">
      {/* Primary Molten Core */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-60 mix-blend-screen">
        {/* Large Red Glows */}
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-red-600/50 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[700px] h-[700px] bg-orange-600/40 rounded-full filter blur-[120px]" />
        
        {/* Subtle Heat Spots */}
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-rose-600/30 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-red-900/50 rounded-full filter blur-[60px]" />
      </div>

      {/* Surface Texture / Grain (SVG Data URI for zero-latency, 0-dependency grain) */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Dark Overlay to maintain readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020408]/50 to-[#020408]" />
    </div>
  );
}
