import { useEffect, useRef } from 'react';

interface Props {
  onPress: () => void;
  onRelease: () => void;
}

export function JumpButton({ onPress, onRelease }: Props) {
  const pressedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!pressedRef.current) {
          pressedRef.current = true;
          onPress();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (pressedRef.current) {
          pressedRef.current = false;
          onRelease();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onPress, onRelease]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!pressedRef.current) {
      pressedRef.current = true;
      onPress();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (pressedRef.current) {
      pressedRef.current = false;
      onRelease();
    }
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={e => e.preventDefault()}
      style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 120,
        height: 60,
        borderRadius: 30,
        border: '3px solid #fff',
        background: 'rgba(255, 215, 0, 0.7)',
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        cursor: 'pointer',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex: 20,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      JUMP
    </button>
  );
}
