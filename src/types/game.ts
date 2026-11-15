export type ExhibitId = 'exhibit-01' | 'exhibit-02' | 'exhibit-03' | 'exhibit-04';
export type AppStep = 'intro' | ExhibitId | 'final-score';

export interface GameOption {
  id: string;
  label: string;
  sublabel?: string;
  description?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ExhibitData {
  id: ExhibitId;
  number: string;
  badge: string;
  title: string;
  headline: string;
  explanation: string[]; // 2-3 short sentences max
  takeaway: string;
  question: string;
  options: GameOption[];
}

export interface VisitorSessionState {
  step: AppStep;
  score: number;
  answers: Record<ExhibitId, string>; // exhibitId -> selectedOptionId
  results: Partial<Record<ExhibitId, { isCorrect: boolean; pointsEarned: number }>>;
  completedExhibits: ExhibitId[];
}
