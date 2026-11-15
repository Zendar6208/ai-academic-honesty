export interface Chapter {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'FOUNDATION' | 'COGNITION' | 'CRISIS' | 'ETHICS' | 'SYNTHESIS';
  status: 'active' | 'upcoming';
  estimatedRead: string;
}

export interface ArchiveMetadata {
  classification: string;
  systemCodename: string;
  institution: string;
  location: string;
  directive: string;
  timestamp: string;
}

export const ARCHIVE_METADATA: ArchiveMetadata = {
  classification: "CLASSIFIED // ACADEMIC INTEGRITY DOSSIER",
  systemCodename: "PROJECT SYNAPSE // ETHICS ARCHIVE",
  institution: "VIT-AP UNIVERSITY",
  location: "ANDHRA PRADESH, INDIA (16.4971° N, 80.4992° E)",
  directive: "Investigating synthetic fluency, cognitive offloading, and the preservation of authentic intellect.",
  timestamp: "2026.11"
};

export const ARCHIVE_CHAPTERS: Chapter[] = [
  {
    id: "chap-01",
    code: "01",
    title: "THE AI REVOLUTION",
    subtitle: "The unprecedented acceleration of large language models and cognitive automation.",
    category: "FOUNDATION",
    status: "upcoming",
    estimatedRead: "4 min"
  },
  {
    id: "chap-02",
    code: "02",
    title: "TWO SIDES OF AI",
    subtitle: "The dual catalyst: intellectual amplifier versus cognitive crutch.",
    category: "FOUNDATION",
    status: "upcoming",
    estimatedRead: "5 min"
  },
  {
    id: "chap-03",
    code: "03",
    title: "WHO IS THINKING?",
    subtitle: "The core philosophical crisis: synthetic synthesis vs human neural struggle.",
    category: "COGNITION",
    status: "upcoming",
    estimatedRead: "6 min"
  },
  {
    id: "chap-04",
    code: "04",
    title: "ACADEMIC HONESTY",
    subtitle: "Redefining authorship, originality, and intellectual ownership in code and prose.",
    category: "ETHICS",
    status: "upcoming",
    estimatedRead: "5 min"
  },
  {
    id: "chap-05",
    code: "05",
    title: "AI HALLUCINATIONS",
    subtitle: "Plausible fabrications, simulated citations, and the epistemic hazard.",
    category: "CRISIS",
    status: "upcoming",
    estimatedRead: "6 min"
  },
  {
    id: "chap-06",
    code: "06",
    title: "THE DETECTOR PROBLEM",
    subtitle: "Statistical fragility, false positives, and why algorithmic policing fails.",
    category: "CRISIS",
    status: "upcoming",
    estimatedRead: "7 min"
  },
  {
    id: "chap-07",
    code: "07",
    title: "THE HUMAN COST",
    subtitle: "Skill atrophy, critical thinking erosion, and the deficit of unexercised curiosity.",
    category: "COGNITION",
    status: "upcoming",
    estimatedRead: "6 min"
  },
  {
    id: "chap-08",
    code: "08",
    title: "RESPONSIBLE AI",
    subtitle: "The institutional framework for ethical co-existence and pedagogical reform.",
    category: "ETHICS",
    status: "upcoming",
    estimatedRead: "5 min"
  },
  {
    id: "chap-09",
    code: "09",
    title: "INTERACTIVE ETHICS QUIZ",
    subtitle: "Real-world university dilemmas: evaluate ambiguous AI usage scenarios.",
    category: "SYNTHESIS",
    status: "upcoming",
    estimatedRead: "8 min"
  },
  {
    id: "chap-10",
    code: "10",
    title: "THE FINAL QUESTION",
    subtitle: "If machines formulate every conclusion, what is the university for?",
    category: "SYNTHESIS",
    status: "upcoming",
    estimatedRead: "4 min"
  }
];
