// ============================================================================
// EXHIBIT 04: REPAIR THE WORKFLOW // DATA SPECIFICATIONS
// Continuous academic scenario: "The Impact of Artificial Intelligence on Higher Education"
// ============================================================================

export interface AssignmentBrief {
  title: string;
  topic: string;
  courseCode: string;
  rules: {
    id: string;
    label: string;
    detail: string;
    isPermitted: boolean;
  }[];
}

export const ASSIGNMENT_SCENARIO: AssignmentBrief = {
  title: 'TERM RESEARCH REPORT',
  topic: 'The Impact of Artificial Intelligence on Higher Education',
  courseCode: 'CS / ETH-402',
  rules: [
    {
      id: 'rule-brainstorm',
      label: 'Brainstorming Permitted',
      detail: 'AI is permitted for brainstorming angles, outlining, and understanding difficult concepts.',
      isPermitted: true,
    },
    {
      id: 'rule-authorship',
      label: 'Authentic Authorship',
      detail: 'The submitted work must reflect the student’s own writing, reasoning, and conceptual synthesis.',
      isPermitted: true,
    },
    {
      id: 'rule-verify',
      label: 'Independent Verification',
      detail: 'All academic sources, facts, and citations must be independently located and verified before citation.',
      isPermitted: true,
    },
    {
      id: 'rule-disclosure',
      label: 'Mandatory Disclosure',
      detail: 'Any assistance received from generative AI tools must be clearly and transparently disclosed.',
      isPermitted: true,
    },
  ],
};

// ============================================================================
// STAGE 01: FIND THE DAMAGE (5 Cards, 10 pts each = 50 pts)
// ============================================================================

export interface DamageCard {
  id: string;
  text: string;
  correctCategory: 'RESPONSIBLE' | 'PROBLEMATIC';
  explanation: string;
}

export const STAGE_01_CARDS: DamageCard[] = [
  {
    id: 'dmg-01',
    text: 'I ask AI to suggest possible angles for my report before deciding which topic I want to explore.',
    correctCategory: 'RESPONSIBLE',
    explanation: 'Brainstorming can be a responsible use of AI when the student makes the decisions and develops the final work independently.',
  },
  {
    id: 'dmg-02',
    text: 'I ask AI to write the complete report and submit its response as my own work.',
    correctCategory: 'PROBLEMATIC',
    explanation: 'Submitting AI-generated text as your own writing completely violates authentic authorship and academic honesty.',
  },
  {
    id: 'dmg-03',
    text: 'I use AI to explain an unfamiliar concept, then close the chat and write my own explanation.',
    correctCategory: 'RESPONSIBLE',
    explanation: 'Using AI as a personal tutor to understand difficult concepts while drafting the final work yourself preserves cognitive mastery.',
  },
  {
    id: 'dmg-04',
    text: 'I copy AI-generated references into my bibliography without checking whether the publications exist.',
    correctCategory: 'PROBLEMATIC',
    explanation: 'AI frequently invents plausible-sounding citations. Citing unverified sources amounts to scholarly fabrication.',
  },
  {
    id: 'dmg-05',
    text: 'I use AI to rewrite my entire report, even though the assignment requires the submitted work to reflect my own writing and understanding.',
    correctCategory: 'PROBLEMATIC',
    explanation: 'Having AI rewrite your entire paper replaces your original voice and reasoning with synthetic output, breaching the course instructions.',
  },
];

// ============================================================================
// STAGE 02: REBUILD THE WORKFLOW (6 Sequential Steps, max 50 pts)
// ============================================================================

export interface WorkflowStep {
  stepNumber: number; // 1 to 6
  stepKey: string;
  label: string;
  actionText: string;
  iconName: 'book-open' | 'compass' | 'search' | 'pen-tool' | 'check-circle' | 'file-text';
}

