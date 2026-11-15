import React from 'react';
import type { AppStep, ExhibitId } from '../../types/game';

interface GameHeaderProps {
  currentStep: AppStep;
  score: number;
  completedExhibits: ExhibitId[];
  onResetClick: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentStep,
  score,
  completedExhibits,
  onResetClick,
}) => {
  const exhibits: { id: ExhibitId; num: string; title: string }[] = [
    { id: 'exhibit-01', num: '01', title: 'Tutor vs Substitute' },
    { id: 'exhibit-02', num: '02', title: 'Citation Hallucination' },
    { id: 'exhibit-03', num: '03', title: 'AI Detectors' },
    { id: 'exhibit-04', num: '04', title: 'Attribution Standard' },
  ];

  const isExhibitStage = currentStep !== 'intro' && currentStep !== 'final-score';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050807]/90 backdrop-blur-md border-b border-[#00FF88]/20 px-4 md:px-8 py-3 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Branding & University Badge */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] md:text-xs text-[#00FF88] uppercase tracking-wider font-semibold">
                VIT-AP UNIVERSITY
              </span>
              <span className="text-[#00FF88]/40 hidden sm:inline">|</span>
              <span className="text-[11px] md:text-xs text-[#87968D] hidden sm:inline font-mono">
                ACADEMIC HONESTY EXHIBITION
              </span>
            </div>
            <div className="text-xs md:text-sm font-display font-medium text-[#E4F0E8] truncate">
              The Thinking Exhibition
            </div>
          </div>
        </div>

        {/* Center: Stage Pills (visible when in exhibits) */}
        {isExhibitStage && (
          <nav aria-label="Exhibit Progress" className="hidden md:flex items-center gap-2 bg-[#071A10] border border-[#00FF88]/25 rounded-full px-3 py-1">
            <span className="text-[10px] font-mono text-[#87968D] uppercase tracking-widest mr-1">
              EXHIBIT
            </span>
            {exhibits.map((ex) => {
              const isActive = currentStep === ex.id;
              const isDone = completedExhibits.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  title={`${ex.num}: ${ex.title}`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#00FF88] text-[#050807] shadow-[0_0_12px_#00FF88]'
                      : isDone
                      ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40'
                      : 'bg-[#050807] text-[#87968D] border border-white/10'
                  }`}
                >
                  {isDone ? '✓' : ex.num}
                </div>
              );
            })}
          </nav>
        )}

        {/* Right: Live Score & New Visitor Reset Button */}
        <div className="flex items-center gap-3">
          <div 
            className="bg-[#071A10] border border-[#00FF88]/30 rounded-lg px-3 py-1.5 flex items-center gap-2"
            aria-live="polite"
          >
            <span className="text-[#00FF88] text-sm animate-pulse">★</span>
            <div className="font-mono text-xs md:text-sm font-bold text-[#E4F0E8] tracking-wider">
              <span className="text-[#00FF88]">{score}</span>
              <span className="text-[#87968D] text-[10px] ml-1">/ 600 PTS</span>
            </div>
          </div>

          <button
            onClick={onResetClick}
            type="button"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00FF88]/30 bg-[#050807] hover:bg-[#00FF88]/15 hover:border-[#00FF88] text-xs font-mono text-[#E4F0E8]/80 hover:text-[#00FF88] transition-all duration-200 cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88]"
            title="Reset session for the next visitor"
          >
            <span className="text-[#00FF88] group-hover:rotate-180 transition-transform duration-300">↺</span>
            <span className="hidden xs:inline">NEW VISITOR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
