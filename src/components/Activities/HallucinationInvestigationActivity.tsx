import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  FastForward, 
  RotateCcw,
  ExternalLink,
  Wifi,
  WifiOff
} from 'lucide-react';

interface CaseData {
  id: 'case-fabricated' | 'case-real';
  caseLabel: string;
  isReal: boolean;
  provenanceType: 'simulation' | 'benchmark';
  authors: string;
  title: string;
  journal: string;
  year: string;
  volumeIssue: string;
  doi: string;
  publisherUrl?: string;
  fieldAnalysis: {
    authors: { status: 'verified' | 'fabricated'; details: string; db: string; mode: string };
    title: { status: 'verified' | 'fabricated'; details: string; db: string; mode: string };
    journal: { status: 'verified' | 'fabricated'; details: string; db: string; mode: string };
    doi: { status: 'verified' | 'fabricated'; details: string; db: string; mode: string };
  };
  summaryTakeaway: string;
}

const CASES: Record<'case-fabricated' | 'case-real', CaseData> = {
  'case-fabricated': {
    id: 'case-fabricated',
    caseLabel: 'EXHIBIT 02-A // SUSPICIOUS CITATION (PEDAGOGICAL CASE)',
    isReal: false,
    provenanceType: 'simulation',
    authors: 'Vance, A. & Rostova, E. (2024)',
    title: 'Emergent Latent Dynamics in Autonomous LLM Epistemology',
    journal: 'International Journal of Neural Cognition & Computational Ethics',
    year: '2024',
    volumeIssue: 'Vol. 14, Issue 3, pp. 112–129',
    doi: '10.1016/j.neucom.2024.11.084',
    fieldAnalysis: {
      authors: {
        status: 'fabricated',
        details: 'Constructed academic names. No co-authorship records exist in ORCID or OpenAlex bibliometrics.',
        db: 'ORCID / OPENALEX REGISTRY',
        mode: 'OFFLINE TEACHING SIMULATION'
      },
      title: {
        status: 'fabricated',
        details: 'Title does not exist in Crossref, Google Scholar, or Semantic Scholar archives.',
        db: 'CROSSREF CORE REPOSITORY',
        mode: 'OFFLINE TEACHING SIMULATION'
      },
      journal: {
        status: 'fabricated',
        details: 'Plausible-sounding journal title. No matching ISSN registered in the International ISSN Portal.',
        db: 'ISSN INTERNATIONAL DIRECTORY',
        mode: 'OFFLINE TEACHING SIMULATION'
      },
      doi: {
        status: 'fabricated',
        details: 'Prefix 10.1016 belongs to Elsevier, but suffix 2024.11.084 is unregistered and resolves to HTTP 404.',
        db: 'DOI.ORG RESOLVER SIMULATION',
        mode: 'OFFLINE TEACHING SIMULATION'
      }
    },
    summaryTakeaway: 'The generative model combined plausible scholarly vocabulary into a convincing reference. None of the four components correspond to actual scholarship.'
  },
  'case-real': {
    id: 'case-real',
    caseLabel: 'EXHIBIT 02-B // PEER-REVIEWED BENCHMARK',
    isReal: true,
    provenanceType: 'benchmark',
    authors: 'Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021)',
    title: 'On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? 🦜',
    journal: 'Proceedings of the 2021 ACM FAccT Conference',
    year: '2021',
    volumeIssue: 'ACM Digital Library, pp. 610–623',
    doi: '10.1145/3442188.3445922',
    publisherUrl: 'https://dl.acm.org/doi/10.1145/3442188.3445922',
    fieldAnalysis: {
      authors: {
        status: 'verified',
        details: 'Verified research team at University of Washington, Google Research, and The DAIR Institute.',
        db: 'ORCID ACADEMIC DIRECTORY',
        mode: 'VERIFIED REPOSITORY RECORD'
      },
      title: {
        status: 'verified',
        details: 'Foundational paper analyzing the environmental, social, and communicative risks of large language models.',
        db: 'ACM DIGITAL LIBRARY & CROSSREF',
        mode: 'VERIFIED REPOSITORY RECORD'
      },
      journal: {
        status: 'verified',
        details: 'Official peer-reviewed ACM Conference on Fairness, Accountability, and Transparency (FAccT \'21).',
        db: 'ACM PROCEEDINGS INDEX',
        mode: 'VERIFIED REPOSITORY RECORD'
      },
      doi: {
        status: 'verified',
        details: 'Active registered DOI (10.1145/3442188.3445922) verified on Crossref and resolving to official ACM open-access proceeding.',
        db: 'CROSSREF & DOI.ORG RESOLVER',
        mode: 'AUTHENTIC PUBLISHER RECORD'
      }
    },
    summaryTakeaway: 'Authentic academic work verified across Crossref, ACM Digital Library, and original publisher records.'
  }
};

