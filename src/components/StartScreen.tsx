import { getHighScore } from '../game/scoreManager';

interface Props {
  onStart: () => void;
}

export function StartScreen({ onStart }: Props) {
  const highScore = getHighScore();

  const handleClick = () => {
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
        }}
      >
        TAP TO START
      </div>
    </div>
  );
}
