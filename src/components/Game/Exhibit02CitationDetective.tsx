import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Users, 
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldAlert,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import '../../styles/citation_detective.css';

interface Exhibit02CitationDetectiveProps {
  onScoreUpdate: (points: number) => void;
  onActivityComplete: (finalScore: number, isVerdictCorrect: boolean) => void;
  onContinue: () => void;
  isCompleted?: boolean;
  savedScore?: number;
}

type DetectiveStage = 
  | 'case' 
  | 'desk' 
  | 'inspect_doi' 
  | 'search_journal' 
  | 'search_author' 
  | 'case_board' 
  | 'verdict';

type MetadataField = 'title' | 'authors' | 'journal' | 'year';

interface DiscrepanciesFound {
  title: boolean;
  authors: boolean;
  journal: boolean;
  year: boolean;
}

export const Exhibit02CitationDetective: React.FC<Exhibit02CitationDetectiveProps> = ({
  onScoreUpdate,
  onActivityComplete,
  onContinue,
  isCompleted = false,
  savedScore = 0,
}) => {
  // Navigation stage: case -> desk -> inspect_doi | search_journal | search_author -> case_board -> verdict
  const [stage, setStage] = useState<DetectiveStage>(isCompleted ? 'verdict' : 'case');

  // Points tracking
  const [doiPointsAwarded, setDoiPointsAwarded] = useState<number>(isCompleted ? 30 : 0);
  const [journalPointsAwarded, setJournalPointsAwarded] = useState<number>(isCompleted ? 30 : 0);
  const [authorPointsAwarded, setAuthorPointsAwarded] = useState<number>(isCompleted ? 30 : 0);
  const [verdictPoints, setVerdictPoints] = useState<number>(isCompleted ? (savedScore >= 60 ? 60 : 0) : 0);

  // Clues pinned status
  const [clue1Pinned, setClue1Pinned] = useState<boolean>(isCompleted);
  const [clue2Pinned, setClue2Pinned] = useState<boolean>(isCompleted);
  const [clue3Pinned, setClue3Pinned] = useState<boolean>(isCompleted);

  // =========================================================================
  // MECHANIC 1: PAPERS, PLEASE DOCUMENT INSPECTION STATE
  // =========================================================================
  const [selectedClaimedField, setSelectedClaimedField] = useState<MetadataField | null>(null);
  const [selectedRegistryField, setSelectedRegistryField] = useState<MetadataField | null>(null);
  const [inspectionFeedback, setInspectionFeedback] = useState<string | null>(null);
  const [doiDiscrepancies, setDoiDiscrepancies] = useState<DiscrepanciesFound>({
    title: isCompleted,
    authors: isCompleted,
    journal: isCompleted,
    year: isCompleted,
  });

  // =========================================================================
  // MECHANIC 2: HER STORY JOURNAL ARCHIVE SEARCH STATE
  // =========================================================================
  const [journalSearchQuery, setJournalSearchQuery] = useState<string>('');
  const [selectedJournalFilter, setSelectedJournalFilter] = useState<string>('all');
  const [journalDeductionAnswer, setJournalDeductionAnswer] = useState<'A' | 'B' | null>(isCompleted ? 'B' : null);

  // =========================================================================
  // MECHANIC 3: RESEARCHER DOSSIERS & BIBLIOGRAPHY STATE
  // =========================================================================
  const [activeAuthorTab, setActiveAuthorTab] = useState<'vance' | 'rostova'>('vance');
  const [coAuthorCheckExecuted, setCoAuthorCheckExecuted] = useState<boolean>(isCompleted);
  const [authorDeductionAnswer, setAuthorDeductionAnswer] = useState<'A' | 'B' | null>(isCompleted ? 'B' : null);

  // =========================================================================
  // STAGE 5: FINAL VERDICT STATE
  // =========================================================================
  const [selectedVerdict, setSelectedVerdict] = useState<'A' | 'B' | 'C' | null>(isCompleted ? 'B' : null);
  const [verdictSubmitted, setVerdictSubmitted] = useState<boolean>(isCompleted);

  // Total points calculation
  const totalScore = doiPointsAwarded + journalPointsAwarded + authorPointsAwarded + verdictPoints;
  const pinnedCluesCount = (clue1Pinned ? 1 : 0) + (clue2Pinned ? 1 : 0) + (clue3Pinned ? 1 : 0);

  // =========================================================================
  // HANDLERS FOR MECHANIC 1: DOCUMENT INSPECTION
  // =========================================================================
  const handleSelectClaimedField = (field: MetadataField) => {
    setSelectedClaimedField(field);
    setInspectionFeedback(`Selected claimed ${field.toUpperCase()}. Now click a field on the Registry Record to compare.`);
  };

  const handleSelectRegistryField = (field: MetadataField) => {
    if (!selectedClaimedField) {
      setInspectionFeedback('Please click a field on the Claimed Citation first, then click here.');
      return;
    }

    setSelectedRegistryField(field);

    if (selectedClaimedField === field) {
      // Discrepancy detected between corresponding fields!
      setDoiDiscrepancies(prev => ({ ...prev, [field]: true }));
      setInspectionFeedback(`DISCREPANCY DETECTED! Claimed ${field.toUpperCase()} does not match the official registry record for DOI-042.`);
    } else {
      // Comparing non-matching fields
      setInspectionFeedback(`NOT COMPARABLE: You selected ${selectedClaimedField.toUpperCase()} vs ${field.toUpperCase()}. Select corresponding fields to compare.`);
    }

    // Reset selection after a brief delay
    setTimeout(() => {
      setSelectedClaimedField(null);
      setSelectedRegistryField(null);
    }, 1200);
  };

  const handlePinDoiClue = () => {
    if (clue1Pinned) return;
    setClue1Pinned(true);
    if (doiPointsAwarded === 0) {
      setDoiPointsAwarded(30);
      onScoreUpdate(30);
    }
  };

  // =========================================================================
  // HANDLERS FOR MECHANIC 2: JOURNAL ARCHIVE SEARCH
  // =========================================================================
  const journalArticles = [
    {
      id: 1,
      title: 'Adaptive Graph Pruning for Knowledge Retrieval',
      authors: 'L. Mercier & D. Zhou',
      pages: '45–62',
      category: 'adaptive',
      note: 'Notice: Similar title structure to the claimed paper, but covers Knowledge Retrieval, has different authors, and different page numbers.',
      isNearMatch: true,
    },
    {
      id: 2,
      title: 'Graph Embeddings for Biomedical Search',
      authors: 'S. Takahashi & R. Mehta',
      pages: '14–31',
      category: 'graph',
      note: 'Biomedical graph entity mapping.',
      isNearMatch: false,
    },
    {
      id: 3,
      title: 'On the Stability of Sparse Attention in Deep Transformers',
      authors: 'J. Alvarez & M. Lindqvist',
      pages: '63–81',
      category: 'pruning',
      note: 'Theoretical convergence bounds.',
      isNearMatch: false,
    },
    {
      id: 4,
      title: 'A Benchmark for Relational Compression in Graph Transformers',
      authors: 'O. Kim & P. Davies',
      pages: '82–101',
      category: 'graph',
      note: 'Empirical graph compression benchmarks.',
      isNearMatch: false,
    },
    {
      id: 5,
      title: 'Neural Methods for Sparse Representation Learning',
      authors: 'T. Bennett & C. Wong',
      pages: '102–111',
      category: 'pruning',
      note: 'Sparse coding paradigms.',
      isNearMatch: false,
    },
    {
      id: 6,
      title: 'Fast Latent Sampling in Multimodal Diffusion Models',
      authors: 'K. Berg & A. Morales',
      pages: '130–148',
      category: 'latent',
      note: 'Latent trajectory sampling.',
      isNearMatch: false,
    },
  ];

  const filteredJournalArticles = journalArticles.filter(art => {
    const q = journalSearchQuery.toLowerCase().trim();
    const matchesFilter = selectedJournalFilter === 'all' || art.category === selectedJournalFilter || art.title.toLowerCase().includes(selectedJournalFilter);
    if (!matchesFilter) return false;
    if (!q) return true;
    return (
      art.title.toLowerCase().includes(q) ||
      art.authors.toLowerCase().includes(q) ||
      art.pages.includes(q)
    );
  });

  const handleSelectJournalDeduction = (option: 'A' | 'B') => {
    if (journalDeductionAnswer !== null) return;
    setJournalDeductionAnswer(option);

    if (option === 'B') {
      setClue2Pinned(true);
      if (journalPointsAwarded === 0) {
        setJournalPointsAwarded(30);
        onScoreUpdate(30);
      }
    }
  };

  // =========================================================================
  // HANDLERS FOR MECHANIC 3: RESEARCHER DOSSIERS
  // =========================================================================
  const handleSelectAuthorDeduction = (option: 'A' | 'B') => {
    if (authorDeductionAnswer !== null) return;
    setAuthorDeductionAnswer(option);

    if (option === 'B') {
      setClue3Pinned(true);
      if (authorPointsAwarded === 0) {
        setAuthorPointsAwarded(30);
        onScoreUpdate(30);
      }
    }
  };

  // =========================================================================
  // HANDLER FOR STAGE 5: FINAL VERDICT
  // =========================================================================
  const handleSubmitVerdict = (verdict: 'A' | 'B' | 'C') => {
    if (verdictSubmitted) return;

    setSelectedVerdict(verdict);
    setVerdictSubmitted(true);

    const isCorrect = verdict === 'B';
    const points = isCorrect ? 60 : 0;
    setVerdictPoints(points);

    if (points > 0) {
      onScoreUpdate(points);
    }

    const finalTotal = doiPointsAwarded + journalPointsAwarded + authorPointsAwarded + points;
    onActivityComplete(finalTotal, isCorrect);
  };

  return (
    <div className="detective-container">
      {/* ------------------------------------------------------------------- */}
      {/* HEADER STRIP                                                        */}
      {/* ------------------------------------------------------------------- */}
      <div className="detective-header-strip">
        <div className="detective-header-left">
          <div className="detective-pulse-dot" />
          <div>
            <span className="detective-header-title">
              CASE 042 // THE MISSING PAPER
            </span>
            <span className="detective-header-subtitle">
              {stage === 'case' && 'STAGE 1 // RECEIVE CASE & EXAMINE SPECIMEN'}
              {stage === 'desk' && `STAGE 2 // INVESTIGATION DESK (${pinnedCluesCount}/3 CLUES PINNED)`}
              {stage === 'inspect_doi' && 'STATION 01 // DOI REGISTRY LOOKUP & INSPECTION'}
              {stage === 'search_journal' && 'STATION 02 // JOURNAL ARCHIVE SEARCH'}
              {stage === 'search_author' && 'STATION 03 // RESEARCHER DIRECTORY & BIBLIOGRAPHY'}
              {stage === 'case_board' && `STAGE 4 // THE CASE BOARD (${pinnedCluesCount}/3 CLUES PINNED)`}
              {stage === 'verdict' && 'STAGE 5 // DELIVER FINAL FORENSIC VERDICT'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="detective-score-badge">
            SCORE: {totalScore} / 150 PTS
          </div>

          {stage !== 'case' && stage !== 'desk' && !verdictSubmitted && (
            <button
              type="button"
              onClick={() => setStage('desk')}
              className="detective-nav-btn"
            >
              <FolderOpen size={14} />
              <span>Desk</span>
            </button>
          )}

          {stage !== 'case' && (
            <button
              type="button"
              onClick={() => setStage('case_board')}
              className="detective-nav-btn"
              style={{
                borderColor: pinnedCluesCount === 3 ? 'rgba(0, 255, 136, 0.45)' : undefined,
                color: pinnedCluesCount === 3 ? '#00FF88' : undefined,
              }}
            >
              <ShieldAlert size={14} />
              <span>Case Board ({pinnedCluesCount}/3)</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MINI REFERENCE BAR (Shown on Investigation Screens)                */}
      {/* ------------------------------------------------------------------- */}
      {stage !== 'case' && stage !== 'verdict' && (
        <div className="mini-reference-bar">
          <div className="mini-reference-text">
            <span style={{ color: '#87968D', marginRight: '6px' }}>INVESTIGATING:</span>
            <span className="mini-reference-title">"Adaptive Graph Pruning for Latent Knowledge Graphs"</span>
            <span style={{ color: '#87968D', margin: '0 6px' }}>—</span>
            <span>Vance &amp; Rostova (2024, Vol 14 Issue 3)</span>
          </div>
          <span className="mini-reference-tag">DOI-042</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 1: RECEIVE THE CASE & EXAMINE SPECIMEN                        */}
      {/* =================================================================== */}
      {stage === 'case' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', marginBottom: '14px' }}>
              <ShieldAlert size={14} color="#FCD34D" />
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#FCD34D', fontWeight: 700 }}>
                FORENSIC INVESTIGATION FILE // CASE 042
              </span>
            </div>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#FFFFFF',
                margin: '0 0 14px 0',
              }}
            >
              THE MISSING PAPER
            </h3>
            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.15rem, 1.8vw, 1.35rem)',
                lineHeight: 1.55,
                color: '#E4F0E8',
                fontWeight: 500,
                maxWidth: '840px',
                margin: 0,
              }}
            >
              An AI assistant generated this academic citation for a student's research assignment. 
              The reference looks scholarly and well-formatted, but is it authentic? As the research investigator, 
              your assignment is to examine the document, query institutional records, uncover discrepancies, 
              and deliver a final forensic verdict.
            </p>
          </div>

          {/* Scholarly Document Specimen */}
          <div className="specimen-card">
            <div className="specimen-watermark">
              <span>RESEARCH SPECIMEN</span>
            </div>

            <div className="specimen-doc-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="specimen-journal-seal">
                  IJ
                </div>
                <div>
                  <h4 className="specimen-journal-name">
                    International Journal of Neural Synthetics
                  </h4>
                  <div className="specimen-journal-meta">
                    Volume 14, Issue 3 • Year: 2024 • Pages: 112–129
                  </div>
                </div>
              </div>

              <div className="specimen-fictional-pill">
                Simulated teaching example. Not a real publication.
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <span className="specimen-section-label">
                CLAIMED ARTICLE TITLE
              </span>
              <h5 className="specimen-article-title">
                Adaptive Graph Pruning for Latent Knowledge Graphs
              </h5>

              <span className="specimen-section-label">
                CLAIMED AUTHORS
              </span>
              <p className="specimen-authors">
                Dr. E. R. Vance &amp; Dr. K. Rostova
              </p>

              <div className="specimen-meta-grid">
                <div className="specimen-meta-card">
                  <span className="specimen-meta-card-label">Publication Year</span>
                  <span className="specimen-meta-card-value">2024</span>
                </div>
                <div className="specimen-meta-card">
                  <span className="specimen-meta-card-label">Issue Coordinates</span>
                  <span className="specimen-meta-card-value">Vol 14, Issue 3</span>
                </div>
                <div className="specimen-meta-card">
                  <span className="specimen-meta-card-label">Page Range</span>
                  <span className="specimen-meta-card-value">pp. 112–129</span>
                </div>
                <div className="specimen-meta-card" style={{ borderColor: 'rgba(245, 158, 11, 0.45)' }}>
                  <span className="specimen-meta-card-label" style={{ color: '#FCD34D' }}>Claimed Identifier</span>
                  <span className="specimen-meta-card-value highlight-amber">DOI-042</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button
              type="button"
              onClick={() => setStage('desk')}
              className="btn-primary"
            >
              <span>OPEN INVESTIGATION WORKSPACE</span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 2: THE INVESTIGATION DESK (3 STATIONS)                        */}
      {/* =================================================================== */}
      {stage === 'desk' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ marginBottom: '26px' }}>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: '#FFFFFF',
                margin: '0 0 10px 0',
              }}
            >
              THE INVESTIGATION DESK
            </h3>
            <p 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.15rem, 1.6vw, 1.35rem)',
                lineHeight: 1.55,
                color: '#E4F0E8',
                fontWeight: 500,
                margin: 0,
              }}
            >
              Choose an investigation station to cross-reference the paper's claims. Uncover discrepancies in all three records to build your case.
            </p>
          </div>

          <div className="desk-grid">
            {/* STATION 01: DOI REGISTRY LOOKUP */}
            <div 
              onClick={() => setStage('inspect_doi')}
              className={`dossier-card ${clue1Pinned ? 'completed' : ''}`}
            >
              <div>
                <div className="dossier-header">
                  <div className="dossier-icon">
                    <Search size={24} />
                  </div>
                  {clue1Pinned ? (
                    <span className="dossier-badge completed">
                      ✓ CLUE PINNED (+30 PTS)
                    </span>
                  ) : (
                    <span className="dossier-badge unchecked">
                      NOT INSPECTED
                    </span>
                  )}
                </div>

                <span className="dossier-tag">STATION 01</span>
                <h4 className="dossier-title">DOI REGISTRY LOOKUP</h4>
                <p className="dossier-desc">
                  Query the digital registry for DOI-042. Activate Document Inspection mode to select and compare fields.
                </p>
              </div>

              <div className="dossier-footer">
                <span className="dossier-reward">
                  {clue1Pinned ? 'Reward: 30 / 30 PTS' : 'Reward: +30 PTS'}
                </span>
                <span className="dossier-cta">
                  {clue1Pinned ? 'Re-inspect' : 'Enter Station'} <ArrowRight size={16} />
                </span>
              </div>
            </div>

            {/* STATION 02: JOURNAL ARCHIVE SEARCH */}
            <div 
              onClick={() => setStage('search_journal')}
              className={`dossier-card ${clue2Pinned ? 'completed' : ''}`}
            >
              <div>
                <div className="dossier-header">
                  <div className="dossier-icon">
                    <BookOpen size={24} />
                  </div>
                  {clue2Pinned ? (
                    <span className="dossier-badge completed">
                      ✓ CLUE PINNED (+30 PTS)
                    </span>
                  ) : (
                    <span className="dossier-badge unchecked">
                      NOT SEARCHED
                    </span>
                  )}
                </div>

                <span className="dossier-tag">STATION 02</span>
                <h4 className="dossier-title">JOURNAL ARCHIVE SEARCH</h4>
                <p className="dossier-desc">
                  Search Volume 14 Issue 3 table of contents using keywords to verify if the paper was published in this issue.
                </p>
              </div>

              <div className="dossier-footer">
                <span className="dossier-reward">
                  {clue2Pinned ? 'Reward: 30 / 30 PTS' : 'Reward: +30 PTS'}
                </span>
                <span className="dossier-cta">
                  {clue2Pinned ? 'Re-examine' : 'Enter Station'} <ArrowRight size={16} />
                </span>
              </div>
            </div>

            {/* STATION 03: RESEARCHER DOSSIERS */}
            <div 
              onClick={() => setStage('search_author')}
              className={`dossier-card ${clue3Pinned ? 'completed' : ''}`}
            >
              <div>
                <div className="dossier-header">
                  <div className="dossier-icon">
                    <Users size={24} />
                  </div>
                  {clue3Pinned ? (
                    <span className="dossier-badge completed">
                      ✓ CLUE PINNED (+30 PTS)
                    </span>
                  ) : (
                    <span className="dossier-badge unchecked">
                      NOT AUDITED
                    </span>
                  )}
                </div>

                <span className="dossier-tag">STATION 03</span>
                <h4 className="dossier-title">RESEARCHER DIRECTORY</h4>
                <p className="dossier-desc">
                  Audit Dr. Vance and Dr. Rostova's publication records and run a simulated co-authorship cross-check.
                </p>
              </div>

              <div className="dossier-footer">
                <span className="dossier-reward">
                  {clue3Pinned ? 'Reward: 30 / 30 PTS' : 'Reward: +30 PTS'}
                </span>
                <span className="dossier-cta">
                  {clue3Pinned ? 'Re-examine' : 'Enter Station'} <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '20px 24px', backgroundColor: 'rgba(6, 15, 10, 0.8)', border: '1px solid rgba(0, 255, 136, 0.25)', borderRadius: '16px' }}>
            <div>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00FF88', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                INVESTIGATION PROGRESS: {pinnedCluesCount} OF 3 CRITICAL DISCREPANCIES PINNED
              </span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#C3D0C8', margin: 0 }}>
                {pinnedCluesCount === 3 
                  ? 'All 3 critical inconsistencies discovered. You are ready to view the Case Board and deliver your final verdict.'
                  : 'Complete all three stations to uncover the evidence and unlock the final verdict.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStage('case_board')}
              className="btn-primary"
            >
              <span>VIEW CASE BOARD</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STATION 01: PAPERS, PLEASE DOCUMENT INSPECTION MODE                 */}
      {/* =================================================================== */}
      {stage === 'inspect_doi' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <button 
                type="button" 
                onClick={() => setStage('desk')}
                className="detective-nav-btn"
              >
                <ArrowLeft size={14} /> Back to Desk
              </button>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 700 }}>
                STATION 01 // PAPERS, PLEASE DOCUMENT INSPECTION
              </span>
            </div>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: '0 0 8px 0',
              }}
            >
              DOI REGISTRY INSPECTION
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#C3D0C8', margin: 0, maxWidth: '800px' }}>
              Select a field on the Claimed Citation, then select the corresponding field on the Official Registry Record to compare them. Discrepancies will be highlighted automatically.
            </p>
          </div>

          {/* Interactive Inspection Feedback Banner */}
          <div className="inspection-console">
            <div className="inspection-instructions">
              <Sparkles size={18} color="#00FF88" />
              <span>
                {inspectionFeedback || 'Click a field on the Claimed Citation (left), then click its counterpart on the Registry Record (right).'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#87968D' }}>
                Discrepancies Found: {[doiDiscrepancies.title, doiDiscrepancies.authors, doiDiscrepancies.journal, doiDiscrepancies.year].filter(Boolean).length} / 4
              </span>
            </div>
          </div>

          {/* Two Documents Side-by-Side Arena */}
          <div className="inspection-arena">
            {/* DOCUMENT 1: CLAIMED CITATION */}
            <div className="doc-panel">
              <div className="doc-panel-header">
                <span className="doc-panel-title">CLAIMED CITATION (STUDENT SUBMISSION)</span>
                <span className="doc-panel-tag">ALLEGED RECORD</span>
              </div>

              {/* Field: Title */}
              <div 
                onClick={() => handleSelectClaimedField('title')}
                className={`inspect-field ${selectedClaimedField === 'title' ? 'selected' : ''} ${doiDiscrepancies.title ? 'discrepancy' : ''}`}
              >
                <span className="inspect-field-label">Article Title</span>
                <p className="inspect-field-value" style={{ fontWeight: 700 }}>
                  Adaptive Graph Pruning for Latent Knowledge Graphs
                </p>
                {doiDiscrepancies.title && (
                  <span className="discrepancy-flag">DISCREPANCY</span>
                )}
              </div>

              {/* Field: Authors */}
              <div 
                onClick={() => handleSelectClaimedField('authors')}
                className={`inspect-field ${selectedClaimedField === 'authors' ? 'selected' : ''} ${doiDiscrepancies.authors ? 'discrepancy' : ''}`}
              >
                <span className="inspect-field-label">Authors</span>
                <p className="inspect-field-value">
                  E. R. Vance &amp; K. Rostova
                </p>
                {doiDiscrepancies.authors && (
                  <span className="discrepancy-flag">DISCREPANCY</span>
                )}
              </div>

              {/* Field: Journal */}
              <div 
                onClick={() => handleSelectClaimedField('journal')}
                className={`inspect-field ${selectedClaimedField === 'journal' ? 'selected' : ''} ${doiDiscrepancies.journal ? 'discrepancy' : ''}`}
              >
                <span className="inspect-field-label">Journal</span>
                <p className="inspect-field-value">
                  International Journal of Neural Synthetics
                </p>
                {doiDiscrepancies.journal && (
                  <span className="discrepancy-flag">DISCREPANCY</span>
                )}
              </div>

              {/* Field: Year */}
              <div 
                onClick={() => handleSelectClaimedField('year')}
                className={`inspect-field ${selectedClaimedField === 'year' ? 'selected' : ''} ${doiDiscrepancies.year ? 'discrepancy' : ''}`}
              >
                <span className="inspect-field-label">Publication Year</span>
                <p className="inspect-field-value">
                  2024 (Vol 14, Issue 3)
                </p>
                {doiDiscrepancies.year && (
                  <span className="discrepancy-flag">DISCREPANCY</span>
                )}
              </div>
            </div>

            {/* DOCUMENT 2: REGISTRY RECORD */}
            <div className="doc-panel registry">
              <div className="doc-panel-header">
                <span className="doc-panel-title">OFFICIAL REGISTRY RECORD (DOI-042)</span>
                <span className="doc-panel-tag" style={{ color: '#60A5FA', background: 'rgba(59, 130, 246, 0.1)' }}>
                  SIMULATED REGISTRY
                </span>
              </div>

              {/* Field: Title */}
              <div 
                onClick={() => handleSelectRegistryField('title')}
                className={`inspect-field ${selectedRegistryField === 'title' ? 'selected' : ''} ${doiDiscrepancies.title ? 'discrepancy' : ''}`}
              >
                <span className="inspect-field-label">Registered Title</span>
                <p className="inspect-field-value" style={{ fontWeight: 700 }}>
                  Efficient Graph Pruning for Knowledge Retrieval
                </p>
                {doiDiscrepancies.title && (
                  <span className="discrepancy-flag">MISMATCH</span>
                )}
              </div>

              {/* Field: Authors */}
              <div 
                onClick={() => handleSelectRegistryField('authors')}
                className={`inspect-field ${selectedRegistryField === 'authors' ? 'selected' : ''} ${doiDiscrepancies.authors ? 'discrepancy' : ''}`}
              >
                <span className="inspect-field-label">Registered Authors</span>
                <p className="inspect-field-value">
                  N. Patel &amp; S. Huang
                </p>
                {doiDiscrepancies.authors && (
                  <span className="discrepancy-flag">MISMATCH</span>
                )}
              </div>

              {/* Field: Journal */}
              <div 
                onClick={() => handleSelectRegistryField('journal')}
                className={`inspect-field ${selectedRegistryField === 'journal' ? 'selected' : ''} ${doiDiscrepancies.journal ? 'discrepancy' : ''}`}
              >
                <span className="inspect-field-label">Registered Journal</span>
                <p className="inspect-field-value">
                  Journal of Computational Networks
                </p>
                {doiDiscrepancies.journal && (
                  <span className="discrepancy-flag">MISMATCH</span>
                )}
              </div>

              {/* Field: Year */}
              <div 
                onClick={() => handleSelectRegistryField('year')}
                className={`inspect-field ${selectedRegistryField === 'year' ? 'selected' : ''} ${doiDiscrepancies.year ? 'discrepancy' : ''}`}
              >
                <span className="inspect-field-label">Registered Year</span>
                <p className="inspect-field-value">
                  2023 (Vol 9, Issue 2)
                </p>
                {doiDiscrepancies.year && (
                  <span className="discrepancy-flag">MISMATCH</span>
                )}
              </div>
            </div>
          </div>

          {/* Pin Clue Button */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '10px' }}>
            <button
              type="button"
              onClick={handlePinDoiClue}
              disabled={clue1Pinned || (!doiDiscrepancies.title && !doiDiscrepancies.authors && !doiDiscrepancies.journal && !doiDiscrepancies.year)}
              className="btn-primary"
              style={{
                backgroundColor: clue1Pinned ? 'rgba(0, 255, 136, 0.15)' : undefined,
                color: clue1Pinned ? '#00FF88' : undefined,
                border: clue1Pinned ? '1px solid rgba(0, 255, 136, 0.4)' : undefined,
              }}
            >
              <Check size={18} />
              <span>{clue1Pinned ? 'CLUE 01 PINNED TO CASE BOARD (+30 PTS)' : 'PIN CLUE 01 TO CASE BOARD (+30 PTS)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStage('search_journal')}
              className="btn-secondary"
            >
              <span>Proceed to Station 02 (Journal Archive)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STATION 02: HER STORY SEARCH JOURNAL ARCHIVE                        */}
      {/* =================================================================== */}
      {stage === 'search_journal' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <button 
                type="button" 
                onClick={() => setStage('desk')}
                className="detective-nav-btn"
              >
                <ArrowLeft size={14} /> Back to Desk
              </button>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 700 }}>
                STATION 02 // HER STORY ARCHIVE INVESTIGATION
              </span>
            </div>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: '0 0 8px 0',
              }}
            >
              JOURNAL ISSUE ARCHIVE SEARCH
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#C3D0C8', margin: 0, maxWidth: '840px' }}>
              Search the table of contents of <em>International Journal of Neural Synthetics</em> (Volume 14, Issue 3, 2024). 
              Determine whether the claimed paper was genuinely published in this issue.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="archive-search-box">
            <Search size={18} className="archive-search-icon" />
            <input
              type="text"
              value={journalSearchQuery}
              onChange={(e) => setJournalSearchQuery(e.target.value)}
              placeholder='Search articles in Vol 14 Issue 3 (e.g. "adaptive", "pruning", "latent", "vance")...'
              className="archive-search-input"
            />
          </div>

          {/* Quick Keyword Filter Chips */}
          <div className="search-chips-row">
            {[
              { id: 'all', label: 'All Articles (6)' },
              { id: 'adaptive', label: 'Adaptive' },
              { id: 'pruning', label: 'Pruning' },
              { id: 'graph', label: 'Graph' },
              { id: 'latent', label: 'Latent' },
              { id: 'vance', label: 'Vance' },
            ].map(chip => (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setSelectedJournalFilter(chip.id);
                  if (chip.id === 'vance') {
                    setJournalSearchQuery('vance');
                  } else if (chip.id === 'all') {
                    setJournalSearchQuery('');
                  }
                }}
                className={`search-chip ${selectedJournalFilter === chip.id ? 'active' : ''}`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Filtered Articles List */}
          <div style={{ marginBottom: '24px' }}>
            {filteredJournalArticles.length > 0 ? (
              filteredJournalArticles.map(art => (
                <div 
                  key={art.id} 
                  className={`archive-article-card ${art.isNearMatch ? 'near-match' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <h5 className="archive-article-title">
                      {art.title}
                    </h5>
                    {art.isNearMatch && (
                      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#FCD34D', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>
                        NEAR MATCH
                      </span>
                    )}
                  </div>
                  <div className="archive-article-meta">
                    Authors: {art.authors} • Pages: {art.pages} • Vol 14, Issue 3 (2024)
                  </div>
                  {art.note && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#93C5FD', marginTop: '6px' }}>
                      {art.note}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#060F0A', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '12px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#EF4444', display: 'block', marginBottom: '6px' }}>
                  0 ARTICLES FOUND FOR "{journalSearchQuery}"
                </span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#87968D', margin: 0 }}>
                  Neither Dr. Vance nor Dr. Rostova appear in the table of contents for Volume 14, Issue 3.
                </p>
              </div>
            )}
          </div>

          {/* Forensic Deduction Question */}
          <div className="deduction-section">
            <h4 className="deduction-prompt">
              FORENSIC DEDUCTION: Does the claimed paper appear in this issue?
            </h4>
            <div className="deduction-options-grid">
              <button
                type="button"
                onClick={() => handleSelectJournalDeduction('A')}
                disabled={journalDeductionAnswer !== null}
                className={`deduction-option-btn ${journalDeductionAnswer === 'A' ? 'selected-wrong' : ''}`}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>A.</span>
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>YES — The publication is verified in this issue.</strong>
                  <span style={{ fontSize: '13px', color: '#87968D' }}>
                    An article with a similar title is present in the table of contents.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectJournalDeduction('B')}
                disabled={journalDeductionAnswer !== null}
                className={`deduction-option-btn ${journalDeductionAnswer === 'B' ? 'selected-correct' : ''}`}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FF88' }}>B.</span>
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px', color: '#00FF88' }}>
                    NO — The exact claimed paper is absent from this issue.
                  </strong>
                  <span style={{ fontSize: '13px', color: '#C3D0C8' }}>
                    Only a related article by Mercier &amp; Zhou (pp. 45–62) exists. The claimed paper (pp. 112–129) was never published here.
                  </span>
                </div>
              </button>
            </div>

            {journalDeductionAnswer === 'B' && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00FF88', fontWeight: 700 }}>
                  ✓ CORRECT FINDING: CLUE 02 PINNED (+30 PTS)
                </span>
                <button
                  type="button"
                  onClick={() => setStage('search_author')}
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '14px' }}
                >
                  <span>Proceed to Station 03 (Researcher Directory)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STATION 03: RESEARCHER DOSSIERS & BIBLIOGRAPHY                      */}
      {/* =================================================================== */}
      {stage === 'search_author' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <button 
                type="button" 
                onClick={() => setStage('desk')}
                className="detective-nav-btn"
              >
                <ArrowLeft size={14} /> Back to Desk
              </button>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 700 }}>
                STATION 03 // RESEARCHER PROFILES &amp; CROSS-CHECK
              </span>
            </div>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: '0 0 8px 0',
              }}
            >
              RESEARCHER DIRECTORY &amp; BIBLIOGRAPHY
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#C3D0C8', margin: 0, maxWidth: '840px' }}>
              Examine the official publication histories of Dr. Vance and Dr. Rostova. 
              Determine whether either author lists the claimed paper or has ever co-authored together.
            </p>
          </div>

          {/* Author Switcher Tabs */}
          <div className="author-tabs">
            <button
              type="button"
              onClick={() => setActiveAuthorTab('vance')}
              className={`author-tab ${activeAuthorTab === 'vance' ? 'active' : ''}`}
            >
              <span className="author-tab-name">Dr. E. R. Vance</span>
              <span className="author-tab-sub">Cambridge Cognitive Systems Lab • Graph Topology</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuthorTab('rostova')}
              className={`author-tab ${activeAuthorTab === 'rostova' ? 'active' : ''}`}
            >
              <span className="author-tab-name">Dr. K. Rostova</span>
              <span className="author-tab-sub">Zurich Robotics Institute • Autonomous Learning</span>
            </button>
          </div>

          {/* Profile Details & Bibliography Box */}
          <div className="author-profile-box">
            {activeAuthorTab === 'vance' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                      Dr. E. R. Vance
                    </h4>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00FF88' }}>
                      Research Field: Topological Graph Neural Networks &amp; Relational Latents
                    </span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#87968D' }}>
                    Institutional Archive ID: VNC-882
                  </span>
                </div>

                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#87968D', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>
                  RECENT VERIFIED PUBLICATIONS:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>Topological Graph Neural Networks (2023)</strong>
                    <div style={{ fontSize: '12px', color: '#87968D', marginTop: '2px' }}>IEEE Trans. Neural Netw. • Vance, E. R., &amp; Alvarez, J.</div>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>Pruning Strategies in Transductive Learning (2022)</strong>
                    <div style={{ fontSize: '12px', color: '#87968D', marginTop: '2px' }}>ICML Proceedings • Vance, E. R., &amp; Zhou, D.</div>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>Dynamic Graph Representation (2021)</strong>
                    <div style={{ fontSize: '12px', color: '#87968D', marginTop: '2px' }}>NeurIPS • Vance, E. R.</div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#FCD34D' }}>
                  ⚠ "Adaptive Graph Pruning for Latent Knowledge Graphs" is NOT in Dr. Vance's bibliography.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                      Dr. K. Rostova
                    </h4>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#60A5FA' }}>
                      Research Field: Reinforcement Learning in Robotics &amp; Embodied Control
                    </span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#87968D' }}>
                    Institutional Archive ID: RST-419
                  </span>
                </div>

                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#87968D', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>
                  RECENT VERIFIED PUBLICATIONS:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>Reinforcement Learning in Sparse Spatial Environments (2024)</strong>
                    <div style={{ fontSize: '12px', color: '#87968D', marginTop: '2px' }}>Robotics &amp; Automation • Rostova, K., &amp; Lindqvist, M.</div>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>Multi-Agent Robotic Control Paradigms (2023)</strong>
                    <div style={{ fontSize: '12px', color: '#87968D', marginTop: '2px' }}>IROS Proceedings • Rostova, K.</div>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>Sim-to-Real Policy Transfer (2022)</strong>
                    <div style={{ fontSize: '12px', color: '#87968D', marginTop: '2px' }}>CoRL Proceedings • Rostova, K., &amp; Morales, A.</div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#FCD34D' }}>
                  ⚠ "Adaptive Graph Pruning for Latent Knowledge Graphs" is NOT in Dr. Rostova's bibliography.
                </div>
              </div>
            )}
          </div>

          {/* Co-Authorship Cross-Check Box */}
          <div className="co-author-check-box">
            <div>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#FFFFFF', display: 'block', marginBottom: '2px' }}>
                CO-AUTHORSHIP DIRECTORY QUERY
              </strong>
              <span style={{ fontSize: '13px', color: '#C3D0C8' }}>
                Search academic citation index for joint publications: E. R. Vance × K. Rostova
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCoAuthorCheckExecuted(true)}
              className="btn-secondary"
            >
              <Search size={16} />
              <span>{coAuthorCheckExecuted ? 'Re-run Query' : 'Query Joint Works'}</span>
            </button>
          </div>

          {coAuthorCheckExecuted && (
            <div style={{ padding: '14px 18px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '12px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#EF4444', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                QUERY RESULT: 0 JOINT PUBLICATIONS FOUND
              </span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#E4F0E8', margin: 0 }}>
                Dr. Vance and Dr. Rostova work in different institutions and subfields (Graph Theory vs Robotics). They have no record of co-authoring any academic paper.
              </p>
            </div>
          )}

          {/* Forensic Deduction Question */}
          <div className="deduction-section">
            <h4 className="deduction-prompt">
              FORENSIC DEDUCTION: Do the author profiles corroborate this publication?
            </h4>
            <div className="deduction-options-grid">
              <button
                type="button"
                onClick={() => handleSelectAuthorDeduction('A')}
                disabled={authorDeductionAnswer !== null}
                className={`deduction-option-btn ${authorDeductionAnswer === 'A' ? 'selected-wrong' : ''}`}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>A.</span>
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>YES — The authors are verified computer scientists.</strong>
                  <span style={{ fontSize: '13px', color: '#87968D' }}>
                    Both researchers publish regularly, confirming the reference is valid.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAuthorDeduction('B')}
                disabled={authorDeductionAnswer !== null}
                className={`deduction-option-btn ${authorDeductionAnswer === 'B' ? 'selected-correct' : ''}`}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FF88' }}>B.</span>
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px', color: '#00FF88' }}>
                    NO — Neither author has published this paper or co-authored together.
                  </strong>
                  <span style={{ fontSize: '13px', color: '#C3D0C8' }}>
                    The publication is absent from both bibliographies, and there is zero record of collaboration.
                  </span>
                </div>
              </button>
            </div>

            {authorDeductionAnswer === 'B' && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00FF88', fontWeight: 700 }}>
                  ✓ CORRECT FINDING: CLUE 03 PINNED (+30 PTS)
                </span>
                <button
                  type="button"
                  onClick={() => setStage('case_board')}
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '14px' }}
                >
                  <span>Proceed to Case Board</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 4: THE CASE BOARD (EVIDENCE SYNTHESIS)                         */}
      {/* =================================================================== */}
      {stage === 'case_board' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <button 
                type="button" 
                onClick={() => setStage('desk')}
                className="detective-nav-btn"
              >
                <ArrowLeft size={14} /> Back to Desk
              </button>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 700 }}>
                STAGE 4 // EVIDENCE SYNTHESIS &amp; CASE BOARD
              </span>
            </div>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: '0 0 8px 0',
              }}
            >
              FORENSIC CASE BOARD
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#C3D0C8', margin: 0, maxWidth: '840px' }}>
              Synthesize your discoveries. Review the connections between the claimed specimen and the three institutional investigations before delivering your verdict.
            </p>
          </div>

          <div className="case-board-container">
            {/* Center Specimen Card */}
            <div className="case-board-center-specimen">
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#FCD34D', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                SUSPICIOUS SPECIMEN UNDER FORENSIC REVIEW
              </span>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                "Adaptive Graph Pruning for Latent Knowledge Graphs"
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#93C5FD', margin: 0 }}>
                Claimed: E. R. Vance &amp; K. Rostova • Int. J. Neural Synthetics, Vol 14 Issue 3 (2024) • DOI-042
              </p>
            </div>

            {/* 3 Connected Pinned Clue Cards */}
            <div className="case-pins-grid">
              {/* CLUE 1 */}
              <div className={`pinned-clue-card ${clue1Pinned ? 'discovered' : 'pending'}`}>
                <span className="pinned-clue-badge">
                  {clue1Pinned ? '✓ CLUE 01 PINNED' : 'CLUE 01 PENDING'}
                </span>
                <h5 className="pinned-clue-title">
                  DOI RESOLUTION CONFLICT
                </h5>
                <p className="pinned-clue-desc">
                  {clue1Pinned
                    ? 'Identifier DOI-042 resolves to an entirely different 2023 paper by Patel & Huang in Journal of Computational Networks.'
                    : 'Station 01 not yet inspected. Query DOI-042 in the registry to verify.'}
                </p>
              </div>

              {/* CLUE 2 */}
              <div className={`pinned-clue-card ${clue2Pinned ? 'discovered' : 'pending'}`}>
                <span className="pinned-clue-badge">
                  {clue2Pinned ? '✓ CLUE 02 PINNED' : 'CLUE 02 PENDING'}
                </span>
                <h5 className="pinned-clue-title">
                  JOURNAL ARCHIVE ABSENCE
                </h5>
                <p className="pinned-clue-desc">
                  {clue2Pinned
                    ? 'Volume 14 Issue 3 contains a related title by Mercier & Zhou (pp. 45–62). The claimed paper does not exist in this volume.'
                    : 'Station 02 not yet searched. Explore the journal table of contents to verify.'}
                </p>
              </div>

              {/* CLUE 3 */}
              <div className={`pinned-clue-card ${clue3Pinned ? 'discovered' : 'pending'}`}>
                <span className="pinned-clue-badge">
                  {clue3Pinned ? '✓ CLUE 03 PINNED' : 'CLUE 03 PENDING'}
                </span>
                <h5 className="pinned-clue-title">
                  AUTHOR COLLABORATION DISCONNECTION
                </h5>
                <p className="pinned-clue-desc">
                  {clue3Pinned
                    ? 'Dr. Vance and Dr. Rostova work in different disciplines and have 0 joint publications. The paper is absent from both CVs.'
                    : 'Station 03 not yet audited. Cross-check author profiles to verify.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '13px', color: pinnedCluesCount === 3 ? '#00FF88' : '#FCD34D', fontWeight: 700 }}>
              {pinnedCluesCount === 3
                ? '3 / 3 CRITICAL DISCREPANCIES ESTABLISHED. VERDICT UNLOCKED.'
                : `${pinnedCluesCount} / 3 CLUES ESTABLISHED. PLEASE COMPLETE ALL STATIONS.`}
            </span>

            <button
              type="button"
              onClick={() => setStage('verdict')}
              disabled={pinnedCluesCount < 3}
              className="btn-primary"
            >
              <span>PROCEED TO FINAL VERDICT</span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 5: FINAL VERDICT & CONCLUSION                                 */}
      {/* =================================================================== */}
      {stage === 'verdict' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ marginBottom: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 700 }}>
                STAGE 5 // FINAL FORENSIC VERDICT
              </span>
            </div>
            <h3 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: '0 0 10px 0',
              }}
            >
              BASED ON YOUR INVESTIGATION, WHAT IS YOUR VERDICT?
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#C3D0C8', margin: 0, maxWidth: '840px' }}>
              Synthesize the evidence from the DOI registry, journal table of contents, and author publication records to deliver your verdict on Case 042.
            </p>
          </div>

          {/* 3 Decision Cards */}
          <div className="verdict-choices-grid">
            {/* OPTION A */}
            <button
              type="button"
              onClick={() => handleSubmitVerdict('A')}
              disabled={verdictSubmitted}
              className={`verdict-card ${selectedVerdict === 'A' ? 'selected-wrong' : ''}`}
            >
              <div>
                <span className="verdict-card-letter">A</span>
                <h4 className="verdict-card-title">GENUINE</h4>
                <p className="verdict-card-desc">
                  The citation accurately represents an authentic publication and can be safely cited.
                </p>
              </div>
            </button>

            {/* OPTION B (CORRECT) */}
            <button
              type="button"
              onClick={() => handleSubmitVerdict('B')}
              disabled={verdictSubmitted}
              className={`verdict-card ${selectedVerdict === 'B' ? 'selected-correct' : ''}`}
            >
              <div>
                <span className="verdict-card-letter" style={{ backgroundColor: 'rgba(0, 255, 136, 0.15)', color: '#00FF88' }}>B</span>
                <h4 className="verdict-card-title" style={{ color: '#00FF88' }}>
                  FABRICATED OR MISREPRESENTED
                </h4>
                <p className="verdict-card-desc">
                  The reference contains conflicting publication information and should not be cited as written.
                </p>
              </div>
            </button>

            {/* OPTION C */}
            <button
              type="button"
              onClick={() => handleSubmitVerdict('C')}
              disabled={verdictSubmitted}
              className={`verdict-card ${selectedVerdict === 'C' ? 'selected-wrong' : ''}`}
            >
              <div>
                <span className="verdict-card-letter">C</span>
                <h4 className="verdict-card-title">INSUFFICIENT EVIDENCE</h4>
                <p className="verdict-card-desc">
                  The available information is not enough to reach a reliable forensic conclusion.
                </p>
              </div>
            </button>
          </div>

          {/* Post-Verdict Reveal & Debrief */}
          {verdictSubmitted && (
            <div style={{ backgroundColor: '#060F0A', border: '2px solid rgba(0, 255, 136, 0.35)', borderRadius: '20px', padding: 'clamp(24px, 4vw, 36px)', marginTop: '28px', animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div className="verdict-stamp-box">
                  FABRICATED CITATION DETECTED
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#00FF88', fontWeight: 700 }}>
                  FINAL CASE SCORE: {totalScore} / 150 PTS EARNED
                </div>
              </div>

              <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px 20px', backgroundColor: 'rgba(13, 31, 23, 0.7)', borderRadius: '12px', border: '1px solid rgba(0, 255, 136, 0.25)' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00FF88', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                    THE DECISIVE CONTRADICTION
                  </strong>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#E4F0E8', lineHeight: 1.55, margin: 0 }}>
                    The supplied identifier (<strong>DOI-042</strong>) definitively resolves to a different publication in the simulated registry: <em>"Efficient Graph Pruning for Knowledge Retrieval"</em> by Patel &amp; Huang (2023). This direct discrepancy invalidates the citation.
                  </p>
                </div>

                <div style={{ padding: '16px 20px', backgroundColor: 'rgba(13, 31, 23, 0.7)', borderRadius: '12px', border: '1px solid rgba(0, 255, 136, 0.25)' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '12px', color: '#60A5FA', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                    THE "FRANKENSTEIN" HALLUCINATION PATTERN
                  </strong>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#E4F0E8', lineHeight: 1.55, margin: 0 }}>
                    The journal archive and author records reveal how AI creates believable illusions: by stitching together fragments of truth. It combined real researcher names (Dr. Vance and Dr. Rostova) with an existing journal and slightly modified a real paper's title (Mercier &amp; Zhou's paper in Volume 14).
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={onContinue}
                    className="btn-primary"
                    style={{ fontSize: '16px', padding: '18px 40px' }}
                  >
                    <span>CONTINUE TO EXHIBIT 03</span>
                    <ArrowRight size={22} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
