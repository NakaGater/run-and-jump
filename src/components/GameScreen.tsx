import { useEffect, useRef, useCallback, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import type { GameState } from '../game/types';
import { ScoreDisplay } from './ScoreDisplay';
import { JumpButton } from './JumpButton';

interface Props {
  onScoreChange: (score: number) => void;
  onGameOver: (score: number) => void;
  onStateChange: (state: GameState) => void;
  gameState: GameState;
  pokemonImage?: HTMLImageElement | null;
}

export function GameScreen({ onScoreChange, onGameOver, onStateChange, gameState, pokemonImage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayScore, setDisplayScore] = useState(0);

  // Store latest callbacks in refs to avoid recreating engine
  const callbacksRef = useRef({ onScoreChange, onGameOver, onStateChange });
  callbacksRef.current = { onScoreChange, onGameOver, onStateChange };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = new GameEngine(canvas, {
      onScoreChange: (s: number) => {
        setDisplayScore(s);
        callbacksRef.current.onScoreChange(s);
      },
      onGameOver: (s: number) => callbacksRef.current.onGameOver(s),
      onStateChange: (st: GameState) => callbacksRef.current.onStateChange(st),
    });
    engineRef.current = engine;

    const resize = () => {
      const container = containerRef.current!;
      engine.resizeCanvas(container.clientWidth, container.clientHeight);
      if (engine.state === 'start') {
        engine.renderIdle();
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current!);
    resize();
    engine.renderIdle();

    return () => {
      observer.disconnect();
      engine.destroy();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.spriteConfig = pokemonImage
        ? { mode: 'pokemon', image: pokemonImage }
        : { mode: 'pixelart' };
      if (engineRef.current.state === 'start') {
        engineRef.current.renderIdle();
      }
    }
  }, [pokemonImage]);

  useEffect(() => {
    if (gameState === 'playing' && engineRef.current && engineRef.current.state !== 'playing') {
      engineRef.current.start();
    }
  }, [gameState]);

  const handleJumpPress = useCallback(() => {
    engineRef.current?.jumpPress();
  }, []);

  const handleJumpRelease = useCallback(() => {
    engineRef.current?.jumpRelease();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          imageRendering: pokemonImage ? 'auto' : 'pixelated',
        }}
      />
      {gameState === 'playing' && (
        <>
          <ScoreDisplay score={displayScore} />
          <JumpButton onPress={handleJumpPress} onRelease={handleJumpRelease} />
        </>
      )}
    </div>
  );
}
