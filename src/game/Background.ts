import { VIRTUAL_WIDTH, GROUND_Y } from './constants';

export class Background {
  skyOffset = 0;
  mountainOffset = 0;
  treeOffset = 0;

  reset() {
    this.skyOffset = 0;
    this.mountainOffset = 0;
    this.treeOffset = 0;
  }

  update(dt: number, speed: number) {
    this.skyOffset = (this.skyOffset + speed * 0.05 * dt) % VIRTUAL_WIDTH;
    this.mountainOffset = (this.mountainOffset + speed * 0.15 * dt) % 200;
    this.treeOffset = (this.treeOffset + speed * 0.4 * dt) % 160;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    grad.addColorStop(0, '#87CEEB');
    grad.addColorStop(0.7, '#B0E0FF');
    grad.addColorStop(1, '#E8F4FD');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, GROUND_Y);

    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 220 + 50) - this.skyOffset + VIRTUAL_WIDTH * 2) % (VIRTUAL_WIDTH + 80) - 40;
      const cy = 40 + i * 25;
      this.drawCloud(ctx, cx, cy, 30 + i * 5);
    }

    // Mountains (back layer)
    ctx.fillStyle = '#7BA89C';
    this.drawMountains(ctx, this.mountainOffset, 200, GROUND_Y, 0.6);
    ctx.fillStyle = '#5C8A7E';
    this.drawMountains(ctx, this.mountainOffset * 1.5, 160, GROUND_Y, 0.8);

    // Trees (front layer)
    this.drawTrees(ctx);
  }

  private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.5, 0, 0, Math.PI * 2);
    ctx.ellipse(x - size * 0.6, y + 4, size * 0.6, size * 0.35, 0, 0, Math.PI * 2);
    ctx.ellipse(x + size * 0.6, y + 4, size * 0.7, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawMountains(ctx: CanvasRenderingContext2D, offset: number, period: number, baseY: number, heightScale: number) {
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = -offset; x <= VIRTUAL_WIDTH + period; x += period) {
      const peakH = (60 + Math.sin(x * 0.01) * 30) * heightScale;
      ctx.lineTo(x + period * 0.5, baseY - peakH);
      ctx.lineTo(x + period, baseY);
    }
    ctx.lineTo(VIRTUAL_WIDTH, baseY);
    ctx.closePath();
    ctx.fill();
  }

  private drawTrees(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < 8; i++) {
      const tx = ((i * 160 + 80) - this.treeOffset + VIRTUAL_WIDTH * 2) % (VIRTUAL_WIDTH + 160) - 80;
      const ty = GROUND_Y;
      const h = 30 + (i % 3) * 10;

      // Trunk
      ctx.fillStyle = '#6B4226';
      ctx.fillRect(tx - 3, ty - h, 6, h * 0.4);

      // Foliage
      ctx.fillStyle = '#2D7A2D';
      ctx.beginPath();
      ctx.moveTo(tx - 14, ty - h * 0.5);
      ctx.lineTo(tx, ty - h);
      ctx.lineTo(tx + 14, ty - h * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#3A9A3A';
      ctx.beginPath();
      ctx.moveTo(tx - 11, ty - h * 0.35);
      ctx.lineTo(tx, ty - h * 0.75);
      ctx.lineTo(tx + 11, ty - h * 0.35);
      ctx.closePath();
      ctx.fill();
    }
  }
}
