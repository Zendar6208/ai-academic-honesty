import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface Exhibit04MotionGraphicProps {
  onStageChange?: (stage: number) => void;
}

export const Exhibit04MotionGraphic: React.FC<Exhibit04MotionGraphicProps> = ({
  onStageChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAlignedRef = useRef<boolean>(false);
  const isManuallyPausedRef = useRef<boolean>(false);
  const wasAutoPausedRef = useRef<boolean>(false);

  const TOTAL_STEPS = 7;
  const STEP_DURATION_MS = 3800; // 3.8s per scene for deliberate storytelling

  const sceneTitles = [
    { num: 1, label: 'ASSIGNMENT', sub: 'Brief arrives' },
    { num: 2, label: 'UNDERSTANDING', sub: 'Requirements to plan' },
    { num: 3, label: 'AI ASSISTANCE', sub: 'Tutor, not substitute' },
    { num: 4, label: 'VERIFICATION', sub: 'Vetting sources' },
    { num: 5, label: 'ORIGINAL WORK', sub: 'Authentic writing' },
    { num: 6, label: 'REVIEW', sub: 'Polishing & clarity' },
    { num: 7, label: 'DISCLOSURE', sub: 'Ownership declared' },
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
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#00FF88] flex-shrink-0" />
          <span className="font-display font-bold text-sm sm:text-base text-[#E4F0E8] tracking-wide">
            THE RESPONSIBLE WORKFLOW // 7-STAGE CINEMATIC ARCHITECTURE
          </span>
        </div>

        <div className="flex items-center gap-2">
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
      {/* 2. INTERACTIVE 7-STAGE TIMELINE TRACKER                             */}
      {/* =================================================================== */}
      <div className="grid grid-cols-2 xs:grid-cols-4 lg:grid-cols-7 gap-2 mb-6 relative z-10">
        {sceneTitles.map((scene) => {
          const isActive = currentStep === scene.num;
          const isPast = currentStep > scene.num;

          return (
            <button
              key={scene.num}
              type="button"
              onClick={() => handleStepClick(scene.num)}
              className={`py-2 px-2 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
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
                  0{scene.num}
                </span>
                {isActive && <Sparkles size={10} className="text-[#00FF88] animate-pulse" />}
              </div>
              <div className="font-display font-bold text-[11px] sm:text-xs text-[#E4F0E8] truncate">
                {scene.label}
              </div>
              <div className="font-mono text-[9px] text-[#87968D] truncate hidden sm:block">
                {scene.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 3. CINEMATIC ILLUSTRATED ANIMATION STAGE (Large Dominant Canvas)    */}
      {/* =================================================================== */}
      <div className="w-full bg-[#070D09] border border-[#00FF88]/25 rounded-xl p-5 sm:p-8 min-h-[460px] sm:min-h-[520px] flex flex-col justify-center items-center relative overflow-hidden">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-3xl pointer-events-none" />

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 01 — ASSIGNMENT ARRIVES                                     */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Workspace Grid Base */}
              <rect x="20" y="195" width="500" height="12" rx="3" fill="#141F18" stroke="#25382B" strokeWidth="1.2" />
              
              {/* Document unfolds into workspace */}
              <rect x="110" y="20" width="320" height="185" rx="5" fill="#0A140F" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 16px 32px rgba(0,255,136,0.18))" />
              
              {/* Header Bar */}
              <rect x="111" y="21" width="318" height="28" rx="4" fill="#0F2417" />
              <circle cx="130" cy="35" r="5" fill="#00FF88" />
              <text x="145" y="38" fill="#E4F0E8" fontSize="8" fontWeight="bold" fontFamily="monospace">COURSE BRIEF // TERM INQUIRY 2026</text>

              {/* Title Materializing */}
              <text x="135" y="70" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="serif">
                Comparative Ethical Frameworks in AI Systems
              </text>
              <line x1="135" y1="78" x2="405" y2="78" stroke="#2B4234" strokeWidth="1.2" />

              {/* Progressive Requirement Bullet Points */}
              <g transform="translate(135, 92)">
                <circle cx="5" cy="5" r="3" fill="#00FF88" />
                <text x="16" y="8" fill="#E4F0E8" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                  1. Formulate an authentic thesis and critical evaluation
                </text>
              </g>

              <g transform="translate(135, 114)">
                <circle cx="5" cy="5" r="3" fill="#00FF88" />
                <text x="16" y="8" fill="#E4F0E8" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                  2. Cross-reference all citations against primary literature
                </text>
              </g>

              <g transform="translate(135, 136)">
                <circle cx="5" cy="5" r="3" fill="#00FF88" />
                <text x="16" y="8" fill="#E4F0E8" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                  3. Transparently disclose AI brainstorming or assistance
                </text>
              </g>

              {/* Status Badge */}
              <rect x="135" y="162" width="160" height="22" rx="3" fill="#132B1E" stroke="#00FF88" strokeWidth="1" />
              <text x="145" y="176" fill="#00FF88" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
                STATUS: ASSIGNMENT RECEIVED
              </text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              The academic assignment arrives. The student establishes an intentional digital workspace and reviews the foundational requirements.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 02 — UNDERSTANDING (Requirements into Plan)                  */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Left Side: Requirements Source */}
              <rect x="30" y="30" width="170" height="175" rx="5" fill="#09140E" stroke="#2A3D32" strokeWidth="1.5" />
              <rect x="31" y="31" width="168" height="24" rx="4" fill="#0E1D15" />
              <text x="40" y="46" fill="#00FF88" fontSize="6" fontFamily="monospace" fontWeight="bold">REQUIREMENTS</text>
              
              <rect x="40" y="65" width="150" height="30" rx="3" fill="#13281C" stroke="#00FF88" strokeWidth="1" />
              <text x="46" y="77" fill="#E4F0E8" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">Thesis &amp; Scope</text>
              <text x="46" y="87" fill="#87968D" fontSize="5" fontFamily="sans-serif">Define research question</text>

              <rect x="40" y="105" width="150" height="30" rx="3" fill="#13281C" stroke="#00FF88" strokeWidth="1" />
              <text x="46" y="117" fill="#E4F0E8" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">Source Evidence</text>
              <text x="46" y="127" fill="#87968D" fontSize="5" fontFamily="sans-serif">Verified primary papers</text>

              <rect x="40" y="145" width="150" height="30" rx="3" fill="#13281C" stroke="#00FF88" strokeWidth="1" />
              <text x="46" y="157" fill="#E4F0E8" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">Synthesis &amp; Ownership</text>
              <text x="46" y="167" fill="#87968D" fontSize="5" fontFamily="sans-serif">Original analysis</text>

              {/* Dynamic Connection Lines Pulsing to Center */}
              <path d="M 190 80 Q 235 80 270 95" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeDasharray="5 3" />
              <path d="M 190 120 L 270 120" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeDasharray="5 3" />
              <path d="M 190 160 Q 235 160 270 145" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeDasharray="5 3" />

              {/* Right Side: Structured Workflow Plan */}
              <rect x="270" y="30" width="240" height="175" rx="5" fill="#08140E" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 12px 24px rgba(0,255,136,0.15))" />
              <rect x="271" y="31" width="238" height="24" rx="4" fill="#0F2417" />
              <text x="282" y="46" fill="#00FF88" fontSize="6.5" fontFamily="monospace" fontWeight="bold">OPERATIONAL PLAN // MILESTONES</text>

              {/* 3 Step Plan */}
              <g transform="translate(282, 65)">
                <rect x="0" y="0" width="216" height="32" rx="3" fill="#112217" stroke="#2C4535" strokeWidth="1" />
                <circle cx="15" cy="16" r="8" fill="#00FF88" />
                <text x="15" y="19" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">1</text>
                <text x="32" y="14" fill="#E4F0E8" fontSize="6" fontWeight="bold" fontFamily="sans-serif">EXPLORE CONCEPTS (AI AS TUTOR)</text>
                <text x="32" y="24" fill="#87968D" fontSize="5" fontFamily="sans-serif">Clarify ideas, brainstorm perspectives</text>
              </g>

              <g transform="translate(282, 105)">
                <rect x="0" y="0" width="216" height="32" rx="3" fill="#112217" stroke="#2C4535" strokeWidth="1" />
                <circle cx="15" cy="16" r="8" fill="#00FF88" />
                <text x="15" y="19" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">2</text>
                <text x="32" y="14" fill="#E4F0E8" fontSize="6" fontWeight="bold" fontFamily="sans-serif">VERIFY SOURCES INDEPENDENTLY</text>
                <text x="32" y="24" fill="#87968D" fontSize="5" fontFamily="sans-serif">Never trust unverified citations</text>
              </g>

              <g transform="translate(282, 145)">
                <rect x="0" y="0" width="216" height="32" rx="3" fill="#112217" stroke="#2C4535" strokeWidth="1" />
                <circle cx="15" cy="16" r="8" fill="#00FF88" />
                <text x="15" y="19" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">3</text>
                <text x="32" y="14" fill="#E4F0E8" fontSize="6" fontWeight="bold" fontFamily="sans-serif">WRITE ORIGINAL SCHOLARSHIP</text>
                <text x="32" y="24" fill="#87968D" fontSize="5" fontFamily="sans-serif">Own the prose, critique, and conclusion</text>
              </g>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              The student digests the assignment rules, mapping instructions into a disciplined, multi-stage roadmap before opening any AI tools.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 03 — AI ASSISTANCE (Tutor, not Substitute)                   */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* AI Chat Sandbox Screen */}
              <rect x="50" y="20" width="440" height="195" rx="6" fill="#08120D" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 14px 28px rgba(0,255,136,0.16))" />
              
              {/* Header */}
              <rect x="51" y="21" width="438" height="26" rx="5" fill="#0F2417" />
              <circle cx="70" cy="34" r="5" fill="#00FF88" />
              <text x="82" y="37" fill="#00FF88" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                CONCEPTUAL TUTOR // EXPLORATION MODE (NOT TEXT GENERATION)
              </text>

              {/* Student Query Bubble */}
              <g transform="translate(70, 56)">
                <rect x="0" y="0" width="400" height="34" rx="4" fill="#12251A" stroke="#00FF88" strokeWidth="1" />
                <text x="12" y="14" fill="#00FF88" fontSize="5.5" fontFamily="monospace" fontWeight="bold">STUDENT INQUIRY:</text>
                <text x="12" y="25" fill="#FFFFFF" fontSize="6.5" fontFamily="sans-serif">
                  "Can you explain how algorithmic bias propagates in latent representation models?"
                </text>
              </g>

              {/* AI Structured Tutor Response */}
              <g transform="translate(70, 98)">
                <rect x="0" y="0" width="400" height="80" rx="4" fill="#0A1810" stroke="#253D2E" strokeWidth="1" />
                <text x="12" y="14" fill="#87968D" fontSize="5.5" fontFamily="monospace">TUTOR EXPLANATION // PROGRESSIVE BREAKDOWN:</text>
                
                {/* Concept 1 */}
                <circle cx="16" cy="27" r="3" fill="#00FF88" />
                <text x="25" y="30" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  1. <tspan fontWeight="bold" fill="#00FF88">Data Skew:</tspan> Historical disparities in training corpora create disproportionate feature weighting.
                </text>

                {/* Concept 2 */}
                <circle cx="16" cy="45" r="3" fill="#00FF88" />
                <text x="25" y="48" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  2. <tspan fontWeight="bold" fill="#00FF88">Latent Geometry:</tspan> Semantic embeddings cluster cultural stereotypes without explicit intent.
                </text>

                {/* Concept 3 */}
                <circle cx="16" cy="63" r="3" fill="#00FF88" />
                <text x="25" y="66" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  3. <tspan fontWeight="bold" fill="#00FF88">Key Question to Explore:</tspan> How do adversarial debiasing layers alter downstream classification accuracy?
                </text>
              </g>

              {/* Takeaway banner at bottom */}
              <rect x="70" y="185" width="400" height="22" rx="3" fill="#132B1E" stroke="#00FF88" strokeWidth="0.8" />
              <text x="270" y="199" fill="#00FF88" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                PRINCIPLE: AI EXPLAINS THE DIFFICULT IDEA // THE STUDENT FORMS THE ARGUMENT
              </text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              The student consults AI as a conceptual dialogue partner to clarify mechanisms, not as an essay author to bypass thinking.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 04 — RESEARCH AND VERIFICATION                              */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 4 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Scanning Laser Beam Grid */}
              <line x1="20" y1="35" x2="520" y2="35" stroke="#00FF88" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              
              {/* Paper A: AI Suggested / Unverified (Fictitious) */}
              <g transform="translate(35, 25)">
                <rect x="0" y="0" width="220" height="175" rx="5" fill="#120A0C" stroke="#F43F5E" strokeWidth="1.8" />
                <rect x="1" y="1" width="218" height="24" rx="4" fill="#200B0F" />
                <text x="10" y="16" fill="#F43F5E" fontSize="6" fontFamily="monospace" fontWeight="bold">
                  SPECIMEN A // AI SUGGESTION
                </text>

                <text x="12" y="38" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="serif">
                  "Optimal Latent Pruning in Neural Layers"
                </text>
                <text x="12" y="50" fill="#87968D" fontSize="5" fontFamily="sans-serif">
                  K. Rostova • Int. J. Machine Learning (2024)
                </text>

                <rect x="12" y="60" width="196" height="40" rx="3" fill="#290E14" stroke="#F43F5E" strokeWidth="1" />
                <text x="18" y="74" fill="#FCA5A5" fontSize="5" fontFamily="monospace">DOI: 10.1016/j.sim.2024.08</text>
                <text x="18" y="86" fill="#F87171" fontSize="5.5" fontWeight="bold" fontFamily="monospace">CROSSREF LOOKUP: 404 NOT FOUND</text>

                {/* Stamped REJECTED */}
                <g transform="rotate(-6 110 135)">
                  <rect x="35" y="120" width="150" height="30" rx="4" fill="#F43F5E" fillOpacity="0.25" stroke="#F43F5E" strokeWidth="2.5" />
                  <text x="110" y="139" fill="#F43F5E" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace" letterSpacing="2">
                    REJECTED // FAKE
                  </text>
                </g>
              </g>

              {/* Central Verification Arrow */}
              <path d="M 265 110 L 275 110" stroke="#00FF88" strokeWidth="2" />

              {/* Paper B: Real Peer-Reviewed Paper (Verified) */}
              <g transform="translate(285, 25)">
                <rect x="0" y="0" width="220" height="175" rx="5" fill="#0A1810" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 12px 24px rgba(0,255,136,0.18))" />
                <rect x="1" y="1" width="218" height="24" rx="4" fill="#0F281B" />
                <text x="10" y="16" fill="#00FF88" fontSize="6" fontFamily="monospace" fontWeight="bold">
                  SPECIMEN B // PRIMARY LITERATURE
                </text>

                <text x="12" y="38" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="serif">
                  "Fairness Guarantees in Latent Embeddings"
                </text>
                <text x="12" y="50" fill="#87968D" fontSize="5" fontFamily="sans-serif">
                  Barocas et al. • ACM FAccT Conference (2023)
                </text>

                <rect x="12" y="60" width="196" height="40" rx="3" fill="#132B1E" stroke="#00FF88" strokeWidth="1" />
                <text x="18" y="74" fill="#8AFFB2" fontSize="5" fontFamily="monospace">DOI: 10.1145/3593013.3594022</text>
                <text x="18" y="86" fill="#00FF88" fontSize="5.5" fontWeight="bold" fontFamily="monospace">INDEXED: ACM DIGITAL LIBRARY (VERIFIED)</text>

                {/* Stamped ACCEPTED */}
                <g transform="rotate(-4 110 135)">
                  <rect x="35" y="120" width="150" height="30" rx="4" fill="#00FF88" fillOpacity="0.2" stroke="#00FF88" strokeWidth="2.5" />
                  <text x="110" y="139" fill="#00FF88" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace" letterSpacing="2">
                    VERIFIED // ACCEPTED
                  </text>
                </g>
              </g>

              {/* Bottom Telemetry */}
              <text x="270" y="222" fill="#87968D" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
                [ ONLY INDEPENDENTLY VERIFIED SOURCES ENTER THE BIBLIOGRAPHY ]
              </text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              Every candidate reference is independently audited against institutional databases. Hallucinated citations are rejected; primary literature is admitted.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 05 — ORIGINAL WORK (Student Authorship)                      */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 5 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* The Manuscript Sheet Growing */}
              <rect x="80" y="15" width="380" height="205" rx="5" fill="#08140E" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 16px 32px rgba(0,255,136,0.18))" />
              
              {/* Header */}
              <rect x="81" y="16" width="378" height="26" rx="4" fill="#0E2417" />
              <text x="96" y="32" fill="#00FF88" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                DRAFT IN PROGRESS // CANDIDATE AUTHORSHIP
              </text>

              {/* Title and Author */}
              <text x="96" y="60" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" fontFamily="serif">
                Evaluating Ethical Governance in Multi-Agent Frameworks
              </text>
              <text x="96" y="72" fill="#87968D" fontSize="6" fontFamily="sans-serif">
                Author: Candidate • School of Computing &amp; Data Ethics
              </text>

              {/* Progressive Student Writing Paragraph */}
              <g transform="translate(96, 85)">
                <rect x="0" y="0" width="348" height="92" rx="4" fill="#0D1E14" stroke="#253E2F" strokeWidth="1" />
                
                <text x="12" y="18" fill="#00FF88" fontSize="5.5" fontFamily="monospace" fontWeight="bold">
                  1.0 CRITICAL THESIS &amp; ARGUMENTATION
                </text>

                <text x="12" y="34" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  "While automated systems optimize for objective utility functions, ethical accountability
                </text>
                <text x="12" y="47" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  cannot be delegated to statistical weightings. As Barocas et al. (2023) demonstrated,
                </text>
                <text x="12" y="60" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  algorithmic impartiality is mathematically impossible across conflicting fairness metrics;
                </text>
                <text x="12" y="73" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  hence human researchers must establish normative priorities prior to deployment."
                </text>

                {/* Animated cursor */}
                <rect x="330" y="67" width="2.5" height="8" fill="#00FF88" className="animate-pulse" />
              </g>

              {/* Authorship Badge */}
              <rect x="96" y="187" width="190" height="20" rx="3" fill="#132B1E" stroke="#00FF88" strokeWidth="0.8" />
              <text x="191" y="200" fill="#00FF88" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                ✓ AUTHENTIC PROSE &amp; ORIGINAL REASONING
              </text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              The student writes the analysis in their own voice, synthesizing verified literature into personal, defensible arguments.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 06 — REVIEW (Grammar, Clarity, Polish)                      */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 6 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Manuscript with Review Highlights */}
              <rect x="50" y="20" width="440" height="195" rx="6" fill="#09140E" stroke="#00FF88" strokeWidth="2" filter="drop-shadow(0 14px 28px rgba(0,255,136,0.16))" />
              
              {/* Header */}
              <rect x="51" y="21" width="438" height="26" rx="5" fill="#0F2417" />
              <text x="70" y="37" fill="#00FF88" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                AUDIT &amp; EDITORIAL POLISH // RIGOROUS PEER STANDARDS
              </text>

              {/* Review Check 1: Grammar & Conciseness */}
              <g transform="translate(70, 58)">
                <rect x="0" y="0" width="400" height="34" rx="4" fill="#112217" stroke="#00FF88" strokeWidth="1" />
                <circle cx="16" cy="17" r="7" fill="#00FF88" />
                <text x="16" y="20" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="32" y="14" fill="#E4F0E8" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                  SYNTACTIC CLARITY &amp; CONCISENESS
                </text>
                <text x="32" y="24" fill="#87968D" fontSize="5.5" fontFamily="sans-serif">
                  Eliminated redundant passive voice clauses; tightened scholarly rhythm.
                </text>
              </g>

              {/* Review Check 2: Citation Exactness */}
              <g transform="translate(70, 100)">
                <rect x="0" y="0" width="400" height="34" rx="4" fill="#112217" stroke="#00FF88" strokeWidth="1" />
                <circle cx="16" cy="17" r="7" fill="#00FF88" />
                <text x="16" y="20" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="32" y="14" fill="#E4F0E8" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                  CITATION INTEGRITY CHECK
                </text>
                <text x="32" y="24" fill="#87968D" fontSize="5.5" fontFamily="sans-serif">
                  Every referenced claim matches direct quotes and findings in original papers.
                </text>
              </g>

              {/* Review Check 3: Cognitive Ownership */}
              <g transform="translate(70, 142)">
                <rect x="0" y="0" width="400" height="34" rx="4" fill="#112217" stroke="#00FF88" strokeWidth="1" />
                <circle cx="16" cy="17" r="7" fill="#00FF88" />
                <text x="16" y="20" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="32" y="14" fill="#E4F0E8" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                  COGNITIVE MASTERY AUDIT
                </text>
                <text x="32" y="24" fill="#87968D" fontSize="5.5" fontFamily="sans-serif">
                  The candidate can explain, defend, and expand every sentence in oral review.
                </text>
              </g>

              <text x="270" y="202" fill="#00FF88" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                [ EDITORIAL AUDIT COMPLETED // READY FOR FORMAL DISCLOSURE ]
              </text>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#E4F0E8] max-w-xl mx-auto font-medium">
              The draft undergoes rigorous review. AI is used strictly for grammatical tightening, while intellectual depth remains verified by the student.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* SCENE 07 — DISCLOSURE & CONCLUSION                                */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 7 && (
          <div className="w-full flex flex-col items-center animate-fadeIn text-center">
            <svg viewBox="0 0 540 240" className="w-full max-w-[680px] sm:max-w-[740px] h-64 sm:h-72 md:h-80 mb-3">
              {/* Completed Submission Canvas */}
              <rect x="40" y="15" width="460" height="210" rx="6" fill="#07130D" stroke="#00FF88" strokeWidth="2.5" filter="drop-shadow(0 18px 36px rgba(0,255,136,0.22))" />
              
              {/* Header Stamp */}
              <rect x="41" y="16" width="458" height="28" rx="5" fill="#0F2A1B" />
              <text x="60" y="33" fill="#00FF88" fontSize="7" fontFamily="monospace" fontWeight="bold">
                FINAL SUBMISSION PACKAGE // ETHICAL DISCLOSURE APPENDED
              </text>

              {/* Formal Disclosure Box */}
              <g transform="translate(60, 54)">
                <rect x="0" y="0" width="420" height="66" rx="4" fill="#0F2218" stroke="#00FF88" strokeWidth="1.2" />
                
                <text x="14" y="17" fill="#00FF88" fontSize="6" fontFamily="monospace" fontWeight="bold">
                  TRANSPARENCY &amp; AI ASSISTANCE STATEMENT:
                </text>

                <text x="14" y="32" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  "Generative AI was utilized as an interactive tutor for brainstorming conceptual outlines
                </text>
                <text x="14" y="44" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  and proofreading sentence grammar. All research literature was independently verified in the
                </text>
                <text x="14" y="56" fill="#E4F0E8" fontSize="6" fontFamily="sans-serif">
                  university repository, and all arguments and prose reflect my authentic authorship."
                </text>
              </g>

              {/* Monumental Core Conclusion */}
              <g transform="translate(60, 130)">
                <rect x="0" y="0" width="420" height="82" rx="4" fill="#050C08" stroke="#00FF88" strokeWidth="1.8" />
                
                <text x="210" y="28" fill="#00FF88" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace" letterSpacing="2">
                  YOUR WORK. YOUR RESPONSIBILITY.
                </text>

                <line x1="50" y1="38" x2="370" y2="38" stroke="#00FF88" strokeWidth="1" opacity="0.4" />

                <text x="210" y="55" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  AI CAN ASSIST THE PROCESS.
                </text>
                <text x="210" y="69" fill="#8AFFB2" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  IT CANNOT TAKE RESPONSIBILITY FOR YOUR WORK.
                </text>
              </g>
            </svg>

            <p className="font-body text-base sm:text-lg text-[#00FF88] max-w-xl mx-auto font-bold">
              "AI CAN ASSIST THE PROCESS. IT CANNOT TAKE RESPONSIBILITY FOR YOUR WORK."
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
