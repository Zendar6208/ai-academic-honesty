import React, { useState, useEffect } from 'react';
import type { ExhibitData } from '../../types/game';
import '../../styles/final_score.css';
import {
  RotateCcw,
  CheckCircle2,
  Award,
  Lock,
  ArrowRight,
  Printer,
  ShieldCheck,
  User,
  Edit2,
  Check,
  Sparkles,
} from 'lucide-react';

interface FinalScoreScreenProps {
  score: number;
  maxScore: number;
  exhibits: ExhibitData[];
  results: Partial<Record<string, { isCorrect: boolean; pointsEarned: number }>>;
  completedExhibits?: string[];
  onRestart: () => void;
  onNavigateToExhibit?: (exhibitId: string) => void;
}

// Canonical display names for each exhibit as specified in requirements
const EXHIBIT_DISPLAY_NAMES: Record<string, { number: string; title: string }> = {
  'exhibit-01': { number: '01', title: 'AI Tutor vs AI Substitute' },
  'exhibit-02': { number: '02', title: 'Citation Jigsaw' },
  'exhibit-03': { number: '03', title: 'Ethical or Not?' },
  'exhibit-04': { number: '04', title: 'Repair the Workflow' },
};

// Strict performance title categories
export const getPerformanceDetails = (score: number) => {
  if (score >= 540) {
    return {
      title: 'EXCEPTIONAL',
      color: '#00FF88',
      bgColor: 'rgba(0, 255, 136, 0.12)',
      description:
        'You demonstrated rigorous cognitive independence and ethical discernment across all four inquiries, consistently choosing authentic comprehension and systematic verification over passive automation.',
    };
  }
  if (score >= 480) {
    return {
      title: 'DISTINGUISHED',
      color: '#33FFAA',
      bgColor: 'rgba(51, 255, 170, 0.12)',
      description:
        'You maintained strong academic discernment, understanding that responsible AI use requires active inquiry, fact-checking, and epistemic ownership of your research and writing.',
    };
  }
  if (score >= 420) {
    return {
      title: 'PROFICIENT',
      color: '#8AFFB2',
      bgColor: 'rgba(138, 255, 178, 0.12)',
      description:
        'You recognized key boundary lines between cognitive assistance and academic surrender, with solid critical questioning across the foundational dilemmas.',
    };
  }
  if (score >= 360) {
    return {
      title: 'DEVELOPING',
      color: '#FBBF24',
      bgColor: 'rgba(251, 191, 36, 0.12)',
      description:
        'You engaged with foundational ethical questions. Reviewing citation verification pitfalls and multi-stage workflow repairs will further sharpen your academic judgment.',
    };
  }
  return {
    title: 'NEEDS IMPROVEMENT',
    color: '#FF6B6B',
    bgColor: 'rgba(255, 107, 107, 0.12)',
    description:
      'You explored the challenges, but reliance on automated fluency remains a vulnerability. True academic mastery begins when you verify every claim and write from authentic understanding.',
  };
};

