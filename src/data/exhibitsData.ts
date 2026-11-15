import type { ExhibitData } from '../types/game';

export const EXHIBITS: ExhibitData[] = [
  {
    id: 'exhibit-01',
    number: '01',
    badge: 'EXHIBIT 01 // COGNITIVE AGENCY',
    title: 'AI Tutor vs AI Substitute',
    headline: 'Fluency Is Not Comprehension.',
    explanation: [
      'Getting an answer and understanding an answer are two fundamentally different cognitive processes.',
      'When an AI generates the entire solution, you bypass the mental struggle where authentic mastery is formed.'
    ],
    takeaway: 'Use AI to challenge your thinking, not replace it.',
    question: "You have a difficult programming assignment. You've tried solving it yourself, but you're stuck on an important part of the logic. You have access to an AI assistant. What would you do?",
    options: [
      {
        id: 'opt-substitute',
        label: 'Get The Answer',
        sublabel: 'Option A',
        description: 'Ask AI to generate the entire solution, copy it into your assignment and move on.',
        isCorrect: false,
        explanation: 'Copying an AI-generated solution leaves you unable to defend the code during oral viva evaluations or adapt the logic to unfamiliar problems.'
      },
      {
        id: 'opt-tutor',
        label: 'Understand The Problem',
        sublabel: 'Option B',
        description: 'Show AI your attempt, ask it to identify mistakes and explain the concepts, then complete the solution yourself.',
        isCorrect: true,
        explanation: 'By using AI as an intellectual sparring partner while writing the final solution yourself, you build authentic comprehension that you can confidently defend.'
      }
    ]
  },
  {
    id: 'exhibit-02',
    number: '02',
    badge: 'EXHIBIT 02 // SOURCE INTEGRITY',
    title: 'The Citation Hallucination',
    headline: 'Plausible Syntax Can Be Pure Fiction.',
    explanation: [
      'Large language models predict words that sound convincing together—they do not verify facts against academic libraries.',
      'As a result, AI can invent believable authors, journals, and DOI identifiers that do not correspond to any real publication.'
    ],
    takeaway: 'An academic citation can look completely legitimate without corresponding to a real publication.',
    question: 'Examine the academic reference specimen in the archive viewer. Does it represent a verified research paper or an AI fabrication?',
    options: [
      {
        id: 'opt-fabricated',
        label: 'Fabricated Reference',
        sublabel: 'AI Hallucination',
        description: 'A hallucinated citation generated from statistical word patterns, with no real publication record.',
        isCorrect: true,
        explanation: 'Correct! AI predicts plausible phrasing rather than querying research databases. Always verify citations against scholarly registries before referencing them.'
      },
      {
        id: 'opt-real',
        label: 'Genuine Publication',
        sublabel: 'Verified Source',
        description: 'An authentic paper indexed in peer-reviewed scholarly databases and publisher archives.',
        isCorrect: false,
        explanation: 'Incorrect. Although the authors, title format, and DOI look realistic, this publication is entirely fictional.'
      }
    ]
  },
  {
    id: 'exhibit-03',
    number: '03',
    badge: 'EXHIBIT 03 // EVALUATION LIMITS',
    title: 'The AI Detector Fallacy',
    headline: 'Detectors Estimate Patterns, Not Honesty.',
    explanation: [
      'AI detectors measure statistical predictability and sentence uniformity, not author identity or intent.',
      'Because formal human academic writing is naturally structured, detectors frequently flag honest work as machine-generated.'
    ],
    takeaway: 'Detector scores are statistical estimates, not proof. Fair assessment requires human dialogue and revision evidence.',
    question: 'An automated tool flags a student essay with an 88% probability score. What is the fair response?',
    options: [
      {
        id: 'opt-interview',
        label: 'Investigate With Evidence',
        sublabel: 'Evidence & Dialogue',
        description: 'Review version history, draft notes, and interview the student to discuss their reasoning.',
        isCorrect: true,
        explanation: 'Correct! Detector scores are statistical estimates, not proof. Fair academic evaluation requires reviewing project drafts, discussing reasoning, and looking at concrete evidence.'
      },
      {
        id: 'opt-penalize',
        label: 'Penalize Immediately',
        sublabel: 'Automated Penalty',
        description: 'Treat the score as conclusive proof of cheating and apply an automatic academic penalty.',
        isCorrect: false,
        explanation: 'Incorrect. Detectors regularly mislabel formal human writing. Disciplining a student based solely on a score risks falsely penalizing honest work.'
      }
    ]
  },
  {
    id: 'exhibit-04',
    number: '04',
    badge: 'EXHIBIT 04 // ETHICAL PRACTICE',
    title: 'The Transparency Standard',
    headline: 'Academic Honesty Is About Attribution, Not Secrecy.',
    explanation: [
      'Academic integrity does not mean banning new tools—it means being transparent about how you use them.',
      'When AI assists your research, disclose its role, verify every claim independently, and take full responsibility for the final submission.'
    ],
    takeaway: 'Use AI to support your thinking, never to replace your responsibility.',
    question: 'You used an AI assistant to brainstorm ideas and debug a complex algorithm in your research. What is the ethical approach?',
    options: [
      {
        id: 'opt-disclose',
        label: 'Disclose And Verify',
        sublabel: 'Ethical Attribution',
        description: 'Acknowledge the tool assistance, verify all derivations independently, and take full ownership.',
        isCorrect: true,
        explanation: 'Correct! Academic honesty is about attribution, not secrecy. Disclosing computational help and verifying the results demonstrates scholarly maturity.'
      },
      {
        id: 'opt-hide',
        label: 'Conceal The Usage',
        sublabel: 'Concealment',
        description: 'Hide the AI assistance to avoid scrutiny, assuming that using technology should remain a secret.',
        isCorrect: false,
        explanation: 'Incorrect. Concealing AI assistance violates academic transparency. True academic integrity relies on openness about tools and methodology.'
      }
    ]
  }
];
