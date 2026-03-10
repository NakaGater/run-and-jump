import type { PlayerState } from '../game/types';

const SPRITE_SIZE = 96;
const DRAW_SIZE = 64;
const BOUNCE_AMPLITUDE = 2;
const BOUNCE_SPEED = 12;
const CHARGE_SCALE_Y = 0.7;

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

  if (state === 'charging') {
    // Crouch: squish vertically, bottom-aligned to ground
    drawH = DRAW_SIZE * CHARGE_SCALE_Y;
    drawY = y + height - drawH;
  } else if (state === 'running') {
    // Bottom-aligned, bounce upward only
    const bounce = Math.abs(Math.sin(animTimer * BOUNCE_SPEED)) * BOUNCE_AMPLITUDE;
    drawY = y + height - drawH - bounce;
  } else {
    // Jumping: bottom-aligned
    drawY = y + height - drawH;
  }

  ctx.drawImage(image, 0, 0, SPRITE_SIZE, SPRITE_SIZE, centerX, drawY, drawW, drawH);
}
