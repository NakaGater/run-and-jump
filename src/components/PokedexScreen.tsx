import { useState, useEffect } from 'react';
import { GEN1_COUNT } from '../game/constants';
import { getSpriteUrl, fetchPokemonData } from '../pokemon/api';
import type { PokemonData } from '../pokemon/types';

interface Props {
  ownedIds: number[];
  onBack: () => void;
}

export function PokedexScreen({ ownedIds, onBack }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<PokemonData | null>(null);
  const ownedSet = new Set(ownedIds);

  useEffect(() => {
    if (selectedId === null) {
      setSelectedData(null);
      return;
    }
    let cancelled = false;
    fetchPokemonData(selectedId).then((d) => {
      if (!cancelled) setSelectedData(d);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [selectedId]);

  const ids = Array.from({ length: GEN1_COUNT }, (_, i) => i + 1);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        zIndex: 30,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: '2px solid #888',
            background: 'transparent',
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
          }}
        >
          もどる
        </button>
        <h2
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#FF6B6B',
            textShadow: '2px 2px 0 #000',
            margin: 0,
          }}
        >
          ポケモンずかん
        </h2>
        <span style={{ color: '#aaa', fontFamily: 'sans-serif', fontSize: 14, marginLeft: 'auto' }}>
          {ownedIds.length} / {GEN1_COUNT}
        </span>
      </div>

      {/* Detail panel (if selected) */}
      {selectedId !== null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            gap: 16,
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            minHeight: 100,
          }}
        >
          <img
            src={getSpriteUrl(selectedId)}
            crossOrigin="anonymous"
            alt=""
            style={{
              width: 80,
              height: 80,
              imageRendering: 'pixelated',
              filter: ownedSet.has(selectedId) ? 'none' : 'brightness(0)',
            }}
          />
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              margin: '0 0 4px',
            }}>
              #{String(selectedId).padStart(3, '0')}{' '}
              {ownedSet.has(selectedId) && selectedData ? selectedData.nameJa : '???'}
            </p>
            {ownedSet.has(selectedId) && selectedData && (
              <>
                <p style={{ color: '#aaa', fontSize: 14, fontFamily: 'sans-serif', margin: '0 0 4px' }}>
                  {selectedData.types.join(' / ')}
                </p>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#ccc', fontFamily: 'sans-serif' }}>
                  <span>HP {selectedData.stats.hp}</span>
                  <span>ATK {selectedData.stats.attack}</span>
                  <span>DEF {selectedData.stats.defense}</span>
                  <span>SPD {selectedData.stats.speed}</span>
                </div>
              </>
            )}
            {!ownedSet.has(selectedId) && (
              <p style={{ color: '#666', fontSize: 14, fontFamily: 'sans-serif', margin: 0 }}>
                まだつかまえていない
              </p>
            )}
          </div>
          <button
            onClick={() => setSelectedId(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: 24,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
            gap: 4,
          }}
        >
          {ids.map((id) => {
            const owned = ownedSet.has(id);
            return (
              <div
                key={id}
                onClick={() => setSelectedId(id)}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedId === id
                    ? 'rgba(255,215,0,0.2)'
                    : 'rgba(255,255,255,0.05)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: selectedId === id ? '2px solid #FFD700' : '2px solid transparent',
                  padding: 2,
                }}
              >
                <img
                  src={getSpriteUrl(id)}
                  crossOrigin="anonymous"
                  alt={`#${id}`}
                  loading="lazy"
                  style={{
                    width: 40,
                    height: 40,
                    imageRendering: 'pixelated',
                    filter: owned ? 'none' : 'brightness(0)',
                  }}
                />
                <span style={{
                  fontSize: 8,
                  color: owned ? '#aaa' : '#444',
                  fontFamily: 'sans-serif',
                }}>
                  {String(id).padStart(3, '0')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