export const STAGE_02_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    stepKey: 'UNDERSTAND',
    label: 'STEP 01 — UNDERSTAND',
    actionText: 'I read the assignment instructions and check what AI assistance is permitted.',
    iconName: 'book-open',
  },
  {
    stepNumber: 2,
    stepKey: 'EXPLORE',
    label: 'STEP 02 — EXPLORE',
    actionText: "I use AI to brainstorm possible approaches and explain concepts I don't understand.",
    iconName: 'compass',
  },
  {
    stepNumber: 3,
    stepKey: 'RESEARCH',
    label: 'STEP 03 — RESEARCH',
    actionText: 'I find relevant academic sources and independently verify their publication details.',
    iconName: 'search',
  },
  {
    stepNumber: 4,
    stepKey: 'CREATE',
    label: 'STEP 04 — CREATE',
    actionText: 'I develop the report using my own understanding, reasoning, and writing.',
    iconName: 'pen-tool',
  },
  {
    stepNumber: 5,
    stepKey: 'REVIEW',
    label: 'STEP 05 — REVIEW',
    actionText: 'I use AI for permitted feedback, then personally evaluate and make the final revisions.',
    iconName: 'check-circle',
  },
  {
    stepNumber: 6,
    stepKey: 'DISCLOSE',
    label: 'STEP 06 — DISCLOSE',
    actionText: 'I review the assignment requirements and disclose my AI assistance as required.',
    iconName: 'file-text',
  },
];

// Helper to calculate Stage 02 score proportionally
export const calculateStage02Score = (correctCount: number): number => {
  switch (correctCount) {
    case 6: return 50;
    case 5: return 42;
    case 4: return 33;
    case 3: return 25;
    case 2: return 17;
    case 1: return 8;
    default: return 0;
  }
};

// ============================================================================
// STAGE 03: THE FINAL CHECK (5 Decisions, 10 pts each = 50 pts)
// ============================================================================

export interface FinalCheckDecision {
  id: string;
  number: number;
  title: string;
  situation: string;
  optionA: {
    id: 'A';
    text: string;
  };
  optionB: {
    id: 'B';
    text: string;
  };
  correctOption: 'A' | 'B';
  explanation: string;
}

export const STAGE_03_DECISIONS: FinalCheckDecision[] = [
  {
    id: 'dec-01',
    number: 1,
    title: 'THE UNVERIFIED SOURCE',
    situation: 'I find a convincing AI-generated reference, but I cannot find the publication in a reliable source.',
    optionA: {
      id: 'A',
      text: 'Keep it because the citation looks professional.',
    },
    optionB: {
      id: 'B',
      text: 'Remove it or replace it with a source I can independently verify.',
    },
    correctOption: 'B',
    explanation: 'A citation looking convincing does not make it real. Never present an unverified source as genuine research.',
  },
  {
    id: 'dec-02',
    number: 2,
    title: 'THE PERFECT PARAGRAPH',
    situation: 'AI has generated a paragraph that explains my topic perfectly. I understand it, but the paragraph is not my own writing.',
    optionA: {
      id: 'A',
      text: 'Submit it unchanged.',
    },
    optionB: {
      id: 'B',
      text: 'Use the explanation to develop my own understanding and write the paragraph myself.',
    },
    correctOption: 'B',
    explanation: 'Understanding AI-generated text does not automatically make it your own work. The assignment requires your own writing and reasoning.',
  },
  {
    id: 'dec-03',
    number: 3,
    title: 'THE LAST-MINUTE GRAMMAR CHECK',
    situation: 'I use an AI tool to identify grammar mistakes in my report. The assignment permits AI feedback.',
    optionA: {
      id: 'A',
      text: 'Review the suggestions and make my own final edits.',
    },
    optionB: {
      id: 'B',
      text: 'Automatically accept every change without reviewing it.',
    },
    correctOption: 'A',
    explanation: 'AI feedback can help, but the student remains responsible for the accuracy and meaning of the final work.',
  },
  {
    id: 'dec-04',
    number: 4,
    title: 'THE MISSING DISCLOSURE',
    situation: 'I used AI for brainstorming and feedback. The assignment requires me to disclose AI assistance, but I am worried that mentioning it will affect my marks.',
    optionA: {
      id: 'A',
      text: 'Leave it out and hope nobody notices.',
    },
    optionB: {
      id: 'B',
      text: 'Disclose the assistance honestly according to the assignment instructions.',
    },
    correctOption: 'B',
    explanation: 'If disclosure is required, hiding permitted AI assistance is still a breach of the stated instructions.',
  },
  {
    id: 'dec-05',
    number: 5,
    title: 'THE VIVA QUESTION',
    situation: 'During a presentation, I am asked to explain an argument in my report. I realise I cannot explain why I included it.',
    optionA: {
      id: 'A',
      text: 'Memorise an AI-generated explanation immediately and pretend I understand.',
    },
    optionB: {
      id: 'B',
      text: 'Revisit the argument, understand the reasoning, and correct the report if necessary.',
    },
    correctOption: 'B',
    explanation: 'Submitting work means taking responsibility for understanding and defending its content.',
  },
];
