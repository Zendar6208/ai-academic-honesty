import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, CheckCircle2, AlertTriangle, ShieldCheck, FastForward, RotateCcw, ArrowRight } from 'lucide-react';

interface AITutorVsSubstituteActivityProps {
  onActivityComplete?: () => void;
}

export const AITutorVsSubstituteActivity: React.FC<AITutorVsSubstituteActivityProps> = ({
  onActivityComplete
}) => {
  const [activeMode, setActiveMode] = useState<'substitute' | 'tutor'>('substitute');
  const [isManuallyPaused, setIsManuallyPaused] = useState<boolean>(false);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState<boolean>(false);
  const [isInViewport, setIsInViewport] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [hasExploredBoth, setHasExploredBoth] = useState<{ substitute: boolean; tutor: boolean }>({
    substitute: true,
    tutor: false
  });
  const [notifiedCompletion, setNotifiedCompletion] = useState<boolean>(false);

  // Whiteboard Interactive Challenge State
  // Steps:
  // 0: Initial State (S relaxed -> tentative A=1, B=2)
  // 1: Dijkstra selects min (A=1) and marks A as finalised
  // 2: Process B (dist=2), edge B -> A has weight -3, reveals path S -> B -> A costs -1
  // 3: Show Contradiction (A was finalised at 1, but shorter path is -1)
  const [whiteboardStep, setWhiteboardStep] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [challengeResolved, setChallengeResolved] = useState<boolean>(false);

  const containerRef = useRef<HTMLElement | null>(null);
  const elapsedRef = useRef<number>(0);
  const inactivityTimerRef = useRef<number | null>(null);
  const cycleIntervalRef = useRef<number | null>(null);

  const CYCLE_DURATION = 7000; // 7 seconds per scenario
  const INACTIVITY_DELAY = 5000; // 5 seconds of inactivity before resuming
  const TICK_INTERVAL = 50; // 50ms smooth update tick

  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. IntersectionObserver: Pause when out of view, resume when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. Main Auto-Alternation Loop
  useEffect(() => {
    // If not in viewport, manually paused, interacting, hovered/focused, or reduced motion: STOP TIMER
    if (!isInViewport || isManuallyPaused || isUserInteracting || isHoveredOrFocused || prefersReducedMotion) {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
        cycleIntervalRef.current = null;
      }
      return;
    }

    // Single active interval
    cycleIntervalRef.current = window.setInterval(() => {
      elapsedRef.current += TICK_INTERVAL;

      if (elapsedRef.current >= CYCLE_DURATION) {
        elapsedRef.current = 0;
        setActiveMode((prev) => {
          const next = prev === 'substitute' ? 'tutor' : 'substitute';
          setHasExploredBoth((h) => ({ ...h, [next]: true }));
          return next;
        });
        setProgressPercent(0);
      } else {
        setProgressPercent((elapsedRef.current / CYCLE_DURATION) * 100);
      }
    }, TICK_INTERVAL);

    return () => {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
        cycleIntervalRef.current = null;
      }
    };
  }, [isInViewport, isManuallyPaused, isUserInteracting, isHoveredOrFocused, prefersReducedMotion]);

  // 3. User interaction handler with 5-second inactivity timer
  const registerUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = window.setTimeout(() => {
      setIsUserInteracting(false);
      elapsedRef.current = 0;
      setProgressPercent(0);
    }, INACTIVITY_DELAY);
  }, []);

  const handleManualSelect = (mode: 'substitute' | 'tutor') => {
    registerUserInteraction();
    setActiveMode(mode);
    setHasExploredBoth((prev) => ({ ...prev, [mode]: true }));
    elapsedRef.current = 0;
    setProgressPercent(0);
  };

  const toggleManualPause = () => {
    setIsManuallyPaused((prev) => !prev);
    registerUserInteraction();
  };

  // 4. Whiteboard Step Controls
  const handleWhiteboardStep = (step: number) => {
    registerUserInteraction();
    setWhiteboardStep(step);
  };

  const handleSelectAnswer = (index: number) => {
    registerUserInteraction();
    setSelectedAnswer(index);
    if (index === 0) { // Correct answer: All edge weights must be non-negative
      setChallengeResolved(true);
      setHasExploredBoth({ substitute: true, tutor: true });
      if (!notifiedCompletion) {
        setNotifiedCompletion(true);
        setTimeout(() => {
          onActivityComplete?.();
        }, 2200);
      }
    }
  };

  const handleResetChallenge = () => {
    registerUserInteraction();
    setWhiteboardStep(0);
    setSelectedAnswer(null);
  };

  // 5. Completion handling
  const isComplete = (hasExploredBoth.substitute && hasExploredBoth.tutor) || challengeResolved;

  useEffect(() => {
    if (isComplete && !notifiedCompletion && isInViewport) {
      setNotifiedCompletion(true);
      const t = setTimeout(() => {
        onActivityComplete?.();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isComplete, notifiedCompletion, isInViewport, onActivityComplete]);

  const handleSkipActivity = () => {
    setHasExploredBoth({ substitute: true, tutor: true });
    setChallengeResolved(true);
    setNotifiedCompletion(true);
    onActivityComplete?.();
  };

  const isTimerRunning = isInViewport && !isManuallyPaused && !isUserInteracting && !isHoveredOrFocused && !prefersReducedMotion;

  return (
    <section 
      id="activity-01"
      ref={containerRef}
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocus={() => setIsHoveredOrFocused(true)}
      onBlur={() => setIsHoveredOrFocused(false)}
      className="documentary-scene activity-stage-wrapper"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(72px, 8vw, 120px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#050807'
      }}
      aria-label="Activity 01: Interactive Reasoning Stage"
    >
      <div className="exhibition-container">

        {/* Distinct Activity Stage Header (Phosphor Accents) */}
        <div 
          style={{
            border: '1px solid var(--accent-primary)',
            backgroundColor: 'rgba(0, 255, 136, 0.04)',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.15)',
            padding: 'clamp(24px, 4vw, 44px)',
            position: 'relative',
            borderRadius: '2px'
          }}
        >
          {/* Stage Calibration Badge */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
              marginBottom: '28px'
            }}
          >
            <div>
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#050807',
                  backgroundColor: 'var(--accent-primary)',
                  padding: '3px 10px',
                  borderRadius: '1px',
                  letterSpacing: '0.12em',
                  marginBottom: '8px'
                }}
              >
                INTERACTIVE ACTIVITY 01 // DIRECT PARTICIPATION
              </div>
              <h2 
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em'
                }}
              >
                AI Tutor vs AI Substitute
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Alternates automatically every 7 seconds. You can select either scenario manually or test the whiteboard demonstration below.
              </p>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={toggleManualPause}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: isTimerRunning ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: isTimerRunning ? 'var(--accent-primary)' : 'var(--text-muted)',
                    border: `1px solid ${isTimerRunning ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  aria-label={isTimerRunning ? "Pause auto-alternation" : "Resume auto-alternation"}
                >
                  {isTimerRunning ? <Pause size={13} /> : <Play size={13} />}
                  <span>
                    {isTimerRunning 
                      ? "AUTO-ALTERNATING (7S)" 
                      : (isHoveredOrFocused 
                          ? "PAUSED (HOVER/FOCUS)" 
                          : (isUserInteracting ? "PAUSED (USER ACTIVE)" : "PAUSED"))}
                  </span>
                </button>

                {/* Skip option */}
                <button
                  onClick={handleSkipActivity}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Skip to next scene"
                >
                  <span>SKIP</span>
                  <FastForward size={12} />
                </button>
              </div>

              {/* Thin Phosphor-Green Progress Indicator */}
              <div 
                style={{
                  width: '180px',
                  height: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  borderRadius: '1px'
                }}
              >
                <div 
                  style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    backgroundColor: 'var(--accent-primary)',
                    boxShadow: '0 0 8px var(--accent-primary)',
                    transition: isTimerRunning ? 'width 50ms linear' : 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Large Clickable Scenario Tabs */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
              marginBottom: '28px'
            }}
            role="tablist"
          >
            <button
              role="tab"
              aria-selected={activeMode === 'substitute'}
              onClick={() => handleManualSelect('substitute')}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                backgroundColor: activeMode === 'substitute' ? 'rgba(255, 90, 90, 0.12)' : 'rgba(5, 8, 7, 0.8)',
                border: `2px solid ${activeMode === 'substitute' ? '#FF8A8A' : 'var(--border-subtle)'}`,
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#FF8A8A', fontWeight: 700, marginBottom: '2px' }}>
                  SCENARIO A
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  The AI Substitute (Passive Outsourcing)
                </div>
              </div>
              <div 
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: '2px solid #FF8A8A',
                  backgroundColor: activeMode === 'substitute' ? '#FF8A8A' : 'transparent',
                  transition: 'background-color 300ms ease'
                }} 
              />
            </button>

            <button
              role="tab"
              aria-selected={activeMode === 'tutor'}
              onClick={() => handleManualSelect('tutor')}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                backgroundColor: activeMode === 'tutor' ? 'rgba(0, 255, 136, 0.12)' : 'rgba(5, 8, 7, 0.8)',
                border: `2px solid ${activeMode === 'tutor' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '2px' }}>
                  SCENARIO B
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  The Socratic Tutor (Dialectic Sparring)
                </div>
              </div>
              <div 
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: '2px solid var(--accent-primary)',
                  backgroundColor: activeMode === 'tutor' ? 'var(--accent-primary)' : 'transparent',
                  boxShadow: activeMode === 'tutor' ? '0 0 8px var(--accent-primary)' : 'none',
                  transition: 'all 300ms ease'
                }} 
              />
            </button>
          </div>

          {/* Scenario Comparison & Whiteboard Reasoning Stage */}
          <div 
            key={activeMode}
            className="scenario-animate"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              backgroundColor: '#050807',
              border: `1px solid ${activeMode === 'substitute' ? 'rgba(255, 90, 90, 0.3)' : 'rgba(0, 255, 136, 0.3)'}`,
              padding: 'clamp(20px, 3vw, 36px)',
              borderRadius: '2px',
              boxShadow: activeMode === 'substitute' ? '0 20px 50px rgba(255, 90, 90, 0.06)' : '0 20px 50px rgba(0, 255, 136, 0.08)'
            }}
          >
            {/* Column 1: Architecture Pipeline & Qualitative Telemetry */}
            <div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}
              >
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: activeMode === 'substitute' ? '#FF8A8A' : 'var(--accent-primary)',
                    letterSpacing: '0.08em'
                  }}
                >
                  {activeMode === 'substitute' ? "ARCHITECTURE: BLACK-BOX CONDUIT" : "ARCHITECTURE: DIALECTIC MIRROR"}
                </span>
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  {activeMode === 'substitute' ? "PASSIVE OUTSOURCING" : "ACTIVE RETENTION"}
                </span>
              </div>

              {/* Graphic Flow Schematic */}
              <div 
                style={{
                  backgroundColor: '#071A10',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  padding: '16px',
                  marginBottom: '18px'
                }}
              >
                <svg viewBox="0 0 380 90" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {activeMode === 'substitute' ? (
                    <g>
                      <line x1="40" y1="45" x2="340" y2="45" stroke="#FF8A8A" strokeWidth="2" strokeDasharray="4 4" />
                      <circle cx="40" cy="45" r="18" fill="#140808" stroke="#FF8A8A" strokeWidth="1.5" />
                      <text x="40" y="49" fill="#FF8A8A" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">TASK</text>
                      <rect x="140" y="25" width="100" height="40" rx="2" fill="#180A0A" stroke="#FF8A8A" strokeWidth="2" />
                      <text x="190" y="44" fill="#FF8A8A" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">BLACK BOX AI</text>
                      <text x="190" y="56" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">[NO HUMAN EFFORT]</text>
                      <circle cx="340" cy="45" r="18" fill="#140808" stroke="#FF8A8A" strokeWidth="1.5" />
                      <text x="340" y="49" fill="var(--text-main)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">OUTPUT</text>
                    </g>
                  ) : (
                    <g>
                      <path d="M 60 45 C 120 15, 180 15, 240 45" fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
                      <path d="M 240 45 C 180 75, 120 75, 60 45" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx="60" cy="45" r="22" fill="rgba(0, 255, 136, 0.15)" stroke="var(--accent-primary)" strokeWidth="2" />
                      <text x="60" y="43" fill="var(--accent-primary)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">HUMAN</text>
                      <text x="60" y="54" fill="var(--text-main)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">INTELLECT</text>
                      <rect x="230" y="25" width="90" height="40" rx="2" fill="#071A10" stroke="var(--accent-primary)" strokeWidth="2" />
                      <text x="275" y="44" fill="var(--accent-primary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">SOCRATIC AI</text>
                      <text x="275" y="56" fill="var(--accent-secondary)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">[COUNTER-PROBE]</text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Qualitative Status Indicators */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div 
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(7, 26, 16, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      PROBLEM STRUGGLE
                    </span>
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: activeMode === 'substitute' ? '#FF8A8A' : 'var(--accent-primary)' 
                      }}
                    >
                      {activeMode === 'substitute' ? 'BYPASSED // OUTSOURCED' : 'ACTIVE // ITERATIVE'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          height: '5px',
                          backgroundColor: activeMode === 'substitute' 
                            ? (step === 1 ? '#FF8A8A' : 'rgba(255, 90, 90, 0.15)') 
                            : 'var(--accent-primary)',
                          borderRadius: '1px'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div 
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(7, 26, 16, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      INTELLECTUAL OWNERSHIP
                    </span>
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: activeMode === 'substitute' ? '#FF8A8A' : 'var(--accent-primary)' 
                      }}
                    >
                      {activeMode === 'substitute' ? 'MODEL DEPENDENCY' : 'FIRST-PRINCIPLES INTUITION'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          height: '5px',
                          backgroundColor: activeMode === 'substitute' 
                            ? (step === 1 ? '#FF8A8A' : 'rgba(255, 90, 90, 0.15)') 
                            : 'var(--accent-primary)',
                          borderRadius: '1px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Exact Dijkstra Counterexample Demonstration (S -> A = 1, S -> B = 2, B -> A = -3) */}
            <div 
              style={{
                padding: '20px',
                backgroundColor: 'rgba(7, 26, 16, 0.95)',
                border: `1px solid ${activeMode === 'substitute' ? 'rgba(255, 90, 90, 0.3)' : 'rgba(0, 255, 136, 0.3)'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '2px'
              }}
            >
              <div>
                {/* Challenge Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {activeMode === 'substitute' ? <AlertTriangle size={16} color="#FF8A8A" /> : <ShieldCheck size={16} color="#00FF88" />}
                    <span 
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: activeMode === 'substitute' ? '#FF8A8A' : 'var(--accent-primary)',
                        letterSpacing: '0.06em'
                      }}
                    >
                      DIJKSTRA REASONING DEMONSTRATION
                    </span>
                  </div>
                  
                  <button
                    onClick={handleResetChallenge}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    title="Reset simulation step"
                  >
                    <RotateCcw size={10} />
                    <span>RESET</span>
                  </button>
                </div>

                <div 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.4,
                    marginBottom: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#050807',
                    borderLeft: `2px solid ${activeMode === 'substitute' ? '#FF8A8A' : 'var(--accent-primary)'}`
                  }}
                >
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>Directed Graph: </span>
                  S → A = 1 &nbsp;•&nbsp; S → B = 2 &nbsp;•&nbsp; B → A = -3
                </div>

                {/* Interactive SVG Graph Canvas:
                    S at Left (70, 110)
                    A at Upper Right (310, 50)
                    B at Lower Right (310, 170)
                */}
                <div 
                  style={{
                    backgroundColor: '#040605',
                    border: '1px solid var(--border-subtle)',
                    padding: '12px',
                    borderRadius: '2px',
                    marginBottom: '12px',
                    position: 'relative'
                  }}
                >
                  <svg viewBox="0 0 380 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <defs>
                      <marker id="arrow-green" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-primary)" />
                      </marker>
                      <marker id="arrow-cyan" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-secondary)" />
                      </marker>
                      <marker id="arrow-red" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF8A8A" />
                      </marker>
                      <marker id="arrow-dim" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
                      </marker>
                    </defs>

                    {/* Edge S -> A (weight 1) */}
                    <line 
                      x1="70" y1="110" x2="310" y2="50" 
                      stroke={whiteboardStep >= 0 ? "var(--accent-primary)" : "rgba(255,255,255,0.2)"} 
                      strokeWidth={whiteboardStep === 1 ? "3" : "2"}
                      markerEnd={whiteboardStep >= 0 ? "url(#arrow-green)" : "url(#arrow-dim)"}
                    />
                    <rect x="175" y="65" width="45" height="18" fill="#050807" rx="2" stroke="var(--border-subtle)" />
                    <text x="197" y="78" fill="var(--accent-primary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">wt: 1</text>

                    {/* Edge S -> B (weight 2) */}
                    <line 
                      x1="70" y1="110" x2="310" y2="170" 
                      stroke={whiteboardStep >= 0 ? "var(--accent-secondary)" : "rgba(255,255,255,0.2)"} 
                      strokeWidth={whiteboardStep === 2 ? "3" : "2"}
                      markerEnd={whiteboardStep >= 0 ? "url(#arrow-cyan)" : "url(#arrow-dim)"}
                    />
                    <rect x="175" y="135" width="45" height="18" fill="#050807" rx="2" stroke="var(--border-subtle)" />
                    <text x="197" y="148" fill="var(--accent-secondary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">wt: 2</text>

                    {/* Edge B -> A (weight -3) Upwards from B to A */}
                    <line 
                      x1="310" y1="170" x2="310" y2="50" 
                      stroke={whiteboardStep >= 2 ? "#FF8A8A" : "rgba(255,255,255,0.2)"} 
                      strokeWidth={whiteboardStep >= 2 ? "3" : "1.5"} 
                      strokeDasharray={whiteboardStep >= 2 ? "none" : "4 4"}
                      markerEnd={whiteboardStep >= 2 ? "url(#arrow-red)" : "url(#arrow-dim)"}
                    />
                    <rect x="325" y="100" width="50" height="20" fill="#180A0A" rx="2" stroke={whiteboardStep >= 2 ? "#FF8A8A" : "var(--border-subtle)"} />
                    <text x="350" y="114" fill="#FF8A8A" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">wt: -3</text>

                    {/* Node S (Source Left) */}
                    <circle cx="70" cy="110" r="18" fill="#071A10" stroke="var(--accent-primary)" strokeWidth="2.5" />
                    <text x="70" y="115" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">S</text>
                    <text x="70" y="142" fill="var(--accent-primary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">dist: 0</text>

                    {/* Node A (Upper Right) */}
                    <circle 
                      cx="310" cy="50" r="18" 
                      fill={whiteboardStep >= 3 ? "rgba(255, 90, 90, 0.25)" : (whiteboardStep >= 1 ? "rgba(0, 255, 136, 0.2)" : "#071A10")} 
                      stroke={whiteboardStep >= 3 ? "#FF8A8A" : (whiteboardStep >= 1 ? "var(--accent-primary)" : "var(--border-subtle)")} 
                      strokeWidth={whiteboardStep >= 1 ? "2.5" : "1.5"} 
                    />
                    <text x="310" y="55" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">A</text>
                    
                    {/* Node A status banner */}
                    <g transform="translate(310, 22)">
                      {whiteboardStep === 0 && (
                        <text x="0" y="0" fill="var(--accent-primary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                          tentative: 1
                        </text>
                      )}
                      {whiteboardStep === 1 && (
                        <text x="0" y="0" fill="var(--accent-primary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
                          FINALISED: 1 (MIN EXTRACTED)
                        </text>
                      )}
                      {whiteboardStep === 2 && (
                        <text x="0" y="0" fill="#FF8A8A" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
                          LOCKED: 1 vs NEW PATH: -1!
                        </text>
                      )}
                      {whiteboardStep >= 3 && (
                        <text x="0" y="0" fill="#FF8A8A" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">
                          ⚡ CONTRADICTION: 1 ≠ -1
                        </text>
                      )}
                    </g>

                    {/* Node B (Lower Right) */}
                    <circle 
                      cx="310" cy="170" r="18" 
                      fill={whiteboardStep >= 2 ? "rgba(138, 255, 178, 0.2)" : "#071A10"} 
                      stroke={whiteboardStep >= 2 ? "var(--accent-secondary)" : "var(--border-subtle)"} 
                      strokeWidth="2" 
                    />
                    <text x="310" y="175" fill="var(--text-main)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">B</text>
                    
                    {/* Node B status banner */}
                    <g transform="translate(310, 198)">
                      <text x="0" y="0" fill="var(--accent-secondary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                        {whiteboardStep >= 2 ? "dist: 2 [PROCESSING EDGES]" : "tentative: 2"}
                      </text>
                    </g>
                  </svg>

                  {/* Step Explanation Callout */}
                  <div 
                    style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(5, 8, 7, 0.95)',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-main)',
                      lineHeight: 1.45
                    }}
                  >
                    {whiteboardStep === 0 && (
                      <div>
                        <strong style={{ color: 'var(--accent-primary)' }}>1. Start at S: </strong>
                        Tentative distances are computed: <span style={{ color: 'var(--accent-primary)' }}>A = 1</span>, <span style={{ color: 'var(--accent-secondary)' }}>B = 2</span>. Priority queue prepares to extract the minimum.
                      </div>
                    )}
                    {whiteboardStep === 1 && (
                      <div>
                        <strong style={{ color: 'var(--accent-primary)' }}>2. Dijkstra selects A first: </strong>
                        Because tentative distance 1 &lt; 2, Dijkstra greedily marks <span style={{ color: 'var(--accent-primary)' }}>A as finalised (dist = 1)</span>. Standard Dijkstra assumes this distance is now permanent.
                      </div>
                    )}
                    {whiteboardStep === 2 && (
                      <div>
                        <strong style={{ color: '#FF8A8A' }}>3. Process B and its negative edge B → A (-3): </strong>
                        Path <span style={{ color: 'var(--text-main)' }}>S → B → A</span> costs: 2 + (-3) = <span style={{ color: '#FF8A8A', fontWeight: 800 }}>-1</span>!
                      </div>
                    )}
                    {whiteboardStep >= 3 && (
                      <div>
                        <strong style={{ color: '#FF8A8A' }}>4. The Contradiction: </strong>
                        Node A was previously finalised with distance <span style={{ color: 'var(--accent-primary)' }}>1</span>, yet a shorter path costs <span style={{ color: '#FF8A8A', fontWeight: 800 }}>-1</span>. Dijkstra missed the shortest path!
                      </div>
                    )}
                  </div>
                </div>

                {/* Visitor Step Buttons */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                  {[
                    { idx: 0, label: "INIT (S)" },
                    { idx: 1, label: "FINALIZE A" },
                    { idx: 2, label: "PROCESS B (-3)" },
                    { idx: 3, label: "CONTRADICTION" }
                  ].map((s) => (
                    <button
                      key={s.idx}
                      onClick={() => handleWhiteboardStep(s.idx)}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        backgroundColor: whiteboardStep === s.idx ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${whiteboardStep === s.idx ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        borderRadius: '2px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        color: whiteboardStep === s.idx ? 'var(--accent-primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                  <button
                    onClick={() => handleWhiteboardStep(Math.min(whiteboardStep + 1, 3))}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: 'rgba(0, 255, 136, 0.12)',
                      border: '1px solid var(--accent-primary)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>NEXT</span>
                    <ArrowRight size={10} />
                  </button>
                </div>

                {/* Visitor Question: Which assumption did Dijkstra rely on? */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700, marginBottom: '8px' }}>
                    ASK THE VISITOR: Which assumption did Dijkstra rely on?
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { 
                        id: 0, 
                        text: "All edge weights must be non-negative for standard Dijkstra's algorithm to guarantee correctness.",
                        isCorrect: true 
                      },
                      { 
                        id: 1, 
                        text: "Graph vertices must be processed in topological sort order.",
                        isCorrect: false 
                      },
                      { 
                        id: 2, 
                        text: "The graph must be a tree without branching or alternative paths.",
                        isCorrect: false 
                      }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectAnswer(opt.id)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          backgroundColor: selectedAnswer === opt.id 
                            ? (opt.isCorrect ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 90, 90, 0.15)') 
                            : 'rgba(5, 8, 7, 0.8)',
                          border: `1px solid ${selectedAnswer === opt.id ? (opt.isCorrect ? 'var(--accent-primary)' : '#FF8A8A') : 'var(--border-subtle)'}`,
                          borderRadius: '2px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          color: selectedAnswer === opt.id ? (opt.isCorrect ? 'var(--accent-primary)' : '#FF8A8A') : 'var(--text-main)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          lineHeight: 1.4
                        }}
                      >
                        <span>{opt.text}</span>
                        {selectedAnswer === opt.id && (
                          <span style={{ fontWeight: 800, marginLeft: '8px', flexShrink: 0 }}>
                            {opt.isCorrect ? "✓ CORRECT" : "✕ FALSE"}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outcome resolution banner */}
                {selectedAnswer !== null && (
                  <div 
                    style={{
                      padding: '10px 14px',
                      backgroundColor: selectedAnswer === 0 ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 90, 90, 0.1)',
                      border: `1px solid ${selectedAnswer === 0 ? 'var(--accent-primary)' : 'rgba(255, 90, 90, 0.4)'}`,
                      borderRadius: '2px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: selectedAnswer === 0 ? 'var(--text-main)' : '#FF8A8A',
                      lineHeight: 1.45
                    }}
                  >
                    {selectedAnswer === 0 ? (
                      <div>
                        <strong style={{ color: 'var(--accent-primary)' }}>CORRECT // INVARIANT VERIFIED: </strong>
                        Standard Dijkstra assumes that adding edges can only increase total path distance (w ≥ 0). When B → A has weight -3, this monotonicity assumption is broken, making the greedy commitment to A = 1 invalid.
                      </div>
                    ) : (
                      <div>
                        <strong style={{ color: '#FF8A8A' }}>INCORRECT: </strong>
                        Dijkstra does not require trees or topological sort. The sole requirement is non-negative edge weights (w ≥ 0) so that finalized distances are guaranteed to be minimal.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.75rem'
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Explanatory Defense State:</span>
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: challengeResolved ? 'var(--accent-primary)' : (activeMode === 'substitute' ? '#FF8A8A' : 'var(--accent-secondary)')
                  }}
                >
                  {challengeResolved 
                    ? "DEFENDED // INVARIANT PROVEN" 
                    : (activeMode === 'substitute' ? "HIGH RISK // CANNOT EXPLAIN IN VIVA" : "AWAITING VISITOR PROOF")}
                </span>
              </div>
            </div>
          </div>

          {/* Completion State Banner */}
          <div 
            style={{
              marginTop: '24px',
              padding: '14px 20px',
              backgroundColor: isComplete ? 'rgba(0, 255, 136, 0.1)' : 'rgba(5, 8, 7, 0.6)',
              border: `1px solid ${isComplete ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              borderRadius: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color={isComplete ? "#00FF88" : "var(--text-dim)"} />
              <span style={{ fontSize: '0.8125rem', color: isComplete ? 'var(--text-main)' : 'var(--text-muted)' }}>
                {isComplete 
                  ? "Activity 01 Complete: Reasoning challenge resolved. Cinematic documentary will glide toward finale..."
                  : "Interactive Stage: Step through the Dijkstra counterexample or select the correct assumption above."}
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-secondary)' }}>
              STAGE STATUS: {isComplete ? "COMPLETED" : "EXPLORING"}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
