import { useState } from 'react';
import type { PokemonCollection } from '../pokemon/types';
import { getSpriteUrl } from '../pokemon/api';
import { usePokemonData } from '../hooks/usePokemonData';

interface Props {
  collection: PokemonCollection;
  onSelect: (id: number) => void;
  onBack: () => void;
}

export function CharacterSelect({ collection, onSelect, onBack }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState(collection.selectedId);
  const { data: hoveredData } = usePokemonData(hoveredId);

  const handleConfirm = () => {
    onSelect(selectedId);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        zIndex: 30,
        overflow: 'auto',
      }}
    >
      <h2
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 32,
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '2px 2px 0 #000',
          margin: '20px 0 10px',
        }}
      >
        キャラクター選択
      </h2>

      {/* Pokemon grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
          padding: '10px 20px',
          maxWidth: 500,
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {/* Pixel art default option */}
        <div
          onClick={() => setSelectedId(0)}
          onMouseEnter={() => setHoveredId(null)}
          style={{
            width: 64,
            height: 64,
            border: selectedId === 0 ? '3px solid #FFD700' : '3px solid transparent',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            color: '#fff',
            fontFamily: 'sans-serif',
            textAlign: 'center',
          }}
        >
          ドット絵
        </div>

        {collection.ownedIds.map((id) => (
          <div
            key={id}
            onClick={() => setSelectedId(id)}
            onMouseEnter={() => setHoveredId(id)}
            style={{
              width: 64,
              height: 64,
              border: selectedId === id ? '3px solid #FFD700' : '3px solid transparent',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={getSpriteUrl(id)}
              crossOrigin="anonymous"
              alt={`#${id}`}
              style={{ width: 48, height: 48, imageRendering: 'pixelated' }}
            />
          </div>
        ))}
      </div>

      {/* Info panel */}
      {hoveredData && (
        <div
          style={{
            padding: '8px 16px',
            color: '#fff',
            fontFamily: 'sans-serif',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          <span style={{ fontWeight: 'bold', color: '#FFD700' }}>
            {hoveredData.nameJa}
          </span>
          <span style={{ marginLeft: 8, color: '#aaa' }}>
            #{String(hoveredData.id).padStart(3, '0')}
          </span>
          <span style={{ marginLeft: 8 }}>
            {hoveredData.types.join(' / ')}
          </span>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 16, padding: '16px 0 24px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '12px 32px',
            borderRadius: 12,
            border: '2px solid #888',
            background: 'transparent',
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
          }}
        >
          もどる
        </button>
        <button
          onClick={handleConfirm}
          style={{
            padding: '12px 32px',
            borderRadius: 12,
            border: 'none',
            background: '#FFD700',
            color: '#333',
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          けってい
        </button>
      </div>
    </div>
  );
}
