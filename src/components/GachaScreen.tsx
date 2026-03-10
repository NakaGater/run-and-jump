import { useState, useEffect, useRef, useCallback } from 'react';
import { rollGacha } from '../pokemon/gacha';
import { getSpriteUrl, fetchPokemonData } from '../pokemon/api';
import type { PokemonData, PokemonCollection } from '../pokemon/types';
import { GEN1_COUNT } from '../game/constants';

interface Props {
  pulls: number;
  ownedIds: number[];
  onAddPokemon: (id: number) => PokemonCollection;
  onComplete: () => void;
}

type Phase = 'spinning' | 'flash' | 'result';

export function GachaScreen({ pulls, ownedIds, onAddPokemon, onComplete }: Props) {
  const [currentPull, setCurrentPull] = useState(0);
  const [phase, setPhase] = useState<Phase>('spinning');
  const [displayId, setDisplayId] = useState(1);
  const [resultId, setResultId] = useState(0);
  const [resultData, setResultData] = useState<PokemonData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const spinRef = useRef<number>(0);
  const ownedRef = useRef(ownedIds);
  ownedRef.current = ownedIds;

  const startSpin = useCallback(() => {
    setPhase('spinning');
    setResultData(null);

    const target = rollGacha();
    setResultId(target);

    let speed = 50;
    let elapsed = 0;
    const totalDuration = 2000;

    const tick = () => {
      elapsed += speed;
      setDisplayId(Math.floor(Math.random() * GEN1_COUNT) + 1);

      if (elapsed >= totalDuration) {
        // Flash
        setDisplayId(target);
        setPhase('flash');
        setTimeout(() => {
          const alreadyOwned = ownedRef.current.includes(target);
          setIsNew(!alreadyOwned);
          onAddPokemon(target);
          fetchPokemonData(target).then(setResultData).catch(() => {});
          setPhase('result');
        }, 300);
        return;
      }

      // Slow down gradually
      speed = 50 + (elapsed / totalDuration) * 250;
      spinRef.current = window.setTimeout(tick, speed);
    };

    spinRef.current = window.setTimeout(tick, speed);
  }, [onAddPokemon]);

  useEffect(() => {
    startSpin();
    return () => clearTimeout(spinRef.current);
  }, [currentPull, startSpin]);

  const handleNext = () => {
    if (currentPull + 1 < pulls) {
      setCurrentPull((p) => p + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: phase === 'flash'
          ? '#fff'
          : 'linear-gradient(180deg, #0d0d2b 0%, #1a1a3e 100%)',
        zIndex: 40,
        transition: 'background 0.15s',
      }}
    >
      <h2
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 28,
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '2px 2px 0 #000',
          margin: '0 0 8px',
        }}
      >
        ガチャ
      </h2>
      <p style={{ color: '#aaa', fontFamily: 'sans-serif', fontSize: 14, margin: '0 0 20px' }}>
        {currentPull + 1} / {pulls}
      </p>

      {/* Sprite display */}
      <div
        style={{
          width: 128,
          height: 128,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 16,
          marginBottom: 20,
          border: phase === 'result' ? '3px solid #FFD700' : '3px solid transparent',
        }}
      >
        <img
          src={getSpriteUrl(phase === 'result' ? resultId : displayId)}
          crossOrigin="anonymous"
          alt=""
          style={{
            width: 96,
            height: 96,
            imageRendering: 'pixelated',
            filter: phase === 'spinning' ? 'brightness(0)' : 'none',
            transition: phase === 'result' ? 'filter 0.3s' : 'none',
          }}
        />
      </div>

      {/* Result info */}
      {phase === 'result' && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 24,
              fontWeight: 'bold',
              color: '#fff',
              margin: '0 0 4px',
            }}
          >
            {resultData?.nameJa ?? `#${resultId}`}
          </p>
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: 14,
              color: '#aaa',
              margin: '0 0 8px',
            }}
          >
            #{String(resultId).padStart(3, '0')}
            {resultData && ` - ${resultData.types.join(' / ')}`}
          </p>
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: 18,
              fontWeight: 'bold',
              color: isNew ? '#4CAF50' : '#FF9800',
              margin: 0,
            }}
          >
            {isNew ? 'NEW! ゲットだぜ！' : 'もっているよ！'}
          </p>
        </div>
      )}

      {/* Next / Done button */}
      {phase === 'result' && (
        <button
          onClick={handleNext}
          style={{
            padding: '12px 40px',
            borderRadius: 12,
            border: 'none',
            background: '#FFD700',
            color: '#333',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          {currentPull + 1 < pulls ? 'つぎへ' : 'もどる'}
        </button>
      )}
    </div>
  );
}
