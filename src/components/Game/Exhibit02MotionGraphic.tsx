import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Exhibit02MotionGraphicProps {
  onStageChange?: (stage: number) => void;
}

export const Exhibit02MotionGraphic: React.FC<Exhibit02MotionGraphicProps> = ({
  onStageChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAlignedRef = useRef<boolean>(false);
  const isManuallyPausedRef = useRef<boolean>(false);
  const wasAutoPausedRef = useRef<boolean>(false);

  const TOTAL_STEPS = 5;
  const STEP_DURATION_MS = 3800; // 3.8s per scene

  // IntersectionObserver to auto-play when >= 70% visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        // Approaching viewport
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.15 &&
          entry.intersectionRatio < 0.70 &&
          !hasAlignedRef.current &&
          !hasAutoPlayed
        ) {
          const rect = entry.target.getBoundingClientRect();
          const isCutOff = rect.top < 70 || rect.bottom > window.innerHeight - 30;
          if (isCutOff) {
            hasAlignedRef.current = true;
            entry.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        // 70% playback gate
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

        // Pause if scrolled away
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

  // Step advancement timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStep < TOTAL_STEPS) {
          setCurrentStep((prev) => {
            const next = prev + 1;
            onStageChange?.(next);
            return next;
          });
        } else {
          setIsPlaying(false);
        }
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

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#050807] border-2 border-[#00FF88]/30 rounded-2xl p-6 sm:p-8 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden"
    >
      {/* Background Matrix Ambient Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #00FF88 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* =================================================================== */}
      {/* 1. CINEMA HEADER BAR (Clean, Elegant, Matching Exhibit 01)          */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-white/10 relative z-10">
        
        {/* Left: Clean Header Title */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00FF88] flex-shrink-0" />
          <span className="font-display font-bold text-sm sm:text-base text-[#E4F0E8]">
            The Anatomy of a Fake Citation // Five-Stage Breakdown
          </span>
        </div>

        {/* Right: Controls (5 Subtle Stage Dots + PAUSE and REPLAY) */}
        <div className="flex items-center gap-2">
          {/* Subtle Stage Dots */}
          <div className="hidden xs:flex items-center gap-1.5 mr-1" aria-label={`Stage ${currentStep} of 5`}>
            {[1, 2, 3, 4, 5].map((dot) => (
              <button
                key={dot}
                type="button"
                onClick={() => handleStepClick(dot)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  dot === currentStep
                    ? 'w-5 bg-[#00FF88] shadow-[0_0_8px_#00FF88]'
                    : dot < currentStep
                    ? 'w-2 bg-[#00FF88]/40 hover:bg-[#00FF88]/70'
                    : 'w-2 bg-white/15 hover:bg-white/30'
                }`}
                title={`Scene ${dot}`}
                aria-label={`Jump to Scene ${dot}`}
              />
            ))}
          </div>

          {/* PAUSE / PLAY Button */}
          <button
            onClick={togglePlay}
            type="button"
            className="exhibit-control-btn"
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
                <span>{currentStep === TOTAL_STEPS ? 'REPLAY' : 'PLAY'}</span>
              </>
            )}
          </button>

          {/* REPLAY Button */}
          <button
            onClick={handleReplay}
            type="button"
            className="exhibit-control-btn"
            title="Replay from Scene 1"
            aria-label="Replay animation from Scene 1"
          >
            <RotateCcw size={13} className="shrink-0" />
            <span>REPLAY</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. CINEMATIC ILLUSTRATED ANIMATION STAGE (Large Dominant Canvas)    */}
      {/* =================================================================== */}
      <div className="w-full bg-[#070D09] border border-[#00FF88]/20 rounded-xl p-4 sm:p-6 min-h-[360px] sm:min-h-[420px] flex flex-col justify-center items-center relative overflow-hidden">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-3xl pointer-events-none" />

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 01 — THE REQUEST (Student at Desk Prompting AI)             */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 460 210" className="w-full max-w-[460px] h-56 sm:h-64 mb-2">
              {/* Desk Surface */}
              <rect x="20" y="160" width="420" height="12" rx="3" fill="#15201A" stroke="#2A3D32" strokeWidth="1.5" />
              <rect x="45" y="172" width="14" height="38" fill="#0C1410" />
              <rect x="400" y="172" width="14" height="38" fill="#0C1410" />

              {/* Research Assignment Sheet on desk */}
              <rect x="60" y="125" width="60" height="36" rx="2" fill="#0D1611" stroke="#3A5243" strokeWidth="1" />
              <line x1="68" y1="133" x2="112" y2="133" stroke="#00FF88" strokeWidth="2" />
              <line x1="68" y1="140" x2="105" y2="140" stroke="#4D6B58" strokeWidth="1.5" />
              <line x1="68" y1="147" x2="98" y2="147" stroke="#4D6B58" strokeWidth="1.5" />
              <text x="90" y="156" fill="#87968D" fontSize="5" fontFamily="monospace" textAnchor="middle">ASSIGNMENT</text>

              {/* Student Figure */}
              <circle cx="340" cy="90" r="22" fill="#E4F0E8" />
              {/* Glasses */}
              <rect x="325" y="85" width="12" height="6" rx="2" fill="none" stroke="#050807" strokeWidth="1.5" />
              <rect x="341" y="85" width="12" height="6" rx="2" fill="none" stroke="#050807" strokeWidth="1.5" />
              <line x1="337" y1="88" x2="341" y2="88" stroke="#050807" strokeWidth="1.5" />

              {/* Student Torso leaning forward */}
              <path d="M 315 120 Q 340 115 365 120 L 380 165 L 305 165 Z" fill="#2E4035" stroke="#3D5446" strokeWidth="1.5" />
              <path d="M 310 130 L 265 153 L 245 157" fill="none" stroke="#2E4035" strokeWidth="10" strokeLinecap="round" />

              {/* Laptop Base */}
              <polygon points="150,160 260,160 250,167 160,167" fill="#1C2B22" stroke="#00FF88" strokeWidth="1" />
              {/* Laptop Screen (angled open) */}
              <polygon points="155,80 255,80 260,160 150,160" fill="#050B08" stroke="#00FF88" strokeWidth="1.5" />

              {/* Screen Content: AI Chat Interface */}
              <rect x="160" y="85" width="90" height="12" rx="1" fill="#0A1810" />
              <circle cx="166" cy="91" r="2" fill="#00FF88" />
              <text x="172" y="93" fill="#00FF88" fontSize="4.5" fontFamily="monospace">RESEARCH_AI</text>

              {/* Chat Prompt Stream Bubble with Animated Typing */}
              <rect x="160" y="101" width="88" height="28" rx="2" fill="#0C1D13" stroke="#00FF88" strokeWidth="0.8" />
              <text x="164" y="110" fill="#87968D" fontSize="4" fontFamily="monospace">PROMPT:</text>
              <text x="164" y="117" fill="#FFFFFF" fontSize="4.5" fontWeight="bold" fontFamily="monospace">"Suggest academic papers</text>
              <text x="164" y="124" fill="#00FF88" fontSize="4.5" fontWeight="bold" fontFamily="monospace">on adaptive graph pruning"</text>
              {/* Blinking cursor */}
              <rect x="241" y="120" width="2" height="5" fill="#00FF88" className="animate-pulse" />

              {/* AI Processing Status */}
              <rect x="160" y="133" width="70" height="18" rx="2" fill="#050E09" stroke="#00FF88" strokeWidth="0.6" strokeDasharray="2 1" />
              <circle cx="166" cy="142" r="2" fill="#00FF88" className="animate-ping" />
              <text x="172" y="144" fill="#00FF88" fontSize="4" fontFamily="monospace">SYNTHESIZING CITATIONS...</text>

              {/* Animated Floating Query Beam */}
              <path d="M 205 80 Q 205 40 280 35" fill="none" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="280" cy="35" r="18" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
              <text x="280" y="33" fill="#87968D" fontSize="4" fontFamily="monospace" textAnchor="middle">FIND</text>
              <text x="280" y="39" fill="#00FF88" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SOURCES</text>
            </svg>

            <p className="font-body text-sm sm:text-base text-[#D1DDD5] max-w-lg mx-auto">
              A university student prompts an AI assistant to locate academic research papers for an assignment.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 02 — THE CITATION APPEARS (Scholarly Paper Materializes)    */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 460 210" className="w-full max-w-[460px] h-56 sm:h-64 mb-2">
              {/* Paper Background & Sheet */}
              <rect x="75" y="10" width="310" height="190" rx="4" fill="#0A120D" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 15px 25px rgba(0,255,136,0.15))" />
              
              {/* Journal Masthead */}
              <rect x="76" y="11" width="308" height="26" rx="3" fill="#0F1F16" />
              <circle cx="95" cy="24" r="6" fill="#00FF88" fillOpacity="0.2" stroke="#00FF88" strokeWidth="1" />
              <text x="95" y="27" fill="#00FF88" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="serif">IJ</text>
              <text x="110" y="22" fill="#E4F0E8" fontSize="6.5" fontWeight="bold" fontFamily="serif">INTERNATIONAL JOURNAL OF NEURAL SYNTHETICS</text>
              <text x="110" y="31" fill="#87968D" fontSize="5" fontFamily="monospace">VOL. 14, NO. 3 • PEER-REVIEWED RESEARCH</text>

              {/* Research Article Title */}
              <text x="95" y="53" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" fontFamily="serif">
                Adaptive Graph Pruning for Latent Knowledge Graphs
              </text>

              {/* Authors Byline */}
              <text x="95" y="69" fill="#00FF88" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                E. R. Vance &amp; K. Rostova
              </text>
              <text x="95" y="78" fill="#87968D" fontSize="5" fontFamily="sans-serif">
                Department of Machine Intelligence &amp; Theoretical Computer Science
              </text>

              {/* Metadata Badges */}
              <rect x="95" y="87" width="70" height="14" rx="2" fill="#13241B" stroke="#00FF88" strokeWidth="0.8" />
              <text x="130" y="96" fill="#00FF88" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">YEAR: 2024</text>

              <rect x="175" y="87" width="85" height="14" rx="2" fill="#13241B" stroke="#00FF88" strokeWidth="0.8" />
              <text x="217" y="96" fill="#00FF88" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PAGES: 112–129</text>

              <rect x="270" y="87" width="100" height="14" rx="2" fill="#13241B" stroke="#FBBF24" strokeWidth="0.8" />
              <text x="320" y="96" fill="#FBBF24" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DOI-042 (SIMULATED)</text>

              {/* Abstract & Article Text Lines */}
              <line x1="95" y1="110" x2="365" y2="110" stroke="#2A3D32" strokeWidth="1" />
              <text x="95" y="120" fill="#87968D" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">ABSTRACT</text>

              {/* Text Lines */}
              <line x1="95" y1="128" x2="220" y2="128" stroke="#4B6354" strokeWidth="2" />
              <line x1="95" y1="136" x2="225" y2="136" stroke="#4B6354" strokeWidth="2" />
              <line x1="95" y1="144" x2="215" y2="144" stroke="#4B6354" strokeWidth="2" />
              <line x1="95" y1="152" x2="210" y2="152" stroke="#4B6354" strokeWidth="2" />

              <line x1="240" y1="128" x2="365" y2="128" stroke="#4B6354" strokeWidth="2" />
              <line x1="240" y1="136" x2="360" y2="136" stroke="#4B6354" strokeWidth="2" />
              <line x1="240" y1="144" x2="350" y2="144" stroke="#4B6354" strokeWidth="2" />
              <line x1="240" y1="152" x2="330" y2="152" stroke="#4B6354" strokeWidth="2" />

              {/* Authoritative Stamp */}
              <circle cx="345" cy="177" r="16" fill="#0F2417" stroke="#00FF88" strokeWidth="1.5" />
              <text x="345" y="175" fill="#00FF88" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">INDEXED</text>
              <text x="345" y="181" fill="#00FF88" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SCHOLARLY</text>
            </svg>

            <p className="font-body text-sm sm:text-base text-[#D1DDD5] max-w-lg mx-auto">
              A convincing academic paper reference materializes, complete with title, authors, journal, and page numbers.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 03 — THE FALSE CONFIDENCE (Pasted into Bibliography)        */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 460 210" className="w-full max-w-[460px] h-56 sm:h-64 mb-2">
              {/* Left Side: Generated Citation */}
              <rect x="25" y="25" width="180" height="150" rx="4" fill="#0A120D" stroke="#00FF88" strokeWidth="1.5" />
              <rect x="26" y="26" width="178" height="20" rx="2" fill="#112217" />
              <text x="35" y="39" fill="#00FF88" fontSize="5" fontFamily="monospace">AI_GENERATOR</text>

              {/* Selected Text Highlight */}
              <rect x="35" y="55" width="160" height="50" rx="2" fill="#00FF88" fillOpacity="0.15" stroke="#00FF88" strokeWidth="1" strokeDasharray="3 2" />
              <text x="40" y="67" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" fontFamily="serif">Vance, E. R., &amp; Rostova, K. (2024).</text>
              <text x="40" y="77" fill="#00FF88" fontSize="5" fontFamily="serif">Adaptive Graph Pruning for Latent Graphs.</text>
              <text x="40" y="87" fill="#D1DDD5" fontSize="4.5" fontFamily="serif">Int. J. Neural Synthetics, 14(3), 112–129.</text>
              <text x="40" y="97" fill="#FBBF24" fontSize="4.5" fontFamily="monospace">DOI-042</text>

              {/* Animated Copy Arrow */}
              <path d="M 210 90 Q 240 65 270 90" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeDasharray="5 3" />
              <polygon points="274,91 265,85 267,94" fill="#00FF88" />
              <rect x="220" y="60" width="40" height="14" rx="2" fill="#00FF88" />
              <text x="240" y="69" fill="#050807" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PASTE</text>

              {/* Right Side: Assignment Bibliography */}
              <rect x="275" y="25" width="160" height="150" rx="4" fill="#0A120D" stroke="#3A5243" strokeWidth="1.5" />
              <rect x="276" y="26" width="158" height="20" rx="2" fill="#141E17" />
              <text x="285" y="39" fill="#E4F0E8" fontSize="5" fontFamily="monospace">BIBLIOGRAPHY</text>

              {/* Bibliography Header */}
              <text x="285" y="61" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">REFERENCES</text>
              <line x1="285" y1="67" x2="420" y2="67" stroke="#2A3D32" strokeWidth="1" />

              {/* Inserted Citation Box with Amber Warning Border */}
              <rect x="285" y="75" width="140" height="48" rx="2" fill="#16180E" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="290" y="87" fill="#FBBF24" fontSize="5" fontWeight="bold" fontFamily="monospace">[1] Vance &amp; Rostova (2024)</text>
              <text x="290" y="96" fill="#E4F0E8" fontSize="4.5" fontFamily="serif">Adaptive Graph Pruning...</text>
              <text x="290" y="105" fill="#87968D" fontSize="4" fontFamily="serif">Int. J. Neural Synthetics, 14(3)</text>
              <text x="290" y="115" fill="#F59E0B" fontSize="4" fontFamily="monospace">DOI-042</text>

              {/* Subtle Amber Callout */}
              <rect x="285" y="131" width="140" height="32" rx="2" fill="#2E1805" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="297" cy="147" r="5" fill="#F59E0B" />
              <text x="297" y="150" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">!</text>
              <text x="306" y="143" fill="#FBBF24" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">UNVERIFIED REFERENCE</text>
              <text x="306" y="152" fill="#FCD34D" fontSize="4" fontFamily="sans-serif">Format does not guarantee existence.</text>
            </svg>

            <p className="font-body text-sm sm:text-base text-[#D1DDD5] max-w-lg mx-auto">
              The citation is pasted into the assignment bibliography without independent verification.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 04 — THE INVESTIGATION (Registry Mismatch Revealed)          */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 4 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 460 210" className="w-full max-w-[460px] h-56 sm:h-64 mb-2">
              {/* Left Column: Claimed Citation */}
              <rect x="25" y="20" width="190" height="165" rx="4" fill="#0C130E" stroke="#3A5243" strokeWidth="1.5" />
              <rect x="26" y="21" width="188" height="22" rx="2" fill="#121D16" />
              <text x="35" y="35" fill="#87968D" fontSize="5.5" fontWeight="bold" fontFamily="monospace">CLAIMED CITATION</text>

              <text x="35" y="55" fill="#87968D" fontSize="4.5" fontFamily="monospace">TITLE:</text>
              <text x="35" y="64" fill="#FFFFFF" fontSize="5" fontWeight="bold" fontFamily="sans-serif">Adaptive Graph Pruning for Latent Graphs</text>

              <text x="35" y="80" fill="#87968D" fontSize="4.5" fontFamily="monospace">AUTHORS:</text>
              <text x="35" y="89" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">E. R. Vance &amp; K. Rostova</text>

              <text x="35" y="105" fill="#87968D" fontSize="4.5" fontFamily="monospace">JOURNAL:</text>
              <text x="35" y="114" fill="#FFFFFF" fontSize="5" fontFamily="serif" fontStyle="italic">Int. J. Neural Synthetics (2024)</text>

              <text x="35" y="130" fill="#87968D" fontSize="4.5" fontFamily="monospace">IDENTIFIER:</text>
              <rect x="35" y="135" width="80" height="15" rx="2" fill="#142B1D" stroke="#00FF88" strokeWidth="1" />
              <text x="40" y="145" fill="#00FF88" fontSize="5.5" fontWeight="bold" fontFamily="monospace">DOI-042</text>

              {/* Query Beam */}
              <path d="M 120 143 L 240 143" stroke="#00FF88" strokeWidth="2" strokeDasharray="3 2" />
              <polygon points="245,143 238,139 238,147" fill="#00FF88" />

              {/* Right Column: Actual Simulated Registry Record */}
              <rect x="245" y="20" width="190" height="165" rx="4" fill="#160B0D" stroke="#F43F5E" strokeWidth="2" />
              <rect x="246" y="21" width="188" height="22" rx="2" fill="#240D11" />
              <text x="255" y="35" fill="#F43F5E" fontSize="5.5" fontWeight="bold" fontFamily="monospace">REGISTRY RECORD: DOI-042</text>

              {/* Mismatched Fields (Red Highlights) */}
              <rect x="252" y="47" width="176" height="22" rx="2" fill="#380F16" stroke="#F43F5E" strokeWidth="1" />
              <text x="256" y="56" fill="#FCA5A5" fontSize="4" fontFamily="monospace">TITLE MISMATCH:</text>
              <text x="256" y="64" fill="#FECDD3" fontSize="5" fontWeight="bold" fontFamily="sans-serif">"Efficient Graph Pruning for Knowledge Retrieval"</text>

              <rect x="252" y="73" width="176" height="22" rx="2" fill="#380F16" stroke="#F43F5E" strokeWidth="1" />
              <text x="256" y="82" fill="#FCA5A5" fontSize="4" fontFamily="monospace">AUTHORS MISMATCH:</text>
              <text x="256" y="90" fill="#FECDD3" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">N. Patel &amp; S. Huang</text>

              <rect x="252" y="99" width="176" height="22" rx="2" fill="#380F16" stroke="#F43F5E" strokeWidth="1" />
              <text x="256" y="108" fill="#FCA5A5" fontSize="4" fontFamily="monospace">JOURNAL MISMATCH:</text>
              <text x="256" y="116" fill="#FECDD3" fontSize="5" fontFamily="serif" fontStyle="italic">Journal of Computational Networks (2023)</text>

              {/* Mismatch Warning Banner */}
              <rect x="252" y="127" width="176" height="24" rx="2" fill="#F43F5E" />
              <text x="340" y="138" fill="#050807" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CONFLICTING METADATA</text>
              <text x="340" y="146" fill="#050807" fontSize="4.5" textAnchor="middle" fontFamily="monospace">Supplied ID belongs to another paper.</text>
            </svg>

            <p className="font-body text-sm sm:text-base text-[#D1DDD5] max-w-lg mx-auto">
              A simulated registry lookup reveals conflicting title, authors, and journal for identifier <span className="font-mono text-rose-400 font-bold">DOI-042</span>.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 05 — THE REVEAL (Clean Visual Revelation Stamp)             */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 5 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 460 210" className="w-full max-w-[460px] h-56 sm:h-64 mb-2">
              {/* Fractured Paper Canvas */}
              <rect x="60" y="15" width="340" height="175" rx="4" fill="#0C100D" stroke="#F43F5E" strokeWidth="2.5" />
              
              {/* Paper Details */}
              <text x="80" y="45" fill="#87968D" fontSize="6" fontFamily="monospace">CLAIMED SPECIMEN // DOI-042</text>
              <text x="80" y="65" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" fontFamily="serif">Adaptive Graph Pruning for Latent Knowledge Graphs</text>
              <text x="80" y="80" fill="#D1DDD5" fontSize="6.5" fontFamily="sans-serif">Authors: E. R. Vance &amp; K. Rostova • Int. J. Neural Synthetics (2024)</text>

              {/* Visual Conflict Separator Line */}
              <line x1="80" y1="95" x2="380" y2="95" stroke="#F43F5E" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

              {/* Three Clean Visual Indicator Pills */}
              <g transform="translate(80, 105)">
                <rect x="0" y="0" width="90" height="18" rx="3" fill="#240D11" stroke="#F43F5E" strokeWidth="1" />
                <circle cx="10" cy="9" r="3" fill="#F43F5E" />
                <text x="20" y="12" fill="#FECDD3" fontSize="5.5" fontWeight="bold" fontFamily="monospace">ID CLASH</text>
              </g>

              <g transform="translate(180, 105)">
                <rect x="0" y="0" width="100" height="18" rx="3" fill="#240D11" stroke="#F43F5E" strokeWidth="1" />
                <circle cx="10" cy="9" r="3" fill="#F43F5E" />
                <text x="20" y="12" fill="#FECDD3" fontSize="5.5" fontWeight="bold" fontFamily="monospace">ISSUE ABSENCE</text>
              </g>

              <g transform="translate(290, 105)">
                <rect x="0" y="0" width="90" height="18" rx="3" fill="#240D11" stroke="#F43F5E" strokeWidth="1" />
                <circle cx="10" cy="9" r="3" fill="#F43F5E" />
                <text x="20" y="12" fill="#FECDD3" fontSize="5.5" fontWeight="bold" fontFamily="monospace">UNVERIFIED</text>
              </g>

              {/* Bold Red Forensic Stamp Clamped across paper */}
              <g transform="rotate(-6 230 148)">
                <rect x="95" y="132" width="270" height="36" rx="4" fill="#F43F5E" fillOpacity="0.2" stroke="#F43F5E" strokeWidth="3" />
                <text x="230" y="156" fill="#F43F5E" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace" letterSpacing="3">
                  REFERENCE NOT VERIFIED
                </text>
              </g>
            </svg>

            <p className="font-body text-sm sm:text-base text-[#D1DDD5] max-w-lg mx-auto">
              Looking academic does not make a source real. Independent verification is essential.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
