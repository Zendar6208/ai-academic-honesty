import { useState, useEffect } from 'react';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/animations.css';
import './styles/layout.css';

import type { ExhibitId, GameOption, VisitorSessionState } from './types/game';
import { EXHIBITS } from './data/exhibitsData';
import { DigitalRain } from './components/Atmosphere/DigitalRain';
import { ButterflyPrelude } from './components/Opening/ButterflyPrelude';
import { CinematicOpening } from './components/Opening/CinematicOpening';
import { SubtleChapterProgress } from './components/Navigation/SubtleChapterProgress';
import { ChapterIndexDrawer } from './components/Header/ChapterIndexDrawer';
import { OpeningHeroScene } from './components/Sections/OpeningHeroScene';
import { ExhibitStage } from './components/Game/ExhibitStage';
import { FinalScoreScreen } from './components/Game/FinalScoreScreen';
import { Footer } from './components/Footer/Footer';
import { ResetConfirmModal } from './components/Game/ResetConfirmModal';
import { Analytics } from '@vercel/analytics/react';

interface SectionInfo {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: SectionInfo[] = [
  { id: 'scene-00', number: 'PROLOGUE', title: 'The Opening Provocation' },
  { id: 'exhibit-01', number: 'EXHIBIT 01', title: 'AI Tutor vs Substitute' },
  { id: 'exhibit-02', number: 'EXHIBIT 02', title: 'Citation Hallucination' },
  { id: 'exhibit-03', number: 'EXHIBIT 03', title: 'AI Detector Fallacy' },
  { id: 'exhibit-04', number: 'EXHIBIT 04', title: 'Transparency Standard' },
  { id: 'final-evaluation', number: 'FINALE', title: 'Evaluation & Score' },
  { id: 'archive-colophon', number: 'COLOPHON', title: 'Archive Colophon' }
];

const createFreshSessionState = (): VisitorSessionState => ({
  step: 'intro',
  score: 0,
  answers: {
    'exhibit-01': '',
    'exhibit-02': '',
    'exhibit-03': '',
    'exhibit-04': '',
  },
  results: {},
  completedExhibits: [],
});

type PreludeStage = 'butterfly' | 'revealing' | 'intro' | 'exhibition';

export function App() {
  const [preludeStage, setPreludeStage] = useState<PreludeStage>('butterfly');
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<SectionInfo>(SECTIONS[0]);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const [session, setSession] = useState<VisitorSessionState>(createFreshSessionState());
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [resetIndex, setResetIndex] = useState<number>(0);

  // Transition from cinematic intro to the continuous exhibition
  const handleEnterExperience = () => {
    setPreludeStage('exhibition');
    setHasEntered(true);
    setSession((prev) => ({
      ...prev,
      step: 'exhibit-01',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Development test helpers for automated verification
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as unknown as { __testApp?: unknown }).__testApp = {
        enterExhibition: () => handleEnterExperience(),
        setSession: (newSession: Partial<VisitorSessionState>) => {
          setSession((prev) => ({
            ...prev,
            ...newSession,
          }));
        },
        completeAllExhibits: (scores: [number, number, number, number] = [150, 0, 150, 150]) => {
          setPreludeStage('exhibition');
          setHasEntered(true);
          const total = Math.min(scores[0] + scores[1] + scores[2] + scores[3], 450);
          setSession({
            step: 'exhibit-04',
            score: total,
            answers: {
              'exhibit-01': 'completed_test',
              'exhibit-02': 'completed_test',
              'exhibit-03': 'completed_test',
              'exhibit-04': 'completed_test',
            },
            results: {
              'exhibit-01': { isCorrect: scores[0] >= 90, pointsEarned: scores[0] },
              'exhibit-02': { isCorrect: true, pointsEarned: 0 },
              'exhibit-03': { isCorrect: scores[2] >= 90, pointsEarned: scores[2] },
              'exhibit-04': { isCorrect: scores[3] >= 90, pointsEarned: scores[3] },
            },
            completedExhibits: ['exhibit-01', 'exhibit-02', 'exhibit-03', 'exhibit-04'],
          });
        },
        completeSingleExhibit: (exId: ExhibitId, score: number = 150) => {
          setPreludeStage('exhibition');
          setHasEntered(true);
          setSession((prev) => {
            const points = exId === 'exhibit-02' ? 0 : score;
            const updatedResults = {
              ...prev.results,
              [exId]: { isCorrect: points >= 90 || exId === 'exhibit-02', pointsEarned: points },
            };
            const updatedCompleted: ExhibitId[] = prev.completedExhibits.includes(exId)
              ? prev.completedExhibits
              : [...prev.completedExhibits, exId];
            return {
              ...prev,
              score: Math.min(
                Object.values(updatedResults).reduce((sum, r) => sum + (r?.pointsEarned || 0), 0),
                450
              ),
              results: updatedResults,
              completedExhibits: updatedCompleted,
            };
          });
        },
      };
    }
  }, []);

  // Track active section and scroll progress
  useEffect(() => {
    if (!hasEntered) return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }

      const scrollPos = window.scrollY + 220;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const elem = document.getElementById(SECTIONS[i].id);
        if (elem && elem.offsetTop <= scrollPos) {
          setCurrentSection(SECTIONS[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasEntered]);

  // Exhibit 01 real-time score updates (+15 PTS per correct question)
  const handleExhibit01ScoreUpdate = (pointsAdded: number) => {
    setSession((prev) => ({
      ...prev,
      score: Math.min(prev.score + pointsAdded, 450),
    }));
  };

  // Exhibit 01 completion
  const handleExhibit01Complete = (finalScore: number, totalCorrect: number) => {
    setSession((prev) => {
      const alreadyCompleted = prev.completedExhibits.includes('exhibit-01');
      const updatedResults = {
        ...prev.results,
        'exhibit-01': {
          isCorrect: finalScore >= 90,
          pointsEarned: finalScore,
        },
      };
      const updatedCompleted: ExhibitId[] = alreadyCompleted
        ? prev.completedExhibits
        : [...prev.completedExhibits, 'exhibit-01'];

      const totalScore = Object.values(updatedResults).reduce(
        (sum, r) => sum + (r?.pointsEarned || 0),
        0
      );

      const areAllScoredComplete = ['exhibit-01', 'exhibit-03', 'exhibit-04'].every((id) =>
        updatedCompleted.includes(id as ExhibitId)
      );

      if (areAllScoredComplete && !alreadyCompleted) {
        setTimeout(() => {
          const elem = document.getElementById('final-evaluation');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }

      return {
        ...prev,
        score: Math.min(totalScore, 450),
        answers: {
          ...prev.answers,
          'exhibit-01': `completed_${totalCorrect}_of_10`,
        },
        results: updatedResults,
        completedExhibits: updatedCompleted,
      };
    });
  };

  // Exhibit 02 real-time score updates (Exhibit 02 is educational, 0 PTS)
  const handleExhibit02ScoreUpdate = (_pointsAdded: number) => {
    // No points awarded for Exhibit 02
  };

  // Exhibit 02 completion (Educational only, 0 PTS)
  const handleExhibit02Complete = () => {
    setSession((prev) => {
      const alreadyCompleted = prev.completedExhibits.includes('exhibit-02');
      const updatedResults = {
        ...prev.results,
        'exhibit-02': {
          isCorrect: true,
          pointsEarned: 0,
        },
      };
      const updatedCompleted: ExhibitId[] = alreadyCompleted
        ? prev.completedExhibits
        : [...prev.completedExhibits, 'exhibit-02'];

      const totalScore = Object.values(updatedResults).reduce(
        (sum, r) => sum + (r?.pointsEarned || 0),
        0
      );

      return {
        ...prev,
        score: Math.min(totalScore, 450),
        answers: {
          ...prev.answers,
          'exhibit-02': 'educational_concluded',
        },
        results: updatedResults,
        completedExhibits: updatedCompleted,
      };
    });
  };

  // Exhibit 03 real-time score updates (+15 PTS per correct situation)
  const handleExhibit03ScoreUpdate = (pointsAdded: number) => {
    setSession((prev) => ({
      ...prev,
      score: Math.min(prev.score + pointsAdded, 450),
    }));
  };

  // Exhibit 03 completion
  const handleExhibit03Complete = (finalScore: number, isVerdictCorrect: boolean) => {
    setSession((prev) => {
      const alreadyCompleted = prev.completedExhibits.includes('exhibit-03');
      const updatedResults = {
        ...prev.results,
        'exhibit-03': {
          isCorrect: isVerdictCorrect,
          pointsEarned: finalScore,
        },
      };
      const updatedCompleted: ExhibitId[] = alreadyCompleted
        ? prev.completedExhibits
        : [...prev.completedExhibits, 'exhibit-03'];

      const totalScore = Object.values(updatedResults).reduce(
        (sum, r) => sum + (r?.pointsEarned || 0),
        0
      );

      const areAllScoredComplete = ['exhibit-01', 'exhibit-03', 'exhibit-04'].every((id) =>
        updatedCompleted.includes(id as ExhibitId)
      );

      if (areAllScoredComplete && !alreadyCompleted) {
        setTimeout(() => {
          const elem = document.getElementById('final-evaluation');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }

      return {
        ...prev,
        score: Math.min(totalScore, 450),
        answers: {
          ...prev.answers,
          'exhibit-03': `swipe_score_${finalScore}`,
        },
        results: updatedResults,
        completedExhibits: updatedCompleted,
      };
    });
  };

  // Exhibit 04 real-time score updates (+10 or +8/9 PTS per stage action)
  const handleExhibit04ScoreUpdate = (pointsAdded: number) => {
    setSession((prev) => ({
      ...prev,
      score: Math.min(prev.score + pointsAdded, 450),
    }));
  };

  // Exhibit 04 completion
  const handleExhibit04Complete = (finalScore: number, isVerdictCorrect: boolean) => {
    setSession((prev) => {
      const alreadyCompleted = prev.completedExhibits.includes('exhibit-04');
      const updatedResults = {
        ...prev.results,
        'exhibit-04': {
          isCorrect: isVerdictCorrect,
          pointsEarned: finalScore,
        },
      };
      const updatedCompleted: ExhibitId[] = alreadyCompleted
        ? prev.completedExhibits
        : [...prev.completedExhibits, 'exhibit-04'];

      const totalScore = Object.values(updatedResults).reduce(
        (sum, r) => sum + (r?.pointsEarned || 0),
        0
      );

      const areAllScoredComplete = ['exhibit-01', 'exhibit-03', 'exhibit-04'].every((id) =>
        updatedCompleted.includes(id as ExhibitId)
      );

      if (areAllScoredComplete && !alreadyCompleted) {
        setTimeout(() => {
          const elem = document.getElementById('final-evaluation');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }

      return {
        ...prev,
        score: Math.min(totalScore, 450),
        answers: {
          ...prev.answers,
          'exhibit-04': `workflow_repaired_${finalScore}`,
        },
        results: updatedResults,
        completedExhibits: updatedCompleted,
      };
    });
  };

  // Option selection in an exhibit (Legacy fallback)
  const handleSelectOption = (exhibitId: ExhibitId, option: GameOption) => {
    // All exhibits manage scoring directly through their interactive challenges
    if (
      exhibitId === 'exhibit-01' ||
      exhibitId === 'exhibit-02' ||
      exhibitId === 'exhibit-03' ||
      exhibitId === 'exhibit-04'
    )
      return;

    // Prevent duplicate submissions or double point awards
    if (session.answers[exhibitId]) return;

    const basePoints = option.isCorrect ? 100 : 25;
    const bonusPoints = 50; // Exhibit completion bonus
    const totalPointsEarned = basePoints + bonusPoints;

    setSession((prev) => {
      const newScore = Math.min(prev.score + totalPointsEarned, 450);

      return {
        ...prev,
        score: newScore,
        answers: {
          ...prev.answers,
          [exhibitId]: option.id,
        },
        results: {
          ...prev.results,
          [exhibitId]: {
            isCorrect: option.isCorrect,
            pointsEarned: totalPointsEarned,
          },
        },
        completedExhibits: prev.completedExhibits.includes(exhibitId)
          ? prev.completedExhibits
          : [...prev.completedExhibits, exhibitId],
      };
    });
  };

  // Smooth scroll to next exhibit or finale
  const handleContinue = (currentExhibitId: ExhibitId) => {
    const exhibitSequence: ExhibitId[] = [
      'exhibit-01',
      'exhibit-02',
      'exhibit-03',
      'exhibit-04',
    ];
    const currentIndex = exhibitSequence.indexOf(currentExhibitId);

    if (currentIndex >= 0 && currentIndex < exhibitSequence.length - 1) {
      const nextExhibitId = exhibitSequence[currentIndex + 1];
      const elem = document.getElementById(nextExhibitId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const finaleElem = document.getElementById('final-evaluation');
      if (finaleElem) {
        finaleElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Reset session for a new visitor (Zero points, fresh answers, return to Butterfly Prelude)
  const handleConfirmReset = () => {
    setSession(createFreshSessionState());
    setHasEntered(false);
    setPreludeStage('butterfly');
    setCurrentSection(SECTIONS[0]);
    setScrollProgress(0);
    setDrawerOpen(false);
    setIsResetModalOpen(false);
    setResetIndex((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="archive-canvas" style={{ backgroundColor: '#000000' }}>
      {/* Background Matrix Digital Rain: disabled during butterfly prelude, active after awakening */}
      <DigitalRain
        opacity={preludeStage === 'exhibition' ? 0.22 : 0.45}
        active={preludeStage !== 'butterfly'}
      />

      {/* 0. Cinematic Butterfly Prelude (Pitch-black awakening scene) */}
      {(preludeStage === 'butterfly' || preludeStage === 'revealing') && (
        <ButterflyPrelude
          key={`prelude-${resetIndex}`}
          onRevealStart={() => setPreludeStage('revealing')}
          onAwaken={() => setPreludeStage('intro')}
        />
      )}

      {/* 1. Cinematic Matrix Introduction Screen */}
      {preludeStage === 'intro' && !hasEntered && (
        <CinematicOpening
          key={`intro-${resetIndex}`}
          onEnter={handleEnterExperience}
        />
      )}

      {/* 2. Continuous Vertically Stacked Exhibition (Active after entering) */}
      {hasEntered && (
        <div key={`exhibition-session-${resetIndex}`} className="archive-content-layer animate-reveal">
          
          {/* Subtle Fixed Chapter Progress Header */}
          <SubtleChapterProgress
            currentSectionId={currentSection.id}
            currentSectionNumber={currentSection.number}
            currentSectionTitle={currentSection.title}
            scrollProgress={scrollProgress}
            score={session.score}
            onResetClick={() => setIsResetModalOpen(true)}
            onOpenIndex={() => setDrawerOpen(true)}
          />

          {/* Chapter Dossier Drawer (Index) */}
          <ChapterIndexDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onSelectChapter={(index) => {
              setDrawerOpen(false);
              const target = SECTIONS[Math.min(index + 1, SECTIONS.length - 1)];
              const elem = document.getElementById(target.id);
              if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            activeChapterIndex={0}
          />

          {/* Main Exhibition Sections */}
          <main id="main-content">
            {/* Scene 00: Monumental Second-Screen Layout (Headline + Manuscript + Hero Slot) */}
            <OpeningHeroScene />

            {/* Exhibit 01: Cognitive Agency (AI Tutor vs AI Substitute) */}
            <ExhibitStage
              key={`exhibit-01-${resetIndex}`}
              data={EXHIBITS[0]}
              selectedOptionId={session.answers['exhibit-01']}
              result={session.results['exhibit-01']}
              onSelectOption={(option) => handleSelectOption('exhibit-01', option)}
              onContinue={() => handleContinue('exhibit-01')}
              nextExhibitTitle="EXHIBIT 02: SOURCE INTEGRITY"
              isLastExhibit={false}
              onExhibit01ScoreUpdate={handleExhibit01ScoreUpdate}
              onExhibit01Complete={handleExhibit01Complete}
            />

            {/* Exhibit 02: Source Integrity (The Citation Hallucination) */}
            <ExhibitStage
              key={`exhibit-02-${resetIndex}`}
              data={EXHIBITS[1]}
              selectedOptionId={session.answers['exhibit-02']}
              result={session.results['exhibit-02']}
              onSelectOption={(option) => handleSelectOption('exhibit-02', option)}
              onContinue={() => handleContinue('exhibit-02')}
              nextExhibitTitle="EXHIBIT 03: DETECTOR FALLACIES"
              isLastExhibit={false}
              onExhibit02ScoreUpdate={handleExhibit02ScoreUpdate}
              onExhibit02Complete={handleExhibit02Complete}
            />

            {/* Exhibit 03: Evaluation Limits (The AI Detector Fallacy) */}
            <ExhibitStage
              key={`exhibit-03-${resetIndex}`}
              data={EXHIBITS[2]}
              selectedOptionId={session.answers['exhibit-03']}
              result={session.results['exhibit-03']}
              onSelectOption={(option) => handleSelectOption('exhibit-03', option)}
              onContinue={() => handleContinue('exhibit-03')}
              nextExhibitTitle="EXHIBIT 04: ETHICAL ATTRIBUTION"
              isLastExhibit={false}
              onExhibit03ScoreUpdate={handleExhibit03ScoreUpdate}
              onExhibit03Complete={handleExhibit03Complete}
            />

            {/* Exhibit 04: Ethical Practice (Repair the Workflow) */}
            <ExhibitStage
              key={`exhibit-04-${resetIndex}`}
              data={EXHIBITS[3]}
              selectedOptionId={session.answers['exhibit-04']}
              result={session.results['exhibit-04']}
              onSelectOption={(option) => handleSelectOption('exhibit-04', option)}
              onContinue={() => handleContinue('exhibit-04')}
              nextExhibitTitle="FINAL EVALUATION & SCORE"
              isLastExhibit={true}
              onExhibit04ScoreUpdate={handleExhibit04ScoreUpdate}
              onExhibit04Complete={handleExhibit04Complete}
            />

            {/* Final Evaluation & Score Showcase */}
            <FinalScoreScreen
              score={session.score}
              maxScore={450}
              exhibits={EXHIBITS}
              results={session.results}
              completedExhibits={session.completedExhibits}
              onRestart={() => setIsResetModalOpen(true)}
              onNavigateToExhibit={(exhibitId) => {
                const target =
                  document.getElementById(`${exhibitId}-activity`) ||
                  document.getElementById(exhibitId);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </main>

          {/* Original 3-Column Documentary Finale & Academic Colophon */}
          <div id="archive-colophon">
            <Footer />
          </div>
        </div>
      )}

      {/* New Visitor Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <Analytics />
    </div>
  );
}

export default App;
