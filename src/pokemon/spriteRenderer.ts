import type { PlayerState } from '../game/types';

const SPRITE_SIZE = 96;
const DRAW_SIZE = 80;
// PokeAPI sprites have ~12% transparent padding at the bottom.
// Push the sprite down past GROUND_Y so the visible feet sit on the ground.
const GROUND_OFFSET = 12;
const BOUNCE_AMPLITUDE = 2;
const BOUNCE_SPEED = 12;
const CHARGE_SCALE_Y = 0.75;

export function drawPokemonPlayer(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  state: PlayerState,
  animTimer: number,
) {
  const drawW = DRAW_SIZE;
  let drawH = DRAW_SIZE;
  const centerX = x + (width - drawW) / 2;
  let drawY: number;

  // Base Y: align bottom of sprite to ground, then push down by GROUND_OFFSET
  const baseY = y + height - drawH + GROUND_OFFSET;

  if (state === 'charging') {
    drawH = DRAW_SIZE * CHARGE_SCALE_Y;
    drawY = y + height - drawH + GROUND_OFFSET;
  } else if (state === 'running') {
    const bounce = Math.abs(Math.sin(animTimer * BOUNCE_SPEED)) * BOUNCE_AMPLITUDE;
    drawY = baseY - bounce;
  } else {
    // Jumping
    drawY = baseY;
  }

  ctx.drawImage(image, 0, 0, SPRITE_SIZE, SPRITE_SIZE, centerX, drawY, drawW, drawH);
}
