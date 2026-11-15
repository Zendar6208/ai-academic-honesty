import React from 'react';
import { ArchiveAssetSlot } from '../Hero/ArchiveAssetSlot';
import { ARCHIVE_METADATA } from '../../types/exhibition';
import { ArrowDown } from 'lucide-react';

export const OpeningHeroScene: React.FC = () => {
  const scrollToExhibit01 = () => {
    const elem = document.getElementById('exhibit-01');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="scene-00"
      className="documentary-scene"
      style={{
        minHeight: '100vh',
        paddingTop: 'calc(52px + clamp(36px, 5vw, 64px))',
        paddingBottom: 'clamp(56px, 6vw, 84px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
      aria-label="Scene 00: The Opening Provocation"
    >
      <div className="exhibition-container">
        
        {/* Curatorial Header Stamp */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 'clamp(28px, 4vw, 56px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                letterSpacing: '0.12em'
              }}
            >
              PROLOGUE // SPECIAL INQUIRY
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)'
              }}
            >
              {ARCHIVE_METADATA.institution}
            </span>
          </div>

          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--accent-secondary)',
              letterSpacing: '0.06em'
            }}
          >
            LOCATION: CENTRAL EXHIBITION HALL
          </div>
        </div>

        {/* Monumental Headline Composition */}
        <div style={{ maxWidth: '1200px' }}>
          <h1 
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: 'var(--text-main)',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}
          >
            AI Can Write
            <br />
            <span>The Answer.</span>
          </h1>

          <div 
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--accent-primary)',
              textTransform: 'uppercase',
              textShadow: '0 0 35px rgba(0, 255, 136, 0.3)',
              marginBottom: 'clamp(20px, 3vw, 36px)'
            }}
          >
            But Can You Explain It?
          </div>

          {/* Physical Document Contrast Statement */}
          <div 
            style={{
              maxWidth: '860px',
              borderLeft: '2px solid var(--accent-primary)',
              paddingLeft: 'clamp(18px, 3vw, 28px)',
              marginTop: '20px',
              marginBottom: '32px',
              backgroundColor: 'rgba(0, 255, 136, 0.02)'
            }}
          >
            <p 
              className="manuscript-contrast"
              style={{
                fontSize: 'clamp(1.125rem, 2vw, 1.45rem)',
                lineHeight: 1.5,
                marginBottom: '8px',
                fontWeight: 500
              }}
            >
              "When computational agents generate solutions in seconds, the ethical divide is no longer who produced the syntax—but who possesses the comprehension."
            </p>
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--accent-primary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Curatorial Intelligence Archive // Special Inquiry Commission, VIT-AP
            </div>
          </div>
        </div>

        {/* Editorial Image Asset Slot */}
        <ArchiveAssetSlot />

        {/* Proceed to Exhibition Button */}
        <div 
          style={{ 
            marginTop: 'clamp(32px, 5vw, 48px)',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            onClick={scrollToExhibit01}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              backgroundColor: 'rgba(7, 26, 16, 0.9)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '4px',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 0 25px rgba(0, 255, 136, 0.2)',
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            className="hover:bg-[#00FF88] hover:text-[#050807] transition-all"
          >
            <span>PROCEED TO EXHIBIT 01: COGNITIVE AGENCY</span>
            <ArrowDown size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};
