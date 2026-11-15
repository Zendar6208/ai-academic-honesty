import React, { useRef } from 'react';
import type { ExhibitData, GameOption } from '../../types/game';
import { Exhibit03MotionGraphic } from '../MotionGraphics/Exhibit03MotionGraphic';
import { Exhibit03EthicalSwipeGame } from './Exhibit03EthicalSwipeGame';
import { ArrowDown } from 'lucide-react';

interface Exhibit03StageProps {
  data: ExhibitData;
  selectedOptionId?: string;
  result?: { isCorrect: boolean; pointsEarned: number };
  onSelectOption: (option: GameOption) => void;
  onContinue: () => void;
  onScoreUpdate?: (pointsAdded: number) => void;
  onActivityComplete?: (score: number, isCorrect: boolean) => void;
}

export const Exhibit03Stage: React.FC<Exhibit03StageProps> = ({
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
      {/* PART 1, 2 & 3: EDUCATIONAL CONTENT, MOTION GRAPHIC & TAKEAWAY       */}
      {/* =================================================================== */}
      <section
        id="exhibit-03"
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
        aria-label="Exhibit 03: AI Detector Limitations"
      >
        <div className="exhibition-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* 1. Small Identifier */}
          <div className="pb-3 mb-6 border-b border-emerald-500/20">
            <span className="font-mono text-xs font-semibold text-emerald-400 tracking-widest uppercase">
              EXHIBIT 03
            </span>
          </div>

          {/* 2. Main Headline & Supporting Introduction */}
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
              A DETECTOR SCORE IS NOT A VERDICT.
            </h2>

            {/* Supporting Content Paragraph 1 */}
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
              AI detectors estimate whether writing resembles patterns associated with AI-generated text. But they cannot establish who wrote something on their own.
            </p>

            {/* Supporting Content Paragraph 2 */}
            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.0625rem, 1.4vw, 1.25rem)',
                lineHeight: 1.6,
                color: '#C2D8C9',
                fontWeight: 400,
                marginBottom: '16px',
              }}
            >
              Even human-written work can be flagged, while AI-assisted writing can go undetected.
            </p>

            {/* Key Takeaway Pill */}
            <div className="inline-block mt-2 px-4 py-2 rounded-lg bg-[#081F12] border border-[#00FF88]/40">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#00FF88] tracking-wider uppercase">
                A FLAG IS A REASON TO REVIEW, NOT A REASON TO ACCUSE.
              </span>
            </div>
          </div>

          {/* 3. Five-Scene Animated Explainer */}
          <Exhibit03MotionGraphic />

          {/* 4. One Memorable Major Takeaway */}
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
              "A DETECTOR CAN RAISE A QUESTION. IT CANNOT ANSWER IT."
            </h3>
          </div>

          {/* 5. Smooth Transition Button to Swipe Activity */}
          <div className="flex justify-start pt-3">
            <button
              type="button"
              onClick={scrollToActivity}
              className="exhibit-btn-pill"
            >
              <span>Test your discernment in Ethical or Not? below</span>
              <ArrowDown size={16} className="text-[#00FF88]" />
            </button>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* PART 4–9: INTERACTIVE SWIPE ACTIVITY: ETHICAL OR NOT?               */}
      {/* =================================================================== */}
      <section
        id="exhibit-03-activity"
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
        aria-label="Exhibit 03 Ethical or Not Swipe Activity"
      >
        <div className="exhibition-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
          
          <Exhibit03EthicalSwipeGame
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
                id: `ethical-swipe-${finalScore}`,
                label: `Ethical Discernment Completed (${finalScore}/150 PTS)`,
                isCorrect: isVerdictCorrect,
                explanation: `Earned ${finalScore} of 150 points during the Ethical or Not? classification challenge.`,
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
