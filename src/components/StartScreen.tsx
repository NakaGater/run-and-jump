import { getHighScore } from '../game/scoreManager';
import { getSpriteUrl } from '../pokemon/api';

interface Props {
  onStart: () => void;
  onCharSelect: () => void;
  onPokedex: () => void;
  selectedPokemonId: number;
}

export function StartScreen({ onStart, onCharSelect, onPokedex, selectedPokemonId }: Props) {
  const highScore = getHighScore();

  const handleClick = (e: React.MouseEvent) => {
    // Don't start if clicking menu buttons
    const target = e.target as HTMLElement;
    if (target.closest('[data-menu-btn]')) return;
    onStart();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      onStart();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 30,
        cursor: 'pointer',
      }}
    >
      <h1
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 48,
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '3px 3px 0 #8B5E3C, -1px -1px 0 #000',
          margin: 0,
          marginBottom: 16,
        }}
      >
        Run & Jump!
      </h1>

      {/* Selected character preview */}
      {selectedPokemonId > 0 && (
        <div style={{ marginBottom: 12 }}>
          <img
            src={getSpriteUrl(selectedPokemonId)}
            crossOrigin="anonymous"
            alt="Selected"
            style={{ width: 64, height: 64, imageRendering: 'pixelated' }}
          />
        </div>
      )}

      <p
        style={{
          fontFamily: 'sans-serif',
          fontSize: 18,
          color: '#fff',
          textShadow: '1px 1px 0 #000',
          margin: 0,
          marginBottom: 8,
        }}
      >
        Press to charge, release to jump!
      </p>
      <p
        style={{
          fontFamily: 'sans-serif',
          fontSize: 14,
          color: '#ccc',
          textShadow: '1px 1px 0 #000',
          margin: 0,
          marginBottom: 24,
        }}
      >
        Space / Tap the button
      </p>
      {highScore > 0 && (
        <p
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 16,
            color: '#FFD700',
            textShadow: '1px 1px 0 #000',
            margin: 0,
            marginBottom: 24,
          }}
        >
          High Score: {highScore}
        </p>
      )}
      <div
        style={{
          padding: '14px 40px',
          borderRadius: 12,
          background: '#FFD700',
          color: '#333',
          fontSize: 22,
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          marginBottom: 16,
        }}
      >
        TAP TO START
      </div>

      {/* Menu buttons */}
      <div style={{ display: 'flex', gap: 12 }} data-menu-btn>
        <button
          onClick={(e) => { e.stopPropagation(); onCharSelect(); }}
          data-menu-btn
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: '2px solid #FFD700',
            background: 'rgba(0,0,0,0.5)',
            color: '#FFD700',
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
          }}
        >
          キャラ選択
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onPokedex(); }}
          data-menu-btn
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: '2px solid #FF6B6B',
            background: 'rgba(0,0,0,0.5)',
            color: '#FF6B6B',
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
          }}
        >
          ずかん
        </button>
      </div>
    </div>
  );
}
