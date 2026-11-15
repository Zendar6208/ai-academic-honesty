import React, { useState, useEffect } from 'react';
import {
  ASSIGNMENT_SCENARIO,
  STAGE_01_CARDS,
  STAGE_02_STEPS,
  STAGE_03_DECISIONS,
  calculateStage02Score,
  type WorkflowStep,
  type FinalCheckDecision,
} from '../../data/exhibit04Data';
import '../../styles/workflow_repair.css';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Compass,
  Search,
  PenTool,
  FileText,
  Award,
  Sparkles,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface Exhibit04RepairWorkflowGameProps {
  onScoreUpdate?: (points: number) => void;
  onActivityComplete?: (finalScore: number, isVerdictCorrect: boolean) => void;
  onContinue?: () => void;
  isCompleted?: boolean;
  savedScore?: number;
}

export const Exhibit04RepairWorkflowGame: React.FC<Exhibit04RepairWorkflowGameProps> = ({
  onScoreUpdate,
  onActivityComplete,
  onContinue,
  isCompleted = false,
  savedScore = 0,
}) => {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(isCompleted ? 4 : 1);
  const [stage01Score, setStage01Score] = useState<number>(0);
  const [stage02Score, setStage02Score] = useState<number>(0);
  const [stage03Score, setStage03Score] = useState<number>(0);
  const [totalGameScore, setTotalGameScore] = useState<number>(savedScore);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // STAGE 01 STATE: FIND THE DAMAGE
  // -------------------------------------------------------------------------
  const [stage01Placements, setStage01Placements] = useState<Record<string, 'RESPONSIBLE' | 'PROBLEMATIC'>>({});
  const [selectedDamageCardId, setSelectedDamageCardId] = useState<string | null>(null);
  const [stage01Evaluated, setStage01Evaluated] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // STAGE 02 STATE: REBUILD THE WORKFLOW
  // -------------------------------------------------------------------------
  // Shuffled steps pool
  const [shuffledSteps, setShuffledSteps] = useState<WorkflowStep[]>([]);
  // Slots 1 to 6 mapped to WorkflowStep | null
  const [slotAssignments, setSlotAssignments] = useState<Record<number, WorkflowStep | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });
  const [selectedStepToPlace, setSelectedStepToPlace] = useState<WorkflowStep | null>(null);
  const [stage02Verified, setStage02Verified] = useState<boolean>(false);
  const [stage02CorrectCount, setStage02CorrectCount] = useState<number>(0);

  // Initialize shuffled steps for Stage 02
  useEffect(() => {
    const shuffleArray = (array: WorkflowStep[]) => {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      // Ensure it's not accidentally in exact order
      if (copy[0].stepNumber === 1 && copy[1].stepNumber === 2 && copy[2].stepNumber === 3) {
        [copy[0], copy[copy.length - 1]] = [copy[copy.length - 1], copy[0]];
      }
      return copy;
    };
    setShuffledSteps(shuffleArray(STAGE_02_STEPS));
  }, []);

  // -------------------------------------------------------------------------
  // STAGE 03 STATE: THE FINAL CHECK
  // -------------------------------------------------------------------------
  const [decisionIndex, setDecisionIndex] = useState<number>(0);
  const [decisionAnswers, setDecisionAnswers] = useState<
    Array<{ decisionId: string; selectedOption: 'A' | 'B'; isCorrect: boolean }>
  >([]);
  const [decisionFeedbackVisible, setDecisionFeedbackVisible] = useState<boolean>(false);

  // =========================================================================
  // STAGE 01 HANDLERS
  // =========================================================================
  const handleSelectDamageCard = (cardId: string) => {
    if (stage01Evaluated) return;
    setSelectedDamageCardId((prev) => (prev === cardId ? null : cardId));
  };

  const handlePlaceDamageCard = (cardId: string, category: 'RESPONSIBLE' | 'PROBLEMATIC') => {
    if (stage01Evaluated) return;
    setStage01Placements((prev) => ({
      ...prev,
      [cardId]: category,
    }));
    setSelectedDamageCardId(null);
  };

  const handleRemoveStage01Card = (cardId: string) => {
    if (stage01Evaluated) return;
    setStage01Placements((prev) => {
      const copy = { ...prev };
      delete copy[cardId];
      return copy;
    });
  };

  const allStage01CardsPlaced = STAGE_01_CARDS.every((card) => stage01Placements[card.id]);

  const handleEvaluateStage01 = () => {
    if (stage01Evaluated || !allStage01CardsPlaced) return;

    let points = 0;
    STAGE_01_CARDS.forEach((card) => {
      if (stage01Placements[card.id] === card.correctCategory) {
        points += 10;
      }
    });

    setStage01Score(points);
    setTotalGameScore((prev) => prev + points);
    onScoreUpdate?.(points);
    setStage01Evaluated(true);
  };

  const handleAdvanceToStage02 = () => {
    setCurrentStage(2);
  };

  // =========================================================================
  // STAGE 02 HANDLERS
  // =========================================================================
  const handleSelectStepCard = (step: WorkflowStep) => {
    if (stage02Verified) return;
    setSelectedStepToPlace((prev) => (prev?.stepKey === step.stepKey ? null : step));
  };

  const handleAssignToSlot = (slotNumber: number) => {
    if (stage02Verified) return;

    // If clicking an occupied slot without a selected card, remove it back to pool
    if (!selectedStepToPlace) {
      const currentInSlot = slotAssignments[slotNumber];
      if (currentInSlot) {
        setSlotAssignments((prev) => ({ ...prev, [slotNumber]: null }));
        setShuffledSteps((prev) => [...prev, currentInSlot]);
      }
      return;
    }

    // Placing selectedStepToPlace into slotNumber
    const existingInSlot = slotAssignments[slotNumber];

    setSlotAssignments((prev) => ({
      ...prev,
      [slotNumber]: selectedStepToPlace,
    }));

    // Remove selected card from pool, and return existing to pool if any
    setShuffledSteps((prev) => {
      const filtered = prev.filter((s) => s.stepKey !== selectedStepToPlace.stepKey);
      return existingInSlot ? [...filtered, existingInSlot] : filtered;
    });

    setSelectedStepToPlace(null);
  };

  const handleResetStage02 = () => {
    if (stage02Verified) return;
    setSlotAssignments({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
    setSelectedStepToPlace(null);
    // Shuffle all steps back into pool
    const copy = [...STAGE_02_STEPS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledSteps(copy);
  };

  const allSlotsFilled = [1, 2, 3, 4, 5, 6].every((slotNum) => slotAssignments[slotNum] !== null);

  const handleVerifyStage02 = () => {
    if (stage02Verified || !allSlotsFilled) return;

    let correct = 0;
    [1, 2, 3, 4, 5, 6].forEach((slotNum) => {
      const assigned = slotAssignments[slotNum];
      if (assigned && assigned.stepNumber === slotNum) {
        correct++;
      }
    });

    const points = calculateStage02Score(correct);
    setStage02CorrectCount(correct);
    setStage02Score(points);
    setTotalGameScore((prev) => prev + points);
    onScoreUpdate?.(points);
    setStage02Verified(true);
  };

  const handleAdvanceToStage03 = () => {
    setCurrentStage(3);
  };

  // =========================================================================
  // STAGE 03 HANDLERS
  // =========================================================================
  const currentDecision: FinalCheckDecision | undefined = STAGE_03_DECISIONS[decisionIndex];

  const handleSelectDecisionOption = (option: 'A' | 'B') => {
    if (decisionFeedbackVisible || !currentDecision) return;

    const isCorrect = option === currentDecision.correctOption;
    const points = isCorrect ? 10 : 0;

    setDecisionAnswers((prev) => [
      ...prev,
      {
        decisionId: currentDecision.id,
        selectedOption: option,
        isCorrect,
      },
    ]);

    if (points > 0) {
      setStage03Score((prev) => prev + points);
      setTotalGameScore((prev) => prev + points);
      onScoreUpdate?.(points);
    }

    setDecisionFeedbackVisible(true);
  };

  const handleNextDecision = () => {
    if (decisionIndex < STAGE_03_DECISIONS.length - 1) {
      setDecisionIndex((prev) => prev + 1);
      setDecisionFeedbackVisible(false);
    } else {
      // Completed all 5 decisions -> Advance to Final Result (Stage 4)
      setCurrentStage(4);
      const totalScore = stage01Score + stage02Score + stage03Score;
      onActivityComplete?.(totalScore, totalScore >= 90);
    }
  };

  // Helper to render icon for Workflow step
  const renderStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'book-open': return <BookOpen size={16} />;
      case 'compass': return <Compass size={16} />;
      case 'search': return <Search size={16} />;
      case 'pen-tool': return <PenTool size={16} />;
      case 'check-circle': return <CheckCircle2 size={16} />;
      case 'file-text': return <FileText size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div className="workflow-repair-root">
      
      {/* =================================================================== */}
      {/* 1. TOP HEADER BAR                                                   */}
      {/* =================================================================== */}
      <div className="workflow-top-bar">
        <div className="workflow-top-title-group">
          <span className="workflow-pulse-beacon" />
          <div>
            <span className="workflow-top-title">
              EXHIBIT 04 ACTIVITY // REPAIR THE WORKFLOW
            </span>
            <span className="workflow-top-subtitle">
              Continuous Scenario: Report on "AI in Higher Education"
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stage Progress Pills */}
          <div className="workflow-stage-pills">
            <span className={`stage-pill ${currentStage === 1 ? 'active' : currentStage > 1 ? 'completed' : ''}`}>
              01 FIND DAMAGE
            </span>
            <span className={`stage-pill ${currentStage === 2 ? 'active' : currentStage > 2 ? 'completed' : ''}`}>
              02 REBUILD
            </span>
            <span className={`stage-pill ${currentStage === 3 ? 'active' : currentStage > 3 ? 'completed' : ''}`}>
              03 FINAL CHECK
            </span>
          </div>

          {/* Running Score Pill */}
          <span className="workflow-score-badge">
            <Award size={14} />
            <span>{totalGameScore} / 150 PTS</span>
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. CONTINUOUS ASSIGNMENT BRIEF & RULES BOX                          */}
      {/* =================================================================== */}
      <div className="assignment-brief-box">
        <div className="assignment-brief-header">
          <div className="flex items-center gap-2.5">
            <span className="assignment-topic-tag">{ASSIGNMENT_SCENARIO.courseCode}</span>
            <h4 className="assignment-title-text">{ASSIGNMENT_SCENARIO.topic}</h4>
          </div>
          <button
            type="button"
            onClick={() => setShowRulesModal((prev) => !prev)}
            className="font-mono text-xs text-[#00FF88] hover:text-[#33FFAA] flex items-center gap-1.5 cursor-pointer bg-black/40 px-3 py-1.5 rounded-lg border border-[#00FF88]/30 transition-all"
          >
            <HelpCircle size={13} />
            <span>{showRulesModal ? 'HIDE RULES' : 'VIEW ASSIGNMENT RULES'}</span>
          </button>
        </div>

        {/* 4 Clear Rules (Always visible or toggleable) */}
        {showRulesModal && (
          <div className="assignment-rules-grid animate-fadeIn">
            {ASSIGNMENT_SCENARIO.rules.map((rule) => (
              <div key={rule.id} className="assignment-rule-item">
                <span className="assignment-rule-label">
                  <ShieldCheck size={13} />
                  <span>{rule.label}</span>
                </span>
                <p className="assignment-rule-desc">{rule.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* STAGE 01: FIND THE DAMAGE                                           */}
      {/* =================================================================== */}
      {currentStage === 1 && (
        <div className="animate-fadeIn">
          
          <div className="stage-intro-banner">
            <h3 className="stage-intro-headline">SOMETHING WENT WRONG.</h3>
            <p className="stage-intro-subtext">
              "The student has already started using AI. Some decisions were responsible. Others weren't. Find the mistakes."
            </p>
          </div>

          {/* Two Distinct Classification Zones */}
          <div className="stage01-zones-container">
            
            {/* RESPONSIBLE ZONE */}
            <div
              className={`classification-zone zone-responsible ${
                selectedDamageCardId ? 'highlight' : ''
              }`}
            >
              <div className="zone-header">
                <span className="zone-title">
                  <CheckCircle2 size={16} />
                  <span>RESPONSIBLE</span>
                </span>
                <span className="font-mono text-xs text-[#00FF88]">
                  {Object.values(stage01Placements).filter((c) => c === 'RESPONSIBLE').length} Placed
                </span>
              </div>

              <div className="zone-card-list">
                {STAGE_01_CARDS.filter((c) => stage01Placements[c.id] === 'RESPONSIBLE').map((card) => (
                  <div key={card.id} className="placed-card-item">
                    <p className="placed-card-text">"{card.text}"</p>
                    {!stage01Evaluated && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStage01Card(card.id)}
                        className="remove-card-btn"
                        title="Remove from zone"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {Object.values(stage01Placements).filter((c) => c === 'RESPONSIBLE').length === 0 && (
                  <div className="zone-empty-hint">
                    Place responsible actions here
                  </div>
                )}
              </div>
            </div>

            {/* PROBLEMATIC ZONE */}
            <div
              className={`classification-zone zone-problematic ${
                selectedDamageCardId ? 'highlight' : ''
              }`}
            >
              <div className="zone-header">
                <span className="zone-title">
                  <AlertTriangle size={16} />
                  <span>PROBLEMATIC</span>
                </span>
                <span className="font-mono text-xs text-[#FF6B6B]">
                  {Object.values(stage01Placements).filter((c) => c === 'PROBLEMATIC').length} Placed
                </span>
              </div>

              <div className="zone-card-list">
                {STAGE_01_CARDS.filter((c) => stage01Placements[c.id] === 'PROBLEMATIC').map((card) => (
                  <div key={card.id} className="placed-card-item">
                    <p className="placed-card-text">"{card.text}"</p>
                    {!stage01Evaluated && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStage01Card(card.id)}
                        className="remove-card-btn"
                        title="Remove from zone"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {Object.values(stage01Placements).filter((c) => c === 'PROBLEMATIC').length === 0 && (
                  <div className="zone-empty-hint">
                    Place problematic actions here
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Cards Pool (unplaced cards) */}
          {!stage01Evaluated && (
            <div className="stage01-cards-pool">
              <span className="font-mono text-xs text-[#87968D] block uppercase tracking-wider mb-2">
                UNASSIGNED ACTIONS ({STAGE_01_CARDS.filter((c) => !stage01Placements[c.id]).length} REMAINING)
              </span>

              {STAGE_01_CARDS.filter((c) => !stage01Placements[c.id]).map((card, idx) => (
                <div
                  key={card.id}
                  className={`damage-action-card ${selectedDamageCardId === card.id ? 'selected' : ''}`}
                  onClick={() => handleSelectDamageCard(card.id)}
                >
                  <p className="damage-card-text">
                    <strong className="text-[#00FF88] font-mono mr-2">#{idx + 1}</strong>
                    "{card.text}"
                  </p>

                  <div className="damage-card-actions">
                    <span className="text-xs text-[#87968D] font-mono mr-auto">
                      Click to assign:
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceDamageCard(card.id, 'RESPONSIBLE');
                      }}
                      className="classify-btn classify-btn-resp"
                    >
                      + RESPONSIBLE
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceDamageCard(card.id, 'PROBLEMATIC');
                      }}
                      className="classify-btn classify-btn-prob"
                    >
                      + PROBLEMATIC
                    </button>
                  </div>
                </div>
              ))}

              {/* Evaluate Button once all 5 cards are placed */}
              {allStage01CardsPlaced && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleEvaluateStage01}
                    className="px-8 py-3.5 rounded-xl bg-[#00FF88] text-[#050807] font-display text-sm font-extrabold uppercase tracking-wider shadow-[0_0_25px_rgba(0,255,136,0.5)] hover:bg-[#33FFAA] transition-all cursor-pointer"
                  >
                    EVALUATE CLASSIFICATIONS (5 / 5 PLACED)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Feedback Review Box after Evaluation */}
          {stage01Evaluated && (
            <div className="stage01-review-box animate-fadeIn">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-[#00FF88] uppercase tracking-wider">
                  STAGE 01 COMPLETE // SCORE: {stage01Score} / 50 PTS
                </span>
                <span className="font-display text-sm font-bold text-white">
                  YOU FOUND THE DAMAGE. NOW FIX IT.
                </span>
              </div>

              {STAGE_01_CARDS.map((card) => {
                const isCorrect = stage01Placements[card.id] === card.correctCategory;
                return (
                  <div
                    key={card.id}
                    className={`stage01-card-feedback-item ${isCorrect ? '' : 'incorrect'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-[#00FF88]">
                        {card.correctCategory === 'RESPONSIBLE' ? '✓ RESPONSIBLE' : '⚠ PROBLEMATIC'}
                      </span>
                      <span className="font-mono text-[11px] text-[#87968D]">
                        {isCorrect ? '+10 PTS' : '+0 PTS (INCORRECT)'}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[#E4F0E8] mb-1">
                      "{card.text}"
                    </p>
                    <p className="font-body text-xs text-[#87968D] italic">
                      {card.explanation}
                    </p>
                  </div>
                );
              })}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleAdvanceToStage02}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00FF88] text-[#050807] font-display text-sm font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:bg-[#33FFAA] transition-all cursor-pointer"
                >
                  <span>REBUILD THE WORKFLOW</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 02: REBUILD THE WORKFLOW                                       */}
      {/* =================================================================== */}
      {currentStage === 2 && (
        <div className="animate-fadeIn">
          
          <div className="stage-intro-banner">
            <h3 className="stage-intro-headline">A BETTER WAY TO WORK.</h3>
            <p className="stage-intro-subtext">
              "You know what went wrong. Now rebuild the process from the beginning."
            </p>
          </div>

          {/* Central Workflow Pipeline (6 Slots) */}
          <div className="workflow-pipeline-grid">
            {[1, 2, 3, 4, 5, 6].map((slotNum) => {
              const assigned = slotAssignments[slotNum];
              const isLocked = stage02Verified && assigned?.stepNumber === slotNum;
              const isOccupied = assigned !== null;

              return (
                <div
                  key={slotNum}
                  onClick={() => handleAssignToSlot(slotNum)}
                  className={`workflow-slot ${isOccupied ? 'occupied' : ''} ${
                    isLocked ? 'correct-locked' : ''
                  } ${selectedStepToPlace ? 'active-drop cursor-pointer' : ''}`}
                >
                  <div className="workflow-slot-header">
                    <span className="slot-number-badge">STAGE {slotNum}</span>
                    {isOccupied && !stage02Verified && (
                      <span className="font-mono text-[10px] text-[#87968D]">
                        Click to remove
                      </span>
                    )}
                    {stage02Verified && (
                      <span className="font-mono text-xs font-bold text-[#00FF88]">
                        {assigned?.stepNumber === slotNum ? '✓ CORRECT' : '✕ WRONG'}
                      </span>
                    )}
                  </div>

                  {assigned ? (
                    <div className="slot-content-filled">
                      <span className="slot-action-label flex items-center gap-1.5">
                        {renderStepIcon(assigned.iconName)}
                        <span>{assigned.label}</span>
                      </span>
                      <p className="slot-action-text">{assigned.actionText}</p>
                    </div>
                  ) : (
                    <div className="slot-content-empty">
                      <span>{selectedStepToPlace ? 'CLICK TO PLACE HERE' : `SLOT 0${slotNum} EMPTY`}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-[#87968D]">
              {[1, 2, 3, 4, 5, 6].filter((s) => slotAssignments[s]).length} of 6 slots filled
            </span>

            {!stage02Verified && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetStage02}
                  className="px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-xs font-mono text-[#87968D] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>RESET SLOTS</span>
                </button>

                <button
                  type="button"
                  disabled={!allSlotsFilled}
                  onClick={handleVerifyStage02}
                  className={`px-5 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    allSlotsFilled
                      ? 'bg-[#00FF88] text-[#050807] shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:bg-[#33FFAA]'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  VERIFY WORKFLOW
                </button>
              </div>
            )}
          </div>

          {/* Shuffled Available Actions Pool */}
          {!stage02Verified && shuffledSteps.length > 0 && (
            <div className="stage02-available-pool animate-fadeIn">
              <div className="stage02-pool-title">
                <span>AVAILABLE WORKFLOW STEPS ({shuffledSteps.length} REMAINING)</span>
                <span className="text-[11px] text-[#87968D] font-normal">
                  Click a card, then click a slot above to place
                </span>
              </div>

              <div className="stage02-cards-grid">
                {shuffledSteps.map((step) => (
                  <div
                    key={step.stepKey}
                    onClick={() => handleSelectStepCard(step)}
                    className={`workflow-draggable-card ${
                      selectedStepToPlace?.stepKey === step.stepKey ? 'selected' : ''
                    }`}
                  >
                    <span className="workflow-card-label flex items-center gap-1.5">
                      {renderStepIcon(step.iconName)}
                      <span>{step.label}</span>
                    </span>
                    <p className="workflow-card-action">{step.actionText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post-Verification Debrief & Advance Button */}
          {stage02Verified && (
            <div className="stage01-review-box animate-fadeIn">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-[#00FF88] uppercase tracking-wider">
                  STAGE 02 COMPLETE // SCORE: {stage02Score} / 50 PTS ({stage02CorrectCount} / 6 CORRECT)
                </span>
                <span className="font-display text-sm font-bold text-white">
                  WORKFLOW RESTORED.
                </span>
              </div>

              <p className="font-body text-sm text-[#C2D8C9] leading-relaxed mb-4">
                "Responsible AI use begins with understanding the rules. AI can assist with exploration and feedback, but the student must remain responsible for the research, reasoning, and final work."
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAdvanceToStage03}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00FF88] text-[#050807] font-display text-sm font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:bg-[#33FFAA] transition-all cursor-pointer"
                >
                  <span>CONTINUE TO FINAL CHECK</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 03: THE FINAL CHECK                                           */}
      {/* =================================================================== */}
      {currentStage === 3 && currentDecision && (
        <div className="animate-fadeIn">
          
          <div className="stage-intro-banner">
            <h3 className="stage-intro-headline">BEFORE YOU HIT SUBMIT...</h3>
            <p className="stage-intro-subtext">
              "The report is almost ready. Five decisions remain. What would you do?"
            </p>
          </div>

          <div className="stage03-card-container">
            
            <div className="flex items-center justify-between mb-2">
              <span className="decision-number-pill">
                DECISION 0{currentDecision.number} // 05
              </span>
              <span className="font-mono text-xs text-[#87968D]">
                Stage 03 Score: {stage03Score} / 50 PTS
              </span>
            </div>

            <h4 className="decision-title">{currentDecision.title}</h4>

            <div className="decision-situation-box">
              <p className="decision-situation-text">"{currentDecision.situation}"</p>
            </div>

            {/* Options A & B */}
            {!decisionFeedbackVisible && (
              <div className="decision-options-grid">
                <button
                  type="button"
                  onClick={() => handleSelectDecisionOption('A')}
                  className="decision-option-btn"
                >
                  <span className="option-tag">OPTION A</span>
                  <p className="option-text">{currentDecision.optionA.text}</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDecisionOption('B')}
                  className="decision-option-btn"
                >
                  <span className="option-tag">OPTION B</span>
                  <p className="option-text">{currentDecision.optionB.text}</p>
                </button>
              </div>
            )}

            {/* Decision Feedback */}
            {decisionFeedbackVisible && (
              <div
                className={`decision-feedback-card ${
                  decisionAnswers[decisionAnswers.length - 1]?.isCorrect
                    ? 'decision-feedback-correct'
                    : 'decision-feedback-incorrect'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#00FF88]">
                    {decisionAnswers[decisionAnswers.length - 1]?.isCorrect
                      ? '✓ RESPONSIBLE DECISION (+10 PTS)'
                      : '⚠ FLAWED DECISION (+0 PTS)'}
                  </span>
                  <span className="font-mono text-xs text-[#87968D]">
                    CORRECT CHOICE: OPTION {currentDecision.correctOption}
                  </span>
                </div>

                <p className="font-body text-sm text-[#E4F0E8] leading-relaxed mb-4">
                  {currentDecision.explanation}
                </p>

                <button
                  type="button"
                  onClick={handleNextDecision}
                  className="w-full py-3 rounded-xl bg-[#00FF88] text-[#050807] font-display text-sm font-bold uppercase tracking-wider hover:bg-[#33FFAA] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>
                    {decisionIndex < STAGE_03_DECISIONS.length - 1
                      ? 'PROCEED TO NEXT DECISION'
                      : 'COMPLETE ASSIGNMENT & RESTORE WORKFLOW'}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* FINAL RESULT: WORKFLOW RESTORED                                     */}
      {/* =================================================================== */}
      {currentStage === 4 && (
        <div className="workflow-final-container animate-fadeIn">
          
          <div className="text-center mb-6">
            <span className="font-mono text-xs font-bold text-[#00FF88] tracking-widest uppercase">
              EXHIBIT 04 // FINAL INTEGRATION COMPLETE
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              YOUR WORKFLOW. YOUR RESPONSIBILITY.
            </h3>
          </div>

          {/* Full Connected Reconstructed Sequence */}
          <div className="bg-[#030B06] border border-[#00FF88]/40 rounded-xl p-4 sm:p-6 mb-6">
            <span className="font-mono text-xs font-bold text-[#00FF88] block uppercase tracking-wider mb-3">
              REPAIRED ACADEMIC PIPELINE
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {STAGE_02_STEPS.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-[#071F13] border border-[#00FF88] rounded-lg p-3 text-center shadow-[0_0_12px_rgba(0,255,136,0.15)]"
                >
                  <span className="font-mono text-[10px] text-[#00FF88] block uppercase font-bold mb-1">
                    0{step.stepNumber} {step.stepKey}
                  </span>
                  <span className="font-body text-xs text-[#E4F0E8] block line-clamp-3">
                    {step.actionText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Stage Score Breakdown */}
          <div className="workflow-final-scores-grid">
            <div className="stage-score-card">
              <span className="font-mono text-[11px] text-[#87968D] block uppercase">
                STAGE 01: FIND DAMAGE
              </span>
              <span className="font-display text-xl font-bold text-[#00FF88] mt-1 block">
                {stage01Score} / 50 PTS
              </span>
            </div>

            <div className="stage-score-card">
              <span className="font-mono text-[11px] text-[#87968D] block uppercase">
                STAGE 02: REBUILD WORKFLOW
              </span>
              <span className="font-display text-xl font-bold text-[#00FF88] mt-1 block">
                {stage02Score} / 50 PTS
              </span>
            </div>

            <div className="stage-score-card">
              <span className="font-mono text-[11px] text-[#87968D] block uppercase">
                STAGE 03: THE FINAL CHECK
              </span>
              <span className="font-display text-xl font-bold text-[#00FF88] mt-1 block">
                {stage03Score} / 50 PTS
              </span>
            </div>
          </div>

          {/* Central Message Debrief */}
          <div className="bg-[#081C10] border-l-4 border-[#00FF88] p-5 rounded-r-xl mb-8">
            <h5 className="font-display font-bold text-white text-base mb-1">
              AI CAN ASSIST THE PROCESS. IT CANNOT TAKE RESPONSIBILITY FOR YOUR WORK.
            </h5>
            <p className="font-body text-sm text-[#C2D8C9] leading-relaxed">
              "Responsible AI use is not about avoiding technology. It is about using it thoughtfully while remaining accountable for what you learn, create, and submit."
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 font-mono text-xs text-[#00FF88] font-bold">
              TOTAL EXHIBIT 04 SCORE: {totalGameScore} / 150 PTS
            </div>
          </div>

          {/* Complete Button to Final Score Screen */}
          <div>
            <button
              type="button"
              onClick={onContinue}
              className="workflow-complete-btn"
            >
              <span>COMPLETE EXHIBIT 04 & VIEW FINAL EVALUATION</span>
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
