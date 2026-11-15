import React, { useState } from 'react';
import { 
  Puzzle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Sparkles, 
  FileText,
  X
} from 'lucide-react';
import '../../styles/citation_jigsaw.css';

interface Exhibit02CitationJigsawProps {
  onScoreUpdate: (points: number) => void;
  onActivityComplete: (finalScore: number, isVerdictCorrect: boolean) => void;
  onContinue: () => void;
  isCompleted?: boolean;
  savedScore?: number;
}

type MetadataCategory = 
  | 'title' 
  | 'authors' 
  | 'year' 
  | 'journal' 
  | 'volumePages' 
  | 'publicationId' 
  | 'unverified';

interface Fragment {
  id: string;
  category: MetadataCategory;
  text: string;
  source: string;
  isTarget: boolean;
}

interface SlotDef {
  key: string;
  label: string;
  category: MetadataCategory;
  isSpecial?: boolean;
}

interface RoundData {
  id: string;
  roundNumber: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  prompt: string;
  aiScrambled: {
    title: string;
    authors: string;
    year: string;
    journal: string;
    volumePages: string;
    publicationId: string;
    flawNote: string;
  };
  archiveRecords: Array<{
    id: string;
    label: string;
    title: string;
    authors: string;
    year: string;
    journal: string;
    volumePages: string;
    publicationId: string;
    notes?: string;
  }>;
  slots: SlotDef[];
  fragments: Fragment[];
  expectedSolution: Record<string, string>; // slotKey -> fragmentId
  explanation: string;
  learningPoint: string;
}

