import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface Exhibit01MotionGraphicProps {
  onStageChange?: (stage: number) => void;
}

export const Exhibit01MotionGraphic: React.FC<Exhibit01MotionGraphicProps> = ({
  onStageChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAlignedRef = useRef<boolean>(false);
  const isManuallyPausedRef = useRef<boolean>(false);
  const wasAutoPausedRef = useRef<boolean>(false);

  // Total steps in the narrative
  const TOTAL_STEPS = 5;
  const STEP_DURATION_MS = 3200; // 3.2s per step for clear storytelling

  // Managed IntersectionObserver: Detects approaching exhibit, aligns viewport smoothly,
  // and starts animation strictly when at least 70% of relevant viewing area is visible.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        // 1. Detect when approaching the viewport (< 70% visible)
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.15 &&
          entry.intersectionRatio < 0.70 &&
          !hasAlignedRef.current &&
          !hasAutoPlayed
        ) {
          const rect = entry.target.getBoundingClientRect();
          const isCutOff = rect.top < 70 || rect.bottom > (window.innerHeight - 30);
          if (isCutOff) {
            hasAlignedRef.current = true;
            entry.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        // 2. Playback gate: Start only when at least 70% of the visual area is visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.70) {
          hasAlignedRef.current = true;
          if (!hasAutoPlayed) {
            setHasAutoPlayed(true);
            setIsPlaying(true);
          } else if (wasAutoPausedRef.current && !isManuallyPausedRef.current && currentStep < TOTAL_STEPS) {
            wasAutoPausedRef.current = false;
            setIsPlaying(true);
          }
        }

        // 3. Pause if visitor scrolls away
        if (entry.intersectionRatio < 0.30 && isPlaying) {
          wasAutoPausedRef.current = true;
          setIsPlaying(false);
        }
      },
      { threshold: [0.15, 0.30, 0.70] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAutoPlayed, isPlaying, currentStep]);

  // Animation playback timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isPlaying) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => {
          if (prev < TOTAL_STEPS) {
            const next = prev + 1;
            onStageChange?.(next);
            return next;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, STEP_DURATION_MS);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, onStageChange]);

  const handleReplay = () => {
    isManuallyPausedRef.current = false;
    wasAutoPausedRef.current = false;
    setCurrentStep(1);
    setIsPlaying(true);
    onStageChange?.(1);
  };

  const handleStepClick = (step: number) => {
    isManuallyPausedRef.current = true;
    wasAutoPausedRef.current = false;
    setCurrentStep(step);
    setIsPlaying(false);
    onStageChange?.(step);
  };

  const togglePlay = () => {
    if (isPlaying) {
      isManuallyPausedRef.current = true;
      wasAutoPausedRef.current = false;
      setIsPlaying(false);
    } else {
      isManuallyPausedRef.current = false;
      wasAutoPausedRef.current = false;
      if (currentStep === TOTAL_STEPS) {
        handleReplay();
      } else {
        setIsPlaying(true);
      }
    }
  };

  const stepLabels = [
    { num: 1, title: 'Assignment Given', desc: 'Passive delegation vs Active engagement' },
    { num: 2, title: 'AI Interaction', desc: 'Black-box generation vs Socratic inquiry' },
    { num: 3, title: 'Cognitive Effort', desc: 'Copy-paste shortcut vs Deriving the proof' },
    { num: 4, title: 'The Viva Defense', desc: 'Failing oral defense vs Board explanation' },
    { num: 5, title: 'The Final Outcome', desc: 'Cognitive failure vs Deep mastery' },
  ];

  return (
    <div 
      ref={containerRef}
      className="w-full bg-[#050807] border-2 border-[#00FF88]/30 rounded-xl p-4 sm:p-6 mb-6 shadow-[0_16px_40px_rgba(0,0,0,0.7)] relative overflow-hidden"
    >
      {/* Background Matrix Ambient Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #00FF88 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* =================================================================== */}
      {/* 1. CINEMATIC MOTION GRAPHICS PLAYER CONTROLS                       */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#00FF88]/20 relative z-10">
        
        {/* Left: Live Status Badge */}
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#00FF88] shadow-[0_0_10px_#00FF88] animate-pulse' : 'bg-[#87968D]'}`} />
          <div>
            <span className="font-mono text-xs font-bold text-[#00FF88] uppercase tracking-wider block">
              CINEMATIC MOTION EXPLAINER // COGNITIVE AGENCY
            </span>
            <span className="font-mono text-[10px] text-[#87968D]">
              {isPlaying ? `PLAYING SCENE 0${currentStep} / 05` : `SCENE 0${currentStep} PAUSED // READY`}
            </span>
          </div>
        </div>

        {/* Right: Motion Controls (Play/Pause, Replay) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={togglePlay}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#071A10]/90 border border-[#00FF88]/60 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88] hover:text-[#050807] font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(0,255,136,0.12)] hover:shadow-[0_0_18px_rgba(0,255,136,0.3)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88] active:scale-[0.97]"
            title={isPlaying ? 'Pause animation' : 'Play animation'}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? (
              <>
                <Pause size={13} className="shrink-0" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play size={13} className="shrink-0 fill-current" />
                <span>{currentStep === TOTAL_STEPS ? 'PLAY AGAIN' : 'PLAY'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReplay}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#071A10]/90 border border-[#00FF88]/60 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88] hover:text-[#050807] font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(0,255,136,0.12)] hover:shadow-[0_0_18px_rgba(0,255,136,0.3)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88] active:scale-[0.97]"
            title="Replay from Scene 1"
            aria-label="Replay animation from Scene 1"
          >
            <RotateCcw size={13} className="shrink-0" />
            <span>REPLAY</span>
          </button>
        </div>

      </div>

      {/* =================================================================== */}
      {/* 2. INTERACTIVE STEPPER TIMELINE SCRUBBER                           */}
      {/* =================================================================== */}
      <div className="mb-6 relative z-10">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {stepLabels.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => handleStepClick(s.num)}
                className={`py-2 px-1.5 sm:px-2 rounded border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-[#071A10] border-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.25)]'
                    : isCompleted
                    ? 'bg-[#050807] border-[#00FF88]/30 opacity-70 hover:opacity-100'
                    : 'bg-[#050807] border-white/5 opacity-40 hover:opacity-80'
                }`}
              >
                {/* Active progress highlight top strip */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#00FF88] shadow-[0_0_6px_#00FF88]" />
                )}

                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-[#00FF88]' : 'text-[#87968D]'}`}>
                    0{s.num}
                  </span>
                  {isActive && <Sparkles size={10} className="text-[#00FF88] animate-pulse" />}
                </div>

                <div className="font-display font-bold text-[11px] sm:text-xs text-[#E4F0E8] truncate">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. DUAL ANIMATED STORY SCENES (SIDE-BY-SIDE CONTRAST)              */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">

        {/* ----------------------------------------------------------------- */}
        {/* SCENE A: AI AS A SUBSTITUTE (The Outsourcing Breakdown)           */}
        {/* ----------------------------------------------------------------- */}
        <div className="bg-[#090D0A] border-2 border-rose-500/40 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden shadow-[0_8px_24px_rgba(244,63,94,0.1)]">
          
          {/* Top Banner */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-500/30">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-rose-950/80 border border-rose-500/50 flex items-center justify-center font-mono text-xs font-bold text-rose-400">
                A
              </span>
              <div>
                <h4 className="font-display font-bold text-sm text-[#E4F0E8] uppercase tracking-wide">
                  AI AS A SUBSTITUTE
                </h4>
                <span className="font-mono text-[10px] text-rose-400">
                  COGNITIVE BYPASS // OUTSOURCING
                </span>
              </div>
            </div>

            <div className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 font-mono text-[10px] font-bold text-rose-400">
              STEP {currentStep} OF 5
            </div>
          </div>

          {/* Animated Graphic Stage Canvas */}
          <div className="w-full bg-[#050807] border border-rose-500/25 rounded-lg p-4 sm:p-5 min-h-[260px] flex flex-col justify-center items-center text-center relative overflow-hidden">
            
            {/* Step 1: Student delegates assignment */}
            {currentStep === 1 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-rose-400 font-bold uppercase tracking-wider mb-2">
                  SCENE 1: DELEGATING THE WORK
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Desk */}
                  <rect x="20" y="90" width="200" height="8" rx="2" fill="#1F2923" />
                  <rect x="35" y="98" width="8" height="28" fill="#15201A" />
                  <rect x="195" y="98" width="8" height="28" fill="#15201A" />
                  
                  {/* Student slumped back */}
                  <circle cx="65" cy="50" r="14" fill="#E4F0E8" />
                  <path d="M 52 68 Q 65 64 78 68 L 84 94 L 46 94 Z" fill="#4B5563" />
                  
                  {/* Laptop */}
                  <polygon points="100,56 150,56 142,90 92,90" fill="#242E28" stroke="#F43F5E" strokeWidth="1.5" />
                  <line x1="86" y1="90" x2="156" y2="90" stroke="#4B5563" strokeWidth="3" />
                  
                  {/* Assignment Sheet being pushed away */}
                  <rect x="150" y="66" width="34" height="24" rx="2" fill="#111814" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="3 2" />
                  <text x="167" y="76" fill="#F43F5E" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DIJKSTRA</text>
                  <text x="167" y="84" fill="#87968D" fontSize="5" textAnchor="middle" fontFamily="monospace">HOMEWORK</text>

                  {/* Arrow to AI prompt */}
                  <path d="M 120 48 Q 140 28 175 35" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 2" />
                  <polygon points="178,36 170,30 172,39" fill="#F43F5E" />
                  <text x="148" y="24" fill="#F43F5E" fontSize="7" fontWeight="bold" fontFamily="monospace">"DO THIS FOR ME"</text>
                </svg>
                <p className="text-xs text-[#87968D] max-w-[320px]">
                  The student pushes the assignment onto the AI interface without attempting the logic themselves.
                </p>
              </div>
            )}

            {/* Step 2: Instant Automated Generation */}
            {currentStep === 2 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-rose-400 font-bold uppercase tracking-wider mb-2">
                  SCENE 2: BLACK-BOX CODE SYNTHESIS
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Terminal Box */}
                  <rect x="30" y="15" width="180" height="96" rx="6" fill="#0D1410" stroke="#F43F5E" strokeWidth="1.5" />
                  
                  {/* Terminal Header */}
                  <line x1="30" y1="32" x2="210" y2="32" stroke="#F43F5E" strokeWidth="1" strokeOpacity="0.4" />
                  <circle cx="42" cy="23" r="3" fill="#F43F5E" />
                  <circle cx="52" cy="23" r="3" fill="#FBBF24" />
                  <circle cx="62" cy="23" r="3" fill="#00FF88" />
                  <text x="75" y="26" fill="#87968D" fontSize="7" fontFamily="monospace">AI_GENERATOR_V4</text>
                  
                  {/* Automated Code Lines (Animated Stream) */}
                  <line x1="45" y1="46" x2="185" y2="46" stroke="#F43F5E" strokeWidth="2.5" className="mg-code-stream" />
                  <line x1="45" y1="56" x2="165" y2="56" stroke="#9CA3AF" strokeWidth="2.5" className="mg-code-stream" />
                  <line x1="45" y1="66" x2="195" y2="66" stroke="#9CA3AF" strokeWidth="2.5" className="mg-code-stream" />
                  <line x1="45" y1="76" x2="150" y2="76" stroke="#F43F5E" strokeWidth="2.5" className="mg-code-stream" />
                  <line x1="45" y1="86" x2="175" y2="86" stroke="#9CA3AF" strokeWidth="2.5" className="mg-code-stream" />

                  {/* Robot Head / Black Box Cog */}
                  <circle cx="185" cy="80" r="14" fill="#050807" stroke="#F43F5E" strokeWidth="1.5" />
                  <text x="185" y="83" fill="#F43F5E" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AI</text>
                </svg>
                <p className="text-xs text-[#87968D] max-w-[320px]">
                  The AI model generates the full solution instantaneously. The student bypassed all cognitive engagement.
                </p>
              </div>
            )}

            {/* Step 3: Copy-Paste Shortcut */}
            {currentStep === 3 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-rose-400 font-bold uppercase tracking-wider mb-2">
                  SCENE 3: ZERO RETENTION PASTE
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Clipboard Ctrl+C */}
                  <rect x="30" y="25" width="55" height="75" rx="4" fill="#121815" stroke="#9CA3AF" strokeWidth="1.5" />
                  <rect x="45" y="20" width="25" height="9" rx="2" fill="#374151" />
                  <text x="57" y="60" fill="#E4F0E8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Ctrl+C</text>
                  <text x="57" y="74" fill="#87968D" fontSize="7" textAnchor="middle" fontFamily="monospace">UNREAD</text>

                  {/* Transfer Pipeline Arrow */}
                  <path d="M 95 62 L 135 62" stroke="#F43F5E" strokeWidth="3" strokeDasharray="4 2" className="mg-code-stream" />
                  <polygon points="140,62 130,57 130,67" fill="#F43F5E" />

                  {/* Destination Portal Ctrl+V */}
                  <rect x="150" y="25" width="55" height="75" rx="4" fill="#121815" stroke="#F43F5E" strokeWidth="2" />
                  <text x="177" y="60" fill="#F43F5E" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Ctrl+V</text>
                  
                  {/* Closed Padlock over student mind */}
                  <circle cx="177" cy="85" r="8" fill="#050807" stroke="#F43F5E" />
                  <text x="177" y="88" fill="#F43F5E" fontSize="8" textAnchor="middle" fontWeight="bold">🔒</text>
                </svg>
                <p className="text-xs text-[#87968D] max-w-[320px]">
                  The code is pasted directly into the portal. The student's brain stores 0 bits of conceptual understanding.
                </p>
              </div>
            )}

            {/* Step 4: The Teacher Question / Viva */}
            {currentStep === 4 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-rose-400 font-bold uppercase tracking-wider mb-2">
                  SCENE 4: THE VIVA INTERROGATION
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Professor / Evaluator */}
                  <circle cx="50" cy="40" r="14" fill="#9CA3AF" />
                  <path d="M 38 58 L 62 58 L 66 105 L 34 105 Z" fill="#374151" />
                  
                  {/* Pointing Laser to Question */}
                  <line x1="62" y1="62" x2="105" y2="48" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 2" />
                  <circle cx="105" cy="48" r="3" fill="#F43F5E" />

                  {/* Evaluator Speech Bubble */}
                  <rect x="85" y="16" width="135" height="34" rx="4" fill="#0D1410" stroke="#F43F5E" strokeWidth="1.5" />
                  <text x="152" y="29" fill="#E4F0E8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    "Line 42: Why does Dijkstra
                  </text>
                  <text x="152" y="40" fill="#E4F0E8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    fail on negative weights?"
                  </text>

                  {/* Student at defense podium */}
                  <circle cx="185" cy="75" r="12" fill="#E4F0E8" />
                  <path d="M 174 91 L 196 91 L 200 120 L 170 120 Z" fill="#4B5563" />
                  
                  {/* Silent speechless dots */}
                  <text x="185" y="60" fill="#F43F5E" fontSize="16" fontWeight="bold" textAnchor="middle">...</text>
                </svg>
                <p className="text-xs text-[#87968D] max-w-[320px]">
                  The evaluator probes the derivation. The student has no answer because they never thought through the problem.
                </p>
              </div>
            )}

            {/* Step 5: Cognitive Failure Verdict */}
            {currentStep === 5 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-rose-400 font-bold uppercase tracking-wider mb-1">
                  SCENE 5: THE FINAL CONSEQUENCE
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Trembling Student Avatar */}
                  <g className="mg-tremble">
                    <circle cx="120" cy="52" r="16" fill="#E4F0E8" />
                    <path d="M 106 72 L 134 72 L 140 115 L 100 115 Z" fill="#F43F5E" />
                    {/* Face: panicked expression */}
                    <circle cx="114" cy="50" r="2.5" fill="#050807" />
                    <circle cx="126" cy="50" r="2.5" fill="#050807" />
                    <line x1="114" y1="58" x2="126" y2="58" stroke="#050807" strokeWidth="2" />
                  </g>

                  {/* Animated Sweat Beads */}
                  <circle cx="140" cy="46" r="3" fill="#60A5FA" className="mg-sweat" />
                  <circle cx="145" cy="54" r="2" fill="#60A5FA" className="mg-sweat" />

                  {/* Giant Flashing Question Marks */}
                  <text x="120" y="26" fill="#F43F5E" fontSize="24" fontWeight="black" textAnchor="middle" className="mg-spark-ignite">
                    ???
                  </text>

                  {/* Slam Stamp */}
                  <rect x="35" y="85" width="170" height="30" rx="3" fill="#4C0519" stroke="#F43F5E" strokeWidth="2" className="mg-stamp" />
                  <text x="120" y="104" fill="#FECDD3" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace" className="mg-stamp">
                    0% RETENTION // COGNITIVE FAILURE
                  </text>
                </svg>
                <p className="text-xs text-rose-400 font-medium max-w-[320px]">
                  Unable to defend or explain the code. Disqualification during interview or exam viva.
                </p>
              </div>
            )}

          </div>

          {/* Bottom Stage Progress Sublabel */}
          <div className="mt-3 pt-3 border-t border-rose-500/20 flex items-center justify-between text-[11px] font-mono">
            <span className="text-rose-400/90 font-bold">
              {stepLabels[currentStep - 1].title}
            </span>
            <span className="text-[#87968D]">
              OUTSOURCING SHORTCUT
            </span>
          </div>

        </div>

        {/* ----------------------------------------------------------------- */}
        {/* SCENE B: AI AS A TUTOR (Active Comprehension & Mastery)            */}
        {/* ----------------------------------------------------------------- */}
        <div className="bg-[#090D0A] border-2 border-[#00FF88]/50 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden shadow-[0_8px_24px_rgba(0,255,136,0.15)]">
          
          {/* Top Banner */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#00FF88]/30">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#00FF88]/20 border border-[#00FF88] flex items-center justify-center font-mono text-xs font-bold text-[#00FF88]">
                B
              </span>
              <div>
                <h4 className="font-display font-bold text-sm text-[#E4F0E8] uppercase tracking-wide">
                  AI AS A SOCRATIC TUTOR
                </h4>
                <span className="font-mono text-[10px] text-[#00FF88]">
                  ACTIVE COMPREHENSION // MASTERY
                </span>
              </div>
            </div>

            <div className="px-2 py-0.5 rounded bg-[#00FF88]/15 border border-[#00FF88]/40 font-mono text-[10px] font-bold text-[#00FF88]">
              STEP {currentStep} OF 5
            </div>
          </div>

          {/* Animated Graphic Stage Canvas */}
          <div className="w-full bg-[#050807] border border-[#00FF88]/30 rounded-lg p-4 sm:p-5 min-h-[260px] flex flex-col justify-center items-center text-center relative overflow-hidden">
            
            {/* Step 1: Student attempts problem first */}
            {currentStep === 1 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-[#00FF88] font-bold uppercase tracking-wider mb-2">
                  SCENE 1: ACTIVE PROBLEM FORMULATION
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Desk */}
                  <rect x="20" y="90" width="200" height="8" rx="2" fill="#1F2923" />
                  <rect x="35" y="98" width="8" height="28" fill="#15201A" />
                  <rect x="195" y="98" width="8" height="28" fill="#15201A" />
                  
                  {/* Focused Student sitting upright */}
                  <circle cx="70" cy="46" r="14" fill="#E4F0E8" />
                  <path d="M 58 64 L 82 64 L 88 94 L 52 94 Z" fill="#00FF88" fillOpacity="0.8" />
                  
                  {/* Hand holding pencil */}
                  <line x1="82" y1="74" x2="108" y2="82" stroke="#E4F0E8" strokeWidth="2.5" />
                  <circle cx="108" cy="82" r="2" fill="#00FF88" />

                  {/* Scratchpad with Graph Diagram */}
                  <rect x="100" y="58" width="65" height="32" rx="3" fill="#0A2216" stroke="#00FF88" strokeWidth="1.2" />
                  <circle cx="115" cy="70" r="4" fill="#00FF88" />
                  <circle cx="145" cy="66" r="4" fill="#00FF88" />
                  <circle cx="145" cy="82" r="4" fill="#00FF88" />
                  <line x1="119" y1="70" x2="141" y2="66" stroke="#00FF88" strokeWidth="1.2" />
                  <line x1="119" y1="70" x2="141" y2="82" stroke="#00FF88" strokeWidth="1.2" />

                  {/* Glowing Synapses in Brain */}
                  <circle cx="70" cy="46" r="5" fill="#00FF88" className="mg-neural-pulse" />
                </svg>
                <p className="text-xs text-[#87968D] max-w-[320px]">
                  The student sketches the graph, analyzes edge invariants, and works through the reasoning themselves.
                </p>
              </div>
            )}

            {/* Step 2: Socratic Hint & Question */}
            {currentStep === 2 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-[#00FF88] font-bold uppercase tracking-wider mb-2">
                  SCENE 2: SOCRATIC GUIDANCE
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Dialogue Bubble: Student Observation */}
                  <rect x="25" y="16" width="90" height="32" rx="4" fill="#121815" stroke="#87968D" strokeWidth="1.2" />
                  <text x="70" y="28" fill="#E4F0E8" fontSize="7" textAnchor="middle" fontFamily="monospace">"Dijkstra visits A</text>
                  <text x="70" y="38" fill="#E4F0E8" fontSize="7" textAnchor="middle" fontFamily="monospace">with cost 1 first."</text>

                  {/* Spark Lightbulb Ignition */}
                  <g className="mg-spark-ignite">
                    <circle cx="120" cy="22" r="8" fill="#FBBF24" />
                    <line x1="120" y1="9" x2="120" y2="5" stroke="#FBBF24" strokeWidth="2" />
                    <line x1="130" y1="14" x2="134" y2="10" stroke="#FBBF24" strokeWidth="2" />
                    <line x1="110" y1="14" x2="106" y2="10" stroke="#FBBF24" strokeWidth="2" />
                  </g>

                  {/* Dialogue Bubble: Socratic AI Hint */}
                  <rect x="55" y="58" width="160" height="42" rx="5" fill="#061D12" stroke="#00FF88" strokeWidth="1.5" />
                  <text x="135" y="73" fill="#00FF88" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    AI TUTOR: "What happens if edge
                  </text>
                  <text x="135" y="85" fill="#00FF88" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    B → A has negative weight -3?"
                  </text>

                  {/* Lightbulb prompt */}
                  <text x="135" y="94" fill="#FBBF24" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    [HINT: Does the greedy choice hold?]
                  </text>
                </svg>
                <p className="text-xs text-[#87968D] max-w-[320px]">
                  The AI does not write the answer. It asks the pivotal Socratic question that sparks discovery.
                </p>
              </div>
            )}

            {/* Step 3: Deriving the Proof & Eureka */}
            {currentStep === 3 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-[#00FF88] font-bold uppercase tracking-wider mb-2">
                  SCENE 3: ACTIVE PROOF DERIVATION
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Derivation Canvas */}
                  <rect x="35" y="15" width="170" height="92" rx="6" fill="#061D12" stroke="#00FF88" strokeWidth="1.5" />
                  
                  {/* Header */}
                  <text x="120" y="30" fill="#00FF88" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    PATH COST DERIVATION
                  </text>
                  
                  {/* Math Derivation Steps */}
                  <text x="50" y="48" fill="#E4F0E8" fontSize="8" fontFamily="monospace">
                    Path 1: S → A = 1
                  </text>
                  <text x="50" y="62" fill="#E4F0E8" fontSize="8" fontFamily="monospace">
                    Path 2: S → B → A = 2 + (-3) = -1
                  </text>
                  <line x1="50" y1="70" x2="190" y2="70" stroke="#00FF88" strokeWidth="1" strokeOpacity="0.4" />
                  
                  {/* Breakthrough Conclusion */}
                  <text x="120" y="84" fill="#00FF88" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    CONTRADICTION: -1 &lt; 1
                  </text>
                  <text x="120" y="96" fill="#87968D" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
                    ASSUMPTION: Non-negative weights required!
                  </text>

                  {/* Neural spark in brain */}
                  <circle cx="195" cy="30" r="6" fill="#00FF88" className="mg-neural-pulse" />
                </svg>
                <p className="text-xs text-[#87968D] max-w-[320px]">
                  The student solves the mathematical contradiction independently, cementing neural comprehension.
                </p>
              </div>
            )}

            {/* Step 4: The Whiteboard Defense */}
            {currentStep === 4 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-[#00FF88] font-bold uppercase tracking-wider mb-2">
                  SCENE 4: WHITEBOARD PRESENTATION
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Whiteboard Stand */}
                  <rect x="80" y="14" width="135" height="92" rx="4" fill="#072214" stroke="#00FF88" strokeWidth="1.8" />
                  
                  {/* Graph Drawn on Board */}
                  <circle cx="105" cy="45" r="7" fill="#E4F0E8" />
                  <text x="105" y="48" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">S</text>
                  
                  <circle cx="155" cy="35" r="7" fill="#00FF88" />
                  <text x="155" y="38" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">A</text>

                  <circle cx="155" cy="65" r="7" fill="#00FF88" />
                  <text x="155" y="68" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">B</text>

                  {/* Directed Edges */}
                  <line x1="112" y1="45" x2="148" y2="35" stroke="#00FF88" strokeWidth="1.5" />
                  <line x1="112" y1="45" x2="148" y2="65" stroke="#00FF88" strokeWidth="1.5" />
                  <line x1="155" y1="58" x2="155" y2="42" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 1" />
                  <text x="170" y="52" fill="#F43F5E" fontSize="7" fontWeight="bold">w = -3</text>

                  <text x="145" y="94" fill="#00FF88" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    DIJKSTRA COUNTEREXAMPLE
                  </text>

                  {/* Confident Student Presenter */}
                  <circle cx="45" cy="42" r="14" fill="#E4F0E8" />
                  <path d="M 33 60 L 57 60 L 62 108 L 28 108 Z" fill="#00FF88" />
                  
                  {/* Arm pointing marker at board */}
                  <line x1="57" y1="68" x2="84" y2="48" stroke="#E4F0E8" strokeWidth="3" />
                  <circle cx="84" cy="48" r="3" fill="#00FF88" />
                </svg>
                <p className="text-xs text-[#87968D] max-w-[320px]">
                  Standing before the evaluators, the student draws the counterexample and defends every edge weight.
                </p>
              </div>
            )}

            {/* Step 5: Confident Mastery Outcome */}
            {currentStep === 5 && (
              <div className="mg-fade-in w-full flex flex-col items-center">
                <span className="font-mono text-[11px] text-[#00FF88] font-bold uppercase tracking-wider mb-1">
                  SCENE 5: AUTHENTIC MASTERY VERDICT
                </span>
                <svg viewBox="0 0 240 130" className="w-full max-w-[240px] h-32 mb-2">
                  {/* Confident Student Avatar */}
                  <circle cx="120" cy="50" r="16" fill="#E4F0E8" />
                  <path d="M 104 70 L 136 70 L 142 115 L 98 115 Z" fill="#00FF88" />
                  
                  {/* Happy confident face */}
                  <circle cx="114" cy="48" r="2.5" fill="#050807" />
                  <circle cx="126" cy="48" r="2.5" fill="#050807" />
                  <path d="M 114 56 Q 120 62 126 56" fill="none" stroke="#050807" strokeWidth="2" />

                  {/* Confident speech waves */}
                  <path d="M 145 42 Q 155 50 145 58" fill="none" stroke="#00FF88" strokeWidth="2" className="mg-spark-ignite" />
                  <path d="M 152 38 Q 166 50 152 62" fill="none" stroke="#00FF88" strokeWidth="2" className="mg-spark-ignite" />

                  {/* Evaluator Checkmarks & Applause */}
                  <circle cx="85" cy="40" r="8" fill="#061D12" stroke="#00FF88" />
                  <path d="M 81 40 L 84 43 L 89 37" fill="none" stroke="#00FF88" strokeWidth="2" />

                  {/* Mastery Achievement Stamp */}
                  <rect x="25" y="85" width="190" height="30" rx="3" fill="#061D12" stroke="#00FF88" strokeWidth="2" className="mg-stamp" />
                  <text x="120" y="104" fill="#00FF88" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace" className="mg-stamp">
                    ✓ 100% EXPLAINABLE // GENUINE MASTERY
                  </text>
                </svg>
                <p className="text-xs text-[#00FF88] font-medium max-w-[320px]">
                  Flawless oral defense. The student owns the knowledge and can adapt it to any unforeseen variant.
                </p>
              </div>
            )}

          </div>

          {/* Bottom Stage Progress Sublabel */}
          <div className="mt-3 pt-3 border-t border-[#00FF88]/20 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#00FF88] font-bold">
              {stepLabels[currentStep - 1].title}
            </span>
            <span className="text-[#87968D]">
              ACTIVE COMPREHENSION
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
