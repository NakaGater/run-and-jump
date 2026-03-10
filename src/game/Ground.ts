import { VIRTUAL_WIDTH, GROUND_Y, GROUND_HEIGHT } from './constants';

export class Ground {
  offset = 0;

  reset() {
    this.offset = 0;
  }

  update(dt: number, speed: number) {
    this.offset = (this.offset + speed * dt) % 32;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Grass layer
    ctx.fillStyle = '#4a8c2a';
    ctx.fillRect(0, GROUND_Y, VIRTUAL_WIDTH, 8);

    // Dirt layer
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(0, GROUND_Y + 8, VIRTUAL_WIDTH, GROUND_HEIGHT - 8);

    // Grass tufts
    ctx.fillStyle = '#5ca632';
    for (let x = -this.offset; x < VIRTUAL_WIDTH + 32; x += 32) {
      ctx.fillRect(x, GROUND_Y - 2, 6, 4);
      ctx.fillRect(x + 16, GROUND_Y - 1, 4, 3);
    }

    // Dirt texture dots
    ctx.fillStyle = '#7a5c10';
    for (let x = -this.offset; x < VIRTUAL_WIDTH + 32; x += 24) {
      ctx.fillRect(x + 4, GROUND_Y + 14, 3, 3);
      ctx.fillRect(x + 14, GROUND_Y + 24, 2, 2);
      ctx.fillRect(x + 8, GROUND_Y + 36, 3, 2);
    }
  }
}
