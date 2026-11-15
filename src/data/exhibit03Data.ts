export interface SwipeSituation {
  id: string;
  number: number; // 1 through 10
  level: 1 | 2 | 3;
  levelTitle: string;
  scenarioTitle: string;
  situationText: string;
  isEthical: boolean;
  explanation: string;
  category: 'AGENCY' | 'VERIFICATION_POLICY' | 'NUANCED_PRACTICE';
  iconType: 'code' | 'dialogue' | 'citation' | 'library' | 'policy_ban' | 'drafts' | 'group' | 'paraphrase' | 'debugging' | 'exam';
}

export interface LevelInfo {
  level: 1 | 2 | 3;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  rangeText: string;
  maxPoints: number;
}

export const EXHIBIT_03_LEVELS: Record<1 | 2 | 3, LevelInfo> = {
  1: {
    level: 1,
    name: 'First Impressions',
    badge: 'LEVEL 01 // FIRST IMPRESSIONS',
    subtitle: 'Cognitive Agency & Authentic Effort',
    description: 'Decide where responsible AI tutoring ends and intellectual delegation begins in everyday student coursework.',
    rangeText: 'Situations 1–3',
    maxPoints: 45,
  },
  2: {
    level: 2,
    name: 'Look Closer',
    badge: 'LEVEL 02 // LOOK CLOSER',
    subtitle: 'Policy, Verification & Transparency',
    description: 'Navigate syllabus guidelines, literature verification, attribution logs, and ethical collaboration in group projects.',
    rangeText: 'Situations 4–7',
    maxPoints: 60,
  },
  3: {
    level: 3,
    name: 'Difficult Judgements',
    badge: 'LEVEL 03 // DIFFICULT JUDGEMENTS',
    subtitle: 'Paraphrasing, Debugging & Assessments',
    description: 'Address subtle academic grey areas where the line between legitimate tool assistance and misconduct requires personal integrity.',
    rangeText: 'Situations 8–10',
    maxPoints: 45,
  },
};

