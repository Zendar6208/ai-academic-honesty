import React, { useState, useEffect } from 'react';
import { ArrowRight, FastForward } from 'lucide-react';

interface CinematicOpeningProps {
  onEnter: () => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onEnter }) => {
  const [phase, setPhase] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    // Progressive timed boot sequence (measured, cinematic, unhurried)
    const timers = [
      setTimeout(() => setPhase(1), 500),   // System Initializing...
      setTimeout(() => setPhase(2), 1500),  // Academic Integrity Protocol: Active
      setTimeout(() => setPhase(3), 2600),  // "AI CAN WRITE THE ANSWER."
      setTimeout(() => setPhase(4), 3700),  // "BUT CAN YOU EXPLAIN IT?"
      setTimeout(() => setPhase(5), 4700),  // Narrative subtitle
      setTimeout(() => setPhase(6), 5600),  // CTA button
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  return (
    <div 
      className={`cinematic-opening-screen ${isExiting ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'}`}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 7, 0.72)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(24px, 5vw, 64px)',
        overflow: 'hidden',
        transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="System Initializing"
    >
      {/* Background radial ambient illumination */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(1000px, 95vw)',
          height: 'min(700px, 75vh)',
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, rgba(7, 26, 16, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Top telemetry status bar */}
      <div 
        style={{
          position: 'absolute',
          top: 24,
          left: 'clamp(20px, 4vw, 56px)',
          right: 'clamp(20px, 4vw, 56px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.12em',
          borderBottom: '1px solid rgba(0, 255, 136, 0.15)',
          paddingBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              display: 'inline-block',
              boxShadow: '0 0 8px var(--accent-primary)'
            }} 
          />
          <span style={{ color: '#E4F0E8' }}>VIT-AP UNIVERSITY // CYBERNETIC INQUIRY</span>
        </div>

        {/* Skip intro button */}
        <button
          onClick={handleEnter}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            padding: '5px 10px',
            border: '1px solid var(--border-medium)',
            borderRadius: '4px',
            backgroundColor: 'rgba(7, 26, 16, 0.6)',
            cursor: 'pointer'
          }}
          aria-label="Skip opening intro"
        >
          <span>SKIP INTRO</span>
          <FastForward size={12} />
        </button>
      </div>

      {/* Central Storytelling Canvas */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1080px',
          textAlign: 'left',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Step 1 & 2: Progressive System Terminal Log */}
        <div 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.8125rem, 1.4vw, 0.9375rem)',
            color: 'var(--accent-primary)',
            letterSpacing: '0.08em',
            marginBottom: 'clamp(20px, 3.5vw, 40px)',
            minHeight: '52px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {phase >= 1 && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'textReveal 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>&gt;</span>
              <span>SYSTEM INITIALIZING...</span>
              {phase === 1 && <span className="cursor-blink" />}
            </div>
          )}

          {phase >= 2 && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--accent-secondary)',
                animation: 'textReveal 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>&gt;</span>
              <span>ACADEMIC INTEGRITY PROTOCOL: ACTIVE</span>
              {phase === 2 && <span className="cursor-blink" />}
            </div>
          )}
        </div>

        {/* Step 3: Reveal AI CAN WRITE THE ANSWER */}
        {phase >= 3 && (
          <h1 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6.5vw, 5.75rem)',
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: 'var(--text-main)',
              textTransform: 'uppercase',
              marginBottom: '14px',
              animation: 'textReveal 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            AI Can Write
            <br />
            <span>The Answer.</span>
          </h1>
        )}

        {/* Step 4: Reveal BUT CAN YOU EXPLAIN IT? */}
        {phase >= 4 && (
          <div 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5.8vw, 5.25rem)',
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: 'var(--accent-primary)',
              textTransform: 'uppercase',
              textShadow: '0 0 35px rgba(0, 255, 136, 0.35)',
              marginBottom: 'clamp(20px, 3vw, 32px)',
              animation: 'textReveal 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            But Can You Explain It?
          </div>
        )}

        {/* Step 5: Narrative Statement */}
        {phase >= 5 && (
          <p 
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9375rem, 1.4vw, 1.1875rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '720px',
              marginBottom: 'clamp(28px, 4vw, 44px)',
              animation: 'textReveal 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            A digital investigation into the boundary between synthetic fluency and authentic comprehension in the age of generative intelligence.
          </p>
        )}

        {/* Step 6: ENTER THE EXPERIENCE CTA */}
        {phase >= 6 && (
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '20px',
              animation: 'textReveal 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <button
              onClick={handleEnter}
              className="enter-archive-button"
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 36px',
                backgroundColor: 'var(--accent-primary)',
                color: '#050807',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '8px',
                boxShadow: '0 0 30px rgba(0, 255, 136, 0.45)',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              aria-label="Enter the digital archive experience"
            >
              <span>ENTER THE EXPERIENCE</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>

            <span 
              className="hidden-mobile font-mono"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                letterSpacing: '0.08em'
              }}
            >
              [ PRESS ENTER KEY TO CONTINUE ]
            </span>
          </div>
        )}
      </div>

      {/* Bottom telemetry status bar */}
      <div 
        style={{
          position: 'absolute',
          bottom: 24,
          left: 'clamp(20px, 4vw, 56px)',
          right: 'clamp(20px, 4vw, 56px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--text-dim)',
          borderTop: '1px solid rgba(0, 255, 136, 0.12)',
          paddingTop: '12px'
        }}
      >
        <span style={{ color: '#87968D' }}>STATUS: SYSTEM READY</span>
        <span style={{ color: '#00FF88' }}>4 EXHIBITS • 3 ASSESSMENTS • 450 PTS</span>
      </div>
    </div>
  );
};
