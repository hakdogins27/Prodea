"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Box, Cpu, Sparkles, Wand2, Terminal, Code2, Layers, LayoutTemplate, Database, Command, Loader2, FileText } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useProjectStore } from "@/store/useProjectStore";
import { DemoSequence } from "@/components/landing/DemoSequence";
import { MarkdownDemoSequence } from "@/components/landing/MarkdownDemoSequence";

export default function Homepage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { clearSession } = useProjectStore();

  useEffect(() => {
    setMounted(true);
    clearSession();
  }, [clearSession]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden selection:bg-primary/20 relative">
      <div className="relative z-10">
        
        {/* Navigation Navbar */}
        <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 glass-effect glow-border-b sticky top-0 z-[100]">
          <div className="flex items-center gap-2 sm:gap-4 font-bold tracking-tight">
            <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="font-branding text-xs sm:text-lg tracking-[0.3em]">PRODEA</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground hidden md:flex">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#templates" className="hover:text-foreground transition-colors">Templates</a>
            <a href="#philosophy" className="hover:text-foreground transition-colors">Philosophy</a>
          </div>
          <button 
            onClick={() => router.push('/project')}
            className="text-[10px] sm:text-sm font-semibold border px-3 sm:px-4 py-1.5 rounded-full hover:bg-muted transition-colors bg-background"
          >
            Launch app
          </button>
        </nav>

        {/* 1. HERO SECTION */}
        <section className="pt-16 sm:pt-20 pb-16 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
          <Logo className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 animate-float" />
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 leading-none">
            STRUC<span className="text-orange-500">TURE</span> YOUR<br/>
            IDEAS.
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
            A high-velocity, studio-grade engineering studio that transforms raw concepts into <span className="text-white border-b border-orange-500/50">production-ready blueprints.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/project')}
              className="group relative px-8 py-4 bg-orange-600 text-white rounded-full font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_50px_rgba(234,88,12,0.5)]"
            >
              Start Building <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
            <a href="#templates" className="px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors w-full sm:w-auto active:scale-95">
              View Templates
            </a>
          </div>
        </section>

        {/* 2. WHAT PRODEA DOES */}
        <section className="py-16 px-6 border-y border-white/5 bg-transparent backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              
              <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:transform group-hover:scale-110 transition-transform duration-500">
                  <Wand2 className="w-32 h-32" />
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 border border-primary/30">
                  <Wand2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">Idea <ArrowRight className="w-4 h-4 text-muted-foreground"/> Structure</h3>
                <p className="text-muted-foreground leading-relaxed"> Transforms messy, unstructured thoughts into organized, strongly-typed project definitions dynamically.</p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:transform group-hover:scale-110 transition-transform duration-500">
                  <Cpu className="w-32 h-32" />
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30">
                  <Cpu className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">Structure <ArrowRight className="w-4 h-4 text-muted-foreground"/> System</h3>
                <p className="text-muted-foreground leading-relaxed">Generates robust architectural maps, optimal tech stack synthesis, and inferred database definitions.</p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:transform group-hover:scale-110 transition-transform duration-500">
                  <Terminal className="w-32 h-32" />
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
                  <Terminal className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">System <ArrowRight className="w-4 h-4 text-muted-foreground"/> Blueprint</h3>
                <p className="text-muted-foreground leading-relaxed">Produces a step-by-step development blueprint instantly exportable into actionable universal context for AI IDEs.</p>
              </div>

            </div>
          </div>
        </section>

        {/* 3. DEMO FLOW PREVIEW */}
        <section className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Zero-Friction Inference.</h2>
            <p className="text-muted-foreground text-lg">Watch Prodea extract a full system from a single sentence.</p>
          </div>
          <DemoSequence />
        </section>

        {/* 5. TEMPLATES SECTION */}
        <section id="templates" className="py-24 px-6 max-w-6xl mx-auto">
           <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Fast Start Templates</h2>
              <p className="text-muted-foreground">Pre-configured architectures ready for inference.</p>
            </div>
            <LayoutTemplate className="w-8 h-8 text-muted-foreground opacity-40 hidden sm:block" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {[
              { t: "SaaS Starter System", d: "Next.js + Stripe + Supabase auth flow map.", i: <Box className="w-5 h-5 text-emerald-500" /> },
              { t: "AI Product Builder", d: "RAG architecture, vector db, and prompt nodes.", i: <Sparkles className="w-5 h-5 text-primary" /> },
              { t: "Mobile App System", d: "React Native + standard backend architecture.", i: <Command className="w-5 h-5 text-blue-500" /> },
              { t: "Backend API System", d: "Robust REST/GraphQL structure with caching.", i: <Database className="w-5 h-5 text-orange-500" /> },
              { t: "Startup MVP Gen", d: "Lean architecture optimized for zero-cost start.", i: <Code2 className="w-5 h-5 text-purple-500" /> },
            ].map((itm, i) => {
              return (
              <div key={i} className="relative h-48 w-full group [perspective:1000px]">
                <div 
                  className={`w-full h-full transition-transform duration-700 ease-fluid [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:z-10`}
                >
                  
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 [backface-visibility:hidden] p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border bg-white/5 border-white/10 transition-all duration-500">
                        {itm.i}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{itm.t}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{itm.d}</p>
                    </div>
                    <button 
                      onClick={() => router.push(`/project?idea=I want to build a ${itm.t}`)}
                      className="text-xs font-semibold mt-4 text-left text-primary hover:underline w-fit"
                    >
                      Use Template →
                    </button>
                  </div>

                  {/* BACK FACE (SIMULATED RENDER) */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] p-5 rounded-3xl border border-primary/50 bg-[#00040A] flex flex-col shadow-[0_0_50px_rgba(var(--primary),0.15)] overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.2)_0,transparent_100%)] z-0" />
                    
                    <div className="relative z-10 flex flex-col h-full font-mono text-[10px] leading-[1.4] text-emerald-400">
                       <span className="text-white/50 mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300">
                         <span className="animate-pulse">$</span> prodea init {itm.t.split(' ')[0].toLowerCase()}
                       </span>
                       <span className="text-primary mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-300 duration-300">✓ binding {itm.t.split(' ')[0].toLowerCase()} modules...</span>
                       
                       <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity delay-500 duration-300 relative pb-6 text-[9px] sm:text-[10px]">
                         <span className="text-blue-400">import</span> {`{ System }`} <span className="text-blue-400">from</span> <span className="text-emerald-300">'@core'</span>;<br/>
                         <span className="text-purple-400">export default class</span> App {'{'}<br/>
                         &nbsp;&nbsp;<span className="text-blue-400">async</span> <span className="text-yellow-200">mount</span>() {'{'}<br/>
                         &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white/50">// rendering...</span><br/>
                         &nbsp;&nbsp;{'}'}<br/>
                         {'}'}
                         
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#00040A]/80 to-[#00040A] animate-[pulse_2s_infinite]" />
                       </div>
                    </div>

                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         router.push(`/project?idea=I want to build a ${itm.t}`);
                       }}
                       className="absolute bottom-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(var(--primary),0.5)] active:scale-95 transition-transform opacity-0 group-hover:opacity-100 delay-500 cursor-pointer"
                    >
                       Compile &rarr;
                    </button>
                  </div>

                </div>
              </div>
              );
            })}
            
          </div>
        </section>

        {/* 6. WHY PRODEA */}
        <section className="py-24 px-6 bg-transparent border-y border-white/5 backdrop-blur-sm">
           <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4 relative inline-block">
                Not another document tool.
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
               <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl flex flex-col justify-center">
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                  <Box className="w-4 h-4" /> Traditional Tools
                </div>
                <ul className="space-y-5">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    <span>ChatGPT <span className="opacity-50 text-xs ml-1">(talks endlessly)</span></span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-3 h-3 rounded-full border border-orange-500/50 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    </div>
                    <span>Notion <span className="opacity-50 text-xs ml-1">(blank documents)</span></span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-3 h-3 flex items-center justify-center animate-bounce">
                       <Code2 className="w-3 h-3 text-yellow-500" />
                    </div>
                    <span>Cursor <span className="opacity-50 text-xs ml-1">(requires exact logic)</span></span>
                  </li>
                </ul>
              </div>
              
              <div className="p-8 rounded-3xl border border-primary/30 bg-primary/10 backdrop-blur-2xl flex flex-col justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                <div className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4"/> Prodea
                </div>
                <p className="text-2xl font-bold leading-tight relative">
                  <span className="absolute -left-6 top-1 text-primary opacity-50 select-none">"</span>
                  Turns <mark className="bg-[#E5D9B6] text-[#0B0F14] px-1.5 py-0.5 rounded-md mx-1 shadow-[0_0_15px_rgba(229,217,182,0.3)]">chaotic ideas</mark> into <span className="text-primary">structured, buildable</span> systems instantly.
                </p>
              </div>
            </div>
           </div>
        </section>

        {/* 7. HOW IT WORKS */}
        <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-16">Pipeline</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 border border-border flex items-center justify-center mb-4 text-xl font-bold text-muted-foreground">1</div>
              <h4 className="font-semibold">Input Idea</h4>
            </div>
            <div className="w-1 h-8 md:w-16 md:h-1 bg-border rounded" />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-4 text-xl font-bold text-primary">2</div>
              <h4 className="font-semibold">AI Structures</h4>
            </div>
            <div className="w-1 h-8 md:w-16 md:h-1 bg-border rounded" />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 text-xl font-bold text-emerald-500">3</div>
              <h4 className="font-semibold">User Refines</h4>
            </div>
            <div className="w-1 h-8 md:w-16 md:h-1 bg-border rounded" />
             <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4 text-xl font-bold text-blue-500">4</div>
              <h4 className="font-semibold">Export / Build</h4>
            </div>
          </div>
        </section>

        {/* 8. AI IDE INTEGRATION (MARKDOWN) */}
        <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#E5D9B6] mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> .MD Universal Context</div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">Built for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">AI Native IDEs.</span></h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    What is a Markdown (.md) file? It's the universal language of modern AI development. It stores structure, logic, and context in a format that Large Language Models parse natively.
                  </p>
                  <p>
                    Prodea synthesizes your entire system architecture directly into `.md`. Simply export the blueprint, drag it into your active working directory, and watch your AI pair-programmers—like <strong className="text-white">Antigravity</strong> or <strong className="text-white">Cursor</strong>—gain instant, hallucination-free context of the exact application they are tasked to build.
                  </p>
                </div>
             </div>
             
             <div className="w-full relative">
                <MarkdownDemoSequence />
             </div>
           </div>
        </section>

        {/* 9. THE ORIGIN */}
        <section id="philosophy" className="py-24 px-6 border-t border-white/5 bg-transparent backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
              Project + Idea = <span className="text-primary italic">Prodea</span>
            </h2>
            <div className="text-lg md:text-xl text-muted-foreground leading-relaxed space-y-6">
              <p>Ideas are chaotic. Projects demand structure.</p>
              <p>We built Prodea to bridge the agonizing gap between early-stage creative brain-dumps and rigid engineering architecture. We enforce no rules initially, allowing creativity to flow unchecked. Prodea exists to capture that execution intent automatically.</p>
              <div className="inline-block px-8 py-4 border border-primary/20 rounded-2xl bg-white/[0.02] shadow-[0_0_30px_rgba(var(--primary),0.1)] mt-8">
                <p className="font-extrabold text-white tracking-wide uppercase text-sm">Minimal friction. Maximum execution.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FOOTER */}
        <footer className="py-12 px-6 glass-effect glow-border-t">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold tracking-tight">
              <Logo className="w-12 h-12" />
              <span className="font-branding text-xs tracking-[0.2em]">PRODEA</span>
            </div>
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-foreground">Docs</a>
              <a href="#" className="hover:text-foreground">GitHub</a>
              <a href="#templates" className="hover:text-foreground">Templates</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
            </div>
            <div className="text-xs text-muted-foreground opacity-60">
               © 2026 Prodea Architectural Engine
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