export const SWIPE_SITUATIONS: SwipeSituation[] = [
  // =========================================================================
  // LEVEL 01 — FIRST IMPRESSIONS (Situations 1–3)
  // =========================================================================
  {
    id: 'sit-01',
    number: 1,
    level: 1,
    levelTitle: 'LEVEL 01: FIRST IMPRESSIONS',
    scenarioTitle: 'The Variable Rename',
    situationText:
      'I ask AI to complete my programming assignment, rename a few variables and functions to make it look original, and submit the code as entirely my own work.',
    isEthical: false,
    explanation:
      'Submitting AI-generated code as your own work misrepresents authorship and deprives you of learning the algorithmic concepts you need to understand.',
    category: 'AGENCY',
    iconType: 'code',
  },
  {
    id: 'sit-02',
    number: 2,
    level: 1,
    levelTitle: 'LEVEL 01: FIRST IMPRESSIONS',
    scenarioTitle: 'The Conceptual Sparring Partner',
    situationText:
      'I am stuck on a complex theoretical concept. I ask AI to explain it with a real-world analogy, then close the chat window and write my own essay explanation from scratch.',
    isEthical: true,
    explanation:
      'Using AI as a tutor to clarify difficult concepts while drafting the final work independently preserves authentic comprehension and academic integrity.',
    category: 'AGENCY',
    iconType: 'dialogue',
  },
  {
    id: 'sit-03',
    number: 3,
    level: 1,
    levelTitle: 'LEVEL 01: FIRST IMPRESSIONS',
    scenarioTitle: 'The Unchecked Bibliography',
    situationText:
      'I need three more academic citations before midnight, so I ask AI to list relevant papers with author names and DOIs, copying them directly into my bibliography without checking if they exist.',
    isEthical: false,
    explanation:
      'AI frequently invents plausible-sounding citations. Citing sources you have not independently located and verified is academic fabrication.',
    category: 'AGENCY',
    iconType: 'citation',
  },

  // =========================================================================
  // LEVEL 02 — LOOK CLOSER (Situations 4–7)
  // =========================================================================
  {
    id: 'sit-04',
    number: 4,
    level: 2,
    levelTitle: 'LEVEL 02: LOOK CLOSER',
    scenarioTitle: 'Verified Literature Scaffolding',
    situationText:
      'My syllabus permits AI for research brainstorming. I ask AI for potential papers on renewable energy, but I download, read, and verify every paper in the university library database before citing it.',
    isEthical: true,
    explanation:
      'Using AI to discover reading leads is responsible when permitted by course policy and combined with rigorous, independent verification of the actual literature.',
    category: 'VERIFICATION_POLICY',
    iconType: 'library',
  },
  {
    id: 'sit-05',
    number: 5,
    level: 2,
    levelTitle: 'LEVEL 02: LOOK CLOSER',
    scenarioTitle: 'Bypassing Course Policy',
    situationText:
      'I use AI to rephrase and polish the grammar of my literature review, even though my course syllabus explicitly states that all AI assistance is strictly prohibited for this foundational writing task.',
    isEthical: false,
    explanation:
      'Even if an AI tool only modifies grammar or phrasing, using it in direct contradiction to explicit course instructions violates academic honesty rules.',
    category: 'VERIFICATION_POLICY',
    iconType: 'policy_ban',
  },
  {
    id: 'sit-06',
    number: 6,
    level: 2,
    levelTitle: 'LEVEL 02: LOOK CLOSER',
    scenarioTitle: 'Attributed Process Log',
    situationText:
      'I use an AI assistant to critique the structure of my argument. In my final submission, I include an attribution note describing how I used AI and attach my initial unedited draft.',
    isEthical: true,
    explanation:
      'Transparent attribution and document history demonstrate intellectual honesty, showing evaluators exactly where AI feedback began and your own thinking took over.',
    category: 'VERIFICATION_POLICY',
    iconType: 'drafts',
  },
  {
    id: 'sit-07',
    number: 7,
    level: 2,
    levelTitle: 'LEVEL 02: LOOK CLOSER',
    scenarioTitle: 'The Silent Group Partner',
    situationText:
      'In a 4-person group project, I use AI to write my assigned section without telling my teammates, letting them believe I researched and wrote the analysis myself.',
    isEthical: false,
    explanation:
      "Submitting AI-generated work to a shared group assignment without your teammates' consent misrepresents your contribution and puts the whole team at academic risk.",
    category: 'VERIFICATION_POLICY',
    iconType: 'group',
  },

  // =========================================================================
  // LEVEL 03 — DIFFICULT JUDGEMENTS (Situations 8–10)
  // =========================================================================
  {
    id: 'sit-08',
    number: 8,
    level: 3,
    levelTitle: 'LEVEL 03: DIFFICULT JUDGEMENTS',
    scenarioTitle: 'Unacknowledged Paraphrasing',
    situationText:
      'I ask AI to outline an original thesis argument on ethics. I find its argument compelling, so I paraphrase its points almost sentence-for-sentence in my essay without citing the AI source.',
    isEthical: false,
    explanation:
      "Ideas and argumentative structures require attribution. Paraphrasing an AI's structured argument without acknowledgement constitutes uncredited idea appropriation.",
    category: 'NUANCED_PRACTICE',
    iconType: 'paraphrase',
  },
  {
    id: 'sit-09',
    number: 9,
    level: 3,
    levelTitle: 'LEVEL 03: DIFFICULT JUDGEMENTS',
    scenarioTitle: 'Algorithmic Debugging vs. Generation',
    situationText:
      "I wrote 150 lines of code but have an index error I cannot find. I paste my code into AI asking 'why am I getting OutOfBounds on line 42?', read the diagnostic hint, and fix the loop condition myself.",
    isEthical: true,
    explanation:
      'Using AI to diagnose a specific bug in code you authored yourself mirrors using a compiler diagnostic or debugger, preserving authentic problem-solving.',
    category: 'NUANCED_PRACTICE',
    iconType: 'debugging',
  },
  {
    id: 'sit-10',
    number: 10,
    level: 3,
    levelTitle: 'LEVEL 03: DIFFICULT JUDGEMENTS',
    scenarioTitle: 'The Synthetic Practice Exam',
    situationText:
      'During an unproctored open-book online quiz meant to test my personal recall and speed, I keep an AI tab open to instantly check multiple-choice questions before selecting my answers.',
    isEthical: false,
    explanation:
      'Open-book policies generally allow course texts and personal notes, not live query-response generation. Using AI to choose answers during an assessment defeats individual evaluation.',
    category: 'NUANCED_PRACTICE',
    iconType: 'exam',
  },
];
