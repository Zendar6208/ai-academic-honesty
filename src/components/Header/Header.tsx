import React, { useState, useEffect } from 'react';
import { ARCHIVE_CHAPTERS } from '../../types/exhibition';
import { Terminal, Volume2, VolumeX, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenIndex: () => void;
  activeChapterIndex: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenIndex, activeChapterIndex }) => {
  const [ambientAudio, setAmbientAudio] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeChapter = ARCHIVE_CHAPTERS[activeChapterIndex] || ARCHIVE_CHAPTERS[0];

  return (
    <header 
      className={`archive-header ${scrolled ? 'header-scrolled' : ''}`}
      style={{
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.6)' : 'none',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: scrolled ? 'rgba(5, 8, 7, 0.95)' : 'rgba(5, 8, 7, 0.8)',
      }}
      role="banner"
    >
      <div className="exhibition-container archive-header-inner">
        {/* Left: Terminal Telemetry Logotype */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 10px var(--accent-primary)',
              borderRadius: '1px'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.14em',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              VIT-AP ARCHIVE // INTELLIGENCE INQUIRY
            </span>
            <span 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-main)'
              }}
            >
              AI & Academic Honesty
            </span>
          </div>

          <div 
            style={{
              height: '24px',
              width: '1px',
              backgroundColor: 'var(--border-subtle)',
              margin: '0 4px'
            }}
            className="hidden-mobile"
          />

          <span 
            className="hidden-tablet font-mono"
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em'
            }}
          >
            SYS: ONLINE // 2026.11
          </span>
        </div>

        {/* Center: Active Chapter Telemetry Tracker */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(7, 26, 16, 0.85)',
              border: '1px solid var(--border-medium)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-main)',
              borderRadius: '2px'
            }}
          >
            <Activity size={12} color="#00FF88" />
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>CH {activeChapter.code}</span>
            <span style={{ color: 'var(--border-medium)' }}>/</span>
            <span>{activeChapter.title}</span>
          </div>
        </div>

        {/* Right: Soundscape Atmosphere & Dossier Index */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Audio atmosphere toggle */}
          <button
            onClick={() => setAmbientAudio(!ambientAudio)}
            title={ambientAudio ? "Mute cybernetic ambient frequency" : "Enable cybernetic ambient frequency"}
            aria-label={ambientAudio ? "Mute atmosphere" : "Enable atmosphere"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '2px',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border-subtle)',
              background: ambientAudio ? 'rgba(0, 255, 136, 0.12)' : 'transparent',
              color: ambientAudio ? 'var(--accent-primary)' : 'var(--text-muted)'
            }}
          >
            {ambientAudio ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span className="hidden-mobile">{ambientAudio ? "AUDIO: FREQ ON" : "ATMOSPHERE"}</span>
          </button>

          {/* Chapters Dossier Button */}
          <button
            onClick={onOpenIndex}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              borderRadius: '2px',
              backgroundColor: 'rgba(0, 255, 136, 0.1)',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              border: '1px solid var(--border-strong)',
              boxShadow: '0 0 12px rgba(0, 255, 136, 0.15)'
            }}
            aria-label="Open Archive Chapter Dossier"
          >
            <Terminal size={13} />
            <span>DOSSIER</span>
          </button>
        </div>
      </div>
    </header>
  );
};
