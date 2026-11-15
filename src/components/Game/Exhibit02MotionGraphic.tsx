import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

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

  const stageTitles = [
    { num: 1, label: 'THE REQUEST', desc: 'Student prompts AI for papers' },
    { num: 2, label: 'THE FABRICATION', desc: 'AI synthesizes plausible citation' },
    { num: 3, label: 'THE ILLUSION', desc: 'Pasted into bibliography without verification' },
    { num: 4, label: 'THE CROSS-CHECK', desc: 'Registry query reveals conflicting records' },
    { num: 5, label: 'FORENSIC VERDICT', desc: 'Reference not verified: looking real != real' },
  ];

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
      className="w-full bg-[#050807] border-2 border-[#00FF88]/30 rounded-2xl p-5 sm:p-8 mb-10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] relative overflow-hidden"
    >
      {/* Background Matrix Ambient Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #00FF88 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* =================================================================== */}
      {/* 1. CINEMA HEADER BAR                                                */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10 relative z-10">
        
        {/* Left: Clean Header Title */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#00FF88] flex-shrink-0" />
          <span className="font-display font-bold text-sm sm:text-base text-[#E4F0E8] tracking-wide">
            THE ANATOMY OF A FAKE CITATION // 5-STAGE INVESTIGATION
          </span>
        </div>

        {/* Right: Controls (PAUSE and REPLAY) */}
        <div className="flex items-center gap-2">
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
      {/* 2. INTERACTIVE 5-STAGE TIMELINE TRACKER                             */}
      {/* =================================================================== */}
      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-2 mb-6 relative z-10">
        {stageTitles.map((stage) => {
          const isActive = currentStep === stage.num;
          const isPast = currentStep > stage.num;

          return (
            <button
              key={stage.num}
              type="button"
              onClick={() => handleStepClick(stage.num)}
              className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-[#091F13] border-[#00FF88] shadow-[0_0_14px_rgba(0,255,136,0.3)]'
                  : isPast
                  ? 'bg-[#06110B] border-[#00FF88]/30 hover:border-[#00FF88]/60'
                  : 'bg-[#050807] border-white/10 opacity-50 hover:opacity-80'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
              )}
              <div className="flex items-center justify-between mb-0.5">
                <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-[#00FF88]' : 'text-[#87968D]'}`}>
                  0{stage.num}
                </span>
                {isActive && <Sparkles size={10} className="text-[#00FF88] animate-pulse" />}
              </div>
              <div className="font-display font-bold text-[11px] sm:text-xs text-[#E4F0E8] truncate">
                {stage.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 3. CINEMATIC ILLUSTRATED ANIMATION STAGE (Enlarged Dominant Canvas)  */}
      {/* =================================================================== */}
      <div className="w-full bg-[#070D09] border border-[#00FF88]/25 rounded-xl p-5 sm:p-8 min-h-[440px] sm:min-h-[500px] flex flex-col justify-center items-center relative overflow-hidden">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-3xl pointer-events-none" />

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 01 — THE REQUEST (Student at Desk Prompting AI)             */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Desk Surface */}
              <rect x="20" y="185" width="500" height="14" rx="3" fill="#15201A" stroke="#2A3D32" strokeWidth="1.5" />
              <rect x="50" y="199" width="16" height="38" fill="#0C1410" />
              <rect x="474" y="199" width="16" height="38" fill="#0C1410" />

              {/* Research Assignment Sheet on desk */}
              <rect x="65" y="145" width="70" height="40" rx="3" fill="#0D1611" stroke="#3A5243" strokeWidth="1.2" />
              <line x1="75" y1="154" x2="125" y2="154" stroke="#00FF88" strokeWidth="2.5" />
              <line x1="75" y1="162" x2="118" y2="162" stroke="#4D6B58" strokeWidth="1.5" />
              <line x1="75" y1="170" x2="110" y2="170" stroke="#4D6B58" strokeWidth="1.5" />
              <text x="100" y="180" fill="#87968D" fontSize="6" fontFamily="monospace" textAnchor="middle">ASSIGNMENT SPECS</text>

              {/* Student Figure */}
              <circle cx="410" cy="100" r="26" fill="#E4F0E8" />
              {/* Glasses */}
              <rect x="392" y="94" width="15" height="8" rx="2" fill="none" stroke="#050807" strokeWidth="1.8" />
              <rect x="412" y="94" width="15" height="8" rx="2" fill="none" stroke="#050807" strokeWidth="1.8" />
              <line x1="407" y1="98" x2="412" y2="98" stroke="#050807" strokeWidth="1.8" />

              {/* Student Torso */}
              <path d="M 380 135 Q 410 130 440 135 L 458 185 L 368 185 Z" fill="#2E4035" stroke="#3D5446" strokeWidth="1.8" />
              <path d="M 374 146 L 315 174 L 290 179" fill="none" stroke="#2E4035" strokeWidth="12" strokeLinecap="round" />

              {/* Laptop Base */}
              <polygon points="175,185 305,185 293,194 187,194" fill="#1C2B22" stroke="#00FF88" strokeWidth="1.2" />
              {/* Laptop Screen (angled open) */}
              <polygon points="180,90 300,90 305,185 175,185" fill="#050B08" stroke="#00FF88" strokeWidth="1.8" />

              {/* Screen Content: AI Chat Interface */}
              <rect x="186" y="96" width="108" height="15" rx="2" fill="#0A1810" />
              <circle cx="194" cy="103" r="2.5" fill="#00FF88" />
              <text x="202" y="106" fill="#00FF88" fontSize="5.5" fontFamily="monospace" fontWeight="bold">SYNTHESIS_MODEL_v4</text>

              {/* Chat Prompt Stream Bubble with Animated Typing */}
              <rect x="186" y="115" width="106" height="34" rx="2" fill="#0C1D13" stroke="#00FF88" strokeWidth="1" />
              <text x="191" y="125" fill="#87968D" fontSize="4.5" fontFamily="monospace">PROMPT:</text>
              <text x="191" y="133" fill="#FFFFFF" fontSize="5" fontWeight="bold" fontFamily="monospace">"Find 3 scholarly papers</text>
              <text x="191" y="141" fill="#00FF88" fontSize="5" fontWeight="bold" fontFamily="monospace">on adaptive graph pruning"</text>
              <rect x="281" y="137" width="2.5" height="6" fill="#00FF88" className="animate-pulse" />

              {/* AI Processing Status */}
              <rect x="186" y="153" width="90" height="22" rx="2" fill="#050E09" stroke="#00FF88" strokeWidth="0.8" strokeDasharray="3 1.5" />
              <circle cx="194" cy="164" r="2.5" fill="#00FF88" className="animate-ping" />
              <text x="202" y="167" fill="#00FF88" fontSize="5" fontFamily="monospace">ASSEMBLING TOKENS...</text>

              {/* Animated Floating Query Beam */}
              <path d="M 240 90 Q 240 40 330 35" fill="none" stroke="#00FF88" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="330" cy="35" r="22" fill="#0A1810" stroke="#00FF88" strokeWidth="1.5" />
              <text x="330" y="32" fill="#87968D" fontSize="4.5" fontFamily="monospace" textAnchor="middle">QUERY</text>
              <text x="330" y="40" fill="#00FF88" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">CITATIONS</text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              A university student prompts an AI model to retrieve scholarly research papers for an academic assignment.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 02 — THE FABRICATION (Scholarly Paper Materializes)          */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Paper Background & Sheet */}
              <rect x="90" y="12" width="360" height="216" rx="5" fill="#0A120D" stroke="#00FF88" strokeWidth="2.2" filter="drop-shadow(0 18px 30px rgba(0,255,136,0.18))" />
              
              {/* Journal Masthead */}
              <rect x="91" y="13" width="358" height="32" rx="4" fill="#0F1F16" />
              <circle cx="114" cy="29" r="8" fill="#00FF88" fillOpacity="0.2" stroke="#00FF88" strokeWidth="1.2" />
              <text x="114" y="33" fill="#00FF88" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="serif">IJ</text>
              <text x="132" y="27" fill="#E4F0E8" fontSize="8" fontWeight="bold" fontFamily="serif">INTERNATIONAL JOURNAL OF NEURAL SYNTHETICS</text>
              <text x="132" y="38" fill="#87968D" fontSize="6" fontFamily="monospace">VOL. 14, NO. 3 • PEER-REVIEWED RESEARCH</text>

              {/* Research Article Title */}
              <text x="114" y="66" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="serif">
                Adaptive Graph Pruning for Latent Knowledge Graphs
              </text>

              {/* Authors Byline */}
              <text x="114" y="85" fill="#00FF88" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
                E. R. Vance &amp; K. Rostova
              </text>
              <text x="114" y="96" fill="#87968D" fontSize="6" fontFamily="sans-serif">
                Department of Machine Intelligence &amp; Theoretical Computer Science
              </text>

              {/* Metadata Badges */}
              <rect x="114" y="106" width="82" height="17" rx="3" fill="#13241B" stroke="#00FF88" strokeWidth="1" />
              <text x="155" y="117" fill="#00FF88" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">YEAR: 2024</text>

              <rect x="206" y="106" width="100" height="17" rx="3" fill="#13241B" stroke="#00FF88" strokeWidth="1" />
              <text x="256" y="117" fill="#00FF88" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PAGES: 112–129</text>

              <rect x="316" y="106" width="118" height="17" rx="3" fill="#13241B" stroke="#FBBF24" strokeWidth="1" />
              <text x="375" y="117" fill="#FBBF24" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DOI-042 (SIMULATED)</text>

              {/* Abstract & Article Text Lines */}
              <line x1="114" y1="134" x2="430" y2="134" stroke="#2A3D32" strokeWidth="1.2" />
              <text x="114" y="146" fill="#87968D" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">ABSTRACT</text>

              {/* Text Lines */}
              <line x1="114" y1="156" x2="260" y2="156" stroke="#4B6354" strokeWidth="2.5" />
              <line x1="114" y1="165" x2="265" y2="165" stroke="#4B6354" strokeWidth="2.5" />
              <line x1="114" y1="174" x2="255" y2="174" stroke="#4B6354" strokeWidth="2.5" />
              <line x1="114" y1="183" x2="250" y2="183" stroke="#4B6354" strokeWidth="2.5" />

              <line x1="280" y1="156" x2="430" y2="156" stroke="#4B6354" strokeWidth="2.5" />
              <line x1="280" y1="165" x2="425" y2="165" stroke="#4B6354" strokeWidth="2.5" />
              <line x1="280" y1="174" x2="415" y2="174" stroke="#4B6354" strokeWidth="2.5" />
              <line x1="280" y1="183" x2="390" y2="183" stroke="#4B6354" strokeWidth="2.5" />

              {/* Authoritative Stamp */}
              <circle cx="405" cy="204" r="18" fill="#0F2417" stroke="#00FF88" strokeWidth="1.8" />
              <text x="405" y="202" fill="#00FF88" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">INDEXED</text>
              <text x="405" y="209" fill="#00FF88" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SCHOLARLY</text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              A convincing academic citation materializes with authentic formatting, plausible authors, a journal title, and publication volume.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 03 — THE ILLUSION (Pasted into Bibliography)                */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Left Side: Generated Citation */}
              <rect x="25" y="25" width="215" height="185" rx="5" fill="#0A120D" stroke="#00FF88" strokeWidth="1.8" />
              <rect x="26" y="26" width="213" height="24" rx="3" fill="#112217" />
              <text x="36" y="42" fill="#00FF88" fontSize="6" fontFamily="monospace" fontWeight="bold">AI_OUTPUT // PLAUSIBLE RESULT</text>

              {/* Selected Text Highlight */}
              <rect x="36" y="60" width="193" height="60" rx="3" fill="#00FF88" fillOpacity="0.15" stroke="#00FF88" strokeWidth="1.2" strokeDasharray="3 2" />
              <text x="42" y="74" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="serif">Vance, E. R., &amp; Rostova, K. (2024).</text>
              <text x="42" y="86" fill="#00FF88" fontSize="6" fontFamily="serif">Adaptive Graph Pruning for Latent Graphs.</text>
              <text x="42" y="98" fill="#D1DDD5" fontSize="5.5" fontFamily="serif">Int. J. Neural Synthetics, 14(3), 112–129.</text>
              <text x="42" y="110" fill="#FBBF24" fontSize="5.5" fontFamily="monospace">DOI-042</text>

              {/* Animated Copy Arrow */}
              <path d="M 245 105 Q 275 75 305 105" fill="none" stroke="#00FF88" strokeWidth="3" strokeDasharray="6 3" />
              <polygon points="310,106 300,99 302,110" fill="#00FF88" />
              <rect x="255" y="70" width="48" height="17" rx="3" fill="#00FF88" />
              <text x="279" y="81" fill="#050807" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PASTE</text>

              {/* Right Side: Assignment Bibliography */}
              <rect x="315" y="25" width="200" height="185" rx="5" fill="#0A120D" stroke="#3A5243" strokeWidth="1.8" />
              <rect x="316" y="26" width="198" height="24" rx="3" fill="#141E17" />
              <text x="326" y="42" fill="#E4F0E8" fontSize="6" fontFamily="monospace" fontWeight="bold">TERM_PAPER_BIBLIOGRAPHY</text>

              {/* References Header */}
              <text x="326" y="66" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">REFERENCES</text>
              <line x1="326" y1="73" x2="495" y2="73" stroke="#2A3D32" strokeWidth="1.2" />

              {/* Inserted Citation Box with Amber Warning Border */}
              <rect x="326" y="82" width="178" height="58" rx="3" fill="#16180E" stroke="#F59E0B" strokeWidth="1.8" />
              <text x="333" y="96" fill="#FBBF24" fontSize="6" fontWeight="bold" fontFamily="monospace">[1] Vance &amp; Rostova (2024)</text>
              <text x="333" y="107" fill="#E4F0E8" fontSize="5.5" fontFamily="serif">Adaptive Graph Pruning...</text>
              <text x="333" y="118" fill="#87968D" fontSize="5" fontFamily="serif">Int. J. Neural Synthetics, 14(3)</text>
              <text x="333" y="130" fill="#F59E0B" fontSize="5" fontFamily="monospace">DOI-042</text>

              {/* Warning Callout Box */}
              <rect x="326" y="148" width="178" height="38" rx="3" fill="#2E1805" stroke="#F59E0B" strokeWidth="1.2" />
              <circle cx="340" cy="167" r="6" fill="#F59E0B" />
              <text x="340" y="171" fill="#050807" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>
              <text x="352" y="163" fill="#FBBF24" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">UNVERIFIED REFERENCE</text>
              <text x="352" y="174" fill="#FCD34D" fontSize="5" fontFamily="sans-serif">Looking academic does not mean it exists.</text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              The citation is pasted directly into the assignment bibliography without independent verification.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 04 — THE CROSS-CHECK (Registry Mismatch Revealed)            */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 4 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Left Column: Claimed Citation */}
              <rect x="25" y="20" width="225" height="195" rx="5" fill="#0C130E" stroke="#3A5243" strokeWidth="1.8" />
              <rect x="26" y="21" width="223" height="26" rx="3" fill="#121D16" />
              <text x="36" y="38" fill="#87968D" fontSize="6.5" fontWeight="bold" fontFamily="monospace">CLAIMED CITATION</text>

              <text x="36" y="62" fill="#87968D" fontSize="5" fontFamily="monospace">TITLE:</text>
              <text x="36" y="73" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">Adaptive Graph Pruning for Latent Graphs</text>

              <text x="36" y="93" fill="#87968D" fontSize="5" fontFamily="monospace">AUTHORS:</text>
              <text x="36" y="104" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">E. R. Vance &amp; K. Rostova</text>

              <text x="36" y="124" fill="#87968D" fontSize="5" fontFamily="monospace">JOURNAL:</text>
              <text x="36" y="135" fill="#FFFFFF" fontSize="6" fontFamily="serif" fontStyle="italic">Int. J. Neural Synthetics (2024)</text>

              <text x="36" y="155" fill="#87968D" fontSize="5" fontFamily="monospace">IDENTIFIER:</text>
              <rect x="36" y="161" width="95" height="18" rx="3" fill="#142B1D" stroke="#00FF88" strokeWidth="1.2" />
              <text x="42" y="173" fill="#00FF88" fontSize="6.5" fontWeight="bold" fontFamily="monospace">DOI-042</text>

              {/* Query Beam across to Registry */}
              <path d="M 135 170 L 285 170" stroke="#00FF88" strokeWidth="2.5" strokeDasharray="4 2" />
              <polygon points="290,170 282,165 282,175" fill="#00FF88" />

              {/* Right Column: Actual Simulated Registry Record */}
              <rect x="290" y="20" width="225" height="195" rx="5" fill="#160B0D" stroke="#F43F5E" strokeWidth="2.2" />
              <rect x="291" y="21" width="223" height="26" rx="3" fill="#240D11" />
              <text x="301" y="38" fill="#F43F5E" fontSize="6.5" fontWeight="bold" fontFamily="monospace">REGISTRY RECORD: DOI-042</text>

              {/* Mismatched Fields (Red Highlights) */}
              <rect x="298" y="53" width="208" height="26" rx="3" fill="#380F16" stroke="#F43F5E" strokeWidth="1.2" />
              <text x="304" y="63" fill="#FCA5A5" fontSize="4.5" fontFamily="monospace">TITLE MISMATCH:</text>
              <text x="304" y="73" fill="#FECDD3" fontSize="6" fontWeight="bold" fontFamily="sans-serif">"Efficient Graph Pruning for Knowledge Retrieval"</text>

              <rect x="298" y="85" width="208" height="26" rx="3" fill="#380F16" stroke="#F43F5E" strokeWidth="1.2" />
              <text x="304" y="95" fill="#FCA5A5" fontSize="4.5" fontFamily="monospace">AUTHORS MISMATCH:</text>
              <text x="304" y="105" fill="#FECDD3" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">N. Patel &amp; S. Huang</text>

              <rect x="298" y="117" width="208" height="26" rx="3" fill="#380F16" stroke="#F43F5E" strokeWidth="1.2" />
              <text x="304" y="127" fill="#FCA5A5" fontSize="4.5" fontFamily="monospace">JOURNAL MISMATCH:</text>
              <text x="304" y="137" fill="#FECDD3" fontSize="6" fontFamily="serif" fontStyle="italic">Journal of Computational Networks (2023)</text>

              {/* Mismatch Warning Banner */}
              <rect x="298" y="150" width="208" height="28" rx="3" fill="#F43F5E" />
              <text x="402" y="163" fill="#050807" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CONFLICTING METADATA</text>
              <text x="402" y="172" fill="#050807" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Supplied ID belongs to another publication.</text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              A registry lookup reveals conflicting title, authors, and journal for identifier <span className="font-mono text-rose-400 font-bold">DOI-042</span>.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 05 — FORENSIC VERDICT (Stamp & Key Lesson)                  */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 5 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Fractured Paper Canvas */}
              <rect x="70" y="15" width="400" height="205" rx="5" fill="#0C100D" stroke="#F43F5E" strokeWidth="2.8" />
              
              {/* Paper Details */}
              <text x="95" y="48" fill="#87968D" fontSize="7" fontFamily="monospace">CLAIMED SPECIMEN // DOI-042</text>
              <text x="95" y="72" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="serif">Adaptive Graph Pruning for Latent Knowledge Graphs</text>
              <text x="95" y="90" fill="#D1DDD5" fontSize="7.5" fontFamily="sans-serif">Authors: E. R. Vance &amp; K. Rostova • Int. J. Neural Synthetics (2024)</text>

              {/* Visual Conflict Separator Line */}
              <line x1="95" y1="108" x2="445" y2="108" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.6" />

              {/* Three Clean Visual Indicator Pills */}
              <g transform="translate(95, 120)">
                <rect x="0" y="0" width="105" height="22" rx="4" fill="#240D11" stroke="#F43F5E" strokeWidth="1.2" />
                <circle cx="12" cy="11" r="3.5" fill="#F43F5E" />
                <text x="24" y="15" fill="#FECDD3" fontSize="6.5" fontWeight="bold" fontFamily="monospace">ID CLASH</text>
              </g>

              <g transform="translate(215, 120)">
                <rect x="0" y="0" width="115" height="22" rx="4" fill="#240D11" stroke="#F43F5E" strokeWidth="1.2" />
                <circle cx="12" cy="11" r="3.5" fill="#F43F5E" />
                <text x="24" y="15" fill="#FECDD3" fontSize="6.5" fontWeight="bold" fontFamily="monospace">ISSUE ABSENCE</text>
              </g>

              <g transform="translate(345, 120)">
                <rect x="0" y="0" width="100" height="22" rx="4" fill="#240D11" stroke="#F43F5E" strokeWidth="1.2" />
                <circle cx="12" cy="11" r="3.5" fill="#F43F5E" />
                <text x="24" y="15" fill="#FECDD3" fontSize="6.5" fontWeight="bold" fontFamily="monospace">UNVERIFIED</text>
              </g>

              {/* Bold Red Forensic Stamp Clamped across paper */}
              <g transform="rotate(-6 270 172)">
                <rect x="110" y="152" width="320" height="42" rx="5" fill="#F43F5E" fillOpacity="0.22" stroke="#F43F5E" strokeWidth="3.5" />
                <text x="270" y="180" fill="#F43F5E" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace" letterSpacing="3">
                  REFERENCE NOT VERIFIED
                </text>
              </g>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              Looking academic does not make a source real. Independent verification of original scholarship is mandatory.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
