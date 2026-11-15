import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SWIPE_SITUATIONS,
  EXHIBIT_03_LEVELS,
  type SwipeSituation,
} from '../../data/exhibit03Data';
import '../../styles/ethical_swipe.css';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Award,
  Layers,
  AlertOctagon,
  Scale,
} from 'lucide-react';

interface Exhibit03EthicalSwipeGameProps {
  onScoreUpdate?: (points: number) => void;
  onActivityComplete?: (finalScore: number, isVerdictCorrect: boolean) => void;
  onContinue?: () => void;
  isCompleted?: boolean;
  savedScore?: number;
}

interface UserAnswer {
  situationId: string;
  userClassifiedEthical: boolean;
  isCorrect: boolean;
  points: number;
}

export const Exhibit03EthicalSwipeGame: React.FC<Exhibit03EthicalSwipeGameProps> = ({
  onScoreUpdate,
  onActivityComplete,
  onContinue,
  isCompleted = false,
  savedScore = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [gameScore, setGameScore] = useState<number>(savedScore);
  const [cardState, setCardState] = useState<'idle' | 'dragging' | 'animating_out' | 'feedback' | 'completed'>(
    isCompleted ? 'completed' : 'idle'
  );
  const [flyDirection, setFlyDirection] = useState<'left' | 'right' | null>(null);
  const [levelIntroDismissed, setLevelIntroDismissed] = useState<Record<number, boolean>>({
    1: true, // Auto-dismissed on start
    2: false,
    3: false,
  });

  // Swipe drag tracking
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPointerDownRef = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentDragXRef = useRef<number>(0);
  const cardElementRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 90; // Pixels required to trigger swipe
  const currentSituation: SwipeSituation | undefined = SWIPE_SITUATIONS[currentIndex];
  const currentLevelInfo = currentSituation ? EXHIBIT_03_LEVELS[currentSituation.level] : EXHIBIT_03_LEVELS[1];

  // Total correct count
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  // Level breakdowns
  const level1Points = userAnswers
    .filter((a) => {
      const sit = SWIPE_SITUATIONS.find((s) => s.id === a.situationId);
      return sit?.level === 1;
    })
    .reduce((sum, a) => sum + a.points, 0);

  const level2Points = userAnswers
    .filter((a) => {
      const sit = SWIPE_SITUATIONS.find((s) => s.id === a.situationId);
      return sit?.level === 2;
    })
    .reduce((sum, a) => sum + a.points, 0);

  const level3Points = userAnswers
    .filter((a) => {
      const sit = SWIPE_SITUATIONS.find((s) => s.id === a.situationId);
      return sit?.level === 3;
    })
    .reduce((sum, a) => sum + a.points, 0);

  // Execute classification decision (from swipe or button)
  const handleClassify = useCallback(
    (classifiedAsEthical: boolean) => {
      if (cardState !== 'idle' || !currentSituation) return;

      const isCorrect = classifiedAsEthical === currentSituation.isEthical;
      const pointsEarned = isCorrect ? 15 : 0;

      // Animate card fly-out
      setFlyDirection(classifiedAsEthical ? 'right' : 'left');
      setCardState('animating_out');

      // Record answer
      const newAnswer: UserAnswer = {
        situationId: currentSituation.id,
        userClassifiedEthical: classifiedAsEthical,
        isCorrect,
        points: pointsEarned,
      };

      setTimeout(() => {
        setUserAnswers((prev) => [...prev, newAnswer]);
        if (pointsEarned > 0) {
          setGameScore((prev) => prev + pointsEarned);
          onScoreUpdate?.(pointsEarned);
        }
        setCardState('feedback');
        setFlyDirection(null);
        setDragOffset({ x: 0, y: 0 });
        currentDragXRef.current = 0;
      }, 250);
    },
    [cardState, currentSituation, onScoreUpdate]
  );

  // Advance to next situation
  const handleNextSituation = useCallback(() => {
    if (currentIndex < SWIPE_SITUATIONS.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextLevel = SWIPE_SITUATIONS[nextIdx].level;

      setCurrentIndex(nextIdx);
      setCardState('idle');
      setDragOffset({ x: 0, y: 0 });
      currentDragXRef.current = 0;

      // Check if entering a new level that has not been acknowledged
      if (!levelIntroDismissed[nextLevel]) {
        setLevelIntroDismissed((prev) => ({ ...prev, [nextLevel]: false }));
      }
    } else {
      // Activity completed
      setCardState('completed');
      const finalScore = userAnswers.reduce((sum, a) => sum + a.points, 0);
      onActivityComplete?.(finalScore, finalScore >= 90);
    }
  }, [currentIndex, levelIntroDismissed, onActivityComplete, userAnswers]);

  // Keyboard navigation: ArrowLeft (Non-Ethical), ArrowRight (Ethical), Enter (Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cardState === 'idle') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handleClassify(false);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleClassify(true);
        }
      } else if (cardState === 'feedback') {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextSituation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cardState, handleClassify, handleNextSituation]);

  // Pointer / Touch drag handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (cardState !== 'idle') return;
    isPointerDownRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    currentDragXRef.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || cardState !== 'idle') return;
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    // Ignore if vertical scrolling is dominant
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaX) < 15) {
      return;
    }

    currentDragXRef.current = deltaX;
    setDragOffset({ x: deltaX, y: deltaY * 0.2 });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
    }

    const deltaX = currentDragXRef.current;
    if (deltaX > SWIPE_THRESHOLD) {
      handleClassify(true); // Swipe right = Ethical
    } else if (deltaX < -SWIPE_THRESHOLD) {
      handleClassify(false); // Swipe left = Non-Ethical
    } else {
      // Reset card position
      setDragOffset({ x: 0, y: 0 });
      currentDragXRef.current = 0;
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
    setDragOffset({ x: 0, y: 0 });
    currentDragXRef.current = 0;
  };

  // Helper: Card Transform CSS
  const getCardTransform = () => {
    if (cardState === 'animating_out') {
      const targetX = flyDirection === 'right' ? 600 : -600;
      const targetRotate = flyDirection === 'right' ? 24 : -24;
      return `translateX(${targetX}px) rotate(${targetRotate}deg)`;
    }
    const rotate = (dragOffset.x / 14);
    return `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotate}deg)`;
  };

  // Drag Indicators Opacity
  const ethicalOpacity = Math.max(0, Math.min(1, dragOffset.x / (SWIPE_THRESHOLD * 0.8)));
  const nonEthicalOpacity = Math.max(0, Math.min(1, -dragOffset.x / (SWIPE_THRESHOLD * 0.8)));

  // Render meaningful scenario illustration
  const renderScenarioIllustration = (iconType: SwipeSituation['iconType']) => {
    switch (iconType) {
      case 'code':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
            <rect x="35" y="25" width="230" height="40" rx="4" fill="#050C08" />
            <text x="45" y="42" fill="#FF4B4B" fontSize="9.5" fontFamily="monospace">
              def solve(): # AI generated solution
            </text>
            <text x="45" y="55" fill="#87968D" fontSize="9.5" fontFamily="monospace">
              &nbsp;&nbsp;my_val_1 = ai_output_core(x) # renamed vars
            </text>
          </svg>
        );
      case 'dialogue':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
            <circle cx="55" cy="45" r="14" fill="#133622" stroke="#00FF88" strokeWidth="1.5" />
            <circle cx="105" cy="45" r="14" fill="#1B472E" stroke="#00FF88" strokeWidth="1.5" />
            <path d="M 69 45 L 91 45" stroke="#00FF88" strokeWidth="2" strokeDasharray="3 3" />
            <text x="135" y="38" fill="#00FF88" fontSize="10" fontFamily="monospace" fontWeight="bold">TUTOR DIALOGUE → SOLO DRAFT</text>
            <text x="135" y="54" fill="#E4F0E8" fontSize="9" fontFamily="sans-serif">Closing AI window before writing own paper</text>
          </svg>
        );
      case 'citation':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
            <rect x="35" y="26" width="120" height="38" rx="4" fill="#1E0E0E" stroke="#FF4B4B" strokeWidth="1" />
            <text x="45" y="42" fill="#FFA5A5" fontSize="8.5" fontFamily="monospace">doi: 10.1016/j.fake.2025</text>
            <text x="45" y="54" fill="#FF4B4B" fontSize="8.5" fontFamily="monospace">UNVERIFIED SOURCE ⚠</text>
            <text x="170" y="42" fill="#FFB800" fontSize="9.5" fontFamily="monospace" fontWeight="bold">COPIED AT MIDNIGHT</text>
            <text x="170" y="56" fill="#87968D" fontSize="8.5" fontFamily="sans-serif">Direct paste into bibliography</text>
          </svg>
        );
      case 'library':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
            <rect x="35" y="26" width="115" height="38" rx="4" fill="#0B2B1B" stroke="#00FF88" strokeWidth="1" />
            <text x="45" y="42" fill="#00FF88" fontSize="9" fontFamily="monospace">✓ IEEE / ACM DATABASE</text>
            <text x="45" y="54" fill="#E4F0E8" fontSize="8.5" fontFamily="monospace">FULL PDF VERIFIED</text>
            <text x="165" y="38" fill="#00FF88" fontSize="10" fontFamily="monospace" fontWeight="bold">PERMITTED RESEARCH LEADS</text>
            <text x="165" y="54" fill="#87968D" fontSize="8.5" fontFamily="sans-serif">Reading & verifying all cited sources</text>
          </svg>
        );
      case 'policy_ban':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#FF4B4B" strokeWidth="1" />
            <rect x="35" y="28" width="140" height="34" rx="4" fill="#240A0A" stroke="#FF4B4B" strokeWidth="1.5" />
            <text x="45" y="44" fill="#FF6B6B" fontSize="9" fontFamily="monospace" fontWeight="bold">COURSE SYLLABUS RULE:</text>
            <text x="45" y="55" fill="#FFA5A5" fontSize="8.5" fontFamily="monospace">"NO AI TOOLS PERMITTED"</text>
            <circle cx="215" cy="45" r="16" fill="#3D1212" stroke="#FF4B4B" strokeWidth="1.5" />
            <text x="215" y="50" fill="#FF4B4B" fontSize="16" fontWeight="bold" textAnchor="middle">✕</text>
          </svg>
        );
      case 'drafts':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
            <rect x="35" y="35" width="40" height="30" rx="3" fill="#0B2114" stroke="#00FF88" strokeWidth="1" />
            <rect x="45" y="30" width="40" height="30" rx="3" fill="#102D1B" stroke="#00FF88" strokeWidth="1" />
            <rect x="55" y="25" width="40" height="30" rx="3" fill="#173B25" stroke="#00FF88" strokeWidth="1.5" />
            <text x="110" y="38" fill="#00FF88" fontSize="10" fontFamily="monospace" fontWeight="bold">ATTRIBUTION NOTE ATTACHED</text>
            <text x="110" y="54" fill="#E4F0E8" fontSize="9" fontFamily="sans-serif">Transparent log + original unedited drafts</text>
          </svg>
        );
      case 'group':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
            <circle cx="45" cy="45" r="12" fill="#11291D" stroke="#00FF88" strokeWidth="1" />
            <circle cx="75" cy="45" r="12" fill="#11291D" stroke="#00FF88" strokeWidth="1" />
            <circle cx="105" cy="45" r="12" fill="#11291D" stroke="#00FF88" strokeWidth="1" />
            <circle cx="135" cy="45" r="12" fill="#361111" stroke="#FF4B4B" strokeWidth="1.5" />
            <text x="135" y="49" fill="#FF4B4B" fontSize="9" fontWeight="bold" textAnchor="middle">AI</text>
            <text x="160" y="38" fill="#FF6B6B" fontSize="10" fontFamily="monospace" fontWeight="bold">UNDISCLOSED AI CONTRIBUTION</text>
            <text x="160" y="54" fill="#87968D" fontSize="8.5" fontFamily="sans-serif">Concealed from fellow teammates</text>
          </svg>
        );
      case 'paraphrase':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
            <rect x="35" y="28" width="90" height="34" rx="4" fill="#081810" stroke="#00FF88" strokeWidth="1" />
            <text x="42" y="44" fill="#87968D" fontSize="8" fontFamily="monospace">AI Thesis Outline</text>
            <text x="42" y="54" fill="#00FF88" fontSize="8" fontFamily="monospace">Argument 1, 2, 3</text>
            <path d="M 130 45 L 155 45" stroke="#FF4B4B" strokeWidth="2" strokeDasharray="3 3" />
            <rect x="160" y="28" width="105" height="34" rx="4" fill="#240D0D" stroke="#FF4B4B" strokeWidth="1" />
            <text x="168" y="44" fill="#FFA5A5" fontSize="8" fontFamily="monospace">Direct Paraphrase</text>
            <text x="168" y="54" fill="#FF4B4B" fontSize="8" fontFamily="monospace">No attribution citation</text>
          </svg>
        );
      case 'debugging':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#00FF88" strokeWidth="1" />
            <rect x="35" y="26" width="120" height="38" rx="4" fill="#05170F" stroke="#00FF88" strokeWidth="1" />
            <text x="42" y="42" fill="#FFB800" fontSize="8.5" fontFamily="monospace">Traceback: Line 42</text>
            <text x="42" y="54" fill="#00FF88" fontSize="8.5" fontFamily="monospace">Fix: for i in range(n)</text>
            <text x="170" y="38" fill="#00FF88" fontSize="10" fontFamily="monospace" fontWeight="bold">SYNTAX DEBUGGING HINT</text>
            <text x="170" y="54" fill="#E4F0E8" fontSize="8.5" fontFamily="sans-serif">Author wrote 150 lines, fixed loop</text>
          </svg>
        );
      case 'exam':
        return (
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <rect x="20" y="15" width="260" height="60" rx="8" fill="#0A1810" stroke="#FF4B4B" strokeWidth="1" />
            <rect x="35" y="28" width="100" height="34" rx="4" fill="#140909" stroke="#FF4B4B" strokeWidth="1" />
            <text x="42" y="44" fill="#FF6B6B" fontSize="8.5" fontFamily="monospace">Quiz Timer: 14:22</text>
            <text x="42" y="54" fill="#FFA5A5" fontSize="8" fontFamily="monospace">Question 7 of 20</text>
            <rect x="150" y="28" width="115" height="34" rx="4" fill="#240B0B" stroke="#FF4B4B" strokeWidth="1" />
            <text x="158" y="44" fill="#FF4B4B" fontSize="8.5" fontFamily="monospace">AI Tab: Live Search</text>
            <text x="158" y="54" fill="#FFA5A5" fontSize="8" fontFamily="monospace">Assessment Compromised</text>
          </svg>
        );
      default:
        return (
          <div className="flex items-center gap-3 text-emerald-400">
            <Scale size={28} />
            <span className="font-mono text-xs">ACADEMIC HONESTY DILEMMA</span>
          </div>
        );
    }
  };

  // Performance descriptive badge for completion screen
  const getPerformanceDebrief = () => {
    if (gameScore === 150) {
      return {
        title: 'Master of Academic Agency // Flawless Ethical Discernment',
        desc: 'You demonstrated clear discernment between responsible AI tutoring and academic misconduct. You understand how to maintain authentic cognitive agency, verify sources, and preserve academic integrity in your university work.',
      };
    }
    if (gameScore >= 105) {
      return {
        title: 'Principled Scholar // Strong Ethical Practice',
        desc: 'You consistently recognized the importance of authentic thinking, transparent attribution, and respecting course policies when using generative tools.',
      };
    }
    return {
      title: 'Developing Practitioner // Core Principles',
      desc: 'Remember: AI can challenge your thinking, but comprehension, accountability, and the final solution must remain your own.',
    };
  };

  return (
    <div className="swipe-game-container">
      
      {/* =================================================================== */}
      {/* 1. TOP HEADER STATUS STRIP                                          */}
      {/* =================================================================== */}
      <div className="swipe-header-strip">
        <div className="swipe-header-left">
          <span className="swipe-pulse-dot" />
          <div>
            <span className="swipe-header-title">
              EXHIBIT 03 ACTIVITY // ETHICAL OR NOT?
            </span>
            <span className="swipe-header-subtitle">
              If you were the student, is this a responsible way to use AI?
            </span>
          </div>
        </div>

        <div className="swipe-header-stats">
          <span className="swipe-stat-pill">
            <Layers size={13} className="text-[#00FF88]" />
            <span>{currentSituation ? currentSituation.levelTitle : 'COMPLETED'}</span>
          </span>
          <span className="swipe-stat-pill">
            <span>SITUATION {Math.min(currentIndex + 1, 10)} / 10</span>
          </span>
          <span className="swipe-stat-pill swipe-score-pill">
            <Award size={14} />
            <span>{gameScore} / 150 PTS</span>
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. LEVEL PROGRESS TRACKER (10 Situation Dots)                       */}
      {/* =================================================================== */}
      <div className="swipe-level-tracker">
        <span className="font-mono text-xs text-[#00FF88] font-semibold">
          {currentLevelInfo.name} ({currentLevelInfo.rangeText})
        </span>

        <div className="swipe-level-dots">
          {SWIPE_SITUATIONS.map((sit, idx) => {
            const answer = userAnswers[idx];
            let dotClass = 'swipe-question-dot';
            if (answer) {
              dotClass += answer.isCorrect ? ' completed-correct' : ' completed-incorrect';
            } else if (idx === currentIndex) {
              dotClass += ' current';
            }
            return (
              <div
                key={sit.id}
                className={dotClass}
                title={`Situation ${idx + 1}: ${sit.scenarioTitle}`}
              />
            );
          })}
        </div>

        <span className="font-mono text-xs text-[#87968D]">
          {correctCount} / 10 Correct
        </span>
      </div>

      {/* =================================================================== */}
      {/* 3. LEVEL INTRO BANNER (Shows on entering Level 2 or 3)              */}
      {/* =================================================================== */}
      {currentSituation && !levelIntroDismissed[currentSituation.level] && (
        <div className="swipe-level-banner">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#00FF88] tracking-widest uppercase">
                {currentLevelInfo.badge}
              </span>
              <h4 className="font-display text-xl sm:text-2xl font-bold text-white mt-1 mb-2">
                {currentLevelInfo.subtitle}
              </h4>
              <p className="font-body text-sm text-[#C2D8C9] leading-relaxed">
                {currentLevelInfo.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setLevelIntroDismissed((prev) => ({
                  ...prev,
                  [currentSituation.level]: true,
                }))
              }
              className="px-4 py-2 rounded-lg bg-[#00FF88] hover:bg-[#33FFAA] text-[#050807] font-display text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-all"
            >
              START LEVEL →
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. MAIN ARENA: CARD / FEEDBACK / COMPLETION                         */}
      {/* =================================================================== */}
      {cardState !== 'completed' && currentSituation && (
        <>
          <div className="swipe-arena">
            
            {/* Feedback Screen for current situation */}
            {cardState === 'feedback' && (
              <div
                className={`swipe-feedback-card ${
                  userAnswers[userAnswers.length - 1]?.isCorrect
                    ? 'swipe-feedback-correct'
                    : 'swipe-feedback-incorrect'
                }`}
              >
                {/* Result Pill */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`swipe-feedback-badge ${
                      userAnswers[userAnswers.length - 1]?.isCorrect ? 'correct' : 'incorrect'
                    }`}
                  >
                    {userAnswers[userAnswers.length - 1]?.isCorrect ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>CORRECT JUDGEMENT (+15 PTS)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} />
                        <span>INCORRECT JUDGEMENT (+0 PTS)</span>
                      </>
                    )}
                  </span>

                  <span className="font-mono text-xs text-[#87968D]">
                    SITUATION {currentSituation.number} OF 10
                  </span>
                </div>

                {/* Ground Truth Label */}
                <div>
                  <span
                    className={`swipe-truth-pill ${
                      currentSituation.isEthical ? 'swipe-truth-ethical' : 'swipe-truth-non-ethical'
                    }`}
                  >
                    {currentSituation.isEthical ? (
                      <>
                        <ShieldCheck size={16} />
                        <span>THIS CONDUCT IS ETHICAL</span>
                      </>
                    ) : (
                      <>
                        <AlertOctagon size={16} />
                        <span>THIS CONDUCT IS NON-ETHICAL</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Scenario Recap */}
                <p className="font-display font-bold text-base text-[#E4F0E8] mb-3">
                  {currentSituation.scenarioTitle}:
                </p>

                {/* Educational Principle Explanation */}
                <div className="swipe-explanation-box">
                  <p className="font-semibold text-white mb-1">
                    Core Academic Honesty Principle:
                  </p>
                  <p className="text-[#C2D8C9] leading-relaxed">
                    {currentSituation.explanation}
                  </p>
                </div>

                {/* Advance Button */}
                <button
                  type="button"
                  onClick={handleNextSituation}
                  className="swipe-next-btn"
                >
                  <span>
                    {currentIndex < SWIPE_SITUATIONS.length - 1
                      ? 'NEXT SITUATION'
                      : 'VIEW FINAL EVALUATION'}
                  </span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Draggable Active Situation Card */}
            {cardState !== 'feedback' && (
              <div
                ref={cardElementRef}
                className={`swipe-card ${cardState === 'dragging' ? 'dragging' : ''}`}
                style={{
                  transform: getCardTransform(),
                  transition:
                    cardState === 'idle'
                      ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
                      : cardState === 'animating_out'
                      ? 'transform 0.25s ease-in, opacity 0.25s ease-in'
                      : 'none',
                  opacity: cardState === 'animating_out' ? 0 : 1,
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
              >
                {/* Visual Directional Badges during Drag */}
                <div
                  className="swipe-badge-overlay swipe-badge-ethical"
                  style={{ opacity: ethicalOpacity }}
                >
                  ETHICAL →
                </div>
                <div
                  className="swipe-badge-overlay swipe-badge-non-ethical"
                  style={{ opacity: nonEthicalOpacity }}
                >
                  ← NON-ETHICAL
                </div>

                {/* Card Topbar */}
                <div className="swipe-card-topbar">
                  <span className="swipe-card-tag">
                    {currentSituation.levelTitle} // #{currentSituation.number}
                  </span>
                  <span className="font-mono text-xs text-[#00FF88]/80">
                    Is this a responsible way to use AI?
                  </span>
                </div>

                {/* Meaningful Visual Illustration for this Scenario */}
                <div className="swipe-scenario-illustration">
                  {renderScenarioIllustration(currentSituation.iconType)}
                </div>

                {/* Scenario Title */}
                <h3 className="swipe-scenario-title">
                  {currentSituation.scenarioTitle}
                </h3>

                {/* Situation Statement */}
                <p className="swipe-situation-text">
                  "{currentSituation.situationText}"
                </p>

                {/* Bottom hint */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#87968D]">
                  <span className="flex items-center gap-1.5">
                    <ArrowLeft size={12} className="text-[#FF6B6B]" />
                    <span className="text-[#FF6B6B]">Drag Left: NON-ETHICAL</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#00FF88]">Drag Right: ETHICAL</span>
                    <ArrowRight size={12} className="text-[#00FF88]" />
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* ================================================================= */}
          {/* 5. ALWAYS-ACCESSIBLE ACTION BUTTONS (Clickable alternative)       */}
          {/* ================================================================= */}
          {cardState !== 'feedback' && (
            <div className="swipe-actions-strip">
              <button
                type="button"
                onClick={() => handleClassify(false)}
                className="swipe-btn swipe-btn-non-ethical"
                title="Classify situation as Non-Ethical (or Swipe Left / Press Left Arrow)"
                aria-label="Classify as Non-Ethical"
              >
                <ArrowLeft size={18} />
                <span>NON-ETHICAL</span>
              </button>

              <button
                type="button"
                onClick={() => handleClassify(true)}
                className="swipe-btn swipe-btn-ethical"
                title="Classify situation as Ethical (or Swipe Right / Press Right Arrow)"
                aria-label="Classify as Ethical"
              >
                <span>ETHICAL</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* =================================================================== */}
      {/* 6. FINAL EVALUATION / COMPLETION SHOWCASE                            */}
      {/* =================================================================== */}
      {cardState === 'completed' && (
        <div className="swipe-complete-container">
          
          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-mono text-xs font-bold text-[#00FF88] tracking-widest uppercase">
              EXHIBIT 03 // ASSESSMENT COMPLETE
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Ethical Discernment Evaluation
            </h3>
          </div>

          {/* Score Showcase */}
          <div className="swipe-score-display">
            <span className="font-mono text-xs font-bold text-[#87968D] tracking-widest uppercase mb-1">
              POINTS EARNED
            </span>
            <div className="swipe-score-number">
              {gameScore}
              <span className="text-xl text-[#00FF88]/60 font-mono"> / 150 PTS</span>
            </div>
            <p className="font-mono text-sm text-[#00FF88] font-semibold">
              {correctCount} OF 10 SITUATIONS CORRECTLY CLASSIFIED
            </p>
          </div>

          {/* Level Breakdown Grid */}
          <div className="swipe-level-breakdown-grid">
            <div className="swipe-level-card">
              <span className="font-mono text-[11px] text-[#87968D] block uppercase">
                LEVEL 01 // FIRST IMPRESSIONS
              </span>
              <span className="font-display text-xl font-bold text-[#00FF88] mt-1 block">
                {level1Points} / 45 PTS
              </span>
              <span className="font-body text-xs text-[#C2D8C9] mt-0.5 block">
                Agency & authentic effort
              </span>
            </div>

            <div className="swipe-level-card">
              <span className="font-mono text-[11px] text-[#87968D] block uppercase">
                LEVEL 02 // LOOK CLOSER
              </span>
              <span className="font-display text-xl font-bold text-[#00FF88] mt-1 block">
                {level2Points} / 60 PTS
              </span>
              <span className="font-body text-xs text-[#C2D8C9] mt-0.5 block">
                Policy, verification & logs
              </span>
            </div>

            <div className="swipe-level-card">
              <span className="font-mono text-[11px] text-[#87968D] block uppercase">
                LEVEL 03 // DIFFICULT CASES
              </span>
              <span className="font-display text-xl font-bold text-[#00FF88] mt-1 block">
                {level3Points} / 45 PTS
              </span>
              <span className="font-body text-xs text-[#C2D8C9] mt-0.5 block">
                Nuanced student grey areas
              </span>
            </div>
          </div>

          {/* Debrief Message */}
          <div className="bg-[#0A1A11] border-l-4 border-[#00FF88] p-5 rounded-r-xl mb-8">
            <h5 className="font-display font-bold text-white text-base mb-1">
              {getPerformanceDebrief().title}
            </h5>
            <p className="font-body text-sm text-[#C2D8C9] leading-relaxed">
              {getPerformanceDebrief().desc}
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 font-mono text-xs text-[#00FF88] font-bold">
              CORE PRINCIPLE: "IF I WERE THE STUDENT, WOULD THIS BE A RESPONSIBLE WAY TO USE AI?"
            </div>
          </div>

          {/* Unlock Continue to Exhibit 04 */}
          <div>
            <button
              type="button"
              onClick={onContinue}
              className="swipe-continue-btn"
            >
              <span>CONTINUE TO EXHIBIT 04: ETHICAL ATTRIBUTION</span>
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
