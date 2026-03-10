import type { ObstacleConfig, ObstacleSize } from './types';

// Virtual coordinate system
export const VIRTUAL_WIDTH = 800;
export const VIRTUAL_HEIGHT = 400;

// Player
export const PLAYER_X = 100;
export const PLAYER_WIDTH = 48;
export const PLAYER_HEIGHT = 64;
export const PLAYER_HITBOX_SHRINK = 6;

// Jump mechanics
export const MIN_JUMP_VELOCITY = -350;
export const MAX_JUMP_VELOCITY = -650;
export const MAX_CHARGE_TIME = 300; // ms
export const GRAVITY = 1600;

// Ground
export const GROUND_Y = 340;
export const GROUND_HEIGHT = 60;

// Speed
export const BASE_SPEED = 200;
export const MAX_SPEED = 600;
export const SPEED_INCREMENT = 5; // per second

// Obstacles
export const OBSTACLE_CONFIGS: Record<ObstacleSize, ObstacleConfig> = {
  small: { width: 24, height: 24 },
  medium: { width: 32, height: 40 },
  large: { width: 40, height: 56 },
};
export const OBSTACLE_HITBOX_SHRINK = 4;
export const MIN_SPAWN_INTERVAL = 0.8; // seconds
export const MAX_SPAWN_INTERVAL = 2.5; // seconds

// Score
export const SCORE_PER_SECOND = 10;

// Animation
export const RUN_FRAME_DURATION = 0.1; // seconds per frame
export const RUN_FRAMES = 3;
