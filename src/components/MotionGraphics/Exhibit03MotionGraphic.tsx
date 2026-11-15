import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Exhibit03MotionGraphicProps {
  onStageChange?: (stage: number) => void;
}

export const Exhibit03MotionGraphic: React.FC<Exhibit03MotionGraphicProps> = ({
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
  const STEP_DURATION_MS = 4000; // 4.0s per scene for optimal comprehension

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

  const togglePlay = () => {
    if (isPlaying) {
      isManuallyPausedRef.current = true;
      setIsPlaying(false);
    } else {
      isManuallyPausedRef.current = false;
      wasAutoPausedRef.current = false;
      if (currentStep === TOTAL_STEPS) {
        setCurrentStep(1);
        onStageChange?.(1);
      }
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    setCurrentStep(1);
    onStageChange?.(1);
    isManuallyPausedRef.current = false;
    wasAutoPausedRef.current = false;
    setIsPlaying(true);
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    onStageChange?.(step);
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
      {/* 1. CINEMA HEADER BAR                                                */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-white/10 relative z-10">
        
        {/* Left: Clean Header Title */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00FF88] flex-shrink-0" />
          <span className="font-display font-bold text-sm sm:text-base text-[#E4F0E8]">
            The Life Cycle of an AI Detection Flag // Five-Stage Breakdown
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
      <div className="w-full bg-[#070D09] border border-[#00FF88]/20 rounded-xl p-4 sm:p-6 min-h-[380px] sm:min-h-[440px] flex flex-col justify-center items-center relative overflow-hidden">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-3xl pointer-events-none" />

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 01 — THE SUBMISSION                                         */}
        {/* Student at laptop submits essay; document glides into portal       */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="w-full max-w-3xl flex flex-col items-center animate-fadeIn">
            <svg
              viewBox="0 0 760 270"
              className="w-full h-auto max-h-[270px] drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
              aria-label="Student submitting academic essay into university gateway"
            >
              {/* Workspace Floor / Horizon */}
              <line x1="40" y1="230" x2="720" y2="230" stroke="#00FF88" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="6 4" />

              {/* Student Desk & Laptop Area (Left Side) */}
              <g transform="translate(60, 50)">
                {/* Desk Lamp Glow */}
                <circle cx="60" cy="40" r="45" fill="#00FF88" fillOpacity="0.08" />
                <path d="M 60 10 L 60 50 L 40 70" stroke="#00FF88" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <polygon points="45,45 75,45 68,60 52,60" fill="#00FF88" fillOpacity="0.4" />

                {/* Student Silhouette */}
                <ellipse cx="140" cy="70" rx="16" ry="18" fill="#1C382A" stroke="#00FF88" strokeWidth="1.5" />
                <path d="M 115 140 C 115 100, 165 100, 165 140 Z" fill="#132B1E" stroke="#00FF88" strokeWidth="1.5" />
                {/* Arms typing */}
                <path d="M 125 110 L 160 128 L 175 125" stroke="#00FF88" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Laptop on Desk */}
                <rect x="165" y="105" width="55" height="38" rx="3" fill="#0A1E14" stroke="#00FF88" strokeWidth="1.5" />
                <rect x="170" y="110" width="45" height="28" rx="2" fill="#00FF88" fillOpacity="0.15" />
                <line x1="174" y1="116" x2="198" y2="116" stroke="#00FF88" strokeWidth="1.5" />
                <line x1="174" y1="121" x2="208" y2="121" stroke="#00FF88" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="174" y1="126" x2="192" y2="126" stroke="#00FF88" strokeWidth="1.2" strokeOpacity="0.7" />
                {/* Laptop base */}
                <polygon points="158,143 227,143 222,148 163,148" fill="#132B1E" stroke="#00FF88" strokeWidth="1.5" />

                {/* Animated Uplink Waves from Student's Laptop */}
                <circle cx="215" cy="118" r="8" stroke="#00FF88" strokeWidth="1.5" fill="none" opacity="0.8">
                  <animate attributeName="r" values="6;22" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* In-Flight Essay Document (Center Transition) */}
              <g transform="translate(320, 65)">
                {/* Motion Trails */}
                <line x1="-30" y1="50" x2="-5" y2="50" stroke="#00FF88" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.6">
                  <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.8s" repeatCount="indefinite" />
                </line>
                <line x1="-40" y1="75" x2="-10" y2="75" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4">
                  <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.8s" repeatCount="indefinite" />
                </line>

                {/* Document Card */}
                <rect x="0" y="0" width="115" height="145" rx="6" fill="#0C1F16" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 0 16px rgba(0,255,136,0.3))">
                  <animate attributeName="y" values="0;-4;0" dur="2.4s" repeatCount="indefinite" />
                </rect>
                {/* Folded corner */}
                <polygon points="90,0 115,25 90,25" fill="#19422F" stroke="#00FF88" strokeWidth="1.5" />
                {/* Document Header */}
                <rect x="14" y="16" width="60" height="7" rx="2" fill="#00FF88" />
                <rect x="14" y="32" width="85" height="4" rx="1.5" fill="#00FF88" fillOpacity="0.5" />
                <rect x="14" y="42" width="80" height="4" rx="1.5" fill="#00FF88" fillOpacity="0.5" />
                <rect x="14" y="52" width="72" height="4" rx="1.5" fill="#00FF88" fillOpacity="0.5" />
                <rect x="14" y="62" width="85" height="4" rx="1.5" fill="#00FF88" fillOpacity="0.5" />
                <rect x="14" y="72" width="65" height="4" rx="1.5" fill="#00FF88" fillOpacity="0.5" />
                {/* Submission Badge */}
                <rect x="14" y="94" width="86" height="24" rx="4" fill="#00FF88" fillOpacity="0.15" stroke="#00FF88" strokeWidth="1" />
                <text x="57" y="110" fill="#00FF88" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  SUBMITTED ✓
                </text>
              </g>

              {/* University Evaluation Portal (Right Side) */}
              <g transform="translate(510, 45)">
                {/* Gateway Tower Frame */}
                <rect x="0" y="0" width="180" height="175" rx="10" fill="#071710" stroke="#00FF88" strokeWidth="2" strokeDasharray="8 4" />
                <rect x="10" y="10" width="160" height="28" rx="5" fill="#0E281C" stroke="#00FF88" strokeWidth="1" />
                <text x="90" y="28" fill="#00FF88" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                  INSTITUTIONAL GATEWAY
                </text>

                {/* Queue Intake Slot */}
                <rect x="20" y="52" width="140" height="45" rx="4" fill="#040D08" stroke="#00FF88" strokeWidth="1.5" />
                <text x="32" y="72" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  CS-402: Term Paper
                </text>
                <text x="32" y="87" fill="#00FF88" fontSize="9" fontFamily="monospace">
                  STATUS: INTAKE QUEUE #42
                </text>

                {/* Receiving Instructor Visual */}
                <circle cx="40" cy="130" r="14" fill="#153625" stroke="#00FF88" strokeWidth="1.5" />
                <path d="M 22 165 C 22 145, 58 145, 58 165 Z" fill="#0F241A" stroke="#00FF88" strokeWidth="1.5" />
                {/* Status indicator */}
                <rect x="68" y="125" width="92" height="24" rx="4" fill="#00FF88" fillOpacity="0.15" stroke="#00FF88" strokeWidth="1" />
                <text x="114" y="141" fill="#00FF88" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  AWAITING REVIEW
                </text>
              </g>
            </svg>
            <p className="mt-4 text-center font-body text-sm sm:text-base text-[#C2D8C9] max-w-xl">
              <strong className="text-[#00FF88]">Scene 01 // The Submission:</strong> A student submits their research paper through the institutional portal. The document enters the assessment queue for evaluation.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 02 — THE SCANNER                                            */}
        {/* Automated scanner fires beam over essay, measuring entropy waves   */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="w-full max-w-3xl flex flex-col items-center animate-fadeIn">
            <svg
              viewBox="0 0 760 270"
              className="w-full h-auto max-h-[270px] drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
              aria-label="Automated AI detection scanner measuring statistical perplexity"
            >
              {/* Central Inspection Console Frame */}
              <rect x="40" y="20" width="680" height="230" rx="12" fill="#06120B" stroke="#00FF88" strokeWidth="2" />
              
              {/* Console Top Header */}
              <rect x="40" y="20" width="680" height="36" rx="12" fill="#0B2115" />
              <circle cx="65" cy="38" r="5" fill="#FF5555" />
              <circle cx="82" cy="38" r="5" fill="#FFB800" />
              <circle cx="99" cy="38" r="5" fill="#00FF88" />
              <text x="120" y="42" fill="#00FF88" fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                STATISTICAL INFERENCE ENGINE // N-GRAM PREDICTABILITY SCANNER
              </text>
              <rect x="580" y="28" width="125" height="20" rx="4" fill="#00FF88" fillOpacity="0.2" stroke="#00FF88" strokeWidth="1" />
              <text x="642" y="42" fill="#00FF88" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                LIVE TELEMETRY
              </text>

              {/* Left Column: Essay Document with Moving Laser Beam */}
              <g transform="translate(70, 70)">
                <rect x="0" y="0" width="220" height="160" rx="6" fill="#081810" stroke="#00FF88" strokeWidth="1.5" />
                
                {/* Paragraph Mock Lines */}
                {[15, 27, 39, 51, 63, 75, 87, 99, 111, 123, 135].map((y, idx) => (
                  <g key={idx}>
                    <line
                      x1="18"
                      y1={y}
                      x2={idx % 3 === 0 ? 180 : idx % 2 === 0 ? 195 : 165}
                      y2={y}
                      stroke={idx >= 3 && idx <= 6 ? '#FFB800' : '#00FF88'}
                      strokeWidth="2.5"
                      strokeOpacity={idx >= 3 && idx <= 6 ? 0.85 : 0.5}
                    />
                  </g>
                ))}

                {/* Animated Horizontal Laser Scanning Beam */}
                <line x1="0" y1="60" x2="220" y2="60" stroke="#00FF88" strokeWidth="3" filter="drop-shadow(0 0 8px #00FF88)">
                  <animate attributeName="y1" values="10;145;10" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="10;145;10" dur="2.5s" repeatCount="indefinite" />
                </line>
                {/* Glow bar */}
                <rect x="0" y="55" width="220" height="10" fill="#00FF88" fillOpacity="0.15">
                  <animate attributeName="y" values="5;140;5" dur="2.5s" repeatCount="indefinite" />
                </rect>
              </g>

              {/* Right Column: Statistical Waves & Distribution Curves */}
              <g transform="translate(325, 70)">
                {/* Graph Frame */}
                <rect x="0" y="0" width="365" height="160" rx="8" fill="#040D07" stroke="#00FF88" strokeWidth="1.2" />
                
                {/* Header inside graph */}
                <text x="20" y="24" fill="#00FF88" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                  PERPLEXITY & BURSTINESS PROFILE
                </text>
                <text x="20" y="40" fill="#87968D" fontSize="9" fontFamily="sans-serif">
                  Comparing sentence length variation & vocabulary distribution
                </text>

                {/* Perplexity Wave Grid */}
                <line x1="20" y1="125" x2="345" y2="125" stroke="#00FF88" strokeOpacity="0.3" strokeWidth="1" />
                <line x1="20" y1="55" x2="20" y2="125" stroke="#00FF88" strokeOpacity="0.3" strokeWidth="1" />

                {/* Dynamic Sine-like Wave: Smooth vs Burst */}
                <path
                  d="M 20 95 Q 60 65, 100 95 T 180 95 T 260 95 T 340 95"
                  fill="none"
                  stroke="#00FF88"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Comparison Curve: Uniform/Predictable Phrase Distribution */}
                <path
                  d="M 20 115 C 80 110, 140 70, 200 70 C 260 70, 300 110, 345 115"
                  fill="none"
                  stroke="#FFB800"
                  strokeWidth="2"
                />

                {/* Metrics Pill Indicators */}
                <rect x="20" y="133" width="95" height="18" rx="3" fill="#00FF88" fillOpacity="0.12" stroke="#00FF88" strokeWidth="0.8" />
                <text x="67" y="146" fill="#00FF88" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                  BURSTINESS: LOW
                </text>

                <rect x="125" y="133" width="105" height="18" rx="3" fill="#FFB800" fillOpacity="0.12" stroke="#FFB800" strokeWidth="0.8" />
                <text x="177" y="146" fill="#FFB800" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                  ENTROPY: UNIFORM
                </text>

                <rect x="240" y="133" width="105" height="18" rx="3" fill="#00FF88" fillOpacity="0.12" stroke="#00FF88" strokeWidth="0.8" />
                <text x="292" y="146" fill="#00FF88" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                  SAMPLE SIZE: 1.8K
                </text>
              </g>
            </svg>
            <p className="mt-4 text-center font-body text-sm sm:text-base text-[#C2D8C9] max-w-xl">
              <strong className="text-[#00FF88]">Scene 02 // The Scanner:</strong> The essay enters an automated detector. The scanner computes statistical metrics—measuring sentence uniformity and word predictability against language models.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 03 — THE 88% FLAG                                           */}
        {/* Large "88% AI-GENERATED" score flashes, triggering a review flag  */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="w-full max-w-3xl flex flex-col items-center animate-fadeIn">
            <svg
              viewBox="0 0 760 270"
              className="w-full h-auto max-h-[270px] drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
              aria-label="Detector produces 88 percent AI-Generated score and highlights document for review"
            >
              {/* Caution Glow Aura */}
              <circle cx="380" cy="135" r="160" fill="#FFB800" fillOpacity="0.06" filter="blur(20px)" />

              {/* Central Alert Dossier Panel */}
              <rect x="90" y="25" width="580" height="220" rx="12" fill="#0B130E" stroke="#FFB800" strokeWidth="2.5" />

              {/* Diagonal Warning Stripes on Top Edge */}
              <g opacity="0.25">
                {[110, 150, 190, 230, 270, 310, 350, 390, 430, 470, 510, 550, 590, 630].map((x) => (
                  <line key={x} x1={x} y1="25" x2={x + 15} y2="40" stroke="#FFB800" strokeWidth="3" />
                ))}
              </g>

              {/* Status Header Badge */}
              <rect x="230" y="42" width="300" height="26" rx="13" fill="#1A1808" stroke="#FFB800" strokeWidth="1.5" />
              <text x="380" y="59" fill="#FFB800" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
                ⚠ STATISTICAL ANOMALY DETECTED
              </text>

              {/* Prominent "88% AI-GENERATED" Score Box */}
              <g transform="translate(140, 80)">
                <rect x="0" y="0" width="220" height="135" rx="8" fill="#140D04" stroke="#FFB800" strokeWidth="2" filter="drop-shadow(0 0 16px rgba(255,184,0,0.25))" />
                <text x="110" y="32" fill="#FFD066" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                  PROBABILITY ESTIMATE
                </text>
                <text x="110" y="85" fill="#FFAA00" fontSize="48" fontFamily="var(--font-display)" fontWeight="900" textAnchor="middle">
                  88%
                </text>
                <text x="110" y="112" fill="#FFB800" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">
                  AI-GENERATED
                </text>
              </g>

              {/* Right Side: Clarification & Review Flag (Tension without guilt) */}
              <g transform="translate(390, 85)">
                {/* Review Flag Badge */}
                <rect x="0" y="0" width="240" height="38" rx="6" fill="#1C180A" stroke="#FFB800" strokeWidth="1.5" />
                <circle cx="20" cy="19" r="7" fill="#FFB800" />
                <text x="20" y="23" fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle">!</text>
                <text x="38" y="24" fill="#FFD066" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  FLAGGED FOR INSTRUCTOR REVIEW
                </text>

                {/* Important Context Card */}
                <rect x="0" y="50" width="240" height="85" rx="6" fill="#08140D" stroke="#00FF88" strokeWidth="1" />
                <text x="14" y="70" fill="#00FF88" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                  EVIDENTIARY STATUS:
                </text>
                <text x="14" y="90" fill="#E4F0E8" fontSize="11" fontFamily="sans-serif">
                  • Signal: Statistical resemblance
                </text>
                <text x="14" y="108" fill="#E4F0E8" fontSize="11" fontFamily="sans-serif">
                  • Authorship: UNVERIFIED
                </text>
                <text x="14" y="124" fill="#FFB800" fontSize="9.5" fontFamily="monospace">
                  → Requires contextual investigation
                </text>
              </g>
            </svg>
            <p className="mt-4 text-center font-body text-sm sm:text-base text-[#C2D8C9] max-w-xl">
              <strong className="text-[#FFB800]">Scene 03 // The 88% Flag:</strong> The detector flags the essay with an 88% probability estimate. This is an illustrative statistical signal that raises a question—not proof of academic dishonesty.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 04 — LOOK BEYOND THE SCORE                                  */}
        {/* Drafts, changelogs, research notes, and source trails surround it */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 4 && (
          <div className="w-full max-w-3xl flex flex-col items-center animate-fadeIn">
            <svg
              viewBox="0 0 760 270"
              className="w-full h-auto max-h-[270px] drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
              aria-label="Instructor examines draft history, research notes, and source trails"
            >
              {/* Central Primary Essay (Scaled back to make room for surrounding context) */}
              <g transform="translate(300, 45)">
                <rect x="0" y="0" width="160" height="185" rx="8" fill="#081810" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 0 16px rgba(0,255,136,0.3))" />
                <rect x="16" y="18" width="80" height="8" rx="2" fill="#00FF88" />
                <line x1="16" y1="36" x2="144" y2="36" stroke="#00FF88" strokeOpacity="0.4" strokeWidth="2" />
                <line x1="16" y1="46" x2="130" y2="46" stroke="#00FF88" strokeOpacity="0.4" strokeWidth="2" />
                <line x1="16" y1="56" x2="140" y2="56" stroke="#00FF88" strokeOpacity="0.4" strokeWidth="2" />
                <line x1="16" y1="66" x2="115" y2="66" stroke="#00FF88" strokeOpacity="0.4" strokeWidth="2" />
                
                {/* 88% detector badge on essay */}
                <rect x="16" y="90" width="128" height="28" rx="4" fill="#1C180A" stroke="#FFB800" strokeWidth="1" />
                <text x="80" y="108" fill="#FFB800" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  FLAG: 88% (SIGNAL)
                </text>

                {/* Connecting lines radiating out to evidence items */}
                <line x1="0" y1="50" x2="-60" y2="35" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="-60" y2="150" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="160" y1="50" x2="220" y2="35" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="160" y1="130" x2="220" y2="150" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>

              {/* Evidence Item 1: Earlier Drafts & History (Top Left) */}
              <g transform="translate(60, 25)">
                <rect x="0" y="0" width="175" height="85" rx="6" fill="#0A2216" stroke="#00FF88" strokeWidth="1.5" />
                <text x="14" y="24" fill="#00FF88" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                  📄 REVISION TIMELINE
                </text>
                <text x="14" y="44" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • Draft 1 (Oct 12): Outline & thesis
                </text>
                <text x="14" y="60" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • Draft 2 (Oct 18): 14 edits
                </text>
                <text x="14" y="74" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • Draft 3 (Oct 24): Citations
                </text>
              </g>

              {/* Evidence Item 2: Handwritten Research Notes (Bottom Left) */}
              <g transform="translate(60, 140)">
                <rect x="0" y="0" width="175" height="90" rx="6" fill="#0A2216" stroke="#00FF88" strokeWidth="1.5" />
                <text x="14" y="24" fill="#00FF88" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                  📓 RESEARCH JOURNAL
                </text>
                <text x="14" y="44" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • Scanned lab notebook
                </text>
                <text x="14" y="60" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • Reading notes from IEEE
                </text>
                <text x="14" y="76" fill="#00FF88" fontSize="9.5" fontFamily="monospace">
                  ✓ Matches methodology
                </text>
              </g>

              {/* Evidence Item 3: Source Trail & Library Borrowing (Top Right) */}
              <g transform="translate(525, 25)">
                <rect x="0" y="0" width="175" height="85" rx="6" fill="#0A2216" stroke="#00FF88" strokeWidth="1.5" />
                <text x="14" y="24" fill="#00FF88" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                  📚 VERIFIED SOURCES
                </text>
                <text x="14" y="44" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • 6 Peer-reviewed papers
                </text>
                <text x="14" y="60" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • Library loan checkout logs
                </text>
                <text x="14" y="74" fill="#00FF88" fontSize="9.5" fontFamily="monospace">
                  ✓ Authentic bibliography
                </text>
              </g>

              {/* Evidence Item 4: Student Reasoning Explanation (Bottom Right) */}
              <g transform="translate(525, 140)">
                <rect x="0" y="0" width="175" height="90" rx="6" fill="#0A2216" stroke="#00FF88" strokeWidth="1.5" />
                <text x="14" y="24" fill="#00FF88" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                  🗣 STUDENT DIALOGUE
                </text>
                <text x="14" y="44" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • Can explain core thesis
                </text>
                <text x="14" y="60" fill="#E4F0E8" fontSize="10" fontFamily="sans-serif">
                  • Explains formal word choices
                </text>
                <text x="14" y="76" fill="#00FF88" fontSize="9.5" fontFamily="monospace">
                  ✓ Articulates derivation
                </text>
              </g>
            </svg>
            <p className="mt-4 text-center font-body text-sm sm:text-base text-[#C2D8C9] max-w-xl">
              <strong className="text-[#00FF88]">Scene 04 // Look Beyond the Score:</strong> The faculty member examines context: developmental drafts, version timestamps, research notebooks, and verified sources. The detector provides one signal; the surrounding evidence provides context.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 05 — A FAIR ASSESSMENT                                      */}
        {/* Collaborative desk dialogue, balanced deliberation, conclusive takeaway */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 5 && (
          <div className="w-full max-w-3xl flex flex-col items-center animate-fadeIn">
            <svg
              viewBox="0 0 760 270"
              className="w-full h-auto max-h-[270px] drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
              aria-label="Faculty and student review evidence together in private dialogue leading to fair assessment"
            >
              {/* Meeting Room Horizon / Desk Surface */}
              <rect x="50" y="170" width="660" height="65" rx="8" fill="#071710" stroke="#00FF88" strokeWidth="2" />

              {/* Faculty Member (Left) */}
              <g transform="translate(130, 70)">
                <ellipse cx="40" cy="35" rx="18" ry="20" fill="#153625" stroke="#00FF88" strokeWidth="1.5" />
                <path d="M 12 105 C 12 65, 68 65, 68 105 Z" fill="#0D2419" stroke="#00FF88" strokeWidth="1.5" />
                <text x="40" y="125" fill="#00FF88" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  FACULTY EVALUATOR
                </text>
              </g>

              {/* Dialogue & Review Table Center (Documents & Shared Screen) */}
              <g transform="translate(290, 85)">
                {/* Center Shared Evidence Console */}
                <rect x="0" y="0" width="180" height="95" rx="6" fill="#040D07" stroke="#00FF88" strokeWidth="1.5" />
                <text x="90" y="24" fill="#00FF88" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  EVIDENCE-BASED INQUIRY
                </text>
                
                {/* 4 Assessment Checks */}
                <g transform="translate(16, 36)">
                  <text x="0" y="10" fill="#00FF88" fontSize="9" fontFamily="monospace">✓ Detector Signal Analyzed</text>
                  <text x="0" y="24" fill="#00FF88" fontSize="9" fontFamily="monospace">✓ Drafts & Timestamps Verified</text>
                  <text x="0" y="38" fill="#00FF88" fontSize="9" fontFamily="monospace">✓ Student Reasoning Articulated</text>
                  <text x="0" y="52" fill="#00FF88" fontSize="9" fontFamily="monospace">✓ Policy Applied Fairly</text>
                </g>
              </g>

              {/* Student (Right) */}
              <g transform="translate(550, 70)">
                <ellipse cx="40" cy="35" rx="18" ry="20" fill="#1C382A" stroke="#00FF88" strokeWidth="1.5" />
                <path d="M 12 105 C 12 65, 68 65, 68 105 Z" fill="#122A1E" stroke="#00FF88" strokeWidth="1.5" />
                <text x="40" y="125" fill="#00FF88" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  STUDENT AUTHOR
                </text>
              </g>

              {/* Floating Verdict Banner */}
              <g transform="translate(180, 20)">
                <rect x="0" y="0" width="400" height="34" rx="17" fill="#031A0F" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 0 16px rgba(0,255,136,0.3))" />
                <text x="200" y="22" fill="#00FF88" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                  FAIR ASSESSMENT // EVIDENCE-BASED RESOLUTION
                </text>
              </g>
            </svg>
            <p className="mt-4 text-center font-body text-sm sm:text-base text-[#C2D8C9] max-w-xl">
              <strong className="text-[#00FF88]">Scene 05 // A Fair Assessment:</strong> In a private, respectful dialogue, faculty and student review the evidence together. Academic decisions rest on verifiable facts, due process, and human judgment.
            </p>
          </div>
        )}

      </div>

      {/* =================================================================== */}
      {/* 3. BOTTOM CINEMA PROGRESS BAR                                       */}
      {/* =================================================================== */}
      <div className="w-full mt-4 flex items-center justify-between text-xs text-[#87968D] font-mono">
        <span>SCENE 0{currentStep} // 05</span>
        <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00FF88] transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <span>{isPlaying ? 'PLAYING...' : 'PAUSED'}</span>
      </div>

    </div>
  );
};
