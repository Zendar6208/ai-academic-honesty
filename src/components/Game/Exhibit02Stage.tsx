import React from 'react';
import type { ExhibitData, GameOption } from '../../types/game';
import { Exhibit02MotionGraphic } from './Exhibit02MotionGraphic';
import { AlertOctagon, ShieldAlert, FileSearch, ArrowRight } from 'lucide-react';

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
  onContinue,
}) => {
  const scrollToExhibit03 = () => {
    const elem = document.getElementById('exhibit-03');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    onContinue();
  };

  return (
    <div className="w-full">
      <section
        id="exhibit-02"
        className="documentary-scene"
        style={{
          minHeight: '100vh',
          paddingTop: 'clamp(64px, 7vw, 96px)',
          paddingBottom: 'clamp(64px, 7vw, 96px)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderTop: '1px solid rgba(0, 255, 136, 0.25)',
        }}
        aria-label="Exhibit 02: AI Hallucinations & Source Integrity"
      >
        <div className="exhibition-container" style={{ maxWidth: '1180px', margin: '0 auto', width: '100%' }}>
          
          {/* 1. Curatorial Identification Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-8 border-b border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold text-emerald-400 tracking-widest uppercase">
                EXHIBIT 02 // SOURCE INTEGRITY
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-xs text-[#87968D] tracking-wider uppercase">
                THE CITATION HALLUCINATION INQUIRY
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#87968D]">
              <span className="w-2 h-2 rounded-full bg-emerald-400/60 inline-block" />
              <span>EDUCATIONAL EXHIBIT // NO TEST</span>
            </div>
          </div>

          {/* 2. Monumental Main Headline & Context */}
          <div className="mb-10 max-w-4xl">
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#E4F0E8',
                marginBottom: '20px',
              }}
            >
              A CITATION CAN LOOK REAL AND STILL BE FAKE.
            </h2>

            {/* Core Teaching Callout */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#08170F] border border-[#00FF88]/30 mb-6 flex items-start gap-3.5">
              <ShieldAlert className="text-[#00FF88] shrink-0 mt-0.5" size={22} />
              <div>
                <span className="font-mono text-xs font-bold text-[#00FF88] uppercase tracking-wider block mb-1">
                  CORE PRINCIPLE // VERIFY THE SOURCE, NOT JUST THE CITATION
                </span>
                <p 
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
                    lineHeight: 1.55,
                    color: '#E4F0E8',
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  Large language models generate text by predicting statistically probable sequences of words. When asked for evidence, they synthesize citations that <span className="text-[#00FF88] font-bold">mimic scholarly conventions</span> without consulting or checking an actual academic index.
                </p>
              </div>
            </div>

            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                lineHeight: 1.65,
                color: '#D1DDD5',
                marginBottom: '12px',
              }}
            >
              Because scholarly references follow predictable grammatical structures (Author, Year, Title, Journal, Volume, DOI), an AI can fabricate convincing papers that do not correspond to any real publications. It can even combine details from genuine papers to create a citation that looks legitimate to examiners, search engines, and peers.
            </p>
          </div>

          {/* 3. Five-Scene Cinematic Animated Explainer (Enlarged) */}
          <Exhibit02MotionGraphic />

          {/* 4. Deep Forensic Field Guide: Three Hallucination Anatomies */}
          <div className="mb-12">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileSearch className="text-[#00FF88]" size={18} />
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#E4F0E8] tracking-tight m-0">
                  Forensic Field Guide // Three Common Citation Hallucinations
                </h3>
              </div>
              <span className="font-mono text-xs text-[#87968D]">DISCERNMENT PATTERNS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pattern 1 */}
              <div className="bg-[#07110B] border border-emerald-500/20 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#00FF88]">PATTERN 01</span>
                    <AlertOctagon size={16} className="text-amber-400" />
                  </div>
                  <h4 className="font-display font-bold text-base text-[#E4F0E8] mb-2">
                    The Borrowed Author
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[#87968D] leading-relaxed m-0">
                    The AI pairs a genuine, highly cited researcher with an imaginary paper title they never authored, often in a domain adjacent to their real discipline.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[11px] text-amber-300/80">
                  VERIFICATION: Search the author's verified ORCID profile or faculty catalog.
                </div>
              </div>

              {/* Pattern 2 */}
              <div className="bg-[#07110B] border border-emerald-500/20 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#00FF88]">PATTERN 02</span>
                    <AlertOctagon size={16} className="text-amber-400" />
                  </div>
                  <h4 className="font-display font-bold text-base text-[#E4F0E8] mb-2">
                    The Phantom Journal &amp; Volume
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[#87968D] leading-relaxed m-0">
                    A real journal title is listed with an impossible volume, issue number, or page span that exceeds publication records or occurred prior to the journal's founding.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[11px] text-amber-300/80">
                  VERIFICATION: Inspect the journal's official publisher table of contents.
                </div>
              </div>

              {/* Pattern 3 */}
              <div className="bg-[#07110B] border border-emerald-500/20 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#00FF88]">PATTERN 03</span>
                    <AlertOctagon size={16} className="text-amber-400" />
                  </div>
                  <h4 className="font-display font-bold text-base text-[#E4F0E8] mb-2">
                    The Chimera DOI Identifier
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[#87968D] leading-relaxed m-0">
                    A valid DOI prefix (e.g., 10.1016/...) is spliced onto a fabricated suffix, resolving to an entirely unrelated paper or returning an unresolvable 404 error.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[11px] text-amber-300/80">
                  VERIFICATION: Resolve via doi.org or query CrossRef directly.
                </div>
              </div>
            </div>
          </div>

          {/* 5. Monumental Key Takeaway Banner */}
          <div className="bg-[#08170F] border-2 border-[#00FF88]/40 rounded-2xl p-6 sm:p-8 shadow-[0_16px_48px_rgba(0,0,0,0.8)] mb-10 text-center">
            <span className="font-mono text-xs font-bold text-[#00FF88] uppercase tracking-widest block mb-2">
              THE UNCOMPROMISING STANDARD
            </span>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                color: '#00FF88',
                marginBottom: '12px',
              }}
            >
              "VERIFY THE SOURCE, NOT JUST THE CITATION."
            </h3>
            <p className="font-display text-sm sm:text-base text-[#E4F0E8] max-w-2xl mx-auto font-medium">
              Looking academic does not make a source real. As an academic author, you bear personal responsibility for every citation listed in your bibliography.
            </p>
          </div>

          {/* 6. Smooth Transition Button to Exhibit 03 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="font-mono text-xs text-[#87968D]">
              NEXT INQUIRY // EXHIBIT 03: AI DETECTOR LIMITATIONS
            </div>
            <button
              type="button"
              onClick={scrollToExhibit03}
              className="exhibit-btn-pill cursor-pointer"
            >
              <span>Proceed to Exhibit 03 — Detector Limitations</span>
              <ArrowRight size={16} className="text-[#00FF88]" />
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};
