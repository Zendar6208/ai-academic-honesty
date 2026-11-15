import React from 'react';
import heroImg from '../../assets/hero.png';

interface WelcomeScreenProps {
  onStartGame: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame }) => {
  return (
    <div className="w-full min-h-[calc(100vh-65px)] flex flex-col justify-center items-center px-4 md:px-8 py-8 md:py-12 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FF88]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Exhibition Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00FF88]/30 bg-[#071A10] text-[#00FF88] font-mono text-[11px] md:text-xs uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
          <span>VIT-AP UNIVERSITY // INTERACTIVE EXHIBITION GAME</span>
        </div>

        {/* Main Provocative Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-[#E4F0E8] tracking-tight leading-[1.12] max-w-4xl mb-4">
          AI Can Write The Answer. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] via-[#8AFFB2] to-[#E4F0E8]">
            Can You Explain It?
          </span>
        </h1>

        {/* 2-Sentence Punchy Premise */}
        <p className="text-base sm:text-lg md:text-xl text-[#87968D] max-w-2xl font-sans mb-8 leading-relaxed">
          Synthetic tools assemble fluent solutions in seconds. But in an oral defense or real-world crisis, fluency without comprehension collapses instantly.
        </p>

        {/* Hero Visual Slot */}
        <div className="w-full max-w-3xl rounded-2xl border border-[#00FF88]/30 bg-[#071A10] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(0,255,136,0.1)] relative group mb-8">
          <div className="aspect-[16/9] w-full relative overflow-hidden">
            <img
              src={heroImg}
              alt="Academic Honesty in the Age of AI"
              className="w-full h-full object-cover object-center filter contrast-105 brightness-95 transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-transparent to-transparent opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050807]/30 via-transparent to-[#050807]/30" />

            {/* Visual Callout Badge inside hero */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#E4F0E8] bg-[#050807]/85 backdrop-blur-md px-4 py-2.5 rounded-lg border border-[#00FF88]/25 shadow-lg">
              <span className="flex items-center gap-2">
                <span className="text-[#00FF88]">●</span> 4 Interactive Exhibits
              </span>
              <span className="text-[#00FF88] font-bold">Earn up to 600 PTS</span>
            </div>
          </div>
        </div>

        {/* Exhibit Preview Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mb-8">
          <div className="bg-[#071A10]/70 border border-[#00FF88]/20 rounded-xl p-3.5 text-left transition-colors hover:border-[#00FF88]/40">
            <div className="font-mono text-[10px] text-[#00FF88] font-bold">EXHIBIT 01</div>
            <div className="text-xs font-semibold text-[#E4F0E8] mt-0.5">Tutor vs Substitute</div>
            <div className="text-[10px] text-[#87968D] mt-1">Cognitive Agency</div>
          </div>
          <div className="bg-[#071A10]/70 border border-[#00FF88]/20 rounded-xl p-3.5 text-left transition-colors hover:border-[#00FF88]/40">
            <div className="font-mono text-[10px] text-[#00FF88] font-bold">EXHIBIT 02</div>
            <div className="text-xs font-semibold text-[#E4F0E8] mt-0.5">Citation Hallucination</div>
            <div className="text-[10px] text-[#87968D] mt-1">Source Integrity</div>
          </div>
          <div className="bg-[#071A10]/70 border border-[#00FF88]/20 rounded-xl p-3.5 text-left transition-colors hover:border-[#00FF88]/40">
            <div className="font-mono text-[10px] text-[#00FF88] font-bold">EXHIBIT 03</div>
            <div className="text-xs font-semibold text-[#E4F0E8] mt-0.5">AI Detector Fallacy</div>
            <div className="text-[10px] text-[#87968D] mt-1">Evaluation Limits</div>
          </div>
          <div className="bg-[#071A10]/70 border border-[#00FF88]/20 rounded-xl p-3.5 text-left transition-colors hover:border-[#00FF88]/40">
            <div className="font-mono text-[10px] text-[#00FF88] font-bold">EXHIBIT 04</div>
            <div className="text-xs font-semibold text-[#E4F0E8] mt-0.5">Attribution Standard</div>
            <div className="text-[10px] text-[#87968D] mt-1">Ethical Practice</div>
          </div>
        </div>

        {/* Main CTA Button */}
        <button
          onClick={onStartGame}
          type="button"
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#00FF88] text-[#050807] font-display font-bold text-base md:text-lg tracking-wide hover:bg-[#8AFFB2] transition-all duration-300 shadow-[0_0_25px_rgba(0,255,136,0.35)] hover:shadow-[0_0_35px_rgba(0,255,136,0.6)] cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88]"
        >
          <span>START THE EXHIBITION GAME</span>
          <span className="font-mono group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        </button>

        <p className="text-xs font-mono text-[#87968D] mt-4">
          Takes ~2 minutes • Interactive educational game for exhibition visitors
        </p>
      </div>
    </div>
  );
};