interface HallucinationInvestigationActivityProps {
  onActivityComplete?: () => void;
}

export const HallucinationInvestigationActivity: React.FC<HallucinationInvestigationActivityProps> = ({
  onActivityComplete
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<'case-fabricated' | 'case-real'>('case-fabricated');
  const [inspectedFields, setInspectedFields] = useState<Record<string, boolean>>({});
  const [activeField, setActiveField] = useState<'authors' | 'title' | 'journal' | 'doi'>('doi');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [visitorDecision, setVisitorDecision] = useState<'real' | 'fabricated' | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Live Crossref API state for the real benchmark citation
  const [liveApiState, setLiveApiState] = useState<{
    attempted: boolean;
    isLive: boolean;
    title?: string;
    publisher?: string;
  }>({ attempted: false, isLive: false });

  const activeCase = CASES[selectedCaseId];
  const fieldData = activeCase.fieldAnalysis[activeField];

  // Attempt real Crossref verification when inspecting DOI on the real citation
  useEffect(() => {
    if (selectedCaseId === 'case-real' && activeField === 'doi' && !liveApiState.attempted) {
      let cancelled = false;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      fetch(`https://api.crossref.org/works/${activeCase.doi}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('Crossref response non-200');
          return res.json();
        })
        .then((json) => {
          if (!cancelled && json?.message) {
            setLiveApiState({
              attempted: true,
              isLive: true,
              title: json.message.title?.[0],
              publisher: json.message.publisher
            });
          }
        })
        .catch(() => {
          if (!cancelled) {
            // Graceful offline fallback
            setLiveApiState({ attempted: true, isLive: false });
          }
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });

      return () => {
        cancelled = true;
        controller.abort();
      };
    }
  }, [selectedCaseId, activeField, liveApiState.attempted, activeCase.doi]);

  const handleInspectField = (fieldKey: 'authors' | 'title' | 'journal' | 'doi') => {
    setActiveField(fieldKey);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setInspectedFields((prev) => ({ ...prev, [`${selectedCaseId}-${fieldKey}`]: true }));
    }, 450);
  };

  const handleMakeDecision = (decision: 'real' | 'fabricated') => {
    setVisitorDecision(decision);
    setIsCompleted(true);
    setTimeout(() => {
      onActivityComplete?.();
    }, 2800);
  };

  const handleResetInvestigation = () => {
    setVisitorDecision(null);
    setInspectedFields({});
    setActiveField('doi');
  };

  const handleCaseChange = (caseId: 'case-fabricated' | 'case-real') => {
    setSelectedCaseId(caseId);
    setVisitorDecision(null);
    setActiveField('doi');
  };

  return (
    <section 
      id="activity-02"
      className="documentary-scene activity-stage-wrapper"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(72px, 8vw, 120px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#050807',
        borderTop: '1px solid var(--border-medium)'
      }}
      aria-label="Activity 02: The Hallucination Investigation"
    >
      <div className="exhibition-container">

        {/* Outer Stage Frame */}
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
          {/* Header Bar */}
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
                INTERACTIVE ACTIVITY 02 // FORENSIC INVESTIGATION
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
                The Hallucination Investigation
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                AI models frequently fabricate plausible-sounding academic citations. Inspect the 4 metadata fields to establish whether this source is authentic.
              </p>
            </div>

            {/* Case Selection & Skip Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleCaseChange('case-fabricated')}
                  style={{
                    padding: '8px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    borderRadius: '2px',
                    backgroundColor: selectedCaseId === 'case-fabricated' ? 'rgba(255, 90, 90, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedCaseId === 'case-fabricated' ? '#FF8A8A' : 'var(--text-muted)',
                    border: `1px solid ${selectedCaseId === 'case-fabricated' ? '#FF8A8A' : 'var(--border-subtle)'}`,
                    cursor: 'pointer'
                  }}
                >
                  CASE 01: SUSPICIOUS REF
                </button>

                <button
                  onClick={() => handleCaseChange('case-real')}
                  style={{
                    padding: '8px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    borderRadius: '2px',
                    backgroundColor: selectedCaseId === 'case-real' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedCaseId === 'case-real' ? 'var(--accent-primary)' : 'var(--text-muted)',
                    border: `1px solid ${selectedCaseId === 'case-real' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer'
                  }}
                >
                  CASE 02: BENCHMARK REF
                </button>

                <button
                  onClick={() => {
                    setIsCompleted(true);
                    onActivityComplete?.();
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Skip to next scene"
                >
                  <span>SKIP</span>
                  <FastForward size={12} />
                </button>
              </div>

              {/* Provenance Badge (Distinguishing Simulation vs Genuine Benchmark) */}
              <div 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.625rem',
                  padding: '3px 8px',
                  borderRadius: '2px',
                  backgroundColor: activeCase.provenanceType === 'simulation' ? 'rgba(255, 90, 90, 0.1)' : 'rgba(0, 255, 136, 0.1)',
                  border: `1px solid ${activeCase.provenanceType === 'simulation' ? 'rgba(255, 90, 90, 0.3)' : 'rgba(0, 255, 136, 0.3)'}`,
                  color: activeCase.provenanceType === 'simulation' ? '#FF8A8A' : 'var(--accent-primary)'
                }}
              >
                <span>PROVENANCE:</span>
                <strong>
                  {activeCase.provenanceType === 'simulation' 
                    ? 'CONTROLLED TEACHING SIMULATION' 
                    : 'AUTHENTIC PEER-REVIEWED BENCHMARK'}
                </strong>
              </div>
            </div>
          </div>

          {/* Forensic Stage Split-Screen */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              backgroundColor: '#050807',
              border: '1px solid var(--border-medium)',
              padding: 'clamp(20px, 3vw, 36px)',
              borderRadius: '2px'
            }}
          >
            {/* Left Side: Interactive Document Viewer */}
            <div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={15} color="var(--accent-primary)" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.06em' }}>
                    ACADEMIC CITATION VIEWER
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  SELECT FIELD TO SCAN
                </span>
              </div>

              {/* Document Mount Box */}
              <div 
                style={{
                  backgroundColor: '#071A10',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  padding: '20px',
                  position: 'relative',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)'
                }}
              >
                {/* Field 1: Authors */}
                <div 
                  onClick={() => handleInspectField('authors')}
                  style={{
                    padding: '12px',
                    borderRadius: '2px',
                    border: `1px solid ${activeField === 'authors' ? 'var(--accent-primary)' : 'transparent'}`,
                    backgroundColor: activeField === 'authors' ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 200ms ease'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Inspect Authors field"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-secondary)' }}>
                      01 // AUTHORS
                    </span>
                    {inspectedFields[`${selectedCaseId}-authors`] && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-primary)' }}>
                        SCANNED ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    {activeCase.authors}
                  </div>
                </div>

                {/* Field 2: Paper Title */}
                <div 
                  onClick={() => handleInspectField('title')}
                  style={{
                    padding: '12px',
                    borderRadius: '2px',
                    border: `1px solid ${activeField === 'title' ? 'var(--accent-primary)' : 'transparent'}`,
                    backgroundColor: activeField === 'title' ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 200ms ease'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Inspect Paper Title field"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-secondary)' }}>
                      02 // ARTICLE TITLE
                    </span>
                    {inspectedFields[`${selectedCaseId}-title`] && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-primary)' }}>
                        SCANNED ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, fontStyle: 'italic' }}>
                    "{activeCase.title}"
                  </div>
                </div>

                {/* Field 3: Journal / Publication Venue */}
                <div 
                  onClick={() => handleInspectField('journal')}
                  style={{
                    padding: '12px',
                    borderRadius: '2px',
                    border: `1px solid ${activeField === 'journal' ? 'var(--accent-primary)' : 'transparent'}`,
                    backgroundColor: activeField === 'journal' ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 200ms ease'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Inspect Journal field"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-secondary)' }}>
                      03 // JOURNAL / VENUE
                    </span>
                    {inspectedFields[`${selectedCaseId}-journal`] && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-primary)' }}>
                        SCANNED ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                    {activeCase.journal}, {activeCase.volumeIssue}
                  </div>
                </div>

                {/* Field 4: DOI Identifier */}
                <div 
                  onClick={() => handleInspectField('doi')}
                  style={{
                    padding: '12px',
                    borderRadius: '2px',
                    border: `1px solid ${activeField === 'doi' ? 'var(--accent-primary)' : 'transparent'}`,
                    backgroundColor: activeField === 'doi' ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Inspect DOI field"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-secondary)' }}>
                      04 // DIGITAL OBJECT IDENTIFIER (DOI)
                    </span>
                    {inspectedFields[`${selectedCaseId}-doi`] && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-primary)' }}>
                        SCANNED ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    https://doi.org/{activeCase.doi}
                  </div>
                </div>
              </div>

              {/* Direct Link to Publisher Record for Real Benchmark */}
              {activeCase.publisherUrl && (
                <div style={{ marginTop: '12px' }}>
                  <a
                    href={activeCase.publisherUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: 'rgba(0, 255, 136, 0.08)',
                      border: '1px solid var(--accent-primary)',
                      borderRadius: '2px',
                      color: 'var(--accent-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <span>OPEN OFFICIAL ACM DIGITAL LIBRARY RECORD</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Right Side: Evidence Forensic Console & Live/Fallback Scanner */}
            <div 
              style={{
                backgroundColor: 'rgba(7, 26, 16, 0.95)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Search size={15} color="var(--accent-primary)" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>
                      FORENSIC EVIDENCE SCANNER
                    </span>
                  </div>
                  
                  {/* Verification Mode Stamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                    {selectedCaseId === 'case-real' && activeField === 'doi' && liveApiState.isLive ? (
                      <span style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Wifi size={10} /> LIVE API ACTIVE
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <WifiOff size={10} /> REPOSITORY ARCHIVE
                      </span>
                    )}
                  </div>
                </div>

                {/* Evidence Terminal Box */}
                <div 
                  style={{
                    backgroundColor: '#040605',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px',
                    borderRadius: '2px',
                    marginBottom: '16px',
                    minHeight: '140px',
                    position: 'relative'
                  }}
                >
                  {isScanning ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '110px', gap: '10px' }}>
                      <div style={{ width: '32px', height: '2px', backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.1em' }}>
                        SCANNING REPOSITORIES...
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                          DATABASE ACCESSED:
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                          {fieldData.db}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        {fieldData.status === 'verified' ? (
                          <CheckCircle2 size={16} color="var(--accent-primary)" />
                        ) : (
                          <AlertTriangle size={16} color="#FF8A8A" />
                        )}
                        <span 
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: fieldData.status === 'verified' ? 'var(--accent-primary)' : '#FF8A8A'
                          }}
                        >
                          {fieldData.status === 'verified' ? 'STATUS: REGISTERED & AUTHENTIC' : 'STATUS: UNVERIFIED / FABRICATED'}
                        </span>
                      </div>

                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '8px' }}>
                        {fieldData.details}
                      </p>

                      {/* Display live Crossref verification details if live fetch succeeded */}
                      {selectedCaseId === 'case-real' && activeField === 'doi' && liveApiState.isLive && (
                        <div style={{ padding: '6px 10px', backgroundColor: 'rgba(0, 255, 136, 0.08)', borderLeft: '2px solid var(--accent-primary)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Live Crossref Record: </span>
                          {liveApiState.title} ({liveApiState.publisher})
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Final Decision Section: DOES THIS SOURCE ACTUALLY EXIST? */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.06em' }}>
                    DOES THIS SOURCE ACTUALLY EXIST?
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <button
                      onClick={() => handleMakeDecision('real')}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        backgroundColor: visitorDecision === 'real' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(5, 8, 7, 0.8)',
                        border: `2px solid ${visitorDecision === 'real' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        borderRadius: '2px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: visitorDecision === 'real' ? 'var(--accent-primary)' : 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                      }}
                    >
                      VERIFIED SOURCE
                    </button>

                    <button
                      onClick={() => handleMakeDecision('fabricated')}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        backgroundColor: visitorDecision === 'fabricated' ? 'rgba(255, 90, 90, 0.2)' : 'rgba(5, 8, 7, 0.8)',
                        border: `2px solid ${visitorDecision === 'fabricated' ? '#FF8A8A' : 'var(--border-subtle)'}`,
                        borderRadius: '2px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: visitorDecision === 'fabricated' ? '#FF8A8A' : 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                      }}
                    >
                      FABRICATED REFERENCE
                    </button>
                  </div>
                </div>

                {/* Cinematic Forensic Reveal Report */}
                {visitorDecision !== null && (
                  <div 
                    style={{
                      padding: '16px',
                      backgroundColor: ((visitorDecision === 'real' && activeCase.isReal) || (visitorDecision === 'fabricated' && !activeCase.isReal))
                        ? 'rgba(0, 255, 136, 0.1)'
                        : 'rgba(255, 90, 90, 0.1)',
                      border: `1px solid ${((visitorDecision === 'real' && activeCase.isReal) || (visitorDecision === 'fabricated' && !activeCase.isReal)) ? 'var(--accent-primary)' : 'rgba(255, 90, 90, 0.4)'}`,
                      borderRadius: '2px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.5,
                      marginBottom: '10px'
                    }}
                  >
                    {/* Visual 4-Field Forensic Matrix Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '12px' }}>
                      {(['authors', 'title', 'journal', 'doi'] as const).map((key) => {
                        const isFieldVerified = activeCase.fieldAnalysis[key].status === 'verified';
                        return (
                          <div 
                            key={key}
                            style={{
                              padding: '6px 8px',
                              backgroundColor: 'rgba(5, 8, 7, 0.7)',
                              border: `1px solid ${isFieldVerified ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 90, 90, 0.4)'}`,
                              borderRadius: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.625rem'
                            }}
                          >
                            <span style={{ color: 'var(--text-muted)' }}>{key.toUpperCase()}:</span>
                            <span style={{ color: isFieldVerified ? 'var(--accent-primary)' : '#FF8A8A', fontWeight: 700 }}>
                              {isFieldVerified ? 'VERIFIED ✓' : 'FABRICATED ✕'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      {((visitorDecision === 'real' && activeCase.isReal) || (visitorDecision === 'fabricated' && !activeCase.isReal)) ? (
                        <>
                          <CheckCircle2 size={16} color="var(--accent-primary)" />
                          <strong style={{ color: 'var(--accent-primary)', fontSize: '0.8125rem' }}>INVESTIGATION ACCURATE: </strong>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} color="#FF8A8A" />
                          <strong style={{ color: '#FF8A8A', fontSize: '0.8125rem' }}>INVESTIGATION INACCURATE: </strong>
                        </>
                      )}
                      <span style={{ fontWeight: 700 }}>
                        {activeCase.isReal ? "Genuine Peer-Reviewed Citation." : "Complete Hallucination."}
                      </span>
                    </div>

                    <div style={{ color: 'var(--text-main)', fontSize: '0.75rem' }}>
                      {activeCase.summaryTakeaway}
                    </div>
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
                <span style={{ color: 'var(--text-muted)' }}>Investigation Status:</span>
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: isCompleted ? 'var(--accent-primary)' : 'var(--accent-secondary)'
                  }}
                >
                  {isCompleted ? "EVALUATION COMPLETE" : "AWAITING VISITOR VERDICT"}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Completion State Banner */}
          <div 
            style={{
              marginTop: '24px',
              padding: '14px 20px',
              backgroundColor: isCompleted ? 'rgba(0, 255, 136, 0.1)' : 'rgba(5, 8, 7, 0.6)',
              border: `1px solid ${isCompleted ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              borderRadius: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color={isCompleted ? "#00FF88" : "var(--text-dim)"} />
              <span style={{ fontSize: '0.8125rem', color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                {isCompleted 
                  ? "Investigation Complete: Hallucination analysis recorded. Cinematic exhibition will glide toward finale..."
                  : "Investigation In Progress: Scan individual citation fields or establish your final verdict above."}
              </span>
            </div>

            <button
              onClick={handleResetInvestigation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={11} />
              <span>RESET CASE</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
