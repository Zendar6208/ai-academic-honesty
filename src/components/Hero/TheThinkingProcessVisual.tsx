import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const TheThinkingProcessVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [act, setAct] = useState<number>(1); // Act 1: Human, Act 2: AI, Act 3: Contrast/Question
  const [progress, setProgress] = useState<number>(0);

  // 12-second total cinematic loop:
  // 0s - 4.5s: Act 1 (The Human Thinking Process - Writing, sketching, crossing out, struggling)
  // 4.5s - 8.5s: Act 2 (Synthetic Fluency - Instantaneous digital generation, flawless document)
  // 8.5s - 12s: Act 3 (The Critical Contrast - The Question: Can you explain it?)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        setProgress((prev) => {
          const next = (prev + dt / 12) % 1;
          if (next < 0.38) setAct(1);
          else if (next < 0.72) setAct(2);
          else setAct(3);
          return next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleTogglePlay = () => setIsPlaying((p) => !p);
  const handleRestart = () => {
    setProgress(0);
    setAct(1);
    setIsPlaying(true);
  };

  // Continuous subtle harmonic breathing
  const breathing = Math.sin(progress * Math.PI * 8) * 3;
  const pulse = (Math.sin(progress * Math.PI * 12) + 1) / 2;

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl border border-[#00FF88]/30 bg-[#040705] shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(0,255,136,0.08)] select-none"
      style={{
        minHeight: 'clamp(520px, 68vw, 720px)',
        overflow: 'hidden',
      }}
      aria-label="Exhibit 01 Focal Installation: The Synthetic Mind — Fluency is Not Comprehension"
    >
      {/* ----------------------------------------------------------------- */}
      {/* 1. CINEMATIC ATMOSPHERE & LIGHTING                                */}
      {/* ----------------------------------------------------------------- */}
      
      {/* Warm focused desk spotlight (Left) */}
      <div 
        className="absolute -top-20 left-0 sm:left-1/4 w-full sm:w-[500px] h-[350px] sm:h-[500px] rounded-full pointer-events-none opacity-20 blur-[80px] sm:blur-[100px] transition-opacity duration-1000"
        style={{
          background: act === 1 || act === 3 
            ? 'radial-gradient(circle, rgba(255, 230, 180, 0.35) 0%, rgba(0, 255, 136, 0.15) 50%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)'
        }}
      />

      {/* Cool emerald digital phosphor glow (Right) */}
      <div 
        className="absolute top-10 right-0 sm:right-1/4 w-full sm:w-[500px] h-[350px] sm:h-[500px] rounded-full pointer-events-none opacity-25 blur-[80px] sm:blur-[100px] transition-opacity duration-1000"
        style={{
          background: act >= 2
            ? 'radial-gradient(circle, rgba(0, 255, 136, 0.4) 0%, rgba(0, 180, 100, 0.15) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)'
        }}
      />

      {/* Deep cinematic vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%] from-transparent via-black/40 to-black/90 pointer-events-none" />

      {/* ----------------------------------------------------------------- */}
      {/* 2. RESTRAINED TOP CURATORIAL BAR & PLAYBACK CONTROLS              */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#040705]/85 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
          <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
            EXHIBIT 01 // THE SYNTHETIC MIND
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="hidden sm:inline font-mono text-xs text-[#00FF88]">
            {act === 1 ? 'ACT I: THE HUMAN THINKING PROCESS' : act === 2 ? 'ACT II: SYNTHETIC FLUENCY' : 'ACT III: THE CRITICAL QUESTION'}
          </span>
        </div>

        {/* Play / Restart Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="exhibit-control-btn"
            title={isPlaying ? 'Pause cinematic sequence' : 'Play cinematic sequence'}
            aria-label={isPlaying ? 'Pause sequence' : 'Play sequence'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="exhibit-control-btn"
            title="Restart cinematic sequence"
            aria-label="Restart sequence"
          >
            <RotateCcw size={12} />
            <span>RESTART</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. PURE VISUAL STORYTELLING CANVAS (90% VISUAL)                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative w-full h-full min-h-[520px] sm:min-h-[580px] md:min-h-[660px] flex items-center justify-center p-4 sm:p-8 pt-16">
        
        {/* SVG CINEMATIC STAGE */}
        <svg viewBox="0 0 1000 580" className="w-full h-full max-h-[620px] overflow-visible">
          <defs>
            {/* Linear Glow Gradients */}
            <linearGradient id="warmLight" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFECC0" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFECC0" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="coolGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00A855" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="hologramGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A1F14" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#030805" stopOpacity="0.9" />
            </linearGradient>

            {/* Soft Glow Filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============================================================= */}
          {/* ENVIRONMENT: THE DESK HORIZON                                 */}
          {/* ============================================================= */}
          {/* Wooden Desk Surface */}
          <rect x="40" y="380" width="920" height="170" rx="4" fill="#0A110D" stroke="#1A2D22" strokeWidth="2" />
          <line x1="40" y1="384" x2="960" y2="384" stroke="#00FF88" strokeWidth="1" strokeOpacity="0.2" />

          {/* ============================================================= */}
          {/* WORLD A: THE HUMAN THINKING PROCESS (LEFT / CENTER)            */}
          {/* ============================================================= */}
          <g 
            className="transition-all duration-700"
            style={{
              opacity: act === 1 || act === 3 ? 1 : 0.35,
              transform: `translateY(${act === 1 ? breathing : 0}px)`,
            }}
          >
            {/* Cone of Warm Ambient Lamp Light */}
            <polygon points="120,40 380,380 40,380" fill="url(#warmLight)" />

            {/* Architecture of the Desk Lamp */}
            <line x1="90" y1="380" x2="90" y2="180" stroke="#3D5245" strokeWidth="4" />
            <line x1="90" y1="180" x2="135" y2="110" stroke="#3D5245" strokeWidth="4" />
            <circle cx="90" cy="180" r="5" fill="#00FF88" fillOpacity="0.4" />
            <polygon points="115,100 160,110 145,135 110,120" fill="#203327" stroke="#3D5245" strokeWidth="2" />
            <circle cx="130" cy="120" r="6" fill="#FFECC0" filter="url(#softGlow)" />

            {/* Student's Open Notebook */}
            <g transform="translate(140, 290) rotate(-4)">
              {/* Notebook Shadow & Cover */}
              <rect x="-8" y="-6" width="276" height="182" rx="4" fill="#050A07" stroke="#253A2E" strokeWidth="1.5" />
              {/* Paper Surface */}
              <rect x="0" y="0" width="260" height="170" rx="2" fill="#0E1712" stroke="#1D3024" strokeWidth="1" />
              {/* Center Spine */}
              <line x1="130" y1="0" x2="130" y2="170" stroke="#203327" strokeWidth="2" strokeDasharray="4 2" />

              {/* LEFT PAGE: Handwritten struggle, diagrams, crossed-out errors */}
              <g opacity={act === 1 ? 0.9 : 0.7}>
                {/* Hand-drawn thought diagram (nodes & circles) */}
                <circle cx="40" cy="40" r="12" fill="none" stroke="#00FF88" strokeWidth="1.5" />
                <text x="40" y="44" fill="#00FF88" fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Concept</text>

                <circle cx="95" cy="40" r="10" fill="none" stroke="#87968D" strokeWidth="1.2" strokeDasharray="2 2" />
                <text x="95" y="43" fill="#87968D" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Path B</text>

                <line x1="52" y1="40" x2="85" y2="40" stroke="#00FF88" strokeWidth="1.2" />

                {/* Strikethrough line representing human mistake */}
                <line x1="20" y1="75" x2="115" y2="75" stroke="#F43F5E" strokeWidth="1.5" strokeOpacity="0.8" />
                <path d="M 22 72 Q 70 65 112 78" fill="none" stroke="#F43F5E" strokeWidth="1.5" />
                <text x="118" y="77" fill="#F43F5E" fontSize="7" fontFamily="sans-serif" fontStyle="italic">✕ why?</text>

                {/* Re-derived correction */}
                <path d="M 25 100 C 45 92 65 105 85 96 S 115 100 120 94" fill="none" stroke="#00FF88" strokeWidth="1.5" />
                <circle cx="120" cy="94" r="3" fill="#00FF88" />

                {/* Question mark in margin */}
                <text x="30" y="138" fill="#FBBF24" fontSize="18" fontWeight="bold" fontFamily="serif">?</text>
                <text x="45" y="136" fill="#E4F0E8" fontSize="8" fontFamily="sans-serif">Where does understanding start?</text>
              </g>

              {/* RIGHT PAGE: Synthesized understanding forming */}
              <g opacity={act === 1 || act === 3 ? 0.95 : 0.6}>
                <line x1="145" y1="30" x2="245" y2="30" stroke="#00FF88" strokeWidth="1.5" />
                <line x1="145" y1="45" x2="235" y2="45" stroke="#3D5245" strokeWidth="1.2" />
                <line x1="145" y1="60" x2="240" y2="60" stroke="#3D5245" strokeWidth="1.2" />
                <line x1="145" y1="75" x2="210" y2="75" stroke="#3D5245" strokeWidth="1.2" />

                {/* Hand-drawn idea spark icon */}
                <g transform="translate(190, 115)">
                  <circle cx="0" cy="0" r="14" fill="#071A10" stroke="#00FF88" strokeWidth="1.5" />
                  <path d="M -5 -4 L 0 5 L 5 -4 Z" fill="#00FF88" />
                  <line x1="0" y1="-8" x2="0" y2="-12" stroke="#00FF88" strokeWidth="1.5" />
                  <line x1="-7" y1="-7" x2="-10" y2="-10" stroke="#00FF88" strokeWidth="1.5" />
                  <line x1="7" y1="-7" x2="10" y2="-10" stroke="#00FF88" strokeWidth="1.5" />
                </g>
              </g>

              {/* Physical Pen resting across paper */}
              <g transform="translate(200, 100) rotate(35)">
                <rect x="-3" y="-30" width="6" height="60" rx="2" fill="#1C2B22" stroke="#00FF88" strokeWidth="0.8" />
                <polygon points="-3,30 3,30 0,38" fill="#D1DDD5" />
                <circle cx="0" cy="38" r="0.8" fill="#00FF88" />
              </g>
            </g>

            {/* The University Student Silhouette / Figure */}
            <g transform="translate(280, 170)">
              {/* Student Head & Hair */}
              <circle cx="50" cy="55" r="28" fill="#E4F0E8" />
              {/* Contemplative Posture */}
              <path d="M 28 48 Q 50 40 72 48" fill="none" stroke="#040705" strokeWidth="3" />
              
              {/* Student Upper Body & Shoulders */}
              <path d="M 10 95 Q 50 82 90 95 L 115 190 L -15 190 Z" fill="#1A2D23" stroke="#2D4738" strokeWidth="2" />
              
              {/* Student Hand resting near notebook */}
              <path d="M 10 110 Q -25 140 -50 155" fill="none" stroke="#1A2D23" strokeWidth="14" strokeLinecap="round" />
              <circle cx="-52" cy="158" r="8" fill="#E4F0E8" />

              {/* Brain / Cognitive Aura when Thinking */}
              <circle 
                cx="50" 
                cy="50" 
                r="36" 
                fill="none" 
                stroke="#00FF88" 
                strokeWidth="1.5" 
                strokeDasharray="4 3" 
                opacity={act === 1 || act === 3 ? 0.7 + pulse * 0.3 : 0.2}
                filter="url(#softGlow)"
              />
            </g>
          </g>

          {/* ============================================================= */}
          {/* WORLD B: SYNTHETIC FLUENCY (RIGHT / FLOATING HUD)             */}
          {/* ============================================================= */}
          <g 
            className="transition-all duration-700"
            style={{
              opacity: act >= 2 ? 1 : 0.3,
              transform: `translateY(${act >= 2 ? -breathing * 0.6 : 0}px)`,
            }}
          >
            {/* Luminous Floating Tablet / Glass Hologram */}
            <g transform="translate(560, 130) rotate(3)">
              {/* Hologram Floating Glow & Drop Shadow */}
              <rect x="-10" y="-10" width="370" height="260" rx="14" fill="none" stroke="#00FF88" strokeWidth="1.5" opacity={0.4} filter="url(#softGlow)" />
              {/* Glass Terminal Surface */}
              <rect x="0" y="0" width="350" height="240" rx="10" fill="url(#hologramGlass)" stroke="#00FF88" strokeWidth="2" />
              
              {/* Scanlines Overlay */}
              <line x1="0" y1="40" x2="350" y2="40" stroke="#00FF88" strokeWidth="1" strokeOpacity="0.3" />

              {/* Top Status Header */}
              <circle cx="20" cy="22" r="4" fill="#00FF88" className="animate-pulse" />
              <text x="32" y="26" fill="#00FF88" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
                SYNTHETIC AGENT // INSTANT OUTPUT
              </text>
              <rect x="250" y="14" width="85" height="16" rx="3" fill="#00FF88" fillOpacity="0.15" stroke="#00FF88" strokeWidth="0.8" />
              <text x="292" y="25" fill="#00FF88" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                0.3 SECONDS
              </text>

              {/* The Perfect Generated Document Stream */}
              <g transform="translate(25, 60)">
                {/* Title Line (Generated Instant) */}
                <rect x="0" y="0" width="220" height="12" rx="2" fill="#FFFFFF" fillOpacity="0.9" />
                
                {/* Clean, Uniform, Polished Lines */}
                <rect x="0" y="22" width="300" height="7" rx="1.5" fill="#00FF88" fillOpacity="0.8" />
                <rect x="0" y="36" width="285" height="7" rx="1.5" fill="#00FF88" fillOpacity="0.7" />
                <rect x="0" y="50" width="295" height="7" rx="1.5" fill="#00FF88" fillOpacity="0.7" />
                <rect x="0" y="64" width="260" height="7" rx="1.5" fill="#00FF88" fillOpacity="0.7" />

                <line x1="0" y1="85" x2="300" y2="85" stroke="#1D3828" strokeWidth="1" />

                <rect x="0" y="98" width="290" height="7" rx="1.5" fill="#00FF88" fillOpacity="0.6" />
                <rect x="0" y="112" width="275" height="7" rx="1.5" fill="#00FF88" fillOpacity="0.6" />
                <rect x="0" y="126" width="240" height="7" rx="1.5" fill="#00FF88" fillOpacity="0.6" />

                {/* Instant Verification Stamp */}
                <g transform="translate(230, 140)">
                  <rect x="0" y="0" width="75" height="22" rx="3" fill="#071E12" stroke="#00FF88" strokeWidth="1.5" />
                  <text x="37" y="14" fill="#00FF88" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    ✓ COMPLETE
                  </text>
                </g>
              </g>
            </g>
          </g>

          {/* ============================================================= */}
          {/* THE CRITICAL CONVERGENCE (ACT III: CAN YOU EXPLAIN IT?)        */}
          {/* ============================================================= */}
          {act === 3 && (
            <g className="animate-fadeIn">
              {/* Connecting Neural Line between Human Mind and Synthetic Output */}
              <path
                d="M 330 220 C 420 180 500 220 570 200"
                fill="none"
                stroke="#00FF88"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                filter="url(#softGlow)"
              />
              <circle cx={330 + ((progress * 800) % 240)} cy={200 + Math.sin(progress * 10) * 10} r="5" fill="#FFFFFF" filter="url(#softGlow)" />

              {/* The Monumental Center Provocation Badge */}
              <g transform="translate(500, 75)">
                <rect x="-140" y="-22" width="280" height="44" rx="22" fill="#030805" stroke="#00FF88" strokeWidth="2" filter="url(#softGlow)" />
                <text x="0" y="5" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
                  CAN YOU EXPLAIN IT?
                </text>
              </g>
            </g>
          )}

          {/* ============================================================= */}
          {/* BASELINE AMBIENT PARTICLES (Matrix Embers)                    */}
          {/* ============================================================= */}
          {[...Array(6)].map((_, i) => (
            <circle
              key={i}
              cx={180 + i * 120}
              cy={320 - Math.sin((progress + i * 0.15) * Math.PI * 2) * 40}
              r={1.2 + (i % 2) * 0.8}
              fill="#00FF88"
              opacity={0.3 + (i % 3) * 0.2}
            />
          ))}
        </svg>

      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. RESTRAINED EDITORIAL HEADLINE & STATEMENT (10% TEXT)           */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-30 px-6 sm:px-10 py-6 border-t border-white/10 bg-[#040705]/95 backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: '6px',
            }}
          >
            FLUENCY IS NOT COMPREHENSION.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
              color: '#00FF88',
              fontWeight: 600,
              margin: 0,
            }}
          >
            "AI can produce the answer. Understanding it is still your responsibility."
          </p>
        </div>

        <div className="border-l-2 border-[#00FF88]/40 pl-4 py-1 max-w-md">
          <span className="font-mono text-[10px] text-[#87968D] uppercase tracking-wider block mb-0.5">
            EXHIBITION CORE PRINCIPLE
          </span>
          <p className="font-display font-medium text-xs sm:text-sm text-[#E4F0E8] max-w-xs">
            "An answer is generated in seconds. Understanding takes thinking."
          </p>
        </div>
      </div>

    </div>
  );
};
