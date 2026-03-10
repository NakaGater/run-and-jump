import { getHighScore } from '../game/scoreManager';

interface Props {
  score: number;
  isNewHighScore: boolean;
  onRetry: () => void;
  gachaPulls?: number;
  onGacha?: () => void;
}

export function GameOverScreen({ score, isNewHighScore, onRetry, gachaPulls = 0, onGacha }: Props) {
  const highScore = getHighScore();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 30,
      }}
    >
      <h2
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 40,
          fontWeight: 'bold',
          color: '#FF4444',
          textShadow: '2px 2px 0 #000',
          margin: 0,
          marginBottom: 20,
        }}
      >
        GAME OVER
      </h2>
      <p
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 24,
          color: '#fff',
          textShadow: '1px 1px 0 #000',
          margin: 0,
          marginBottom: 8,
        }}
      >
        Score: {score}
      </p>
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
        Best: {highScore}
      </p>
      {isNewHighScore && (
        <p
          style={{
            fontFamily: 'sans-serif',
            fontSize: 20,
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '0 0 10px #FFD700',
            margin: 0,
            marginBottom: 24,
            animation: 'pulse 0.6s ease-in-out infinite alternate',
          }}
        >
          NEW HIGH SCORE!
        </p>
      )}

      {/* Gacha button */}
      {gachaPulls > 0 && onGacha && (
        <button
          onClick={onGacha}
          style={{
            padding: '14px 40px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(102,126,234,0.5)',
            marginBottom: 12,
            animation: 'pulse 1s ease-in-out infinite alternate',
          }}
        >
          ガチャを引く！ x{gachaPulls}
        </button>
      )}

      <button
        onClick={onRetry}
        style={{
          padding: '14px 40px',
          borderRadius: 12,
          border: 'none',
          background: '#FFD700',
          color: '#333',
          fontSize: 22,
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        RETRY
      </button>
    </div>
  );
}
