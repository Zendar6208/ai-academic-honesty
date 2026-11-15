import React, { useRef } from 'react';
import type { ExhibitData, GameOption } from '../../types/game';
import { Exhibit02MotionGraphic } from './Exhibit02MotionGraphic';
import { Exhibit02CitationJigsaw } from './Exhibit02CitationJigsaw';
import { ArrowDown } from 'lucide-react';

interface Exhibit02StageProps {
  data: ExhibitData;
  selectedOptionId?: string;
  result?: { isCorrect: boolean; pointsEarned: number };
  onSelectOption: (option: GameOption) => void;
  onContinue: () => void;
  onScoreUpdate?: (pointsAdded: number) => void;
  onActivityComplete?: (score: number, isCorrect: boolean) => void;
}

export const Exhibit02Stage: React.FC<Exhibit02StageProps> = ({
  data: _data,
  selectedOptionId,
  result,
  onSelectOption,
  onContinue,
  onScoreUpdate,
  onActivityComplete,
}) => {
  const hasAnswered = !!selectedOptionId;
  const activitySectionRef = useRef<HTMLDivElement>(null);

  const scrollToActivity = () => {
    if (activitySectionRef.current) {
      activitySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full">
      
      {/* =================================================================== */}
      {/* PART 1 & 2 & 3: EDUCATIONAL CONTENT, MOTION GRAPHIC & TAKEAWAY      */}
      {/* =================================================================== */}
      <section
        id="exhibit-02"
        className="documentary-scene"
        style={{
          minHeight: '100vh',
          paddingTop: 'clamp(56px, 6vw, 84px)',
          paddingBottom: 'clamp(56px, 6vw, 84px)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderTop: '1px solid rgba(0, 255, 136, 0.25)',
        }}
        aria-label="Exhibit 02: AI Hallucinations"
      >
        <div className="exhibition-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* 1. Small Identifier */}
          <div className="pb-3 mb-6 border-b border-emerald-500/20">
            <span className="font-mono text-xs font-semibold text-emerald-400 tracking-widest uppercase">
              EXHIBIT 02
            </span>
          </div>

          {/* 2. Main Headline & Short Supporting Introduction */}
          <div className="mb-10 max-w-4xl">
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.85rem, 3.6vw, 3.15rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#E4F0E8',
                marginBottom: '18px',
              }}
            >
              A CITATION CAN LOOK REAL AND STILL BE FAKE.
            </h2>

            {/* Supporting Content */}
            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.15rem, 1.6vw, 1.35rem)',
                lineHeight: 1.6,
                color: '#E4F0E8',
                fontWeight: 500,
                marginBottom: '14px',
              }}
            >
              AI can generate convincing academic references that don't correspond to real publications. It can even combine details from different papers to create a citation that looks legitimate.
            </p>

            {/* Final Sentence */}
            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.0625rem, 1.3vw, 1.2rem)',
                lineHeight: 1.6,
                color: '#00FF88',
                fontWeight: 600,
                margin: 0,
              }}
            >
              Always verify the source before citing it.
            </p>
          </div>

          {/* 3. Five-Scene Animated Explainer */}
          <Exhibit02MotionGraphic />

          {/* 4. One Memorable Takeaway */}
          <div className="bg-[#09140E] border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.7)] mb-10 text-center">
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                color: '#00FF88',
                margin: 0,
              }}
            >
              "LOOKING ACADEMIC DOESN'T MAKE A SOURCE REAL."
            </h3>
          </div>

          {/* 5. Smooth Transition Button to Forensic Activity */}
          <div className="flex justify-start pt-3">
            <button
              type="button"
              onClick={scrollToActivity}
              className="exhibit-btn-pill"
            >
              <span>Reconstruct the citation in Citation Jigsaw below</span>
              <ArrowDown size={16} className="text-[#00FF88]" />
            </button>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* PART 4–8: INTERACTIVE CITATION JIGSAW CHALLENGE                     */}
      {/* =================================================================== */}
      <section
        id="exhibit-02-activity"
        ref={activitySectionRef}
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
        aria-label="Exhibit 02 Citation Jigsaw Forensic Puzzle"
      >
        <div className="exhibition-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <Exhibit02CitationJigsaw
            onScoreUpdate={(points) => {
              if (onScoreUpdate) {
                onScoreUpdate(points);
              }
            }}
            onActivityComplete={(finalScore, isVerdictCorrect) => {
              if (onActivityComplete) {
                onActivityComplete(finalScore, isVerdictCorrect);
              }
              onSelectOption({
                id: `citation-jigsaw-${finalScore}`,
                label: `Citation Jigsaw Completed (${finalScore}/150 PTS)`,
                isCorrect: isVerdictCorrect,
                explanation: `Earned ${finalScore} of 150 points during the Citation Jigsaw challenge.`,
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
