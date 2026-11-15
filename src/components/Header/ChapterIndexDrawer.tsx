import React, { useEffect } from 'react';
import { ARCHIVE_CHAPTERS, ARCHIVE_METADATA } from '../../types/exhibition';
import { X, ArrowRight, Lock } from 'lucide-react';

interface ChapterIndexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (index: number) => void;
  activeChapterIndex: number;
}

export const ChapterIndexDrawer: React.FC<ChapterIndexDrawerProps> = ({
  isOpen,
  onClose,
  onSelectChapter,
  activeChapterIndex
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="archive-drawer-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 7, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity 200ms ease-out'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Archive Chapter Dossier"
    >
      <div 
        className="archive-drawer-sheet"
        style={{
          width: '100%',
          maxWidth: '620px',
          height: '100%',
          backgroundColor: '#071A10',
          borderLeft: '1px solid var(--border-strong)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div 
          style={{
            padding: '32px 32px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'rgba(5, 8, 7, 0.6)'
          }}
        >
          <div>
            <div className="terminal-badge" style={{ marginBottom: '10px' }}>
              DOSSIER // {ARCHIVE_METADATA.systemCodename}
            </div>
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                marginBottom: '4px'
              }}
            >
              Intelligence Chapters Itinerary
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {ARCHIVE_METADATA.institution} // {ARCHIVE_METADATA.location}
            </p>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close dossier"
            style={{
              padding: '8px',
              borderRadius: '2px',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(0, 255, 136, 0.05)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Institutional Directive */}
        <div 
          style={{
            padding: '20px 32px',
            backgroundColor: 'rgba(0, 255, 136, 0.04)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--accent-primary)',
              letterSpacing: '0.1em',
              marginBottom: '6px'
            }}
          >
            ARCHIVE DIRECTIVE
          </div>
          <p 
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              color: 'var(--text-main)'
            }}
          >
            "{ARCHIVE_METADATA.directive}"
          </p>
        </div>

        {/* 10 Chapters List */}
        <div style={{ padding: '24px 32px', flex: 1 }}>
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.12em',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}
          >
            COMPLETE EXHIBITION STRUCTURE (10 SECTIONS)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ARCHIVE_CHAPTERS.map((chapter, index) => {
              const isActive = index === activeChapterIndex;

              return (
                <div 
                  key={chapter.id}
                  style={{
                    padding: '18px 20px',
                    border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: isActive ? 'rgba(0, 255, 136, 0.08)' : 'rgba(5, 8, 7, 0.5)',
                    borderRadius: '2px',
                    transition: 'all 200ms ease-out',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span 
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: isActive ? 'var(--accent-primary)' : 'var(--text-dim)',
                          letterSpacing: '0.08em'
                        }}
                      >
                        SECTION {chapter.code}
                      </span>
                      <span 
                        style={{
                          fontSize: '0.625rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 6px',
                          backgroundColor: 'rgba(0, 255, 136, 0.1)',
                          color: 'var(--accent-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '1px'
                        }}
                      >
                        {chapter.category}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {chapter.estimatedRead}
                    </span>
                  </div>

                  <h3 
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginBottom: '4px'
                    }}
                  >
                    {chapter.title}
                  </h3>

                  <p 
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.45,
                      marginBottom: '12px'
                    }}
                  >
                    {chapter.subtitle}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isActive ? (
                      <button
                        onClick={() => {
                          onSelectChapter(index);
                          onClose();
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: 'var(--accent-primary)'
                        }}
                      >
                        <span>CURRENT MODULE</span>
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <div 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-dim)'
                        }}
                      >
                        <Lock size={12} />
                        <span>UNLOCKED IN CHAPTER SEQUENCE</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div 
          style={{
            padding: '20px 32px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(5, 8, 7, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)'
          }}
        >
          <span>VIT-AP UNIVERSITY // CENTRAL EXHIBITION</span>
          <span>ETHICS & COGNITION ARCHIVE</span>
        </div>
      </div>
    </div>
  );
};
