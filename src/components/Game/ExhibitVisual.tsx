import React from 'react';
import type { ExhibitId } from '../../types/game';
import { Exhibit01MotionGraphic } from '../MotionGraphics/Exhibit01MotionGraphic';

interface ExhibitVisualProps {
  exhibitId: ExhibitId;
  hasAnswered?: boolean;
}

export const ExhibitVisual: React.FC<ExhibitVisualProps> = ({
  exhibitId,
}) => {
  switch (exhibitId) {
    case 'exhibit-01':
      return <Exhibit01MotionGraphic />;
    case 'exhibit-02':
      return <Exhibit02Visual />;
    case 'exhibit-03':
      return <Exhibit03Visual />;
    case 'exhibit-04':
      return <Exhibit04Visual />;
    default:
      return null;
  }
};

/* ========================================================================= */
/* EXHIBIT 02: AI HALLUCINATIONS                                            */
/* Realistic Academic Paper Specimen + Forensic Verification Pipeline         */
/* ========================================================================= */
const Exhibit02Visual: React.FC = () => {
  return (
    <div className="w-full bg-[#050807] border border-[#00FF88]/30 rounded-xl p-4 sm:p-6 mb-6 shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
      
      {/* Visual Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#00FF88]/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse" />
          <span className="font-mono text-xs font-semibold text-[#00FF88] uppercase tracking-wider">
            Academic Citation Investigation
          </span>
        </div>
        <span className="font-mono text-xs text-[#C8D7CE]">
          Comparing plausible syntax with verified research catalogs
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ------------------------------------------------------------- */}
        {/* LEFT (7 Cols): Realistic Academic Paper Specimen Canvas       */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-7 bg-[#0E1411] border-2 border-[#00FF88]/40 rounded-xl p-5 relative overflow-hidden shadow-2xl">
          
          {/* Fictional Specimen Diagonal Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 rotate-[-25deg]">
            <span className="text-4xl sm:text-5xl font-black font-mono border-4 border-rose-500 text-rose-500 px-6 py-3 tracking-widest uppercase">
              FICTIONAL SPECIMEN
            </span>
          </div>

          {/* Academic Paper Header */}
          <div className="border-b-2 border-white/20 pb-3 mb-4">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#87968D] uppercase tracking-wider mb-1">
              <span>IEEE / ACM TRANSACTIONS ON COMPUTING SYSTEMS</span>
              <span className="text-rose-400 font-bold">SYNTHETIC ARTIFACT</span>
            </div>
            <div className="text-[11px] font-mono text-[#87968D]">
              Vol. 42, No. 4, Article 18 • Publication Date: October 2024
            </div>
          </div>

          {/* Paper Title (Realistic Academic Phrasing) */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#E4F0E8] leading-tight mb-2">
            "Formal Verification of Non-Monotonic Path Invariants in Asynchronous Distributed Systems"
          </h3>

          {/* Authors & Institutional Affiliation */}
          <div className="text-xs text-[#87968D] mb-4 pb-3 border-b border-white/10">
            <span className="text-[#00FF88] font-medium">Dr. Elena Rostova</span>,{' '}
            <span className="text-[#E4F0E8]">Marcus Vance</span>,{' '}
            <span className="text-[#E4F0E8]">Alistair Thorne</span>
            <div className="text-[10px] italic text-[#87968D] mt-0.5">
              Department of Computer Science & Center for Distributed Cryptosystems
            </div>
          </div>

          {/* Abstract in 2-Column Academic Formatting */}
          <div className="bg-[#050807]/90 border border-white/10 rounded p-3 mb-4 text-xs text-[#C5D2C9] leading-relaxed">
            <span className="font-bold text-[#00FF88] text-[10px] tracking-wider uppercase block mb-1 font-mono">
              ABSTRACT SPECIMEN
            </span>
            <p className="mb-2">
              We present a rigorous proof of non-monotonic path divergence in distributed network routing when edge weights exhibit dynamic negative intervals. By formalizing bounded convergence metrics, we demonstrate why greedy edge-relaxation heuristics inevitably fail without global cycle guarantees.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#87968D] pt-2 border-t border-white/5">
              <span>CCS CONCEPTS: Theory of computation</span>
              <span>KEYWORDS: Routing, Invariants, Dijkstra</span>
            </div>
          </div>

          {/* The Hallucinated DOI Block (With Visual Highlight) */}
          <div className="bg-[#050807] border border-rose-500/50 rounded-lg p-3 relative">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                OFFICIAL IDENTIFIER:
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                FABRICATED STRING
              </span>
            </div>
            <div 
              className="font-mono text-xs sm:text-sm md:text-base font-bold text-[#E4F0E8] tracking-wider py-1 select-all"
              style={{ wordBreak: 'break-all' }}
            >
              https://doi.org/10.1145/3699104.2024.fake
            </div>
            <p className="text-xs text-[#C8D7CE] mt-1">
              ⚠️ Syntactically legitimate DOI prefix and suffix generated by LLM probability weights, but completely unindexed in global DOI registries.
            </p>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* RIGHT (5 Cols): The Forensic Verification Pipeline Scanner   */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-5 bg-[#0A0D0B] border-2 border-rose-500/40 rounded-xl p-5 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-rose-500/30">
              <span className="font-mono text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Independent Source Verification
              </span>
            </div>

            {/* Step-by-Step Forensic Verification */}
            <div className="space-y-3.5 mb-5">
              
              {/* Step 1: Query Sent */}
              <div className="flex items-start gap-3 p-3 rounded bg-[#050807] border border-white/5">
                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                  1
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold text-[#E4F0E8]">Crossref DOI Database</div>
                  <div className="font-mono text-[11px] text-[#C8D7CE]" style={{ wordBreak: 'break-all' }}>QUERY: doi.org/10.1145/3699104...</div>
                  <div className="text-[11px] text-rose-400 font-bold mt-1">→ STATUS: 404 Not Found (No record exists)</div>
                </div>
              </div>

              {/* Step 2: Author Database Search */}
              <div className="flex items-start gap-3 p-3 rounded bg-[#050807] border border-white/5">
                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                  2
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold text-[#E4F0E8]">Academic Library Search</div>
                  <div className="font-mono text-[11px] text-[#C8D7CE]" style={{ wordBreak: 'break-all' }}>SEARCH: "Elena Rostova" + "Non-Monotonic"</div>
                  <div className="text-[11px] text-rose-400 font-bold mt-1">→ STATUS: 0 matching papers found</div>
                </div>
              </div>

              {/* Step 3: Journal Volume Index */}
              <div className="flex items-start gap-3 p-3 rounded bg-[#050807] border border-white/5">
                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                  3
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold text-[#E4F0E8]">Journal Volume Index</div>
                  <div className="font-mono text-[11px] text-[#C8D7CE]" style={{ wordBreak: 'break-all' }}>CHECK: Vol 42, No 4 (Oct 2024)</div>
                  <div className="text-[11px] text-rose-400 font-bold mt-1">→ STATUS: Article 18 was never published</div>
                </div>
              </div>

            </div>
          </div>

          {/* Final Forensic Verdict Stamp */}
          <div className="p-4 rounded-lg bg-rose-950/40 border-2 border-rose-500 text-center">
            <span className="font-mono text-[10px] text-rose-400 font-bold uppercase tracking-widest block mb-1">
              Verification Outcome
            </span>
            <div className="font-display font-extrabold text-base text-rose-300 uppercase tracking-wide">
              Hallucinated Citation
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-rose-500/30 text-[10px] font-mono">
              <span className="text-[#87968D]">Plausible Structure: <b className="text-white">99%</b></span>
              <span className="text-[#87968D]">Genuine Record: <b className="text-rose-400">0%</b></span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

/* ========================================================================= */
/* EXHIBIT 03: AI DETECTORS                                                 */
/* Graphical Flow: Document -> Scanner -> 88% -> Reality vs Limitation       */
/* ========================================================================= */
const Exhibit03Visual: React.FC = () => {
  return (
    <div className="w-full bg-[#050807] border border-[#00FF88]/30 rounded-xl p-4 sm:p-6 mb-6 shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
      
      {/* Visual Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#00FF88]/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse" />
          <span className="font-mono text-xs font-semibold text-[#00FF88] uppercase tracking-wider">
            Statistical Scoring vs. Ground Truth
          </span>
        </div>
        <span className="font-mono text-xs text-[#C8D7CE]">
          Probability estimates are not proof of misconduct
        </span>
      </div>

      {/* TOP: Illustrated Detection Scanner Process */}
      <div className="bg-[#0A0D0B] border border-amber-500/40 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Step 1: Student Essay Ingestion */}
          <div className="bg-[#050807] border border-white/10 rounded-lg p-3 text-center">
            <span className="font-mono text-[10px] text-[#87968D] uppercase tracking-wider block mb-2 font-bold">
              1. Essay Submitted
            </span>
            <svg viewBox="0 0 120 70" className="w-full h-16 mx-auto">
              {/* Paper Sheet */}
              <rect x="35" y="5" width="50" height="60" rx="3" fill="#1F2923" stroke="#87968D" strokeWidth="1.5" />
              <line x1="45" y1="18" x2="75" y2="18" stroke="#E4F0E8" strokeWidth="2" />
              <line x1="45" y1="26" x2="70" y2="26" stroke="#9CA3AF" strokeWidth="1.5" />
              <line x1="45" y1="34" x2="75" y2="34" stroke="#9CA3AF" strokeWidth="1.5" />
              <line x1="45" y1="42" x2="65" y2="42" stroke="#9CA3AF" strokeWidth="1.5" />
              <line x1="45" y1="50" x2="72" y2="50" stroke="#9CA3AF" strokeWidth="1.5" />
            </svg>
            <span className="text-[11px] text-[#C8D7CE]">Formal, academic syntax</span>
          </div>

          {/* Step 2: Algorithmic Token Scanner */}
          <div className="bg-[#050807] border border-amber-500/30 rounded-lg p-3 text-center">
            <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider block mb-2 font-bold">
              2. Pattern Analysis
            </span>
            <svg viewBox="0 0 120 70" className="w-full h-16 mx-auto">
              {/* Perplexity Wave Curves */}
              <path d="M 15 35 Q 35 10 55 35 T 95 35 T 115 35" fill="none" stroke="#FBBF24" strokeWidth="2" />
              <line x1="15" y1="55" x2="105" y2="55" stroke="#4B5563" strokeWidth="1" />
              {/* Laser beam scan */}
              <line x1="60" y1="10" x2="60" y2="60" stroke="#00FF88" strokeWidth="2" strokeDasharray="2 2" />
              <text x="60" y="65" fill="#FBBF24" fontSize="8" textAnchor="middle" fontFamily="monospace">BURSTINESS &lt; 0.12</text>
            </svg>
            <span className="text-[11px] text-amber-300">Measures word predictability</span>
          </div>

          {/* Step 3: High Probability Score Alert */}
          <div className="bg-amber-950/30 border border-amber-500 rounded-lg p-3 text-center">
            <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider block mb-1 font-bold">
              3. Output Score
            </span>
            <div className="font-display font-black text-3xl sm:text-4xl text-amber-400 my-1">
              88%
            </div>
            <span className="font-mono text-[10px] text-amber-200 uppercase font-bold tracking-wider">
              Pattern Match Score
            </span>
          </div>

        </div>
      </div>

      {/* MIDDLE: Side-by-Side Visual Split (What it means vs What it cannot prove) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        
        {/* WHAT THE SCORE SUGGESTS */}
        <div className="bg-[#050807] border border-amber-500/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30 text-xs font-mono font-bold text-amber-400">
            <span>📊</span>
            <span>What the 88% Score Suggests</span>
          </div>
          <div className="space-y-2.5 text-xs text-[#C8D7CE]">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span>The essay uses uniform, predictable sentence structures common in academic prose.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Word choice exhibits low variance (high statistical predictability).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Passive voice and structured transitions triggered the model's training threshold.</span>
            </div>
          </div>
        </div>

        {/* WHAT THE SCORE CANNOT PROVE */}
        <div className="bg-[#050807] border border-rose-500/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-rose-500/30 text-xs font-mono font-bold text-rose-400">
            <span>🚫</span>
            <span>What the Score Cannot Prove</span>
          </div>
          <div className="space-y-2.5 text-xs text-[#C8D7CE]">
            <div className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong>Authorship:</strong> It cannot determine who typed the words.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong>Misconduct:</strong> It provides zero legal or academic proof of cheating.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong>False Positives:</strong> High-scoring human authors (especially non-native speakers) are frequently mislabeled.</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM: The Fair Assessment Pathway (SVG Flow) */}
      <div className="bg-[#0A2216] border border-[#00FF88]/40 rounded-xl p-4">
        <span className="font-mono text-xs font-semibold text-[#00FF88] uppercase tracking-wider block mb-3">
          Fair Evaluation Protocol: Evidence over algorithms
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded bg-[#050807] border border-[#00FF88]/30">
            <span className="font-mono text-[10px] text-[#00FF88] font-bold block mb-1">STEP 1</span>
            <div className="font-display font-bold text-xs text-[#E4F0E8]">Flag for Review</div>
            <span className="text-[11px] text-[#C8D7CE]">Never auto-penalize</span>
          </div>
          <div className="p-2.5 rounded bg-[#050807] border border-[#00FF88]/30">
            <span className="font-mono text-[10px] text-[#00FF88] font-bold block mb-1">STEP 2</span>
            <div className="font-display font-bold text-xs text-[#E4F0E8]">Examine Drafts</div>
            <span className="text-[11px] text-[#C8D7CE]">Version history & logs</span>
          </div>
          <div className="p-2.5 rounded bg-[#050807] border border-[#00FF88]/30">
            <span className="font-mono text-[10px] text-[#00FF88] font-bold block mb-1">STEP 3</span>
            <div className="font-display font-bold text-xs text-[#E4F0E8]">Student Discussion</div>
            <span className="text-[11px] text-[#C8D7CE]">Discuss student's logic</span>
          </div>
          <div className="p-2.5 rounded bg-[#050807] border border-[#00FF88]/30">
            <span className="font-mono text-[10px] text-[#00FF88] font-bold block mb-1">STEP 4</span>
            <div className="font-display font-bold text-xs text-[#E4F0E8]">Evidenced Finding</div>
            <span className="text-[11px] text-[#00FF88]">Ground truth evidence</span>
          </div>
        </div>
      </div>

    </div>
  );
};

/* ========================================================================= */
/* EXHIBIT 04: RESPONSIBLE AI                                               */
/* Three Monumental Interconnected Visual Pillars (SVG)                      */
/* ========================================================================= */
const Exhibit04Visual: React.FC = () => {
  return (
    <div className="w-full bg-[#050807] border border-[#00FF88]/30 rounded-xl p-4 sm:p-6 mb-6 shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
      
      {/* Visual Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#00FF88]/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse" />
          <span className="font-mono text-xs font-semibold text-[#00FF88] uppercase tracking-wider">
            The Three Pillars of Responsible AI
          </span>
        </div>
        <span className="font-mono text-xs text-[#C8D7CE]">
          Disclosure, verification, and academic ownership
        </span>
      </div>

      {/* Three Interconnected Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        
        {/* PILLAR 1: TRANSPARENCY */}
        <div className="bg-[#0A1610] border-2 border-[#00FF88]/40 rounded-xl p-5 flex flex-col justify-between text-center relative overflow-hidden group hover:border-[#00FF88] transition-all">
          <div className="absolute top-2 left-2 font-mono text-[10px] text-[#00FF88] font-bold">
            01
          </div>
          <div className="my-2">
            {/* SVG Illustration: The Open Lantern / Blueprint */}
            <svg viewBox="0 0 100 80" className="w-24 h-20 mx-auto mb-3">
              {/* Illuminated Translucent Box with gears */}
              <rect x="20" y="20" width="60" height="50" rx="4" fill="#071A10" stroke="#00FF88" strokeWidth="2" />
              {/* Inner visible mechanism */}
              <circle cx="40" cy="45" r="10" fill="none" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="60" cy="45" r="8" fill="none" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Light rays shining outward */}
              <line x1="50" y1="18" x2="50" y2="8" stroke="#00FF88" strokeWidth="2" />
              <line x1="30" y1="20" x2="22" y2="12" stroke="#00FF88" strokeWidth="2" />
              <line x1="70" y1="20" x2="78" y2="12" stroke="#00FF88" strokeWidth="2" />
              <text x="50" y="60" fill="#E4F0E8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">OPEN LOGS</text>
            </svg>
            <h4 className="font-display font-bold text-lg text-[#E4F0E8] tracking-tight mb-1">
              Transparency
            </h4>
            <span className="font-mono text-xs text-[#00FF88] font-semibold uppercase tracking-wider block mb-2">
              Disclose Usage
            </span>
            <p className="text-xs sm:text-sm text-[#C8D7CE] leading-relaxed">
              Always declare which AI models you used, what prompts you fed them, and what portions they assisted. Never conceal your tools.
            </p>
          </div>
          <div className="pt-3 border-t border-white/5 font-mono text-[11px] text-[#00FF88]">
            Openness builds trust
          </div>
        </div>

        {/* PILLAR 2: VERIFICATION */}
        <div className="bg-[#0A1610] border-2 border-[#00FF88]/40 rounded-xl p-5 flex flex-col justify-between text-center relative overflow-hidden group hover:border-[#00FF88] transition-all">
          <div className="absolute top-2 left-2 font-mono text-[10px] text-[#00FF88] font-bold">
            02
          </div>
          <div className="my-2">
            {/* SVG Illustration: The Precision Microscope & Caliper */}
            <svg viewBox="0 0 100 80" className="w-24 h-20 mx-auto mb-3">
              {/* Magnifying Inspection Glass */}
              <circle cx="45" cy="35" r="18" fill="#071A10" stroke="#00FF88" strokeWidth="2" />
              <line x1="58" y1="48" x2="78" y2="68" stroke="#00FF88" strokeWidth="4" strokeLinecap="round" />
              {/* Checkmark inside glass */}
              <path d="M 37 35 L 43 41 L 54 30" fill="none" stroke="#00FF88" strokeWidth="2.5" />
              {/* Calibration ticks */}
              <line x1="20" y1="65" x2="35" y2="65" stroke="#9CA3AF" strokeWidth="1.5" />
              <line x1="20" y1="62" x2="20" y2="68" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="27" y1="63" x2="27" y2="67" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="35" y1="62" x2="35" y2="68" stroke="#9CA3AF" strokeWidth="1" />
            </svg>
            <h4 className="font-display font-bold text-lg text-[#E4F0E8] tracking-tight mb-1">
              Verification
            </h4>
            <span className="font-mono text-xs text-[#00FF88] font-semibold uppercase tracking-wider block mb-2">
              Verify Every Claim
            </span>
            <p className="text-xs sm:text-sm text-[#C8D7CE] leading-relaxed">
              Independently prove every formula, execute every algorithm, and verify every citation against genuine academic catalogs.
            </p>
          </div>
          <div className="pt-3 border-t border-white/5 font-mono text-[11px] text-[#00FF88]">
            Confirm facts independently
          </div>
        </div>

        {/* PILLAR 3: ACCOUNTABILITY */}
        <div className="bg-[#0A1610] border-2 border-[#00FF88]/40 rounded-xl p-5 flex flex-col justify-between text-center relative overflow-hidden group hover:border-[#00FF88] transition-all">
          <div className="absolute top-2 left-2 font-mono text-[10px] text-[#00FF88] font-bold">
            03
          </div>
          <div className="my-2">
            {/* SVG Illustration: The Human Seal & Signature */}
            <svg viewBox="0 0 100 80" className="w-24 h-20 mx-auto mb-3">
              {/* Shield / Seal of Ownership */}
              <polygon points="50,15 75,25 75,50 50,70 25,50 25,25" fill="#071A10" stroke="#00FF88" strokeWidth="2" />
              {/* Fountain Pen Nib */}
              <polygon points="50,28 55,42 45,42" fill="#00FF88" />
              <line x1="50" y1="42" x2="50" y2="52" stroke="#00FF88" strokeWidth="1.5" />
              {/* Human Handprint / Fingerprint waves */}
              <path d="M 40 48 Q 50 44 60 48" fill="none" stroke="#E4F0E8" strokeWidth="1" />
              <path d="M 38 54 Q 50 50 62 54" fill="none" stroke="#E4F0E8" strokeWidth="1" />
            </svg>
            <h4 className="font-display font-bold text-lg text-[#E4F0E8] tracking-tight mb-1">
              Accountability
            </h4>
            <span className="font-mono text-xs text-[#00FF88] font-semibold uppercase tracking-wider block mb-2">
              Take Ownership
            </span>
            <p className="text-xs sm:text-sm text-[#C8D7CE] leading-relaxed">
              You are personally and legally responsible for the final submission. If AI hallucinated or made a calculation error, you bear the consequence.
            </p>
          </div>
          <div className="pt-3 border-t border-white/5 font-mono text-[11px] text-[#00FF88]">
            You own the final work
          </div>
        </div>

      </div>

      {/* Connecting Conduit Bar */}
      <div className="p-3 rounded-lg bg-[#071A10] border border-[#00FF88]/30 flex flex-wrap items-center justify-around gap-3 text-xs font-mono text-[#E4F0E8]">
        <span className="flex items-center gap-1.5 text-[#00FF88] font-bold">
          <span>①</span> Disclose Assistance
        </span>
        <span className="text-white/20">→</span>
        <span className="flex items-center gap-1.5 text-[#00FF88] font-bold">
          <span>②</span> Verify Evidence
        </span>
        <span className="text-white/20">→</span>
        <span className="flex items-center gap-1.5 text-[#00FF88] font-bold">
          <span>③</span> Stand Behind Your Work
        </span>
      </div>

    </div>
  );
};
