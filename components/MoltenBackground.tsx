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

      {/* Surface Texture / Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Dark Overlay to maintain readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020408]/50 to-[#020408]" />
    </div>
  );
}
