interface Props {
  score: number;
}

export function ScoreDisplay({ score }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 16,
        fontFamily: '"Courier New", monospace',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {String(score).padStart(6, '0')}
    </div>
  );
}
