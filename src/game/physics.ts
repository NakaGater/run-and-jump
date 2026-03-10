import type { Rect } from './types';
import { GRAVITY, GROUND_Y, PLAYER_HITBOX_SHRINK, OBSTACLE_HITBOX_SHRINK } from './constants';

export function applyGravity(velocityY: number, dt: number): number {
  return velocityY + GRAVITY * dt;
}

export function getPlayerHitbox(x: number, y: number, w: number, h: number): Rect {
  return {
    x: x + PLAYER_HITBOX_SHRINK,
    y: y + PLAYER_HITBOX_SHRINK,
    width: w - PLAYER_HITBOX_SHRINK * 2,
    height: h - PLAYER_HITBOX_SHRINK * 2,
  };
}

export function getObstacleHitbox(x: number, y: number, w: number, h: number): Rect {
  return {
    x: x + OBSTACLE_HITBOX_SHRINK,
    y: y + OBSTACLE_HITBOX_SHRINK,
    width: w - OBSTACLE_HITBOX_SHRINK * 2,
    height: h - OBSTACLE_HITBOX_SHRINK * 2,
  };
}

export function checkAABB(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function clampToGround(y: number, height: number): number {
  const groundTop = GROUND_Y - height;
  return Math.min(y, groundTop);
}

export function isOnGround(y: number, height: number): boolean {
  return y >= GROUND_Y - height;
}