const ROUNDS: RoundData[] = [
  // =========================================================================
  // ROUND 01 — THE MISMATCH (EASY, 50 PTS)
  // =========================================================================
  {
    id: 'round_01',
    roundNumber: '01',
    title: 'Round 01 — The Mismatch',
    difficulty: 'Easy',
    points: 50,
    prompt: 'Reconstruct the authentic publication record for "Latent Representation in Neural Graph Architectures". Cross-reference the archive dossiers below to replace the mismatched journal, volume, and identifier.',
    aiScrambled: {
      title: 'Latent Representation in Neural Graph Architectures',
      authors: 'Elena Rostova & Marcus Vance',
      year: '2024',
      journal: 'Annals of Biological Computing',
      volumePages: 'Vol. 9, pp. 45–60',
      publicationId: 'DEMO-1108-B',
      flawNote: 'AI paired a computer science paper with a biology journal and an unrelated identifier.',
    },
    archiveRecords: [
      {
        id: 'rec_a',
        label: 'Archive Record A (CS & AI Series)',
        title: 'Latent Representation in Neural Graph Architectures',
        authors: 'Elena Rostova & Marcus Vance',
        year: '2024',
        journal: 'Journal of Machine Learning Systems',
        volumePages: 'Vol. 18, pp. 142–159',
        publicationId: 'DEMO-2041-A',
        notes: 'Verified repository record in Machine Learning Systems.',
      },
      {
        id: 'rec_b',
        label: 'Archive Record B (Bioinformatics Series)',
        title: 'Molecular Folding in Computational Proteomics',
        authors: 'K. Chen & T. Weber',
        year: '2021',
        journal: 'Annals of Biological Computing',
        volumePages: 'Vol. 9, pp. 45–60',
        publicationId: 'DEMO-1108-B',
        notes: 'Verified repository record in Biological Computing.',
      },
    ],
    slots: [
      { key: 'title', label: 'Paper Title', category: 'title' },
      { key: 'authors', label: 'Author Names', category: 'authors' },
      { key: 'year', label: 'Publication Year', category: 'year' },
      { key: 'journal', label: 'Journal Name', category: 'journal' },
      { key: 'volumePages', label: 'Volume / Pages', category: 'volumePages' },
      { key: 'publicationId', label: 'Publication ID', category: 'publicationId' },
    ],
    fragments: [
      { id: 'r1_t1', category: 'title', text: 'Latent Representation in Neural Graph Architectures', source: 'Record A', isTarget: true },
      { id: 'r1_t2', category: 'title', text: 'Molecular Folding in Computational Proteomics', source: 'Record B', isTarget: false },
      { id: 'r1_a1', category: 'authors', text: 'Elena Rostova & Marcus Vance', source: 'Record A', isTarget: true },
      { id: 'r1_a2', category: 'authors', text: 'K. Chen & T. Weber', source: 'Record B', isTarget: false },
      { id: 'r1_y1', category: 'year', text: '2024', source: 'Record A', isTarget: true },
      { id: 'r1_y2', category: 'year', text: '2021', source: 'Record B', isTarget: false },
      { id: 'r1_j1', category: 'journal', text: 'Journal of Machine Learning Systems', source: 'Record A', isTarget: true },
      { id: 'r1_j2', category: 'journal', text: 'Annals of Biological Computing', source: 'Record B', isTarget: false },
      { id: 'r1_v1', category: 'volumePages', text: 'Vol. 18, pp. 142–159', source: 'Record A', isTarget: true },
      { id: 'r1_v2', category: 'volumePages', text: 'Vol. 9, pp. 45–60', source: 'Record B', isTarget: false },
      { id: 'r1_p1', category: 'publicationId', text: 'DEMO-2041-A', source: 'Record A', isTarget: true },
      { id: 'r1_p2', category: 'publicationId', text: 'DEMO-1108-B', source: 'Record B', isTarget: false },
    ],
    expectedSolution: {
      title: 'r1_t1',
      authors: 'r1_a1',
      year: 'r1_y1',
      journal: 'r1_j1',
      volumePages: 'r1_v1',
      publicationId: 'r1_p1',
    },
    explanation: 'The AI citation took the genuine title and authors from Record A, but attached the journal, volume, and identifier of an unrelated biology paper (Record B). By matching the evidence in Archive Record A, you restored the authentic publication.',
    learningPoint: 'A citation can look convincing while containing details that do not belong together.',
  },

  // =========================================================================
  // ROUND 02 — THE SPLICE (MEDIUM, 50 PTS)
  // =========================================================================
  {
    id: 'round_02',
    roundNumber: '02',
    title: 'Round 02 — The Splice',
    difficulty: 'Medium',
    points: 50,
    prompt: 'Reconstruct the authentic publication record for "Adversarial Robustness in Multimodal Foundation Models". Discard the spliced fragments taken from Hardware (Record Y) and Robotics (Record Z).',
    aiScrambled: {
      title: 'Adversarial Robustness in Multimodal Foundation Models',
      authors: 'Devon Mercer & Julia Haas',
      year: '2024',
      journal: 'Robotics and Autonomous Control',
      volumePages: 'Vol. 14, Issue 2, pp. 88–104',
      publicationId: 'DEMO-8910-Y',
      flawNote: 'AI created a "Frankenstein" citation spliced together from three completely different papers across AI, Microarchitecture, and Robotics.',
    },
    archiveRecords: [
      {
        id: 'rec_x',
        label: 'Archive Record X (Multimodal AI)',
        title: 'Adversarial Robustness in Multimodal Foundation Models',
        authors: 'Sophia Lindqvist & Tariq Al-Mansoor',
        year: '2023',
        journal: 'Cognitive Systems & Neural Networks',
        volumePages: 'Vol. 14, Issue 2, pp. 88–104',
        publicationId: 'DEMO-3342-X',
        notes: 'Peer-reviewed paper on multimodal security.',
      },
      {
        id: 'rec_y',
        label: 'Archive Record Y (Microarchitecture)',
        title: 'Sparse Attention Kernels for Low-Power Accelerators',
        authors: 'Devon Mercer & Julia Haas',
        year: '2022',
        journal: 'IEEE Microarchitecture Letters',
        volumePages: 'Vol. 7, pp. 12–28',
        publicationId: 'DEMO-8910-Y',
        notes: 'Hardware acceleration research.',
      },
      {
        id: 'rec_z',
        label: 'Archive Record Z (Robotics & Swarms)',
        title: 'Dynamic Routing in Autonomous Aerial Swarms',
        authors: 'Carlos Mendez & Rita Silva',
        year: '2024',
        journal: 'Robotics and Autonomous Control',
        volumePages: 'Vol. 31, pp. 210–232',
        publicationId: 'DEMO-5521-Z',
        notes: 'Autonomous systems conference publication.',
      },
    ],
    slots: [
      { key: 'title', label: 'Paper Title', category: 'title' },
      { key: 'authors', label: 'Author Names', category: 'authors' },
      { key: 'year', label: 'Publication Year', category: 'year' },
      { key: 'journal', label: 'Journal Name', category: 'journal' },
      { key: 'volumePages', label: 'Volume / Pages', category: 'volumePages' },
      { key: 'publicationId', label: 'Publication ID', category: 'publicationId' },
    ],
    fragments: [
      { id: 'r2_t1', category: 'title', text: 'Adversarial Robustness in Multimodal Foundation Models', source: 'Record X', isTarget: true },
      { id: 'r2_t2', category: 'title', text: 'Sparse Attention Kernels for Low-Power Accelerators', source: 'Record Y', isTarget: false },
      { id: 'r2_t3', category: 'title', text: 'Dynamic Routing in Autonomous Aerial Swarms', source: 'Record Z', isTarget: false },
      { id: 'r2_a1', category: 'authors', text: 'Sophia Lindqvist & Tariq Al-Mansoor', source: 'Record X', isTarget: true },
      { id: 'r2_a2', category: 'authors', text: 'Devon Mercer & Julia Haas', source: 'Record Y', isTarget: false },
      { id: 'r2_a3', category: 'authors', text: 'Carlos Mendez & Rita Silva', source: 'Record Z', isTarget: false },
      { id: 'r2_y1', category: 'year', text: '2023', source: 'Record X', isTarget: true },
      { id: 'r2_y2', category: 'year', text: '2022', source: 'Record Y', isTarget: false },
      { id: 'r2_y3', category: 'year', text: '2024', source: 'Record Z', isTarget: false },
      { id: 'r2_j1', category: 'journal', text: 'Cognitive Systems & Neural Networks', source: 'Record X', isTarget: true },
      { id: 'r2_j2', category: 'journal', text: 'IEEE Microarchitecture Letters', source: 'Record Y', isTarget: false },
      { id: 'r2_j3', category: 'journal', text: 'Robotics and Autonomous Control', source: 'Record Z', isTarget: false },
      { id: 'r2_v1', category: 'volumePages', text: 'Vol. 14, Issue 2, pp. 88–104', source: 'Record X', isTarget: true },
      { id: 'r2_v2', category: 'volumePages', text: 'Vol. 7, pp. 12–28', source: 'Record Y', isTarget: false },
      { id: 'r2_v3', category: 'volumePages', text: 'Vol. 31, pp. 210–232', source: 'Record Z', isTarget: false },
      { id: 'r2_p1', category: 'publicationId', text: 'DEMO-3342-X', source: 'Record X', isTarget: true },
      { id: 'r2_p2', category: 'publicationId', text: 'DEMO-8910-Y', source: 'Record Y', isTarget: false },
      { id: 'r2_p3', category: 'publicationId', text: 'DEMO-5521-Z', source: 'Record Z', isTarget: false },
    ],
    expectedSolution: {
      title: 'r2_t1',
      authors: 'r2_a1',
      year: 'r2_y1',
      journal: 'r2_j1',
      volumePages: 'r2_v1',
      publicationId: 'r2_p1',
    },
    explanation: 'The AI generated a "Frankenstein" citation by splicing pieces from three unrelated publications. By cross-checking the archive dossiers, you discarded the spliced impostor pieces and reassembled Record X.',
    learningPoint: 'AI can combine genuine-looking details into a citation that does not correspond to any single publication.',
  },

  // =========================================================================
  // ROUND 03 — THE IMPOSTOR (HARD, 50 PTS)
  // =========================================================================
  {
    id: 'round_03',
    roundNumber: '03',
    title: 'Round 03 — The Impostor',
    difficulty: 'Hard',
    points: 50,
    prompt: 'Reconstruct the verified fields for "Empirical Limits of Hallucination in Large Generative Transformers". Notice: one crucial detail cannot be verified against the official registry. Identify the fabricated detail and place it into the dedicated "UNVERIFIED / NO MATCH" slot!',
    aiScrambled: {
      title: 'Empirical Limits of Hallucination in Large Generative Transformers',
      authors: 'Dr. Liam Gallagher & Dr. Sunita Rao',
      year: '2024',
      journal: 'Transactions on Artificial Intelligence Ethics',
      volumePages: 'Vol. 6, Issue 4, pp. 310–329',
      publicationId: 'DEMO-9999-VOID',
      flawNote: 'The paper is real, but the identifier DEMO-9999-VOID is a phantom ID invented by AI with zero registry existence.',
    },
    archiveRecords: [
      {
        id: 'rec_g',
        label: 'Archive Record G (Target Paper)',
        title: 'Empirical Limits of Hallucination in Large Generative Transformers',
        authors: 'Dr. Liam Gallagher & Dr. Sunita Rao',
        year: '2024',
        journal: 'Transactions on Artificial Intelligence Ethics',
        volumePages: 'Vol. 6, Issue 4, pp. 310–329',
        publicationId: 'NO REGISTERED IDENTIFIER (Pending deposit)',
        notes: 'Paper verified in print archive. Institutional repository indicates no digital identifier has been issued.',
      },
      {
        id: 'rec_registry_audit',
        label: 'Institutional Registry Verification Log',
        title: 'Digital Registry Lookup Audit',
        authors: 'Institutional Registry Office',
        year: '2024',
        journal: 'Cross-Registry Audit Log',
        volumePages: 'Status: Complete',
        publicationId: 'FLAGGED AUDIT',
        notes: 'DEMO-9999-VOID: ZERO RECORDS FOUND. Phantom identifier generated by external software.',
      },
    ],
    slots: [
      { key: 'title', label: 'Paper Title', category: 'title' },
      { key: 'authors', label: 'Author Names', category: 'authors' },
      { key: 'year', label: 'Publication Year', category: 'year' },
      { key: 'journal', label: 'Journal Name', category: 'journal' },
      { key: 'volumePages', label: 'Volume / Pages', category: 'volumePages' },
      { key: 'unverified', label: 'UNVERIFIED / NO MATCH (Drop Unsupported Detail Here)', category: 'unverified', isSpecial: true },
    ],
    fragments: [
      { id: 'r3_t1', category: 'title', text: 'Empirical Limits of Hallucination in Large Generative Transformers', source: 'Record G', isTarget: true },
      { id: 'r3_t2', category: 'title', text: 'A Survey of Tokenization Protocols', source: 'Unrelated', isTarget: false },
      { id: 'r3_a1', category: 'authors', text: 'Dr. Liam Gallagher & Dr. Sunita Rao', source: 'Record G', isTarget: true },
      { id: 'r3_a2', category: 'authors', text: 'H. Bradley & J. Miller', source: 'Unrelated', isTarget: false },
      { id: 'r3_y1', category: 'year', text: '2024', source: 'Record G', isTarget: true },
      { id: 'r3_y2', category: 'year', text: '2021', source: 'Unrelated', isTarget: false },
      { id: 'r3_j1', category: 'journal', text: 'Transactions on Artificial Intelligence Ethics', source: 'Record G', isTarget: true },
      { id: 'r3_j2', category: 'journal', text: 'Proceedings of Natural Language Notes', source: 'Unrelated', isTarget: false },
      { id: 'r3_v1', category: 'volumePages', text: 'Vol. 6, Issue 4, pp. 310–329', source: 'Record G', isTarget: true },
      { id: 'r3_v2', category: 'volumePages', text: 'Vol. 2, pp. 15–22', source: 'Unrelated', isTarget: false },
      { id: 'r3_u1', category: 'unverified', text: 'DEMO-9999-VOID (Fabricated Phantom ID — Zero Registry Match)', source: 'AI Hallucination', isTarget: true },
      { id: 'r3_u2', category: 'unverified', text: 'DEMO-7701-G (Assigned to Bradley & Miller, 2021)', source: 'Registry Index', isTarget: false },
    ],
    expectedSolution: {
      title: 'r3_t1',
      authors: 'r3_a1',
      year: 'r3_y1',
      journal: 'r3_j1',
      volumePages: 'r3_v1',
      unverified: 'r3_u1',
    },
    explanation: 'When a publication detail cannot be verified against official archives, academic integrity demands that you do not force it into the citation as fact. By isolating DEMO-9999-VOID into the Unverified slot, you prevented a fabricated identifier from corrupting the academic record.',
    learningPoint: 'When a publication detail cannot be verified, do not treat it as fact.',
  },
];

