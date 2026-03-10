import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState } from './game/types';
import { saveHighScore } from './game/scoreManager';
import { loadPokemonImage } from './pokemon/api';
import { calculateGachaPulls } from './pokemon/gacha';
import { usePokemonCollection } from './hooks/usePokemonCollection';
import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { CharacterSelect } from './components/CharacterSelect';
import { GachaScreen } from './components/GachaScreen';
import { PokedexScreen } from './components/PokedexScreen';

type AppScreen = 'game' | 'charselect' | 'pokedex' | 'gacha';

export default function App() {
  const [appScreen, setAppScreen] = useState<AppScreen>('game');
  const [gameState, setGameState] = useState<GameState>('start');
  const [, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const gameKeyRef = useRef(0);

  const { collection, add, select, refresh } = usePokemonCollection();
  const [pokemonImage, setPokemonImage] = useState<HTMLImageElement | null>(null);

  // Gacha state
  const [gachaPulls, setGachaPulls] = useState(0);

  // Load pokemon image when selectedId changes
  useEffect(() => {
    const id = collection.selectedId;
    if (id === 0) {
      setPokemonImage(null);
      return;
    }
    let cancelled = false;
    loadPokemonImage(id).then((img) => {
      if (!cancelled) setPokemonImage(img);
    }).catch(() => {
      if (!cancelled) setPokemonImage(null);
    });
    return () => { cancelled = true; };
  }, [collection.selectedId]);

  const handleStart = useCallback(() => {
    gameKeyRef.current += 1;
    setScore(0);
    setIsNewHighScore(false);
    setShowCelebration(false);
    setGameState('playing');
    setAppScreen('game');
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

    // Calculate gacha pulls
    const pulls = calculateGachaPulls(s, isNew);
    setGachaPulls(pulls);
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

  const handleCharSelect = useCallback(() => {
    setAppScreen('charselect');
  }, []);

  const handlePokedex = useCallback(() => {
    setAppScreen('pokedex');
  }, []);

  const handleCharConfirm = useCallback((id: number) => {
    select(id);
    setAppScreen('game');
  }, [select]);

  const handleBackToStart = useCallback(() => {
    setAppScreen('game');
  }, []);

  const handleStartGacha = useCallback(() => {
    setAppScreen('gacha');
  }, []);

  const handleGachaComplete = useCallback(() => {
    setAppScreen('game');
    refresh();
  }, [refresh]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GameScreen
        key={gameKeyRef.current}
        onScoreChange={handleScoreChange}
        onGameOver={handleGameOver}
        onStateChange={handleStateChange}
        gameState={gameState}
        pokemonImage={pokemonImage}
      />

      {appScreen === 'game' && gameState === 'start' && (
        <StartScreen
          onStart={handleStart}
          onCharSelect={handleCharSelect}
          onPokedex={handlePokedex}
          selectedPokemonId={collection.selectedId}
        />
      )}

      {appScreen === 'game' && gameState === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          isNewHighScore={isNewHighScore}
          onRetry={handleRetry}
          gachaPulls={gachaPulls}
          onGacha={handleStartGacha}
        />
      )}

      {appScreen === 'charselect' && (
        <CharacterSelect
          collection={collection}
          onSelect={handleCharConfirm}
          onBack={handleBackToStart}
        />
      )}

      {appScreen === 'gacha' && (
        <GachaScreen
          pulls={gachaPulls}
          ownedIds={collection.ownedIds}
          onAddPokemon={add}
          onComplete={handleGachaComplete}
        />
      )}

      {appScreen === 'pokedex' && (
        <PokedexScreen
          ownedIds={collection.ownedIds}
          onBack={handleBackToStart}
        />
      )}

      {showCelebration && (
        <CelebrationOverlay onComplete={handleCelebrationComplete} />
      )}
    </div>
  );
}
