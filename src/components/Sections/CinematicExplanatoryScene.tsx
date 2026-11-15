import React, { useState } from 'react';
import { Zap, BookOpen } from 'lucide-react';

export const CinematicExplanatoryScene: React.FC = () => {
  const [activeCircuit, setActiveCircuit] = useState<'synthesis' | 'bypass'>('synthesis');

  return (
    <section 
      id="scene-01"
      className="documentary-scene"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(72px, 8vw, 110px)',
        paddingBottom: 'clamp(80px, 9vw, 130px)',
        backgroundColor: '#071A10',
        borderTop: '1px solid var(--border-medium)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
      aria-label="Scene 01: Cognitive Reasoning Pathway"
    >
      <div className="exhibition-container">
        
        {/* Curatorial Header */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '20px'
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
              SCENE 01 // CONCEPTUAL INQUIRY
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)'
              }}
            >
              THE VELOCITY TRAP
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
            PEDAGOGICAL FRAMEWORK // VIT-AP ARCHIVE
          </div>
        </div>

        {/* 1. Monumental Headline */}
        <h2 
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            maxWidth: '1000px',
            marginBottom: '14px'
          }}
        >
          Fluency Is Not Comprehension.
        </h2>

        {/* 2. Razor-sharp Sub-headline (Qualitative, evidence-neutral) */}
        <p 
          style={{
            fontSize: 'clamp(1.0625rem, 1.8vw, 1.25rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            maxWidth: '780px',
            marginBottom: 'clamp(32px, 4vw, 48px)'
          }}
        >
          When generative systems instantly assemble polished answers, the deliberate struggle required to build durable intuition is entirely circumvented.
        </p>

        {/* 3. Dominant Visual Centerpiece: Conceptual Reasoning Pathway Diagram */}
        <div 
          style={{
            backgroundColor: '#050807',
            border: '1px solid var(--border-medium)',
            borderRadius: '2px',
            padding: 'clamp(20px, 3.5vw, 36px)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 255, 136, 0.05)',
            marginBottom: 'clamp(32px, 4vw, 48px)',
            position: 'relative'
          }}
        >
          {/* Pathway Selector & Status Bar */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: activeCircuit === 'synthesis' ? 'var(--accent-primary)' : '#FF8A8A',
                  boxShadow: activeCircuit === 'synthesis' ? '0 0 8px var(--accent-primary)' : '0 0 8px #FF8A8A'
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '0.08em' }}>
                {activeCircuit === 'synthesis' ? 'PATHWAY A: INTELLECTUAL SYNTHESIS' : 'PATHWAY B: SYNTHETIC SHORTCUT'}
              </span>
            </div>

            {/* Pathway Mode Switches */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveCircuit('synthesis')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  borderRadius: '2px',
                  backgroundColor: activeCircuit === 'synthesis' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeCircuit === 'synthesis' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  border: `1px solid ${activeCircuit === 'synthesis' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
              >
                <BookOpen size={13} />
                <span>INTELLECTUAL SYNTHESIS</span>
              </button>

              <button
                onClick={() => setActiveCircuit('bypass')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  borderRadius: '2px',
                  backgroundColor: activeCircuit === 'bypass' ? 'rgba(255, 90, 90, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeCircuit === 'bypass' ? '#FF8A8A' : 'var(--text-muted)',
                  border: `1px solid ${activeCircuit === 'bypass' ? '#FF8A8A' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
              >
                <Zap size={13} />
                <span>SYNTHETIC SHORTCUT</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Schematic: Conceptual Inquiry Flow */}
          <div 
            style={{
              width: '100%',
              backgroundColor: '#040605',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              padding: 'clamp(16px, 3vw, 32px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Grid Accent */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none'
              }}
            />

            <svg 
              viewBox="0 0 960 260" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
              aria-label="Conceptual Reasoning Pathway Diagram"
            >
              <defs>
                <filter id="glow-green-path" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-red-path" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* PATH A: INTELLECTUAL SYNTHESIS (Upper Route) */}
              <g opacity={activeCircuit === 'synthesis' ? 1 : 0.22} style={{ transition: 'opacity 400ms ease' }}>
                <path 
                  d="M 120 70 L 340 70 L 580 70 L 820 70" 
                  fill="none" 
                  stroke="var(--accent-primary)" 
                  strokeWidth="3" 
                  strokeDasharray={activeCircuit === 'synthesis' ? '8 4' : 'none'}
                  filter="url(#glow-green-path)"
                />
                
                {/* Node 1: Problem Formulation */}
                <g transform="translate(120, 70)">
                  <circle r="28" fill="#071A10" stroke="var(--accent-primary)" strokeWidth="2" />
                  <circle r="6" fill="var(--accent-primary)" />
                  <text y="48" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
                    01: PROBLEM
                  </text>
                  <text y="62" fill="var(--accent-secondary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                    [FORMULATE HYPOTHESIS]
                  </text>
                </g>

                {/* Node 2: Critical Dialectic */}
                <g transform="translate(340, 70)">
                  <circle r="34" fill="#071A10" stroke="var(--accent-primary)" strokeWidth="2.5" />
                  <polygon points="-8,-8 8,0 -8,8" fill="var(--accent-primary)" />
                  <text y="52" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
                    02: DIALECTIC
                  </text>
                  <text y="66" fill="var(--accent-secondary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                    [PROBE & COUNTER-ARGUMENT]
                  </text>
                </g>

                {/* Node 3: Error Rectification */}
                <g transform="translate(580, 70)">
                  <circle r="30" fill="#071A10" stroke="var(--accent-primary)" strokeWidth="2" />
                  <rect x="-7" y="-7" width="14" height="14" fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
                  <text y="50" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
                    03: RECTIFICATION
                  </text>
                  <text y="64" fill="var(--accent-secondary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                    [INDEPENDENT DERIVATION]
                  </text>
                </g>

                {/* Node 4: First-Principles Mastery */}
                <g transform="translate(820, 70)">
                  <circle r="32" fill="rgba(0, 255, 136, 0.15)" stroke="var(--accent-primary)" strokeWidth="3" filter="url(#glow-green-path)" />
                  <polygon points="0,-10 9,7 -9,7" fill="var(--accent-primary)" />
                  <text y="52" fill="var(--accent-primary)" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">
                    04: MASTERY
                  </text>
                  <text y="66" fill="var(--text-main)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                    [DEFENSIBLE UNDER SCRUTINY]
                  </text>
                </g>
              </g>

              {/* PATH B: SYNTHETIC SHORTCUT (Lower Route) */}
              <g opacity={activeCircuit === 'bypass' ? 1 : 0.22} style={{ transition: 'opacity 400ms ease' }}>
                <path 
                  d="M 120 180 Q 470 240 820 180" 
                  fill="none" 
                  stroke="#FF8A8A" 
                  strokeWidth="3" 
                  strokeDasharray="6 6"
                  filter={activeCircuit === 'bypass' ? 'url(#glow-red-path)' : 'none'}
                />

                {/* Node B1: Prompt Delegation */}
                <g transform="translate(120, 180)">
                  <circle r="26" fill="#140808" stroke="#FF8A8A" strokeWidth="2" />
                  <rect x="-6" y="-6" width="12" height="12" fill="#FF8A8A" />
                  <text y="46" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
                    PROMPT DELEGATION
                  </text>
                  <text y="60" fill="#FF8A8A" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                    [UNEXAMINED QUERY]
                  </text>
                </g>

                {/* Warning: Bypasses Deliberate Struggle */}
                <g transform="translate(470, 222)">
                  <rect x="-140" y="-14" width="280" height="28" fill="#1A0808" stroke="#FF8A8A" strokeWidth="1" rx="2" />
                  <text y="4" fill="#FF8A8A" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700" letterSpacing="0.08em">
                    ⚠ SHORTCUT (CIRCUMVENTS UNDERSTANDING)
                  </text>
                </g>

                {/* Node B2: Epistemic Debt */}
                <g transform="translate(820, 180)">
                  <circle r="30" fill="#1E0707" stroke="#FF8A8A" strokeWidth="2.5" />
                  <line x1="-8" y1="-8" x2="8" y2="8" stroke="#FF8A8A" strokeWidth="2.5" />
                  <line x1="8" y1="-8" x2="-8" y2="8" stroke="#FF8A8A" strokeWidth="2.5" />
                  <text y="48" fill="#FF8A8A" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">
                    EPISTEMIC DEBT
                  </text>
                  <text y="62" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                    [INABILITY TO DEFEND DERIVATION]
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Qualitative State Dashboard (Discrete State Indicators — No Invented Numbers) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              marginTop: '24px'
            }}
          >
            {/* Qualitative State 1: Conceptual Struggle */}
            <div 
              style={{
                padding: '16px 20px',
                backgroundColor: 'rgba(7, 26, 16, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                CONCEPTUAL INQUIRY
              </div>
              <div 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.8125rem', 
                  fontWeight: 700, 
                  color: activeCircuit === 'synthesis' ? 'var(--accent-primary)' : '#FF8A8A',
                  marginBottom: '10px'
                }}
              >
                {activeCircuit === 'synthesis' ? 'ACTIVE // ITERATIVE STRUGGLE' : 'BYPASSED // DELEGATED'}
              </div>
              
              {/* Stepped Discrete State Indicator */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      height: '6px',
                      backgroundColor: activeCircuit === 'synthesis' 
                        ? 'var(--accent-primary)' 
                        : (step === 1 ? '#FF8A8A' : 'rgba(255, 90, 90, 0.15)'),
                      borderRadius: '1px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Qualitative State 2: Intellectual Ownership */}
            <div 
              style={{
                padding: '16px 20px',
                backgroundColor: 'rgba(7, 26, 16, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                INTELLECTUAL OWNERSHIP
              </div>
              <div 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.8125rem', 
                  fontWeight: 700, 
                  color: activeCircuit === 'synthesis' ? 'var(--accent-primary)' : '#FF8A8A',
                  marginBottom: '10px'
                }}
              >
                {activeCircuit === 'synthesis' ? 'FIRST-PRINCIPLES INTUITION' : 'SYNTACTIC MIMICRY'}
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      height: '6px',
                      backgroundColor: activeCircuit === 'synthesis' 
                        ? 'var(--accent-primary)' 
                        : (step === 1 ? '#FF8A8A' : 'rgba(255, 90, 90, 0.15)'),
                      borderRadius: '1px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Qualitative State 3: Defense Under Scrutiny */}
            <div 
              style={{
                padding: '16px 20px',
                backgroundColor: 'rgba(7, 26, 16, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                DEFENSE UNDER SCRUTINY
              </div>
              <div 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.8125rem', 
                  fontWeight: 700, 
                  color: activeCircuit === 'synthesis' ? 'var(--accent-primary)' : '#FF8A8A',
                  marginBottom: '10px'
                }}
              >
                {activeCircuit === 'synthesis' ? 'DEFENSIBLE UNDER SCRUTINY' : 'VULNERABLE TO INQUIRY'}
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      height: '6px',
                      backgroundColor: activeCircuit === 'synthesis' 
                        ? 'var(--accent-primary)' 
                        : (step === 1 ? '#FF8A8A' : 'rgba(255, 90, 90, 0.15)'),
                      borderRadius: '1px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Editorial Statement */}
        <div 
          style={{
            maxWidth: '820px',
            borderLeft: '2px solid var(--accent-primary)',
            paddingLeft: 'clamp(16px, 2.5vw, 24px)',
            backgroundColor: 'rgba(0, 255, 136, 0.02)'
          }}
        >
          <div 
            className="manuscript-contrast"
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
              lineHeight: 1.55,
              marginBottom: '6px'
            }}
          >
            "When answer generation is automated, rigorous cross-examination becomes the ultimate test of intellectual integrity."
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Curatorial Synthesis // Center for Cognitive Autonomy, VIT-AP
          </div>
        </div>

      </div>
    </section>
  );
};