// Utility function to thoroughly shuffle fragments so correct and incorrect fragments
// are dispersed unpredictably across rows and columns with no consecutive runs
function shuffleFragments(fragments: Fragment[]): Fragment[] {
  let shuffled: Fragment[] = [];
  let attempts = 0;

  do {
    shuffled = [...fragments];
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;

    // Validate dispersion:
    // 1. Max consecutive correct items <= 2
    // 2. Max consecutive distractor items <= 2
    let maxConsecutiveTarget = 0;
    let currConsecutiveTarget = 0;
    let maxConsecutiveDistractor = 0;
    let currConsecutiveDistractor = 0;

    for (const f of shuffled) {
      if (f.isTarget) {
        currConsecutiveTarget++;
        currConsecutiveDistractor = 0;
      } else {
        currConsecutiveDistractor++;
        currConsecutiveTarget = 0;
      }
      maxConsecutiveTarget = Math.max(maxConsecutiveTarget, currConsecutiveTarget);
      maxConsecutiveDistractor = Math.max(maxConsecutiveDistractor, currConsecutiveDistractor);
    }

    if (maxConsecutiveTarget <= 2 && maxConsecutiveDistractor <= 2) {
      break;
    }
  } while (attempts < 60);

  return shuffled;
}

export const Exhibit02CitationJigsaw: React.FC<Exhibit02CitationJigsawProps> = ({
  onScoreUpdate,
  onActivityComplete,
  onContinue,
  isCompleted = false,
  savedScore = 0,
}) => {
  // Screen state: 'intro' | 'playing' | 'complete'
  const [screen, setScreen] = useState<'intro' | 'playing' | 'complete'>(isCompleted ? 'complete' : 'intro');

  // Shuffled fragments map: roundIdx -> shuffled array of fragments
  const [shuffledFragmentsMap, setShuffledFragmentsMap] = useState<Record<number, Fragment[]>>(() => {
    const map: Record<number, Fragment[]> = {};
    ROUNDS.forEach((r, idx) => {
      map[idx] = shuffleFragments(r.fragments);
    });
    return map;
  });

  // Round management
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [roundScores, setRoundScores] = useState<number[]>([
    isCompleted ? 50 : 0,
    isCompleted ? 50 : 0,
    isCompleted ? 50 : 0,
  ]);
  const [roundResults, setRoundResults] = useState<Array<boolean | null>>([
    isCompleted ? true : null,
    isCompleted ? true : null,
    isCompleted ? true : null,
  ]);

  // Current round active puzzle state
  const currentRound = ROUNDS[currentRoundIdx];
  const [placedSlots, setPlacedSlots] = useState<Record<string, string | null>>({});
  const [selectedFragmentId, setSelectedFragmentId] = useState<string | null>(null);
  const [hoveredSlotKey, setHoveredSlotKey] = useState<string | null>(null);
  const [isRoundSubmitted, setIsRoundSubmitted] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<string>('rec_a');

  // Current total score
  const totalScore = roundScores.reduce((acc, s) => acc + s, 0);

  // Update active dossier tab on round change and ensure freshly shuffled fragments
  const handleSelectRound = (roundIdx: number) => {
    setCurrentRoundIdx(roundIdx);
    setPlacedSlots({});
    setSelectedFragmentId(null);
    setHoveredSlotKey(null);
    setIsRoundSubmitted(roundResults[roundIdx] !== null);
    setStatusMessage(null);
    setActiveDossierTab(ROUNDS[roundIdx].archiveRecords[0].id);

    // If this round hasn't been submitted yet, generate a fresh thorough shuffle
    if (roundResults[roundIdx] === null) {
      setShuffledFragmentsMap(prev => ({
        ...prev,
        [roundIdx]: shuffleFragments(ROUNDS[roundIdx].fragments),
      }));
    }
  };

  // Start game from intro
  const handleStartGame = () => {
    const freshMap: Record<number, Fragment[]> = {};
    ROUNDS.forEach((r, idx) => {
      freshMap[idx] = shuffleFragments(r.fragments);
    });
    setShuffledFragmentsMap(freshMap);
    setScreen('playing');
    handleSelectRound(0);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, fragmentId: string) => {
    if (isRoundSubmitted) return;
    e.dataTransfer.setData('text/plain', fragmentId);
    setSelectedFragmentId(fragmentId);
  };

  const handleDragOver = (e: React.DragEvent, slotKey: string) => {
    if (isRoundSubmitted) return;
    e.preventDefault();
    setHoveredSlotKey(slotKey);
  };

  const handleDragLeave = () => {
    setHoveredSlotKey(null);
  };

  const handleDrop = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    setHoveredSlotKey(null);
    if (isRoundSubmitted) return;

    const fragmentId = e.dataTransfer.getData('text/plain') || selectedFragmentId;
    if (!fragmentId) return;

    assignFragmentToSlot(fragmentId, slotKey);
  };

  // Accessible click/tap to place handler
  const handleFragmentClick = (fragmentId: string) => {
    if (isRoundSubmitted) return;

    // If fragment is already placed, do nothing
    const isAlreadyPlaced = Object.values(placedSlots).includes(fragmentId);
    if (isAlreadyPlaced) return;

    if (selectedFragmentId === fragmentId) {
      setSelectedFragmentId(null);
      setStatusMessage(null);
    } else {
      setSelectedFragmentId(fragmentId);
      const frag = currentRound.fragments.find(f => f.id === fragmentId);
      setStatusMessage(`Selected "${frag?.category.toUpperCase()}". Click a matching slot below to place it.`);
    }
  };

  const handleSlotClick = (slotKey: string) => {
    if (isRoundSubmitted) return;

    const currentPlacedId = placedSlots[slotKey];

    // If slot is occupied and no fragment is selected, unplace it
    if (currentPlacedId && !selectedFragmentId) {
      setPlacedSlots(prev => ({
        ...prev,
        [slotKey]: null,
      }));
      setStatusMessage('Fragment returned to evidence pool.');
      return;
    }

    // If fragment is selected, try to assign it to this slot
    if (selectedFragmentId) {
      assignFragmentToSlot(selectedFragmentId, slotKey);
    }
  };

  const handleRemovePlaced = (slotKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRoundSubmitted) return;
    setPlacedSlots(prev => ({
      ...prev,
      [slotKey]: null,
    }));
    setStatusMessage('Fragment removed.');
  };

  // Helper to validate and place fragment into slot
  const assignFragmentToSlot = (fragmentId: string, slotKey: string) => {
    const fragment = currentRound.fragments.find(f => f.id === fragmentId);
    const slot = currentRound.slots.find(s => s.key === slotKey);

    if (!fragment || !slot) return;

    // Check category match
    if (fragment.category !== slot.category) {
      setStatusMessage(`Category Mismatch: "${fragment.category.toUpperCase()}" cannot be placed into "${slot.label}"!`);
      setSelectedFragmentId(null);
      return;
    }

    // Valid placement: place into slot and unassign from any other slot
    setPlacedSlots(prev => {
      const next = { ...prev };
      // Remove this fragment from any previous slot
      Object.keys(next).forEach(k => {
        if (next[k] === fragmentId) next[k] = null;
      });
      next[slotKey] = fragmentId;
      return next;
    });

    setSelectedFragmentId(null);
    setStatusMessage(`Placed "${fragment.text.substring(0, 32)}..." into ${slot.label}.`);
  };

  // Check if all slots are filled
  const allSlotsFilled = currentRound.slots.every(slot => !!placedSlots[slot.key]);

  // Submit current round
  const handleVerifyRound = () => {
    if (!allSlotsFilled || isRoundSubmitted) return;

    setIsRoundSubmitted(true);

    // Evaluate correctness: every slot must match expectedSolution
    const isCorrect = currentRound.slots.every(slot => {
      const placedId = placedSlots[slot.key];
      return placedId === currentRound.expectedSolution[slot.key];
    });

    const points = isCorrect ? 50 : 0;

    // Update round state
    const newScores = [...roundScores];
    newScores[currentRoundIdx] = points;
    setRoundScores(newScores);

    const newResults = [...roundResults];
    newResults[currentRoundIdx] = isCorrect;
    setRoundResults(newResults);

    // Score update
    if (points > 0) {
      onScoreUpdate(points);
    }
  };

  // Advance to next round or complete
  const handleNextRound = () => {
    if (currentRoundIdx < ROUNDS.length - 1) {
      handleSelectRound(currentRoundIdx + 1);
    } else {
      // Activity completed
      const finalTotal = roundScores.reduce((acc, s) => acc + s, 0);
      const allCorrect = roundResults.every(r => r === true);
      setScreen('complete');
      onActivityComplete(finalTotal, allCorrect);
    }
  };

  return (
    <div className="jigsaw-container">
      {/* ------------------------------------------------------------------- */}
      {/* TOP HEADER STRIP                                                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="jigsaw-header-strip">
        <div className="jigsaw-header-left">
          <div className="jigsaw-pulse-dot" />
          <div>
            <span className="jigsaw-header-title">
              EXHIBIT 02 // CITATION JIGSAW
            </span>
            <span className="jigsaw-header-subtitle">
              {screen === 'intro' && 'FORENSIC CITATION RECONSTRUCTION PUZZLE'}
              {screen === 'playing' && `${currentRound.title.toUpperCase()} (${currentRound.difficulty.toUpperCase()} • 50 PTS)`}
              {screen === 'complete' && 'RECONSTRUCTION COMPLETE // ALL ROUNDS AUDITED'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="jigsaw-score-badge">
            SCORE: {screen === 'complete' && isCompleted && savedScore ? savedScore : totalScore} / 150 PTS
          </div>

          {screen === 'playing' && (
            <button
              type="button"
              onClick={() => setScreen('intro')}
              style={{
                background: 'none',
                border: 'none',
                color: '#87968D',
                fontFamily: 'monospace',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              How To Play
            </button>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* SCREEN 1: INTRO SCREEN (CAN YOU REBUILD THE TRUTH?)                 */}
      {/* =================================================================== */}
      {screen === 'intro' && (
        <div className="jigsaw-intro-card animate-reveal">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '14px', backgroundColor: 'rgba(0, 255, 136, 0.12)', border: '1px solid rgba(0, 255, 136, 0.35)', marginBottom: '16px' }}>
            <Puzzle size={14} color="#00FF88" />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 700 }}>
              INTERACTIVE CITATION RECONSTRUCTION CHALLENGE
            </span>
          </div>

          <h3 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              color: '#FFFFFF',
              margin: '0 0 16px 0',
            }}
          >
            CAN YOU REBUILD THE TRUTH?
          </h3>

          <p 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)',
              lineHeight: 1.55,
              color: '#E4F0E8',
              fontWeight: 500,
              maxWidth: '840px',
              margin: 0,
            }}
          >
            AI has generated a research citation. Some details may be wrong, mixed up, or completely invented. 
            Find the matching publication details and rebuild the authentic record.
          </p>

          {/* 3 Step Visual Instructions */}
          <div className="jigsaw-steps-grid">
            <div className="jigsaw-step-item">
              <span className="jigsaw-step-num">STEP 01</span>
              <h4 className="jigsaw-step-title">1. EXAMINE</h4>
              <p className="jigsaw-step-desc">
                Review the AI-generated citation and inspect the verified publication archive dossiers.
              </p>
            </div>

            <div className="jigsaw-step-item">
              <span className="jigsaw-step-num">STEP 02</span>
              <h4 className="jigsaw-step-title">2. ASSEMBLE</h4>
              <p className="jigsaw-step-desc">
                Drag (or tap) the correct evidence fragments into the matching citation metadata slots.
              </p>
            </div>

            <div className="jigsaw-step-item">
              <span className="jigsaw-step-num">STEP 03</span>
              <h4 className="jigsaw-step-title">3. VERIFY</h4>
              <p className="jigsaw-step-desc">
                Submit your reconstruction to verify accuracy and reveal how AI fabricated the citation.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '10px' }}>
            <button
              type="button"
              onClick={handleStartGame}
              className="btn-primary"
            >
              <span>START RECONSTRUCTION</span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>

            <span className="fictional-notice">
              All publication records in this simulation are fictional and created for educational purposes.
            </span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SCREEN 2: ACTIVE PUZZLE WORKSPACE (ROUNDS 1, 2, 3)                  */}
      {/* =================================================================== */}
      {screen === 'playing' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          
          {/* Round Stepper */}
          <div className="round-stepper">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {ROUNDS.map((r, idx) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRound(idx)}
                  className={`round-pill ${currentRoundIdx === idx ? 'active' : ''} ${roundResults[idx] !== null ? 'completed' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{roundResults[idx] ? '✓' : roundResults[idx] === false ? '✗' : ''}</span>
                  <span>{r.title}</span>
                  <span style={{ opacity: 0.6 }}>({r.points} PTS)</span>
                </button>
              ))}
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#87968D' }}>
              ROUND {currentRoundIdx + 1} OF 3
            </div>
          </div>

          {/* Round Prompt */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#E4F0E8', lineHeight: 1.5, margin: 0 }}>
              {currentRound.prompt}
            </p>
          </div>

          {/* AREA A: The Scrambled AI Citation */}
          <div className="scrambled-citation-box">
            <div className="scrambled-badge-strip">
              <span className="scrambled-badge">
                <AlertTriangle size={14} />
                AI-GENERATED CITATION // SUSPICIOUS SPECIMEN
              </span>
              <span className="fictional-notice">
                Simulated AI Output
              </span>
            </div>

            <p className="scrambled-text">
              <strong>"{currentRound.aiScrambled.title}"</strong> by <em>{currentRound.aiScrambled.authors}</em> ({currentRound.aiScrambled.year}). Published in <span className="highlight-flaw">{currentRound.aiScrambled.journal}</span>, {currentRound.aiScrambled.volumePages}. Identifier: <span className="highlight-flaw">{currentRound.aiScrambled.publicationId}</span>.
            </p>

            <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '11px', color: '#FCD34D' }}>
              ⚠ Analysis: {currentRound.aiScrambled.flawNote}
            </div>
          </div>

          {/* Archive Dossiers (Evidence Reference Tabs) */}
          <div className="archive-dossier-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                VERIFIED PUBLICATION ARCHIVES (EVIDENCE SOURCES)
              </span>
              <span style={{ fontSize: '11px', color: '#87968D', fontFamily: 'monospace' }}>
                Cross-check to identify matching fields
              </span>
            </div>

            <div className="dossier-tabs-row">
              {currentRound.archiveRecords.map(rec => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setActiveDossierTab(rec.id)}
                  className={`dossier-tab-btn ${activeDossierTab === rec.id ? 'active' : ''}`}
                >
                  <FileText size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  {rec.label}
                </button>
              ))}
            </div>

            {/* Selected Dossier Preview */}
            {(() => {
              const activeRec = currentRound.archiveRecords.find(r => r.id === activeDossierTab) || currentRound.archiveRecords[0];
              return (
                <div className="dossier-record-preview">
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    Title: "{activeRec.title}"
                  </div>
                  <div style={{ color: '#93C5FD', marginBottom: '4px' }}>
                    Authors: {activeRec.authors} • Year: {activeRec.year} • Journal: {activeRec.journal}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#87968D' }}>
                    Coordinates: {activeRec.volumePages} • Official ID: {activeRec.publicationId}
                  </div>
                  {activeRec.notes && (
                    <div style={{ marginTop: '6px', fontSize: '12px', color: '#00FF88' }}>
                      {activeRec.notes}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Status Message / Interaction Helper */}
          {statusMessage && (
            <div style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', marginBottom: '18px', fontFamily: 'monospace', fontSize: '12px', color: '#00FF88', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* AREA C: Citation Reconstruction Workspace */}
          <div className="workspace-container">
            <div className="workspace-title-row">
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  CENTRAL RECONSTRUCTION WORKSPACE
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#87968D' }}>
                  Drag fragments from below or click a fragment, then click a slot.
                </span>
              </div>

              {!isRoundSubmitted && (
                <button
                  type="button"
                  onClick={() => setPlacedSlots({})}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  <RotateCcw size={13} />
                  <span>Clear All Slots</span>
                </button>
              )}
            </div>

            {/* Slots Grid */}
            <div className="workspace-slots-grid">
              {currentRound.slots.map(slot => {
                const placedFragmentId = placedSlots[slot.key];
                const placedFragment = placedFragmentId ? currentRound.fragments.find(f => f.id === placedFragmentId) : null;
                const isDragOver = hoveredSlotKey === slot.key;
                const isSelectedMatching = selectedFragmentId ? currentRound.fragments.find(f => f.id === selectedFragmentId)?.category === slot.category : false;

                // Submission evaluation states
                const isCorrect = isRoundSubmitted && placedFragmentId === currentRound.expectedSolution[slot.key];
                const isWrong = isRoundSubmitted && placedFragmentId !== currentRound.expectedSolution[slot.key];

                return (
                  <div
                    key={slot.key}
                    onDragOver={(e) => handleDragOver(e, slot.key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, slot.key)}
                    onClick={() => handleSlotClick(slot.key)}
                    className={`drop-slot ${placedFragment ? 'filled' : ''} ${isDragOver ? 'drag-over' : ''} ${slot.isSpecial ? 'unverified-slot' : ''}`}
                    style={{
                      cursor: isRoundSubmitted ? 'default' : 'pointer',
                      borderColor: isCorrect 
                        ? '#00FF88' 
                        : isWrong 
                        ? '#EF4444' 
                        : isSelectedMatching && !placedFragment 
                        ? '#00FF88' 
                        : undefined,
                      borderStyle: isSelectedMatching && !placedFragment ? 'dashed' : undefined,
                      boxShadow: isSelectedMatching && !placedFragment ? '0 0 15px rgba(0, 255, 136, 0.2)' : undefined,
                    }}
                  >
                    <div className="drop-slot-label">
                      <span>{slot.label}</span>
                      {isCorrect && (
                        <span style={{ color: '#00FF88', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={13} /> VERIFIED MATCH
                        </span>
                      )}
                      {isWrong && (
                        <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <X size={13} /> MISMATCH / INCORRECT
                        </span>
                      )}
                    </div>

                    {placedFragment ? (
                      <div className="placed-fragment">
                        <div className="placed-fragment-text">
                          {placedFragment.text}
                          <span style={{ fontSize: '11px', color: '#87968D', marginLeft: '8px', fontFamily: 'monospace' }}>
                            ({placedFragment.source})
                          </span>
                        </div>

                        {!isRoundSubmitted && (
                          <button
                            type="button"
                            onClick={(e) => handleRemovePlaced(slot.key, e)}
                            className="remove-fragment-btn"
                            title="Remove from slot"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="drop-slot-empty-text">
                        [ DROP {slot.category.toUpperCase()} HERE OR CLICK AFTER SELECTING ]
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AREA B: Evidence Fragments Pool */}
          <div className="fragments-pool-container">
            <div className="fragments-pool-header">
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  AVAILABLE EVIDENCE FRAGMENTS
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#87968D' }}>
                  Drag cards into the slots above or click to select
                </span>
              </div>

              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#87968D' }}>
                {Object.values(placedSlots).filter(Boolean).length} / {currentRound.slots.length} SLOTS FILLED
              </span>
            </div>

            <div className="fragments-grid">
              {(shuffledFragmentsMap[currentRoundIdx] || currentRound.fragments).map(frag => {
                const isPlaced = Object.values(placedSlots).includes(frag.id);
                const isSelected = selectedFragmentId === frag.id;

                return (
                  <div
                    key={frag.id}
                    draggable={!isRoundSubmitted && !isPlaced}
                    onDragStart={(e) => handleDragStart(e, frag.id)}
                    onClick={() => handleFragmentClick(frag.id)}
                    className={`fragment-card ${isPlaced ? 'placed' : ''} ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="fragment-card-header">
                      <span className="fragment-category-pill">
                        {frag.category}
                      </span>
                      <span className="fragment-source-tag">
                        {frag.source}
                      </span>
                    </div>

                    <p className="fragment-card-text">
                      {frag.text}
                    </p>

                    {isSelected && (
                      <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#00FF88', fontWeight: 700 }}>
                        ● SELECTED — CLICK MATCHING SLOT
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification / Submission Button */}
          {!isRoundSubmitted ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="button"
                onClick={handleVerifyRound}
                disabled={!allSlotsFilled}
                className="btn-primary"
              >
                <Check size={18} strokeWidth={2.5} />
                <span>VERIFY CITATION ({allSlotsFilled ? 'READY TO SUBMIT' : 'FILL ALL SLOTS FIRST'})</span>
              </button>
            </div>
          ) : (
            /* Post-Submission Feedback Banner */
            <div className={`round-feedback-card ${roundResults[currentRoundIdx] ? 'correct' : 'incorrect'}`}>
              <div className={`feedback-status-badge ${roundResults[currentRoundIdx] ? 'correct' : 'incorrect'}`}>
                {roundResults[currentRoundIdx] ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>RECONSTRUCTION VERIFIED // +50 POINTS AWARDED</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    <span>RECONSTRUCTION FLAWED // 0 POINTS</span>
                  </>
                )}
              </div>

              <p className="feedback-explanation">
                {currentRound.explanation}
              </p>

              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
                <strong style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                  CORE TAKEAWAY:
                </strong>
                <span style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                  {currentRound.learningPoint}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  onClick={handleNextRound}
                  className="btn-primary"
                >
                  <span>{currentRoundIdx < ROUNDS.length - 1 ? 'NEXT PUZZLE' : 'VIEW FINAL RESULTS'}</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =================================================================== */}
      {/* SCREEN 3: ACTIVITY COMPLETE & GRAND TAKEAWAY                        */}
      {/* =================================================================== */}
      {screen === 'complete' && (
        <div className="activity-complete-box">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '20px', backgroundColor: 'rgba(0, 255, 136, 0.12)', border: '1px solid rgba(0, 255, 136, 0.35)', marginBottom: '18px' }}>
            <Sparkles size={16} color="#00FF88" />
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00FF88', fontWeight: 800 }}>
              RECONSTRUCTION COMPLETE
            </span>
          </div>

          <h3 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              margin: '0 0 12px 0',
            }}
          >
            CITATION JIGSAW RESOLVED
          </h3>

          <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 800, color: '#00FF88', marginBottom: '8px' }}>
            FINAL ACTIVITY SCORE: {savedScore || totalScore} / 150 PTS
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#C3D0C8', maxWidth: '720px', margin: '0 auto 24px auto' }}>
            You investigated three distinct hallucination archetypes: mismatched metadata, spliced "Frankenstein" citations, and fabricated phantom identifiers.
          </p>

          {/* Core Final Takeaway Box */}
          <div className="final-takeaway-box">
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8AFFB2', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              EXHIBIT 02 ESSENTIAL TRUTH
            </span>
            <p className="final-takeaway-text">
              "NEVER TRUST A CITATION JUST BECAUSE IT LOOKS REAL. VERIFY THE SOURCE."
            </p>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', paddingTop: '10px' }}>
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
      )}
    </div>
  );
};
