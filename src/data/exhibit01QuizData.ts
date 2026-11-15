export interface QuizOption {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export const EXHIBIT_01_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "You're stuck on a programming assignment. How should you use AI to help you learn?",
    options: [
      {
        letter: 'A',
        text: 'Ask AI to generate the complete solution and submit it.',
        isCorrect: false,
      },
      {
        letter: 'B',
        text: 'Copy its code and change a few variable names.',
        isCorrect: false,
      },
      {
        letter: 'C',
        text: "Share your attempt and ask AI for hints about where you're going wrong.",
        isCorrect: true,
      },
      {
        letter: 'D',
        text: 'Submit the first solution AI produces without testing it.',
        isCorrect: false,
      },
    ],
    explanation: "Asking for hints helps you identify mistakes while keeping you actively involved in solving the problem.",
  },
  {
    id: 2,
    question: "AI gives you a polished mathematical proof, but you cannot explain one of its steps. What should you do?",
    options: [
      {
        letter: 'A',
        text: 'Understand the missing step, verify the reasoning and derive the proof yourself.',
        isCorrect: true,
      },
      {
        letter: 'B',
        text: 'Submit it because the proof looks mathematically correct.',
        isCorrect: false,
      },
      {
        letter: 'C',
        text: 'Remove the confusing step and submit the rest.',
        isCorrect: false,
      },
      {
        letter: 'D',
        text: 'Claim the entire proof as your own work.',
        isCorrect: false,
      },
    ],
    explanation: "You should understand and verify every step before taking responsibility for the work you submit.",
  },
  {
    id: 3,
    question: "AI suggests an algorithm for your assignment. What should you do before using it?",
    options: [
      {
        letter: 'A',
        text: 'Accept it because AI has read more code than you.',
        isCorrect: false,
      },
      {
        letter: 'B',
        text: 'Choose it because its explanation is lengthy.',
        isCorrect: false,
      },
      {
        letter: 'C',
        text: 'Submit it immediately if the code compiles.',
        isCorrect: false,
      },
      {
        letter: 'D',
        text: 'Test different inputs, check edge cases and understand its complexity.',
        isCorrect: true,
      },
    ],
    explanation: "Code that compiles is not necessarily correct. Testing and understanding the algorithm are essential.",
  },
  {
    id: 4,
    question: "AI helps you debug a difficult programming problem. Which approach demonstrates genuine ownership?",
    options: [
      {
        letter: 'A',
        text: 'Submit the suggested changes without examining them.',
        isCorrect: false,
      },
      {
        letter: 'B',
        text: 'Understand the changes, test them and be able to explain why they work.',
        isCorrect: true,
      },
      {
        letter: 'C',
        text: 'Remove the comments so nobody notices AI assistance.',
        isCorrect: false,
      },
      {
        letter: 'D',
        text: 'Assume the code is correct because AI generated it.',
        isCorrect: false,
      },
    ],
    explanation: "Using AI for debugging can support learning, but you remain responsible for the code you submit.",
  },
  {
    id: 5,
    question: "AI gives you two possible solutions to a programming problem. How should you choose?",
    options: [
      {
        letter: 'A',
        text: 'Always choose the shorter solution.',
        isCorrect: false,
      },
      {
        letter: 'B',
        text: 'Always choose the first solution generated.',
        isCorrect: false,
      },
      {
        letter: 'C',
        text: "Compare correctness, efficiency and the problem's requirements.",
        isCorrect: true,
      },
      {
        letter: 'D',
        text: 'Ask AI to choose randomly.',
        isCorrect: false,
      },
    ],
    explanation: "A good solution must satisfy the problem's requirements, not simply look shorter or more sophisticated.",
  },
  {
    id: 6,
    question: "AI uses a mathematical theorem in your assignment, but you're unsure whether its conditions apply. What should you do?",
    options: [
      {
        letter: 'A',
        text: 'Check the theorem\'s assumptions and verify that they hold in your problem.',
        isCorrect: true,
      },
      {
        letter: 'B',
        text: 'Accept the theorem because AI sounds confident.',
        isCorrect: false,
      },
      {
        letter: 'C',
        text: 'Remove the assumptions from the explanation.',
        isCorrect: false,
      },
      {
        letter: 'D',
        text: 'Submit it without checking.',
        isCorrect: false,
      },
    ],
    explanation: "A theorem is valid only when its required conditions are satisfied.",
  },
  {
    id: 7,
    question: "Your course permits AI-generated explanations but does not permit submitting AI-generated solutions. What should you do?",
    options: [
      {
        letter: 'A',
        text: 'Ask AI to complete the assignment and conceal its involvement.',
        isCorrect: false,
      },
      {
        letter: 'B',
        text: 'Generate the solution and change the wording.',
        isCorrect: false,
      },
      {
        letter: 'C',
        text: 'Ignore the course instructions if the answer is correct.',
        isCorrect: false,
      },
      {
        letter: 'D',
        text: 'Use AI for permitted explanations while completing the solution yourself.',
        isCorrect: true,
      },
    ],
    explanation: "Responsible AI use means respecting the rules of the assignment and doing the work you are expected to do.",
  },
  {
    id: 8,
    question: "You copy an AI-generated explanation into your assignment but cannot explain what it means. What is the biggest problem?",
    options: [
      {
        letter: 'A',
        text: 'The explanation might use complicated vocabulary.',
        isCorrect: false,
      },
      {
        letter: 'B',
        text: 'You cannot independently verify or defend the work you submitted.',
        isCorrect: true,
      },
      {
        letter: 'C',
        text: 'The answer might be longer than necessary.',
        isCorrect: false,
      },
      {
        letter: 'D',
        text: 'The formatting might not match the assignment.',
        isCorrect: false,
      },
    ],
    explanation: "Submitting something you cannot understand creates a gap between the appearance of knowledge and actual understanding.",
  },
  {
    id: 9,
    question: "AI suggests a correction to your program. It passes one basic test, but you haven't checked other cases. What should you do?",
    options: [
      {
        letter: 'A',
        text: 'Submit it immediately.',
        isCorrect: false,
      },
      {
        letter: 'B',
        text: 'Assume AI already checked every possibility.',
        isCorrect: false,
      },
      {
        letter: 'C',
        text: 'Test edge cases and understand why the correction works.',
        isCorrect: true,
      },
      {
        letter: 'D',
        text: 'Remove the tests to avoid errors.',
        isCorrect: false,
      },
    ],
    explanation: "Passing one test does not guarantee correctness. Edge cases can reveal problems that ordinary inputs miss.",
  },
  {
    id: 10,
    question: "Which approach best represents using AI as a tutor rather than a substitute?",
    options: [
      {
        letter: 'A',
        text: 'Develop your own solution, use AI to challenge your reasoning, verify its suggestions and explain the final result yourself.',
        isCorrect: true,
      },
      {
        letter: 'B',
        text: 'Ask AI to complete the task and read its answer once.',
        isCorrect: false,
      },
      {
        letter: 'C',
        text: 'Copy the generated answer and submit it.',
        isCorrect: false,
      },
      {
        letter: 'D',
        text: 'Let AI decide which parts of the assignment you need to understand.',
        isCorrect: false,
      },
    ],
    explanation: "AI should strengthen your reasoning and understanding, not replace the thinking required to complete your work.",
  },
];
