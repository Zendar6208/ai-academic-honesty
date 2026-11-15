import React, { useState, useRef } from 'react';
import { EXHIBIT_01_QUESTIONS, type QuizQuestion } from '../../data/exhibit01QuizData';
import { CheckCircle2, XCircle, ArrowRight, ArrowDown, Award, Sparkles } from 'lucide-react';

interface Exhibit01QuizActivityProps {
  onScoreUpdate: (pointsAdded: number) => void;
  onActivityComplete: (finalScore: number, totalCorrect: number) => void;
  onContinue: () => void;
  isCompleted?: boolean;
  savedScore?: number;
}

export const Exhibit01QuizActivity: React.FC<Exhibit01QuizActivityProps> = ({
  onScoreUpdate,
  onActivityComplete,
  onContinue,
  isCompleted = false,
  savedScore = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedLetter, setSelectedLetter] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [answersRecord, setAnswersRecord] = useState<Record<number, { letter: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>>({});
  const [currentScore, setCurrentScore] = useState<number>(savedScore);
  const [isFinished, setIsFinished] = useState<boolean>(isCompleted);
  const hasAnsweredRef = useRef<boolean>(false);

  const totalQuestions = EXHIBIT_01_QUESTIONS.length;
  const currentQ: QuizQuestion = EXHIBIT_01_QUESTIONS[currentIndex];
  const hasAnsweredCurrent = selectedLetter !== null || hasAnsweredRef.current;

  // Handle selecting an answer
  const handleSelectAnswer = (letter: 'A' | 'B' | 'C' | 'D') => {
    // Prevent duplicate selection
    if (hasAnsweredRef.current || hasAnsweredCurrent || isFinished) return;
    hasAnsweredRef.current = true;

    const chosenOption = currentQ.options.find((opt) => opt.letter === letter);
    const isCorrect = !!chosenOption?.isCorrect;
    const points = isCorrect ? 15 : 0;

    setSelectedLetter(letter);
    setAnswersRecord((prev) => ({
      ...prev,
      [currentQ.id]: { letter, isCorrect },
    }));

    if (points > 0) {
      setCurrentScore((prev) => {
        const nextScore = prev + points;
        return nextScore;
      });
      onScoreUpdate(points);
    }
  };

  // Handle moving to the next question or finishing
  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      hasAnsweredRef.current = false;
      setCurrentIndex((prev) => prev + 1);
      setSelectedLetter(null);
    } else {
      // Calculate final results
      const totalCorrect = Object.values(answersRecord).filter((a) => a.isCorrect).length;
      setIsFinished(true);
      onActivityComplete(currentScore, totalCorrect);
    }
  };

  // Performance breakdown text based on final score
  const getPerformanceSummary = (score: number) => {
    if (score >= 135) {
      return 'Exemplary Cognitive Discernment: You consistently demonstrated the discipline of treating AI as an intellectual sparring partner, protecting authentic understanding and taking full ownership of your academic work.';
    }
    if (score >= 105) {
      return 'Strong Ethical Reasoning: You grasp the vital distinction between cognitive struggle and passive automation, showing clear command of academic honesty and independent verification.';
    }
    return 'Valuable Learning Foundation: Reviewing these scenarios reinforces that fluency is never comprehension. Continue practicing independent problem-solving and critical verification.';
  };

  const progressPercentage = Math.round(((currentIndex + (hasAnsweredCurrent ? 1 : 0)) / totalQuestions) * 100);
  const correctCount = Object.values(answersRecord).filter((a) => a.isCorrect).length;

  return (
    <div
      style={{
        backgroundColor: '#050807',
        border: '1px solid rgba(0, 255, 136, 0.25)',
        borderRadius: '16px',
        padding: 'clamp(24px, 4vw, 44px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 255, 136, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="animate-reveal"
    >
      {/* Decorative ambient subtle green glow in the corner */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 180,
          height: 180,
          background: 'radial-gradient(circle at top right, rgba(0, 255, 136, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ========================================================================= */}
      {/* FINISHED SUMMARY SCREEN                                                   */}
      {/* ========================================================================= */}
      {isFinished ? (
        <div className="animate-reveal text-center py-6">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 255, 136, 0.12)',
              border: '2px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              marginBottom: '20px',
              boxShadow: '0 0 25px rgba(0, 255, 136, 0.35)',
            }}
          >
            <Award size={32} />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-primary)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            CHALLENGE COMPLETE // EVALUATION RECORDED
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.25,
              marginBottom: '16px',
            }}
          >
            Exhibit 01 Knowledge Challenge
          </h3>

          {/* Score Showcase Cards */}
          <div className="flex flex-wrap items-center justify-center gap-4 my-8">
            <div
              style={{
                backgroundColor: 'rgba(7, 26, 16, 0.85)',
                border: '1px solid rgba(0, 255, 136, 0.4)',
                borderRadius: '12px',
                padding: '20px 32px',
                minWidth: 180,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                FINAL SCORE
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                }}
              >
                {currentScore} <span style={{ fontSize: '1rem', color: '#87968D' }}>/ 150 PTS</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(7, 26, 16, 0.85)',
                border: '1px solid rgba(0, 255, 136, 0.4)',
                borderRadius: '12px',
                padding: '20px 32px',
                minWidth: 180,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                ACCURACY
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                {correctCount} <span style={{ fontSize: '1rem', color: '#87968D' }}>/ 10 CORRECT</span>
              </div>
            </div>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
              lineHeight: 1.7,
              color: '#D1DDD5',
              maxWidth: 680,
              margin: '0 auto 36px',
            }}
          >
            {getPerformanceSummary(currentScore)}
          </p>

          <div className="flex justify-center">
            <button
              onClick={onContinue}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 40px',
                backgroundColor: 'var(--accent-primary)',
                color: '#050807',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                boxShadow: '0 0 25px rgba(0, 255, 136, 0.4)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              className="hover:scale-[1.02] active:scale-95"
            >
              <span>CONTINUE TO EXHIBIT 02: SOURCE INTEGRITY</span>
              <ArrowDown size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* ACTIVE QUESTION SCREEN (ONE QUESTION AT A TIME)                           */
        /* ========================================================================= */
        <div>
          {/* Top Status Bar: Question Index, Progress Bar, Score Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <span
                style={{
                  padding: '5px 12px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0, 255, 136, 0.12)',
                  border: '1px solid rgba(0, 255, 136, 0.35)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  letterSpacing: '0.08em',
                }}
              >
                QUESTION {String(currentIndex + 1).padStart(2, '0')} / {totalQuestions}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
                className="hidden sm:inline"
              >
                KNOWLEDGE & ETHICAL JUDGEMENT
              </span>
            </div>

            {/* Live Score Counter */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '4px',
                backgroundColor: 'rgba(7, 26, 16, 0.9)',
                border: '1px solid rgba(0, 255, 136, 0.35)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-main)',
                fontWeight: 700,
                alignSelf: 'flex-start',
              }}
            >
              <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>CURRENT SCORE:</span>
              <span style={{ color: 'var(--accent-primary)' }}>{currentScore}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>/ 150 PTS</span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercentage}%`,
                backgroundColor: 'var(--accent-primary)',
                boxShadow: '0 0 10px var(--accent-primary)',
                transition: 'width 250ms ease-out',
              }}
            />
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)',
                fontWeight: 700,
                lineHeight: 1.4,
                color: '#FFFFFF',
              }}
            >
              {currentQ.question}
            </h3>
          </div>

          {/* 4 Large Clickable Answer Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            {currentQ.options.map((option) => {
              const isSelected = selectedLetter === option.letter;
              const isCorrect = option.isCorrect;

              // Compute card background and border styling based on state
              let cardBg = 'rgba(7, 26, 16, 0.55)';
              let cardBorder = 'rgba(255, 255, 255, 0.12)';
              let badgeBg = 'rgba(255, 255, 255, 0.06)';
              let badgeBorder = 'rgba(255, 255, 255, 0.15)';
              let badgeColor = 'var(--text-muted)';
              let shadow = 'none';

              if (hasAnsweredCurrent) {
                if (isSelected) {
                  if (isCorrect) {
                    cardBg = 'rgba(0, 255, 136, 0.15)';
                    cardBorder = 'var(--accent-primary)';
                    badgeBg = 'rgba(0, 255, 136, 0.25)';
                    badgeBorder = 'var(--accent-primary)';
                    badgeColor = 'var(--accent-primary)';
                    shadow = '0 0 20px rgba(0, 255, 136, 0.25)';
                  } else {
                    cardBg = 'rgba(239, 68, 68, 0.12)';
                    cardBorder = 'rgba(239, 68, 68, 0.6)';
                    badgeBg = 'rgba(239, 68, 68, 0.25)';
                    badgeBorder = 'rgba(239, 68, 68, 0.6)';
                    badgeColor = '#fca5a5';
                    shadow = '0 0 20px rgba(239, 68, 68, 0.2)';
                  }
                } else if (isCorrect) {
                  // Reveal the correct option if the user chose incorrectly
                  cardBg = 'rgba(0, 255, 136, 0.08)';
                  cardBorder = 'rgba(0, 255, 136, 0.45)';
                  badgeBg = 'rgba(0, 255, 136, 0.18)';
                  badgeBorder = 'rgba(0, 255, 136, 0.45)';
                  badgeColor = 'var(--accent-primary)';
                } else {
                  cardBg = 'rgba(5, 8, 7, 0.4)';
                  cardBorder = 'rgba(255, 255, 255, 0.05)';
                }
              }

              return (
                <button
                  key={option.letter}
                  type="button"
                  onClick={() => handleSelectAnswer(option.letter)}
                  disabled={hasAnsweredCurrent}
                  style={{
                    backgroundColor: cardBg,
                    border: `1.5px solid ${cardBorder}`,
                    borderRadius: '10px',
                    padding: '18px 20px',
                    textAlign: 'left',
                    cursor: hasAnsweredCurrent ? 'default' : 'pointer',
                    transition: 'all 180ms ease',
                    boxShadow: shadow,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 110,
                  }}
                  className={`group ${!hasAnsweredCurrent ? 'hover:border-[#00FF88] hover:bg-[#071A10] hover:scale-[1.01]' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Letter Badge (A, B, C, D) */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '6px',
                        backgroundColor: badgeBg,
                        border: `1px solid ${badgeBorder}`,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: badgeColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {option.letter}
                    </div>

                    {/* Option Text */}
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.9375rem, 1.1vw, 1.0625rem)',
                        lineHeight: 1.55,
                        color: hasAnsweredCurrent && !isSelected && !isCorrect ? '#87968D' : '#E4F0E8',
                        fontWeight: isSelected ? 600 : 400,
                      }}
                      className={!hasAnsweredCurrent ? 'group-hover:text-white' : ''}
                    >
                      {option.text}
                    </div>
                  </div>

                  {/* Status Indicator at bottom right */}
                  {hasAnsweredCurrent && (
                    <div className="flex justify-end mt-3 pt-2 border-t border-white/5">
                      {isSelected ? (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: isCorrect ? 'var(--accent-primary)' : '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 size={13} />
                              <span>✓ Correct Choice (+15 PTS)</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={13} />
                              <span>✕ Your Choice (+0 PTS)</span>
                            </>
                          )}
                        </span>
                      ) : isCorrect ? (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>✓ Correct Answer</span>
                        </span>
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* IMMEDIATE FEEDBACK & NEXT QUESTION NAVIGATION GATE                         */}
          {/* ========================================================================= */}
          {hasAnsweredCurrent && (
            <div
              style={{
                backgroundColor: 'rgba(7, 26, 16, 0.95)',
                border: selectedLetter && currentQ.options.find((o) => o.letter === selectedLetter)?.isCorrect
                  ? '1.5px solid var(--accent-primary)'
                  : '1.5px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '10px',
                padding: '20px 24px',
                marginTop: '16px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
              }}
              className="animate-reveal"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2.5">
                  {selectedLetter && currentQ.options.find((o) => o.letter === selectedLetter)?.isCorrect ? (
                    <CheckCircle2 size={20} className="text-[#00FF88] shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-amber-400 shrink-0" />
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: selectedLetter && currentQ.options.find((o) => o.letter === selectedLetter)?.isCorrect ? '#FFFFFF' : '#FDE68A',
                    }}
                  >
                    {selectedLetter && currentQ.options.find((o) => o.letter === selectedLetter)?.isCorrect
                      ? 'Correct Judgement'
                      : 'Important Ethical Distinction'}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor: selectedLetter && currentQ.options.find((o) => o.letter === selectedLetter)?.isCorrect ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedLetter && currentQ.options.find((o) => o.letter === selectedLetter)?.isCorrect ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: selectedLetter && currentQ.options.find((o) => o.letter === selectedLetter)?.isCorrect ? 'var(--accent-primary)' : '#87968D',
                    alignSelf: 'flex-start',
                  }}
                >
                  {selectedLetter && currentQ.options.find((o) => o.letter === selectedLetter)?.isCorrect
                    ? '+15 PTS EARNED'
                    : '+0 PTS'}
                </div>
              </div>

              {/* Explanation Text */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#D1DDD5',
                  marginBottom: '18px',
                }}
              >
                {currentQ.explanation}
              </p>

              {/* Next Question / Finish Action Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 28px',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#050807',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    boxShadow: '0 0 18px rgba(0, 255, 136, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                  className="hover:scale-[1.02] active:scale-95"
                >
                  <span>
                    {currentIndex < totalQuestions - 1 ? 'NEXT QUESTION' : 'VIEW FINAL SCORE'}
                  </span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Exhibit01QuizActivity;
