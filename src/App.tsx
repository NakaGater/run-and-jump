import { useState, useCallback, useRef } from 'react';
import type { GameState } from './game/types';
import { saveHighScore } from './game/scoreManager';
import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { CelebrationOverlay } from './components/CelebrationOverlay';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const gameKeyRef = useRef(0);

  const handleStart = useCallback(() => {
    gameKeyRef.current += 1;
    setScore(0);
    setIsNewHighScore(false);
    setShowCelebration(false);
    setGameState('playing');
  }, []);

  const handleScoreChange = useCallback((s: number) => {
    setScore(s);
  }, []);

  const handleGameOver = useCallback((s: number) => {
    setFinalScore(s);
    const isNew = saveHighScore(s);
    setIsNewHighScore(isNew);
    if (isNew) {
      setShowCelebration(true);
    }
  }, []);

  const handleStateChange = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  const handleRetry = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GameScreen
        key={gameKeyRef.current}
        onScoreChange={handleScoreChange}
        onGameOver={handleGameOver}
        onStateChange={handleStateChange}
        gameState={gameState}
      />
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          isNewHighScore={isNewHighScore}
          onRetry={handleRetry}
        />
      )}
      {showCelebration && (
        <CelebrationOverlay onComplete={handleCelebrationComplete} />
      )}
    </div>
  );
}
