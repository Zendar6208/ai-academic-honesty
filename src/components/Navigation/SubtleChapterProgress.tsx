import React, { useState, useEffect } from 'react';
import { Terminal, RotateCcw } from 'lucide-react';

interface SubtleChapterProgressProps {
  currentSectionId: string;
  currentSectionTitle: string;
  currentSectionNumber: string;
  scrollProgress: number;
  score: number;
  onResetClick: () => void;
  onOpenIndex: () => void;
}

export const SubtleChapterProgress: React.FC<SubtleChapterProgressProps> = ({
  currentSectionTitle,
  currentSectionNumber,
  scrollProgress,
  score,
  onResetClick,
  onOpenIndex
}) => {
  const [showScrollCue, setShowScrollCue] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowScrollCue(false);
      } else {
        setShowScrollCue(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Discreet Fixed Top Telemetry Bar */}
      <nav 
        className="subtle-progress-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '52px',
          backgroundColor: 'rgba(5, 8, 7, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 255, 136, 0.15)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(16px, 3vw, 36px)',
          transition: 'all 200ms ease'
        }}
        aria-label="Exhibition scene tracker"
      >
        {/* Left: Active Scene Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span 
            className="glow-beacon"
            style={{
              width: '7px',
              height: '7px',
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 10px var(--accent-primary)',
              borderRadius: '1px',
              display: 'inline-block',
              flexShrink: 0
            }} 
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', minWidth: 0 }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700, flexShrink: 0 }}>
              {currentSectionNumber}
            </span>
            <span style={{ color: 'var(--border-medium)', flexShrink: 0 }}>/</span>
            <span style={{ 
              color: 'var(--text-main)', 
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'clamp(90px, 22vw, 240px)'
            }}>
              {currentSectionTitle}
            </span>
          </div>
        </div>

        {/* Center: Slender Reading Trace */}
        <div 
          className="hidden-mobile"
          style={{
            flex: '0 1 200px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1px'
          }}
          title={`Documentary progress: ${Math.round(scrollProgress * 100)}%`}
        >
          <div 
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%`,
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 8px var(--accent-primary)',
              transition: 'width 80ms linear'
            }}
          />
        </div>

        {/* Right: Live Score & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Live Score Counter */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '2px',
              backgroundColor: 'rgba(7, 26, 16, 0.8)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-main)',
              fontWeight: 700
            }}
            aria-live="polite"
          >
            <span style={{ color: 'var(--accent-primary)' }}>★</span>
            <span style={{ color: 'var(--accent-primary)' }}>{score}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>/ 600 PTS</span>
          </div>

          {/* New Visitor / Reset Button */}
          <button
            onClick={onResetClick}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              minHeight: '32px',
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: 'rgba(5, 8, 7, 0.85)',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              border: '1px solid var(--border-medium)',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            aria-label="Start new visitor session"
            title="Reset session for the next visitor"
          >
            <RotateCcw size={12} style={{ color: 'var(--accent-primary)' }} />
            <span className="hidden-mobile">NEW VISITOR</span>
          </button>

          {/* Discreet Index Button */}
          <button
            onClick={onOpenIndex}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              minHeight: '32px',
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
            aria-label="Open Exhibition Itinerary"
          >
            <Terminal size={13} />
            <span className="hidden-mobile">INDEX</span>
          </button>
        </div>
      </nav>

      {/* Slender Scroll Cue (Fades out when user scrolls past 80px) */}
      {showScrollCue && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            opacity: 0.9,
            transition: 'opacity 300ms ease'
          }}
        >
          <span>SCROLL TO EXPLORE EXHIBITION</span>
          <div 
            style={{
              width: '1px',
              height: '16px',
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 6px var(--accent-primary)',
              animation: 'scrollCuePulse 1.8s infinite ease-in-out'
            }} 
          />
        </div>
      )}
    </>
  );
};