export const FinalScoreScreen: React.FC<FinalScoreScreenProps> = ({
  score: _liveScore,
  maxScore = 600,
  exhibits: _exhibits,
  results,
  completedExhibits = [],
  onRestart,
  onNavigateToExhibit,
}) => {
  // Accurate exhibit scores from results record
  const score01 = results['exhibit-01']?.pointsEarned ?? 0;
  const score02 = results['exhibit-02']?.pointsEarned ?? 0;
  const score03 = results['exhibit-03']?.pointsEarned ?? 0;
  const score04 = results['exhibit-04']?.pointsEarned ?? 0;

  // Strict sum of the 4 actual exhibit scores
  const calculatedTotalScore = Math.min(score01 + score02 + score03 + score04, maxScore);

  // Check which exhibits are completed
  const isExhibit01Complete = completedExhibits.includes('exhibit-01');
  const isExhibit02Complete = completedExhibits.includes('exhibit-02');
  const isExhibit03Complete = completedExhibits.includes('exhibit-03');
  const isExhibit04Complete = completedExhibits.includes('exhibit-04');

  const completedCount = [
    isExhibit01Complete,
    isExhibit02Complete,
    isExhibit03Complete,
    isExhibit04Complete,
  ].filter(Boolean).length;

  const isAllComplete = completedCount === 4;

  // Candidate Name state (Default: 'CANDIDATE', editable for print export)
  const [candidateName, setCandidateName] = useState<string>('CANDIDATE');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('CANDIDATE');

  // Animated counting score
  const [displayedScore, setDisplayedScore] = useState<number>(0);

  // Smooth count-up animation when all 4 exhibits are completed
  useEffect(() => {
    if (!isAllComplete) {
      setDisplayedScore(0);
      return;
    }

    const startVal = 0;
    const target = calculatedTotalScore;

    let startTime: number | null = null;
    const duration = 1000; // 1.0s crisp smooth count-up

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startVal + (target - startVal) * easedProgress);

      setDisplayedScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedScore(target);
      }
    };

    const frameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(frameId);
  }, [isAllComplete, calculatedTotalScore]);

  // Overall percentage
  const percentage = Math.round((calculatedTotalScore / maxScore) * 1000) / 10;
  const performanceDetails = getPerformanceDetails(calculatedTotalScore);

  // SVG Circular Ring parameters
  const ringRadius = 72;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const progressRatio = Math.min(Math.max(displayedScore / maxScore, 0), 1);
  const strokeDashoffset = ringCircumference * (1 - progressRatio);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    setCandidateName(trimmed ? trimmed.toUpperCase() : 'CANDIDATE');
    setIsEditingName(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="final-evaluation"
      className="final-score-section documentary-scene"
      aria-label="Final Candidate Performance Evaluation"
    >
      {/* Ambient background glow */}
      <div className="final-ambient-glow" />

      <div className="exhibition-container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Curatorial Header Stamp */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
            marginBottom: 'clamp(28px, 4vw, 44px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#00FF88',
                letterSpacing: '0.12em',
              }}
            >
              FINALE // SPECIAL COMMISSION
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: '#87968D',
              }}
            >
              VIT-AP ARCHIVE
            </span>
          </div>

          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: isAllComplete ? '#00FF88' : '#FBBF24',
              letterSpacing: '0.08em',
              fontWeight: 700,
            }}
          >
            STATUS: {isAllComplete ? 'EVALUATION COMPLETE // 4 OF 4' : `PENDING // ${completedCount} OF 4 COMPLETED`}
          </div>
        </div>

        {/* =================================================================== */}
        {/* CASE A: PENDING EVALUATION (When < 4 Exhibits are completed)         */}
        {/* =================================================================== */}
        {!isAllComplete && (
          <div className="evaluation-locked-container text-center animate-fadeIn">
            <span className="locked-header-badge">
              <Lock size={13} />
              <span>CANDIDATE REPORT LOCKED // {completedCount} OF 4 COMPLETED</span>
            </span>

            <h2 className="locked-title">COMPLETE ALL FOUR EXHIBITS</h2>

            <p className="locked-description">
              "The Candidate Performance Report synthesizes your discernment across all four inquiries. Complete every activity to reveal your final score, percentage, and performance title."
            </p>

            {/* Checklist of 4 Exhibits */}
            <div className="locked-checklist-grid">
              {[
                {
                  id: 'exhibit-01',
                  num: '01',
                  name: 'AI Tutor vs AI Substitute',
                  isDone: isExhibit01Complete,
                  pts: score01,
                },
                {
                  id: 'exhibit-02',
                  num: '02',
                  name: 'Citation Jigsaw',
                  isDone: isExhibit02Complete,
                  pts: score02,
                },
                {
                  id: 'exhibit-03',
                  num: '03',
                  name: 'Ethical or Not?',
                  isDone: isExhibit03Complete,
                  pts: score03,
                },
                {
                  id: 'exhibit-04',
                  num: '04',
                  name: 'Repair the Workflow',
                  isDone: isExhibit04Complete,
                  pts: score04,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`locked-exhibit-card ${item.isDone ? 'completed' : ''}`}
                >
                  <div>
                    <div className="locked-card-header">
                      <span className="font-mono text-xs font-bold text-[#00FF88]">
                        EXHIBIT {item.num}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${
                          item.isDone ? 'text-[#00FF88]' : 'text-[#FBBF24]'
                        }`}
                      >
                        {item.isDone ? `✓ ${item.pts}/150 PTS` : '⚠ PENDING'}
                      </span>
                    </div>
                    <h4 className="locked-card-title">{item.name}</h4>
                  </div>

                  {!item.isDone && (
                    <button
                      type="button"
                      onClick={() => onNavigateToExhibit?.(item.id)}
                      className="locked-jump-btn"
                    >
                      <span>GO TO CHALLENGE</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                  {item.isDone && (
                    <div className="flex items-center gap-1.5 text-xs text-[#00FF88] font-mono font-bold">
                      <CheckCircle2 size={14} />
                      <span>ACTIVITY COMPLETED</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="font-mono text-xs text-[#87968D]">
              [ INVESTIGATE REMAINING EXHIBITS ABOVE TO UNLOCK OFFICIAL RESULTS ]
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* CASE B: COMPLETE FINAL RESULTS (All 4 Exhibits completed)           */}
        {/* =================================================================== */}
        {isAllComplete && (
          <div className="animate-fadeIn">
            
            {/* 1. CINEMATIC COMPLETION OPENING HERO */}
            <div className="completion-hero-banner">
              <span className="completion-kicker">
                <Sparkles size={12} className="inline mr-1" />
                EXHIBITION COMPLETE // ALL 4 INQUIRIES CONCLUDED
              </span>
              
              <h1 className="completion-hero-title">
                YOU MADE IT THROUGH.
              </h1>

              <p className="completion-hero-subtext">
                "Four challenges. Four opportunities to think critically. One final result."
              </p>
            </div>

            {/* Section Subheading Reveal */}
            <div className="text-center mb-6">
              <span className="font-mono text-xs font-bold text-[#00FF88] uppercase tracking-widest">
                // OFFICIAL PERFORMANCE ASSESSMENT //
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#E4F0E8] mt-1">
                FINAL RESULTS
              </h2>
            </div>

            {/* 2. PREMIUM DIGITAL CANDIDATE RESULT CARD */}
            <div className="candidate-result-card">
              {/* Reticle Corner Brackets */}
              <div className="reticle-corner reticle-tl" />
              <div className="reticle-corner reticle-tr" />
              <div className="reticle-corner reticle-bl" />
              <div className="reticle-corner reticle-br" />

              {/* Card Header Bar */}
              <div className="card-top-header">
                <div className="report-institution-info">
                  <span className="report-series-tag">
                    AI &amp; ACADEMIC HONESTY // VIT-AP UNIVERSITY
                  </span>
                  <h3 className="report-document-title">
                    CANDIDATE PERFORMANCE REPORT
                  </h3>
                </div>

                {/* Candidate Name / ID Display */}
                <div className="candidate-id-badge">
                  <User size={15} className="text-[#00FF88] shrink-0" />
                  {isEditingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="candidate-name-input"
                        placeholder="CANDIDATE NAME"
                        maxLength={24}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') setIsEditingName(false);
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleSaveName}
                        className="p-1 rounded bg-[#00FF88] text-[#050807] cursor-pointer"
                        title="Save name"
                      >
                        <Check size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="candidate-name-text">{candidateName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNameInput(candidateName);
                          setIsEditingName(true);
                        }}
                        className="text-[#87968D] hover:text-[#00FF88] cursor-pointer transition-colors p-0.5"
                        title="Personalize candidate name for printout"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Central Hero Score & Progress Ring Display */}
              <div className="score-hero-display">
                {/* Visual Animated Circular Progress Ring */}
                <div className="score-ring-wrapper">
                  <svg className="score-ring-svg" viewBox="0 0 160 160">
                    <circle
                      className="score-ring-bg"
                      cx="80"
                      cy="80"
                      r={ringRadius}
                      strokeWidth="10"
                    />
                    <circle
                      className="score-ring-fill"
                      cx="80"
                      cy="80"
                      r={ringRadius}
                      strokeWidth="10"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="score-ring-center">
                    <span className="score-ring-percent">
                      {Math.round((displayedScore / maxScore) * 100)}%
                    </span>
                    <span className="score-ring-label">MASTERY</span>
                  </div>
                </div>

                {/* Big Score Typography & Telemetry */}
                <div className="score-number-group">
                  <span className="score-label-kicker">FINAL EVALUATION SCORE</span>
                  <div className="score-big-counter">
                    <span>{displayedScore}</span>
                    <span className="score-max-tag">/ {maxScore} PTS</span>
                  </div>

                  {/* Metadata Chips */}
                  <div className="score-meta-pills">
                    <span className="score-meta-pill">
                      PERCENTAGE: {percentage}%
                    </span>
                    <span className="score-meta-pill">
                      COMPLETED: 4 / 4 EXHIBITS
                    </span>
                    <span className="score-meta-pill text-[#00FF88] border-[#00FF88]/40">
                      STATUS: COMPLETED
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Title Badge */}
              <div className="performance-tier-container">
                <div
                  className="performance-tier-badge"
                  style={{
                    color: performanceDetails.color,
                    backgroundColor: performanceDetails.bgColor,
                    borderColor: performanceDetails.color,
                  }}
                >
                  <Award size={16} />
                  <span>PERFORMANCE: {performanceDetails.title}</span>
                </div>
                <p className="performance-tier-desc">{performanceDetails.description}</p>
                <p className="performance-tier-disclaimer">
                  * Performance categories reflect exhibition simulation metrics and are not official university grades.
                </p>
              </div>

              {/* 3. EXHIBIT-WISE SCORE BREAKDOWN */}
              <div className="breakdown-section-title">
                <span>EXHIBIT-WISE PERFORMANCE BREAKDOWN</span>
                <span className="text-[11px] text-[#87968D]">4 / 4 CHALLENGES VERIFIED</span>
              </div>

              <div className="exhibit-breakdown-grid">
                {[
                  {
                    id: 'exhibit-01',
                    num: EXHIBIT_DISPLAY_NAMES['exhibit-01'].number,
                    title: EXHIBIT_DISPLAY_NAMES['exhibit-01'].title,
                    score: score01,
                    max: 150,
                  },
                  {
                    id: 'exhibit-02',
                    num: EXHIBIT_DISPLAY_NAMES['exhibit-02'].number,
                    title: EXHIBIT_DISPLAY_NAMES['exhibit-02'].title,
                    score: score02,
                    max: 150,
                  },
                  {
                    id: 'exhibit-03',
                    num: EXHIBIT_DISPLAY_NAMES['exhibit-03'].number,
                    title: EXHIBIT_DISPLAY_NAMES['exhibit-03'].title,
                    score: score03,
                    max: 150,
                  },
                  {
                    id: 'exhibit-04',
                    num: EXHIBIT_DISPLAY_NAMES['exhibit-04'].number,
                    title: EXHIBIT_DISPLAY_NAMES['exhibit-04'].title,
                    score: score04,
                    max: 150,
                  },
                ].map((item) => {
                  const itemPercent = Math.round((item.score / item.max) * 100);
                  return (
                    <div key={item.id} className="breakdown-card">
                      <div className="breakdown-card-top">
                        <div>
                          <span className="breakdown-exhibit-num">
                            EXHIBIT {item.num}
                          </span>
                          <h4 className="breakdown-exhibit-name">{item.title}</h4>
                        </div>
                        <div className="breakdown-score-badge">
                          <span className="breakdown-score-value">{item.score}</span>
                          <span className="breakdown-score-max"> / {item.max}</span>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div>
                        <div className="breakdown-bar-track">
                          <div
                            className="breakdown-bar-fill"
                            style={{ width: `${itemPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="font-mono text-[10px] text-[#87968D]">
                            {item.score > 0 ? '✓ COMPLETED' : 'PARTICIPATED'}
                          </span>
                          <span className="font-mono text-[10px] text-[#00FF88] font-bold">
                            {itemPercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 4. FINAL TAKEAWAY DIRECTIVE */}
              <div className="final-takeaway-box">
                <span className="takeaway-tag">THE FINAL TAKEAWAY</span>
                <h4 className="takeaway-headline">
                  THE REAL SCORE IS WHAT YOU TAKE FORWARD.
                </h4>
                <p className="takeaway-text">
                  "AI can generate answers, ideas, and information. Responsible use begins when you understand, verify, question, and take ownership of your work."
                </p>
                <div className="takeaway-signature">
                  VIT-AP University • Academic Ethics &amp; Integrity Commission
                </div>
              </div>

              {/* 5. ACTION BUTTONS */}
              <div className="final-actions-row">
                {/* PRIMARY: EXPERIENCE COMPLETE */}
                <div className="btn-complete-badge">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                  <span>EXPERIENCE COMPLETE</span>
                </div>

                {/* EXPORT: SAVE MY RESULTS */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-print-export"
                  title="Print or export candidate performance report as PDF"
                >
                  <Printer size={16} />
                  <span>SAVE MY RESULTS</span>
                </button>

                {/* SECONDARY: NEW VISITOR */}
                <button
                  type="button"
                  onClick={onRestart}
                  className="btn-new-visitor"
                  title="Reset exhibition and start fresh"
                >
                  <RotateCcw size={16} />
                  <span>NEW VISITOR</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
