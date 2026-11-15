import React from 'react';
import type { ExhibitData, GameOption } from '../../types/game';
import { ExhibitVisual } from './ExhibitVisual';
import { Exhibit01SequentialStage } from './Exhibit01SequentialStage';
import { Exhibit02Stage } from './Exhibit02Stage';
import { Exhibit03Stage } from './Exhibit03Stage';
import { Exhibit04Stage } from './Exhibit04Stage';
import { ArrowDown, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ExhibitStageProps {
  data: ExhibitData;
  selectedOptionId?: string;
  result?: { isCorrect: boolean; pointsEarned: number };
  onSelectOption: (option: GameOption) => void;
  onContinue: () => void;
  nextExhibitTitle?: string;
  isLastExhibit: boolean;
  onExhibit01ScoreUpdate?: (pointsAdded: number) => void;
  onExhibit01Complete?: (score: number, totalCorrect: number) => void;
  onExhibit02ScoreUpdate?: (pointsAdded: number) => void;
  onExhibit02Complete?: (score: number, isCorrect: boolean) => void;
  onExhibit03ScoreUpdate?: (pointsAdded: number) => void;
  onExhibit03Complete?: (score: number, isCorrect: boolean) => void;
  onExhibit04ScoreUpdate?: (pointsAdded: number) => void;
  onExhibit04Complete?: (score: number, isCorrect: boolean) => void;
}

export const ExhibitStage: React.FC<ExhibitStageProps> = ({
  data,
  selectedOptionId,
  result,
  onSelectOption,
  onContinue,
  nextExhibitTitle,
  isLastExhibit,
  onExhibit01ScoreUpdate,
  onExhibit01Complete,
  onExhibit02ScoreUpdate,
  onExhibit02Complete,
  onExhibit03ScoreUpdate,
  onExhibit03Complete,
  onExhibit04ScoreUpdate,
  onExhibit04Complete,
}) => {
  // Delegate Exhibit 01 to the sequential 01A -> 01B -> Activity layout
  if (data.id === 'exhibit-01') {
    return (
      <Exhibit01SequentialStage
        data={data}
        selectedOptionId={selectedOptionId}
        result={result}
        onSelectOption={onSelectOption}
        onContinue={onContinue}
        onScoreUpdate={onExhibit01ScoreUpdate}
        onActivityComplete={onExhibit01Complete}
      />
    );
  }

  // Delegate Exhibit 02 to the educational explainer & Citation Jigsaw layout
  if (data.id === 'exhibit-02') {
    return (
      <Exhibit02Stage
        data={data}
        selectedOptionId={selectedOptionId}
        result={result}
        onSelectOption={onSelectOption}
        onContinue={onContinue}
        onScoreUpdate={onExhibit02ScoreUpdate}
        onActivityComplete={onExhibit02Complete}
      />
    );
  }

  // Delegate Exhibit 03 to the educational explainer & Ethical or Not? swipe layout
  if (data.id === 'exhibit-03') {
    return (
      <Exhibit03Stage
        data={data}
        selectedOptionId={selectedOptionId}
        result={result}
        onSelectOption={onSelectOption}
        onContinue={onContinue}
        onScoreUpdate={onExhibit03ScoreUpdate}
        onActivityComplete={onExhibit03Complete}
      />
    );
  }

  // Delegate Exhibit 04 to the continuous Repair the Workflow challenge
  if (data.id === 'exhibit-04') {
    return (
      <Exhibit04Stage
        data={data}
        selectedOptionId={selectedOptionId}
        result={result}
        onSelectOption={onSelectOption}
        onContinue={onContinue}
        onScoreUpdate={onExhibit04ScoreUpdate}
        onActivityComplete={onExhibit04Complete}
      />
    );
  }

  const hasAnswered = !!selectedOptionId;

  return (
    <section 
      id={data.id}
      className="documentary-scene"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(56px, 7vw, 96px)',
        paddingBottom: 'clamp(80px, 9vw, 120px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderTop: '1px solid rgba(0, 255, 136, 0.15)'
      }}
      aria-label={`${data.badge}: ${data.title}`}
    >
      <div className="exhibition-container">
        
        {/* Curatorial Header Stamp (Original Matrix Style) */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 'clamp(28px, 4vw, 48px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                letterSpacing: '0.12em'
              }}
            >
              {data.badge}
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              EXHIBITION SPECIMEN
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. SEE & UNDERSTAND: Editorial Headline + Narrative Story   */}
        {/* ========================================================= */}
        <div style={{ maxWidth: '1100px', marginBottom: 'clamp(36px, 4.5vw, 56px)' }}>
          {/* Headline */}
          <h2 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#E4F0E8',
              marginBottom: '20px'
            }}
          >
            {data.headline}
          </h2>

          {/* Engaging Editorial Narrative Blocks */}
          <div className="mb-10 max-w-4xl">
            {data.explanation.length > 0 && (
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
                {data.explanation[0]}
              </p>
            )}

            {data.explanation.slice(1).map((sentence, idx) => (
              <p 
                key={idx} 
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(1.125rem, 1.35vw, 1.25rem)',
                  lineHeight: 1.75,
                  color: '#D1DDD5',
                  marginBottom: '16px'
                }}
              >
                {sentence}
              </p>
            ))}
          </div>

          {/* Meaningful Visual Diagram / Specimen Inspection */}
          <ExhibitVisual exhibitId={data.id} hasAnswered={hasAnswered} />

          {/* Prominent Editorial Key Takeaway */}
          <div 
            style={{
              maxWidth: '920px',
              borderLeft: '4px solid var(--accent-primary)',
              padding: '24px 28px',
              marginTop: '28px',
              marginBottom: '36px',
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
                color: 'var(--accent-primary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                fontWeight: 700
              }}
            >
              CORE TAKEAWAY
            </div>
            <div 
              style={{
                fontSize: 'clamp(1.125rem, 1.8vw, 1.35rem)',
                color: '#E4F0E8',
                fontWeight: 600,
                lineHeight: 1.5,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em'
              }}
            >
              "{data.takeaway}"
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PLAY & DECIDE: Section Divider + Tactile Game Cards      */}
        {/* ========================================================= */}
        <div 
          style={{
            paddingTop: '36px',
            marginTop: '20px',
            borderTop: '1px solid rgba(0, 255, 136, 0.2)',
            maxWidth: '1100px'
          }}
        >
          <div 
            style={{
              backgroundColor: 'rgba(7, 26, 16, 0.95)',
              border: '2px solid rgba(0, 255, 136, 0.4)',
              borderRadius: '16px',
              padding: 'clamp(24px, 4vw, 44px)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)'
            }}
          >
            {/* Section Marker */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#00FF88]/20">
              <span className="font-mono text-xs font-semibold text-[#00FF88] tracking-widest uppercase">
                EXHIBIT {data.number} // YOUR DECISION
              </span>
              <span className="font-mono text-xs text-[#00FF88] font-bold">
                WORTH +150 PTS
              </span>
            </div>

            {/* Dilemma Question Heading */}
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#E4F0E8',
                marginBottom: '18px'
              }}
            >
              WHAT WOULD YOU DO?
            </h3>

            {/* Scenario Description */}
            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.125rem, 1.4vw, 1.3rem)',
                lineHeight: 1.7,
                color: '#D1DDD5',
                maxWidth: '850px',
                marginBottom: '32px'
              }}
            >
              {data.question}
            </p>

            {/* Large Tactile Game Option Cards (CARD A / CARD B) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {data.options.map((option, index) => {
                const isSelected = selectedOptionId === option.id;
                const cardLabel = index === 0 ? 'OPTION A' : 'OPTION B';
                
                let cardStyles = 'bg-[#050D08] border-2 border-white/15 hover:border-[#00FF88] hover:bg-[#07160E] hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] text-[#E4F0E8]';
                
                if (hasAnswered) {
                  if (isSelected) {
                    cardStyles = option.isCorrect
                      ? 'bg-[#00FF88]/15 border-[#00FF88] shadow-[0_0_30px_rgba(0,255,136,0.35)] text-[#E4F0E8]'
                      : 'bg-rose-950/40 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] text-[#E4F0E8]';
                  } else {
                    cardStyles = 'opacity-35 border-white/5 bg-[#050807] cursor-not-allowed text-[#87968D]';
                  }
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => onSelectOption(option)}
                    className={`relative p-7 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88] ${cardStyles}`}
                  >
                    <div>
                      {/* Top Row: Card Identifier + Category Badge */}
                      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
                        <span className="px-3 py-1 rounded bg-[#071A10] border border-[#00FF88]/50 font-mono text-xs font-bold text-[#00FF88] tracking-wider uppercase">
                          {cardLabel}
                        </span>

                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <span className={`font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${option.isCorrect ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/50' : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'}`}>
                              {option.isCorrect ? '✓ CORRECT CHOICE' : '✕ SELECTED'}
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border-2 border-white/20 group-hover:border-[#00FF88] transition-colors" />
                          )}
                        </div>
                      </div>

                      {/* Large Readable Title */}
                      <h4 
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.25rem, 1.8vw, 1.5rem)',
                          fontWeight: 700,
                          lineHeight: 1.3,
                          color: '#E4F0E8',
                          marginBottom: '10px'
                        }}
                        className="group-hover:text-[#00FF88] transition-colors"
                      >
                        {option.label}
                      </h4>

                      {/* Concise Description in 16-18px body font */}
                      {option.description && (
                        <p 
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                            lineHeight: 1.65,
                            color: '#D1DDD5',
                            marginBottom: '16px'
                          }}
                        >
                          {option.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Row: Tactile Selection Action */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs mt-2">
                      <span className="text-[#00FF88] font-bold tracking-wider uppercase">
                        {hasAnswered
                          ? isSelected
                            ? option.isCorrect
                              ? '✓ Choice Confirmed'
                              : '✕ Choice Recorded'
                            : 'Unselected'
                          : 'Select This Option'}
                      </span>
                      <span className="text-[#00FF88] font-bold text-sm group-hover:translate-x-1.5 transition-transform">
                        {hasAnswered ? '' : '→'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* 3. RESULT: Immediate Feedback & Points Earned              */}
            {/* ========================================================= */}
            {hasAnswered && result && (
              <div 
                style={{
                  backgroundColor: 'rgba(5, 8, 7, 0.95)',
                  border: '2px solid var(--accent-primary)',
                  borderRadius: '12px',
                  padding: '24px 28px',
                  boxShadow: '0 0 35px rgba(0, 255, 136, 0.2)',
                  marginBottom: '28px'
                }}
                className="animate-reveal"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-3">
                    {result.isCorrect ? (
                      <CheckCircle2 size={26} className="text-[#00FF88] shrink-0" />
                    ) : (
                      <AlertTriangle size={26} className="text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-mono text-xs text-[#00FF88] font-bold uppercase tracking-wider block">
                        Decision Outcome
                      </span>
                      <span 
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#E4F0E8'
                        }}
                      >
                        {result.isCorrect ? 'First-Principles Discernment' : 'Important Pedagogical Insight'}
                      </span>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 bg-[#071A10] border border-[#00FF88] rounded font-mono text-xs font-bold text-[#00FF88] self-start sm:self-auto">
                    +{result.pointsEarned} PTS EARNED
                  </div>
                </div>

                {/* Explanation */}
                <p 
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
                    lineHeight: 1.7,
                    color: '#E4F0E8',
                    marginBottom: '12px'
                  }}
                >
                  {data.options.find((o) => o.id === selectedOptionId)?.explanation}
                </p>

                <div className="font-mono text-xs text-[#87968D]">
                  ★ Includes +50 PTS exhibit completion bonus.
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. CONTINUE: Advance to Next Exhibit / Finale             */}
            {/* ========================================================= */}
            {hasAnswered && (
              <div className="flex justify-end pt-2 animate-reveal">
                <button
                  onClick={onContinue}
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 36px',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#050807',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    boxShadow: '0 0 25px rgba(0, 255, 136, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  className="hover:scale-[1.01] active:scale-95"
                >
                  <span>{isLastExhibit ? 'PROCEED TO FINAL EVALUATION' : `CONTINUE TO ${nextExhibitTitle || 'NEXT EXHIBIT'}`}</span>
                  <ArrowDown size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
