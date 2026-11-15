import React, { useRef } from 'react';
import type { ExhibitData, GameOption } from '../../types/game';
import { Exhibit04RepairWorkflowGame } from './Exhibit04RepairWorkflowGame';
import { ArrowDown } from 'lucide-react';

interface Exhibit04StageProps {
  data: ExhibitData;
  selectedOptionId?: string;
  result?: { isCorrect: boolean; pointsEarned: number };
  onSelectOption: (option: GameOption) => void;
  onContinue: () => void;
  onScoreUpdate?: (pointsAdded: number) => void;
  onActivityComplete?: (score: number, isCorrect: boolean) => void;
}

export const Exhibit04Stage: React.FC<Exhibit04StageProps> = ({
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
      {/* PART 1 & 2: EDUCATIONAL INTRODUCTION & TAKEAWAY                     */}
      {/* =================================================================== */}
      <section
        id="exhibit-04"
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
        aria-label="Exhibit 04: Repair the Workflow"
      >
        <div className="exhibition-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* 1. Small Identifier */}
          <div className="pb-3 mb-6 border-b border-emerald-500/20">
            <span className="font-mono text-xs font-semibold text-emerald-400 tracking-widest uppercase">
              EXHIBIT 04 // FINAL INTEGRATION
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
              ONE ASSIGNMENT. A DOZEN DECISIONS.
            </h2>

            {/* Supporting Content Paragraph */}
            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.15rem, 1.6vw, 1.35rem)',
                lineHeight: 1.6,
                color: '#E4F0E8',
                fontWeight: 500,
                marginBottom: '16px',
              }}
            >
              AI can help you complete an assignment. But every decision matters. Can you repair a flawed workflow and make it responsible?
            </p>

            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.0625rem, 1.4vw, 1.25rem)',
                lineHeight: 1.6,
                color: '#00FF88',
                fontWeight: 600,
                margin: 0,
              }}
            >
              Responsible AI use is not about blindly avoiding AI. It is about understanding when and how to use it.
            </p>
          </div>

          {/* 3. Major Takeaway Banner */}
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
              "USE AI AS A TOOL. REMAIN THE AUTHOR OF YOUR WORK."
            </h3>
          </div>

          {/* 4. Smooth Transition Button to Interactive Activity */}
          <div className="flex justify-start pt-3">
            <button
              type="button"
              onClick={scrollToActivity}
              className="exhibit-btn-pill"
            >
              <span>Repair the workflow in the interactive challenge below</span>
              <ArrowDown size={16} className="text-[#00FF88]" />
            </button>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* PART 3: INTERACTIVE CHALLENGE: REPAIR THE WORKFLOW                  */}
      {/* =================================================================== */}
      <section
        id="exhibit-04-activity"
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
        aria-label="Exhibit 04 Repair the Workflow Interactive Challenge"
      >
        <div className="exhibition-container" style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          <Exhibit04RepairWorkflowGame
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
                id: `repair-workflow-${finalScore}`,
                label: `Workflow Repaired (${finalScore}/150 PTS)`,
                isCorrect: isVerdictCorrect,
                explanation: `Earned ${finalScore} of 150 points during the Repair the Workflow challenge.`,
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
