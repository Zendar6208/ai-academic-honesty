import React from 'react';
import { ARCHIVE_METADATA } from '../../types/exhibition';

export const Footer: React.FC = () => {
  return (
    <footer 
      style={{
        backgroundColor: '#050807',
        borderTop: '1px solid var(--border-medium)',
        paddingTop: '64px',
        paddingBottom: '64px',
        color: 'var(--text-muted)',
        position: 'relative',
        zIndex: 10
      }}
      role="contentinfo"
    >
      <div className="exhibition-container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Left Column */}
          <div>
            <div className="terminal-badge" style={{ marginBottom: '10px' }}>
              INTELLIGENCE ARCHIVE // 2026
            </div>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '8px'
              }}
            >
              AI & Academic Honesty
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
              Curated for the university community at VIT-AP. Designed as an interactive digital archive examining synthetic fluency, epistemic debt, and the preservation of human critical thinking.
            </p>
          </div>

          {/* Center Column */}
          <div>
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                letterSpacing: '0.1em',
                marginBottom: '10px'
              }}
            >
              INSTITUTIONAL METADATA
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              <strong>VENUE:</strong> Central Exhibition Hall, VIT-AP
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              <strong>COORDINATES:</strong> {ARCHIVE_METADATA.location}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              <strong>CODENAME:</strong> {ARCHIVE_METADATA.systemCodename}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                letterSpacing: '0.1em',
                marginBottom: '10px'
              }}
            >
              CORE ARCHIVE ETHOS
            </div>
            <p className="manuscript-contrast" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
              "Education is not the acquisition of generated answers, but the formation of a conscious mind capable of questioning them."
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            © 2026 VIT-AP UNIVERSITY. ALL INTELLECTUAL RIGHTS RESERVED.
          </div>
          <div>
            ACADEMIC INTEGRITY SPECIAL COMMISSION // MATRIX ARCHIVE RUNTIME
          </div>
        </div>
      </div>
    </footer>
  );
};
