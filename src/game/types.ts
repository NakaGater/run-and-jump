export interface Vector2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type GameState = 'start' | 'playing' | 'gameover';

export type PlayerState = 'running' | 'charging' | 'jumping';

export type ObstacleSize = 'small' | 'medium' | 'large';

export interface ObstacleConfig {
  width: number;
  height: number;
}

export interface GameCallbacks {
  onScoreChange: (score: number) => void;
  onGameOver: (score: number) => void;
  onStateChange: (state: GameState) => void;
}

export interface SpriteFrame {
  data: number[][];
  palette: Record<number, string>;
}
