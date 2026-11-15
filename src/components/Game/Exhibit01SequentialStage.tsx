import React, { useState, useEffect, useRef } from 'react';
import type { ExhibitData, GameOption } from '../../types/game';
import { Play, Pause, RotateCcw, ArrowDown } from 'lucide-react';
import { Exhibit01QuizActivity } from './Exhibit01QuizActivity';

interface Exhibit01SequentialStageProps {
  data: ExhibitData;
  selectedOptionId?: string;
  result?: { isCorrect: boolean; pointsEarned: number };
  onSelectOption: (option: GameOption) => void;
  onContinue: () => void;
  onScoreUpdate?: (pointsAdded: number) => void;
  onActivityComplete?: (score: number, totalCorrect: number) => void;
}

export const Exhibit01SequentialStage: React.FC<Exhibit01SequentialStageProps> = ({
  data: _data,
  selectedOptionId,
  result,
  onSelectOption,
  onContinue,
  onScoreUpdate,
  onActivityComplete,
}) => {
  const hasAnswered = !!selectedOptionId;

  // ---------------------------------------------------------------------------
  // ANIMATION STATE: EXHIBIT 01A (Substitute)
  // ---------------------------------------------------------------------------
  const [stepA, setStepA] = useState<number>(1);
  const [isPlayingA, setIsPlayingA] = useState<boolean>(false);
  const [hasStartedA, setHasStartedA] = useState<boolean>(false);
  const sectionARef = useRef<HTMLDivElement>(null);
  const visualCardRefA = useRef<HTMLDivElement>(null);
  const hasAlignedRefA = useRef<boolean>(false);
  const isManuallyPausedRefA = useRef<boolean>(false);
  const wasAutoPausedRefA = useRef<boolean>(false);

  // ---------------------------------------------------------------------------
  // ANIMATION STATE: EXHIBIT 01B (Tutor)
  // ---------------------------------------------------------------------------
  const [stepB, setStepB] = useState<number>(1);
  const [isPlayingB, setIsPlayingB] = useState<boolean>(false);
  const [hasStartedB, setHasStartedB] = useState<boolean>(false);
  const sectionBRef = useRef<HTMLDivElement>(null);
  const visualCardRefB = useRef<HTMLDivElement>(null);
  const hasAlignedRefB = useRef<boolean>(false);
  const isManuallyPausedRefB = useRef<boolean>(false);
  const wasAutoPausedRefB = useRef<boolean>(false);

  const STEP_DURATION_MS = 2900; // 2.9s per stage

  // Managed IntersectionObserver: Detects approaching exhibits, aligns viewport smoothly,
  // and starts animation strictly when at least 70% of relevant viewing area is visible.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isTargetA = entry.target === visualCardRefA.current;
          const isTargetB = entry.target === visualCardRefB.current;

          if (isTargetA) {
            // 1. Detect when approaching the viewport (< 70% visible)
            // If only partially visible and never aligned yet, smoothly center before playback
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.15 &&
              entry.intersectionRatio < 0.70 &&
              !hasAlignedRefA.current &&
              !hasStartedA
            ) {
              const rect = entry.target.getBoundingClientRect();
              const isCutOff = rect.top < 70 || rect.bottom > (window.innerHeight - 30);
              if (isCutOff) {
                hasAlignedRefA.current = true;
                entry.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }

            // 2. Playback gate: Start only when at least 70% of the visual area is visible
            if (entry.isIntersecting && entry.intersectionRatio >= 0.70) {
              hasAlignedRefA.current = true;
              if (!hasStartedA) {
                setHasStartedA(true);
                setIsPlayingA(true);
              } else if (wasAutoPausedRefA.current && !isManuallyPausedRefA.current && stepA < 5) {
                wasAutoPausedRefA.current = false;
                setIsPlayingA(true);
              }
            }

            // 3. Pause if visitor scrolls far away
            if (entry.intersectionRatio < 0.30 && isPlayingA) {
              wasAutoPausedRefA.current = true;
              setIsPlayingA(false);
            }
          }

          if (isTargetB) {
            // 1. Detect when approaching the viewport (< 70% visible)
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.15 &&
              entry.intersectionRatio < 0.70 &&
              !hasAlignedRefB.current &&
              !hasStartedB
            ) {
              const rect = entry.target.getBoundingClientRect();
              const isCutOff = rect.top < 70 || rect.bottom > (window.innerHeight - 30);
              if (isCutOff) {
                hasAlignedRefB.current = true;
                entry.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }

            // 2. Playback gate: Start only when at least 70% of the visual area is visible
            if (entry.isIntersecting && entry.intersectionRatio >= 0.70) {
              hasAlignedRefB.current = true;
              if (!hasStartedB) {
                setHasStartedB(true);
                setIsPlayingB(true);
              } else if (wasAutoPausedRefB.current && !isManuallyPausedRefB.current && stepB < 5) {
                wasAutoPausedRefB.current = false;
                setIsPlayingB(true);
              }
            }

            // 3. Pause if visitor scrolls far away
            if (entry.intersectionRatio < 0.30 && isPlayingB) {
              wasAutoPausedRefB.current = true;
              setIsPlayingB(false);
            }
          }
        });
      },
      {
        threshold: [0.15, 0.30, 0.70],
      }
    );

    if (visualCardRefA.current) {
      observer.observe(visualCardRefA.current);
    }
    if (visualCardRefB.current) {
      observer.observe(visualCardRefB.current);
    }

    return () => observer.disconnect();
  }, [hasStartedA, hasStartedB, isPlayingA, isPlayingB, stepA, stepB]);

  // Playback timer for Exhibit 01A
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isPlayingA) {
      timer = setTimeout(() => {
        setStepA((prev) => {
          if (prev < 5) {
            return prev + 1;
          } else {
            setIsPlayingA(false);
            // No automatic scroll: visitor remains in control to inspect Exhibit 01A
            return prev;
          }
        });
      }, STEP_DURATION_MS);
    }

    return () => clearTimeout(timer);
  }, [isPlayingA, stepA]);

  // Playback timer for Exhibit 01B
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isPlayingB) {
      timer = setTimeout(() => {
        setStepB((prev) => {
          if (prev < 5) {
            return prev + 1;
          } else {
            setIsPlayingB(false);
            // No automatic scroll: visitor remains in control to inspect Exhibit 01B
            return prev;
          }
        });
      }, STEP_DURATION_MS);
    }

    return () => clearTimeout(timer);
  }, [isPlayingB, stepB]);

  // Replay & Play/Pause handlers
  const handleReplayA = () => {
    isManuallyPausedRefA.current = false;
    wasAutoPausedRefA.current = false;
    setStepA(1);
    setIsPlayingA(true);
  };

  const handleTogglePlayA = () => {
    if (isPlayingA) {
      isManuallyPausedRefA.current = true;
      wasAutoPausedRefA.current = false;
      setIsPlayingA(false);
    } else {
      isManuallyPausedRefA.current = false;
      wasAutoPausedRefA.current = false;
      if (stepA === 5) {
        setStepA(1);
      }
      setIsPlayingA(true);
    }
  };

  const handleReplayB = () => {
    isManuallyPausedRefB.current = false;
    wasAutoPausedRefB.current = false;
    setStepB(1);
    setIsPlayingB(true);
  };

  const handleTogglePlayB = () => {
    if (isPlayingB) {
      isManuallyPausedRefB.current = true;
      wasAutoPausedRefB.current = false;
      setIsPlayingB(false);
    } else {
      isManuallyPausedRefB.current = false;
      wasAutoPausedRefB.current = false;
      if (stepB === 5) {
        setStepB(1);
      }
      setIsPlayingB(true);
    }
  };

  const scrollToSectionB = () => {
    const elemB = document.getElementById('exhibit-01b');
    if (elemB) {
      elemB.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToActivity = () => {
    const activityElem = document.getElementById('exhibit-01-activity');
    if (activityElem) {
      activityElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full">
      
      {/* =================================================================== */}
      {/* EXHIBIT 01A: AI AS A SUBSTITUTE                                    */}
      {/* =================================================================== */}
      <section
        id="exhibit-01"
        ref={sectionARef}
        className="documentary-scene"
        style={{
          minHeight: '100vh',
          paddingTop: 'clamp(56px, 6vw, 84px)',
          paddingBottom: 'clamp(56px, 6vw, 84px)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderTop: '1px solid rgba(244, 63, 94, 0.2)'
        }}
        aria-label="Exhibit 01A: AI As A Substitute"
      >
        <div className="exhibition-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* 1. Small Exhibit Identification Label */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-rose-500/20">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold text-rose-400 tracking-wider">
                EXHIBIT 01A // COGNITIVE AGENCY
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-xs text-[#87968D] tracking-wider uppercase">
                CHAPTER 01: THE OUTSOURCING SHORTCUT
              </span>
            </div>
          </div>

          {/* 2. Large Educational Headline & 3. Engaging Editorial Story Blocks */}
          <div className="mb-10 max-w-4xl">
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.85rem, 3.6vw, 3.15rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#E4F0E8',
                marginBottom: '18px'
              }}
            >
              The Shortcut That Costs You Understanding
            </h2>

            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)',
                lineHeight: 1.55,
                color: '#E4F0E8',
                fontWeight: 500,
                marginBottom: '16px'
              }}
            >
              When an AI agent produces a flawless solution in seconds, it creates a dangerous cognitive illusion: <span style={{ color: '#F43F5E', fontWeight: 700 }}>the feeling of mastery without the reality of comprehension.</span>
            </p>

            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.125rem, 1.35vw, 1.25rem)',
                lineHeight: 1.75,
                color: '#D1DDD5',
                marginBottom: '20px'
              }}
            >
              Delegating an entire programming problem or research assignment bypasses the mental struggle where authentic understanding is formed. You receive the final syntax, but your brain never constructs the conceptual models required to explain the logic during viva evaluations, diagnose subtle bugs, or adapt the algorithm to novel challenges.
            </p>

            <div 
              style={{
                borderLeft: '3px solid #F43F5E',
                paddingLeft: '20px',
                marginTop: '16px',
                marginBottom: '24px'
              }}
            >
              <p 
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.125rem, 1.5vw, 1.3rem)',
                  fontWeight: 600,
                  color: '#FECDD3',
                  lineHeight: 1.5,
                  margin: 0
                }}
              >
                "Outsourcing thinking saves hours today, but creates an epistemic debt that defaults the moment an evaluator asks: 'Why did you choose line 42?'"
              </p>
            </div>
          </div>

          {/* Cinema Screen Container for Scene A Animation */}
          <div 
            ref={visualCardRefA}
            className="w-full bg-[#070B08] border-2 border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden mb-8"
          >
            
            {/* Ambient Red Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Cinema Header Bar (Clean, Non-Technical) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#F43F5E] flex-shrink-0" />
                <span className="font-display font-bold text-sm sm:text-base text-[#E4F0E8]">
                  The Outsourcing Shortcut // Five-Stage Breakdown
                </span>
              </div>

              {/* Controls: Progress Dots + PAUSE and REPLAY Buttons */}
              <div className="flex items-center gap-2">
                {/* 5 Subtle Stage Dots */}
                <div className="hidden xs:flex items-center gap-1.5 mr-1" aria-label={`Stage ${stepA} of 5`}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dot === stepA
                          ? 'w-4 bg-rose-500 shadow-[0_0_8px_#F43F5E]'
                          : dot < stepA
                          ? 'w-2 bg-rose-500/40'
                          : 'w-2 bg-white/15'
                      }`}
                    />
                  ))}
                </div>

                {/* PAUSE / PLAY Button */}
                <button
                  type="button"
                  onClick={handleTogglePlayA}
                  className="exhibit-control-btn exhibit-control-btn-danger"
                  title={isPlayingA ? 'Pause animation' : 'Play animation'}
                  aria-label={isPlayingA ? 'Pause animation' : 'Play animation'}
                >
                  {isPlayingA ? (
                    <Pause size={13} className="shrink-0" />
                  ) : (
                    <Play size={13} className="shrink-0 fill-current" />
                  )}
                  <span>{isPlayingA ? 'PAUSE' : 'PLAY'}</span>
                </button>

                {/* REPLAY Button */}
                <button
                  type="button"
                  onClick={handleReplayA}
                  className="exhibit-control-btn exhibit-control-btn-danger"
                  title="Replay from Scene 1"
                  aria-label="Replay animation from Scene 1"
                >
                  <RotateCcw size={13} className="shrink-0" />
                  <span>REPLAY</span>
                </button>
              </div>
            </div>

            {/* Dynamic Stage Canvas (Large Visual Display) */}
            <div className="min-h-[340px] sm:min-h-[380px] flex flex-col justify-center items-center text-center relative z-10">
              
              {/* Stage 1: Assignment Arrives & Delegated */}
              {stepA === 1 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <rect x="20" y="85" width="200" height="8" rx="2" fill="#1F2923" />
                    <rect x="35" y="93" width="8" height="25" fill="#15201A" />
                    <rect x="195" y="93" width="8" height="25" fill="#15201A" />
                    <circle cx="65" cy="46" r="14" fill="#E4F0E8" />
                    <path d="M 52 64 Q 65 60 78 64 L 84 90 L 46 90 Z" fill="#4B5563" />
                    <polygon points="100,52 150,52 142,86 92,86" fill="#242E28" stroke="#F43F5E" strokeWidth="1.5" />
                    <line x1="86" y1="86" x2="156" y2="86" stroke="#4B5563" strokeWidth="3" />
                    <rect x="150" y="62" width="34" height="24" rx="2" fill="#111814" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="3 2" />
                    <text x="167" y="72" fill="#F43F5E" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DIJKSTRA</text>
                    <text x="167" y="80" fill="#87968D" fontSize="5" textAnchor="middle" fontFamily="monospace">HOMEWORK</text>
                    <path d="M 120 44 Q 140 24 175 31" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 2" />
                    <polygon points="178,32 170,26 172,35" fill="#F43F5E" />
                    <text x="148" y="20" fill="#F43F5E" fontSize="7" fontWeight="bold" fontFamily="monospace">"DO THIS FOR ME"</text>
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#E4F0E8',
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    A challenging programming problem arrives. The student immediately delegates it to AI without attempting to understand the logic.
                  </p>
                </div>
              )}

              {/* Stage 2: Instant Code Synthesis */}
              {stepA === 2 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <rect x="30" y="10" width="180" height="96" rx="6" fill="#0D1410" stroke="#F43F5E" strokeWidth="1.5" />
                    <line x1="30" y1="26" x2="210" y2="26" stroke="#F43F5E" strokeWidth="1" strokeOpacity="0.4" />
                    <circle cx="42" cy="18" r="3" fill="#F43F5E" />
                    <circle cx="52" cy="18" r="3" fill="#FBBF24" />
                    <circle cx="62" cy="18" r="3" fill="#00FF88" />
                    <text x="75" y="21" fill="#87968D" fontSize="7" fontFamily="monospace">AI_GENERATOR_V4</text>
                    <line x1="45" y1="40" x2="185" y2="40" stroke="#F43F5E" strokeWidth="2.5" className="mg-code-stream" />
                    <line x1="45" y1="50" x2="165" y2="50" stroke="#9CA3AF" strokeWidth="2.5" className="mg-code-stream" />
                    <line x1="45" y1="60" x2="195" y2="60" stroke="#9CA3AF" strokeWidth="2.5" className="mg-code-stream" />
                    <line x1="45" y1="70" x2="150" y2="70" stroke="#F43F5E" strokeWidth="2.5" className="mg-code-stream" />
                    <line x1="45" y1="80" x2="175" y2="80" stroke="#9CA3AF" strokeWidth="2.5" className="mg-code-stream" />
                    <circle cx="185" cy="74" r="14" fill="#050807" stroke="#F43F5E" strokeWidth="1.5" />
                    <text x="185" y="77" fill="#F43F5E" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AI</text>
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#E4F0E8',
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    The AI produces a complete solution in seconds. The student receives the answer, but the thinking process was entirely bypassed.
                  </p>
                </div>
              )}

              {/* Stage 3: Unread Copy-Paste Shortcut */}
              {stepA === 3 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <rect x="30" y="20" width="55" height="75" rx="4" fill="#121815" stroke="#9CA3AF" strokeWidth="1.5" />
                    <rect x="45" y="15" width="25" height="9" rx="2" fill="#374151" />
                    <text x="57" y="55" fill="#E4F0E8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Ctrl+C</text>
                    <text x="57" y="69" fill="#87968D" fontSize="7" textAnchor="middle" fontFamily="monospace">UNREAD</text>
                    <path d="M 95 57 L 135 57" stroke="#F43F5E" strokeWidth="3" strokeDasharray="4 2" className="mg-code-stream" />
                    <polygon points="140,57 130,52 130,62" fill="#F43F5E" />
                    <rect x="150" y="20" width="55" height="75" rx="4" fill="#121815" stroke="#F43F5E" strokeWidth="2" />
                    <text x="177" y="55" fill="#F43F5E" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Ctrl+V</text>
                    <circle cx="177" cy="80" r="8" fill="#050807" stroke="#F43F5E" />
                    <text x="177" y="83" fill="#F43F5E" fontSize="8" textAnchor="middle" fontWeight="bold">🔒</text>
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#E4F0E8',
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    The code is pasted directly into the assignment portal. It is submitted on time, but nothing was stored in the student's mind.
                  </p>
                </div>
              )}

              {/* Stage 4: Viva Question */}
              {stepA === 4 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <circle cx="50" cy="35" r="14" fill="#9CA3AF" />
                    <path d="M 38 53 L 62 53 L 66 100 L 34 100 Z" fill="#374151" />
                    <line x1="62" y1="57" x2="105" y2="43" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="105" cy="43" r="3" fill="#F43F5E" />
                    <rect x="85" y="11" width="135" height="34" rx="4" fill="#0D1410" stroke="#F43F5E" strokeWidth="1.5" />
                    <text x="152" y="24" fill="#E4F0E8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      "Line 42: Why does Dijkstra
                    </text>
                    <text x="152" y="35" fill="#E4F0E8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      fail on negative weights?"
                    </text>
                    <circle cx="185" cy="70" r="12" fill="#E4F0E8" />
                    <path d="M 174 86 L 196 86 L 200 115 L 170 115 Z" fill="#4B5563" />
                    <text x="185" y="55" fill="#F43F5E" fontSize="16" fontWeight="bold" textAnchor="middle">...</text>
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#E4F0E8',
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    During the oral review, the teacher asks the student to explain line 42. The student is speechless because they never derived the logic.
                  </p>
                </div>
              )}

              {/* Stage 5: Cognitive Failure Verdict */}
              {stepA === 5 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <g className="mg-tremble">
                      <circle cx="120" cy="46" r="16" fill="#E4F0E8" />
                      <path d="M 106 66 L 134 66 L 140 108 L 100 108 Z" fill="#F43F5E" />
                      <circle cx="114" cy="44" r="2.5" fill="#050807" />
                      <circle cx="126" cy="44" r="2.5" fill="#050807" />
                      <line x1="114" y1="52" x2="126" y2="52" stroke="#050807" strokeWidth="2" />
                    </g>
                    <circle cx="140" cy="40" r="3" fill="#60A5FA" className="mg-sweat" />
                    <circle cx="145" cy="48" r="2" fill="#60A5FA" className="mg-sweat" />
                    <text x="120" y="22" fill="#F43F5E" fontSize="24" fontWeight="black" textAnchor="middle" className="mg-spark-ignite">
                      ???
                    </text>
                    <rect x="35" y="78" width="170" height="30" rx="3" fill="#4C0519" stroke="#F43F5E" strokeWidth="2" className="mg-stamp" />
                    <text x="120" y="97" fill="#FECDD3" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace" className="mg-stamp">
                      0% RETENTION // COGNITIVE FAILURE
                    </text>
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#FECDD3',
                      fontWeight: 600,
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    Unable to defend the solution, the student fails the evaluation. The shortcut saved time upfront, but destroyed understanding.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* 5. One Memorable Takeaway (Editorial Manuscript Style) */}
          <div 
            style={{
              maxWidth: '920px',
              borderLeft: '4px solid #F43F5E',
              padding: '24px 28px',
              marginTop: '24px',
              marginBottom: '32px',
              backgroundColor: 'rgba(244, 63, 94, 0.06)',
              borderRadius: '0 12px 12px 0',
              borderTop: '1px solid rgba(244, 63, 94, 0.25)',
              borderRight: '1px solid rgba(244, 63, 94, 0.12)',
              borderBottom: '1px solid rgba(244, 63, 94, 0.12)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#F43F5E',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}
            >
              CORE TAKEAWAY
            </div>
            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.125rem, 1.8vw, 1.35rem)',
                fontWeight: 600,
                color: '#E4F0E8',
                lineHeight: 1.5,
                letterSpacing: '-0.01em',
                margin: 0
              }}
            >
              "Fluency is not comprehension. Using AI to generate answers without understanding the underlying mechanics trades authentic mastery for temporary convenience."
            </p>
          </div>

          {/* Transition Cue to Exhibit 01B */}
          <div className="flex justify-start pt-3">
            <button
              type="button"
              onClick={scrollToSectionB}
              className="exhibit-btn-pill"
            >
              <span>See the alternative: How to learn with AI</span>
              <ArrowDown size={15} className="text-[#00FF88]" />
            </button>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* EXHIBIT 01B: AI AS A TUTOR                                          */}
      {/* =================================================================== */}
      <section
        id="exhibit-01b"
        ref={sectionBRef}
        className="documentary-scene"
        style={{
          minHeight: '100vh',
          paddingTop: 'clamp(56px, 6vw, 84px)',
          paddingBottom: 'clamp(56px, 6vw, 84px)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderTop: '1px solid rgba(0, 255, 136, 0.2)'
        }}
        aria-label="Exhibit 01B: AI As A Tutor"
      >
        <div className="exhibition-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* 1. Small Exhibit Identification Label */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-[#00FF88]/20">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold text-[#00FF88] tracking-wider">
                EXHIBIT 01B // ACTIVE COMPREHENSION
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-xs text-[#87968D] tracking-wider uppercase">
                CHAPTER 02: THE MASTER TUTOR
              </span>
            </div>
          </div>

          {/* 2. Large Educational Headline & 3. Engaging Editorial Story Blocks */}
          <div className="mb-10 max-w-4xl">
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.85rem, 3.6vw, 3.15rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#E4F0E8',
                marginBottom: '18px'
              }}
            >
              How AI Can Act As A Master Tutor
            </h2>

            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)',
                lineHeight: 1.55,
                color: '#E4F0E8',
                fontWeight: 500,
                marginBottom: '16px'
              }}
            >
              When used with deliberate intention, <span style={{ color: '#00FF88', fontWeight: 700 }}>AI is most powerful when it acts as an unyielding intellectual sparring partner.</span>
            </p>

            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.125rem, 1.35vw, 1.25rem)',
                lineHeight: 1.75,
                color: '#D1DDD5',
                marginBottom: '20px'
              }}
            >
              Attempt the problem first. Write the initial logic, draft the code, or construct the theoretical argument yourself. Then bring that work to the AI and ask it to find edge cases, challenge assumptions, and explain confusing theoretical boundaries. You remain the author; AI becomes the tutor.
            </p>

            <div 
              style={{
                borderLeft: '3px solid #00FF88',
                paddingLeft: '20px',
                marginTop: '16px',
                marginBottom: '24px'
              }}
            >
              <p 
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.125rem, 1.5vw, 1.3rem)',
                  fontWeight: 600,
                  color: '#A7F3D0',
                  lineHeight: 1.5,
                  margin: 0
                }}
              >
                "The goal is not to avoid modern tools, but to ensure that when your work is evaluated, the knowledge resides inside your mind—not inside your prompt history."
              </p>
            </div>
          </div>

          {/* Cinema Screen Container for Scene B Animation */}
          <div 
            ref={visualCardRefB}
            className="w-full bg-[#050E09] border-2 border-[#00FF88]/40 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden mb-8"
          >
            
            {/* Ambient Green Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF88]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Cinema Header Bar (Clean, Non-Technical) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] flex-shrink-0" />
                <span className="font-display font-bold text-sm sm:text-base text-[#E4F0E8]">
                  Active Comprehension with AI // Five-Stage Breakdown
                </span>
              </div>

              {/* Controls: Progress Dots + PAUSE and REPLAY Buttons */}
              <div className="flex items-center gap-2">
                {/* 5 Subtle Stage Dots */}
                <div className="hidden xs:flex items-center gap-1.5 mr-1" aria-label={`Stage ${stepB} of 5`}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dot === stepB
                          ? 'w-4 bg-[#00FF88] shadow-[0_0_8px_#00FF88]'
                          : dot < stepB
                          ? 'w-2 bg-[#00FF88]/40'
                          : 'w-2 bg-white/15'
                      }`}
                    />
                  ))}
                </div>

                {/* PAUSE / PLAY Button */}
                <button
                  type="button"
                  onClick={handleTogglePlayB}
                  className="exhibit-control-btn"
                  title={isPlayingB ? 'Pause animation' : 'Play animation'}
                  aria-label={isPlayingB ? 'Pause animation' : 'Play animation'}
                >
                  {isPlayingB ? (
                    <Pause size={13} className="shrink-0" />
                  ) : (
                    <Play size={13} className="shrink-0 fill-current" />
                  )}
                  <span>{isPlayingB ? 'PAUSE' : 'PLAY'}</span>
                </button>

                {/* REPLAY Button */}
                <button
                  type="button"
                  onClick={handleReplayB}
                  className="exhibit-control-btn"
                  title="Replay from Scene 1"
                  aria-label="Replay animation from Scene 1"
                >
                  <RotateCcw size={13} className="shrink-0" />
                  <span>REPLAY</span>
                </button>
              </div>
            </div>

            {/* Dynamic Stage Canvas (Large Visual Display) */}
            <div className="min-h-[340px] sm:min-h-[380px] flex flex-col justify-center items-center text-center relative z-10">
              
              {/* Stage 1: Student Attempts Problem First */}
              {stepB === 1 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <rect x="20" y="85" width="200" height="8" rx="2" fill="#1F2923" />
                    <rect x="35" y="93" width="8" height="25" fill="#15201A" />
                    <rect x="195" y="93" width="8" height="25" fill="#15201A" />
                    <circle cx="70" cy="42" r="14" fill="#E4F0E8" />
                    <path d="M 58 60 L 82 60 L 88 90 L 52 90 Z" fill="#00FF88" fillOpacity="0.8" />
                    <line x1="82" y1="70" x2="108" y2="78" stroke="#E4F0E8" strokeWidth="2.5" />
                    <circle cx="108" cy="78" r="2" fill="#00FF88" />
                    <rect x="100" y="54" width="65" height="32" rx="3" fill="#0A2216" stroke="#00FF88" strokeWidth="1.2" />
                    <circle cx="115" cy="66" r="4" fill="#00FF88" />
                    <circle cx="145" cy="62" r="4" fill="#00FF88" />
                    <circle cx="145" cy="78" r="4" fill="#00FF88" />
                    <line x1="119" y1="66" x2="141" y2="62" stroke="#00FF88" strokeWidth="1.2" />
                    <line x1="119" y1="66" x2="141" y2="78" stroke="#00FF88" strokeWidth="1.2" />
                    <circle cx="70" cy="42" r="5" fill="#00FF88" className="mg-neural-pulse" />
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#E4F0E8',
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    The student sketches the graph, analyzes edge costs, and works through the reasoning independently before consulting AI.
                  </p>
                </div>
              )}

              {/* Stage 2: Socratic Guidance */}
              {stepB === 2 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <rect x="25" y="12" width="90" height="32" rx="4" fill="#121815" stroke="#87968D" strokeWidth="1.2" />
                    <text x="70" y="24" fill="#E4F0E8" fontSize="7" textAnchor="middle" fontFamily="monospace">"Dijkstra visits A</text>
                    <text x="70" y="34" fill="#E4F0E8" fontSize="7" textAnchor="middle" fontFamily="monospace">with cost 1 first."</text>
                    <g className="mg-spark-ignite">
                      <circle cx="120" cy="18" r="8" fill="#FBBF24" />
                      <line x1="120" y1="5" x2="120" y2="1" stroke="#FBBF24" strokeWidth="2" />
                      <line x1="130" y1="10" x2="134" y2="6" stroke="#FBBF24" strokeWidth="2" />
                      <line x1="110" y1="10" x2="106" y2="6" stroke="#FBBF24" strokeWidth="2" />
                    </g>
                    <rect x="55" y="54" width="160" height="42" rx="5" fill="#061D12" stroke="#00FF88" strokeWidth="1.5" />
                    <text x="135" y="69" fill="#00FF88" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      AI TUTOR: "What happens if edge
                    </text>
                    <text x="135" y="81" fill="#00FF88" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      B → A has negative weight -3?"
                    </text>
                    <text x="135" y="90" fill="#FBBF24" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      [HINT: Does the greedy choice hold?]
                    </text>
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#E4F0E8',
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    The AI does not write the code. It asks a targeted question that highlights where the student's assumption might fail.
                  </p>
                </div>
              )}

              {/* Stage 3: Proof Derivation */}
              {stepB === 3 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <rect x="35" y="10" width="170" height="92" rx="6" fill="#061D12" stroke="#00FF88" strokeWidth="1.5" />
                    <text x="120" y="25" fill="#00FF88" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      PATH COST DERIVATION
                    </text>
                    <text x="50" y="43" fill="#E4F0E8" fontSize="8" fontFamily="monospace">
                      Path 1: S → A = 1
                    </text>
                    <text x="50" y="57" fill="#E4F0E8" fontSize="8" fontFamily="monospace">
                      Path 2: S → B → A = 2 + (-3) = -1
                    </text>
                    <line x1="50" y1="65" x2="190" y2="65" stroke="#00FF88" strokeWidth="1" strokeOpacity="0.4" />
                    <text x="120" y="79" fill="#00FF88" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      CONTRADICTION: -1 &lt; 1
                    </text>
                    <text x="120" y="91" fill="#87968D" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
                      ASSUMPTION: Non-negative weights required!
                    </text>
                    <circle cx="195" cy="25" r="6" fill="#00FF88" className="mg-neural-pulse" />
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#E4F0E8',
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    The student calculates the contradiction independently, understanding why Dijkstra requires non-negative edge weights.
                  </p>
                </div>
              )}

              {/* Stage 4: Whiteboard Defense */}
              {stepB === 4 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <rect x="80" y="10" width="135" height="92" rx="4" fill="#072214" stroke="#00FF88" strokeWidth="1.8" />
                    <circle cx="105" cy="41" r="7" fill="#E4F0E8" />
                    <text x="105" y="44" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">S</text>
                    <circle cx="155" cy="31" r="7" fill="#00FF88" />
                    <text x="155" y="34" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">A</text>
                    <circle cx="155" cy="61" r="7" fill="#00FF88" />
                    <text x="155" y="64" fill="#050807" fontSize="7" fontWeight="bold" textAnchor="middle">B</text>
                    <line x1="112" y1="41" x2="148" y2="31" stroke="#00FF88" strokeWidth="1.5" />
                    <line x1="112" y1="41" x2="148" y2="61" stroke="#00FF88" strokeWidth="1.5" />
                    <line x1="155" y1="54" x2="155" y2="38" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 1" />
                    <text x="170" y="48" fill="#F43F5E" fontSize="7" fontWeight="bold">w = -3</text>
                    <text x="145" y="90" fill="#00FF88" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      DIJKSTRA COUNTEREXAMPLE
                    </text>
                    <circle cx="45" cy="38" r="14" fill="#E4F0E8" />
                    <path d="M 33 56 L 57 56 L 62 104 L 28 104 Z" fill="#00FF88" />
                    <line x1="57" y1="64" x2="84" y2="44" stroke="#E4F0E8" strokeWidth="3" />
                    <circle cx="84" cy="44" r="3" fill="#00FF88" />
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#E4F0E8',
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    At the whiteboard, the student draws the counterexample and explains why the greedy invariant fails with total confidence.
                  </p>
                </div>
              )}

              {/* Stage 5: Genuine Mastery */}
              {stepB === 5 && (
                <div className="mg-fade-in w-full max-w-2xl mx-auto flex flex-col items-center">
                  <svg viewBox="0 0 240 120" className="mg-svg-canvas">
                    <circle cx="120" cy="46" r="16" fill="#E4F0E8" />
                    <path d="M 104 66 L 136 66 L 142 110 L 98 110 Z" fill="#00FF88" />
                    <circle cx="114" cy="44" r="2.5" fill="#050807" />
                    <circle cx="126" cy="44" r="2.5" fill="#050807" />
                    <path d="M 114 52 Q 120 58 126 52" fill="none" stroke="#050807" strokeWidth="2" />
                    <path d="M 145 38 Q 155 46 145 54" fill="none" stroke="#00FF88" strokeWidth="2" className="mg-spark-ignite" />
                    <path d="M 152 34 Q 166 46 152 58" fill="none" stroke="#00FF88" strokeWidth="2" className="mg-spark-ignite" />
                    <circle cx="85" cy="36" r="8" fill="#061D12" stroke="#00FF88" />
                    <path d="M 81 36 L 84 39 L 89 33" fill="none" stroke="#00FF88" strokeWidth="2" />
                    <rect x="25" y="78" width="190" height="30" rx="3" fill="#061D12" stroke="#00FF88" strokeWidth="2" className="mg-stamp" />
                    <text x="120" y="97" fill="#00FF88" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace" className="mg-stamp">
                      ✓ 100% EXPLAINABLE // GENUINE MASTERY
                    </text>
                  </svg>
                  <p 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                      lineHeight: 1.65,
                      color: '#00FF88',
                      fontWeight: 600,
                      maxWidth: '560px',
                      margin: '12px auto 0'
                    }}
                  >
                    Flawless defense. The student truly understands the algorithm and can adapt it to any variant or exam scenario.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* 5. One Memorable Takeaway (Editorial Manuscript Style) */}
          <div 
            style={{
              maxWidth: '920px',
              borderLeft: '4px solid var(--accent-primary)',
              padding: '24px 28px',
              marginTop: '24px',
              marginBottom: '32px',
              backgroundColor: 'rgba(7, 26, 16, 0.65)',
              borderRadius: '0 12px 12px 0',
              borderTop: '1px solid rgba(0, 255, 136, 0.25)',
              borderRight: '1px solid rgba(0, 255, 136, 0.1)',
              borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}
            >
              CORE TAKEAWAY
            </div>
            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.125rem, 1.8vw, 1.35rem)',
                fontWeight: 600,
                color: '#E4F0E8',
                lineHeight: 1.5,
                letterSpacing: '-0.01em',
                margin: 0
              }}
            >
              "True competence isn't knowing how to prompt for answers—it's having the first-principles discernment to defend every derivation and explain every line yourself."
            </p>
          </div>

          {/* Transition Cue to Interactive Activity */}
          <div className="flex justify-start pt-3">
            <button
              type="button"
              onClick={scrollToActivity}
              className="exhibit-btn-pill"
            >
              <span>Test what you have learned in the challenge below</span>
              <ArrowDown size={15} className="text-[#00FF88]" />
            </button>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* PART 3: THE INTERACTIVE ACTIVITY — 10-QUESTION KNOWLEDGE CHALLENGE   */}
      {/* =================================================================== */}
      <section
        id="exhibit-01-activity"
        className="documentary-scene"
        style={{
          minHeight: '80vh',
          paddingTop: 'clamp(56px, 6vw, 84px)',
          paddingBottom: 'clamp(64px, 7vw, 96px)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderTop: '1px solid rgba(0, 255, 136, 0.25)',
        }}
        aria-label="Exhibit 01 Knowledge and Ethical Judgement Challenge"
      >
        <div className="exhibition-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Header Stamp */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#00FF88]/20">
            <span className="font-mono text-xs font-semibold text-[#00FF88] tracking-widest uppercase">
              EXHIBIT 01 // KNOWLEDGE & ETHICAL JUDGEMENT
            </span>
            <span className="font-mono text-xs text-[#00FF88] font-bold">
              10 QUESTIONS • 150 PTS MAX
            </span>
          </div>

          {/* Monumental Activity Heading */}
          <h3 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '12px',
            }}
          >
            WHAT WOULD YOU DO?
          </h3>

          <p 
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.0625rem, 1.25vw, 1.2rem)',
              lineHeight: 1.65,
              color: '#D1DDD5',
              maxWidth: '820px',
              marginBottom: '32px',
            }}
          >
            Test what you have learned about authentic comprehension, independent problem-solving, and responsible AI use across 10 realistic academic dilemmas.
          </p>

          {/* 10-Question Knowledge Challenge Activity */}
          <Exhibit01QuizActivity
            onScoreUpdate={(points) => {
              if (onScoreUpdate) {
                onScoreUpdate(points);
              }
            }}
            onActivityComplete={(finalScore, totalCorrect) => {
              if (onActivityComplete) {
                onActivityComplete(finalScore, totalCorrect);
              }
              onSelectOption({
                id: `quiz-score-${finalScore}`,
                label: `Challenge Completed (${totalCorrect}/10)`,
                isCorrect: finalScore >= 90,
                explanation: `Earned ${finalScore} of 150 points with ${totalCorrect} of 10 correct responses.`,
              });
            }}
            onContinue={onContinue}
            isCompleted={hasAnswered}
            savedScore={result?.pointsEarned || 0}
          />

        </div>
      </section>

    </div>
  );
};
