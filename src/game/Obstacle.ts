import type { ObstacleSize } from './types';
import { OBSTACLE_CONFIGS, GROUND_Y, VIRTUAL_WIDTH } from './constants';

export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  size: ObstacleSize;
  passed = false;

  constructor(size: ObstacleSize) {
    const config = OBSTACLE_CONFIGS[size];
    this.size = size;
    this.width = config.width;
    this.height = config.height;
    this.x = VIRTUAL_WIDTH + 20;
    this.y = GROUND_Y - this.height;
  }

  update(dt: number, speed: number) {
    this.x -= speed * dt;
  }

  isOffScreen(): boolean {
    return this.x + this.width < -20;
  }
}

export class ObstacleManager {
  obstacles: Obstacle[] = [];
  spawnTimer = 0;
  nextSpawnTime = 1.5;

  reset() {
    this.obstacles = [];
    this.spawnTimer = 0;
    this.nextSpawnTime = 1.5;
  }

  private getSpawnInterval(speed: number): number {
    // Faster speed = shorter intervals, but with minimum
    const ratio = speed / 600;
    const interval = 2.5 - ratio * 1.7;
    return Math.max(0.8, interval);
  }

  private pickSize(): ObstacleSize {
    const r = Math.random();
    if (r < 0.4) return 'small';
    if (r < 0.75) return 'medium';
    return 'large';
  }

  update(dt: number, speed: number) {
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.nextSpawnTime) {
      this.spawnTimer = 0;
      this.nextSpawnTime = this.getSpawnInterval(speed) * (0.7 + Math.random() * 0.6);
      this.obstacles.push(new Obstacle(this.pickSize()));
    }

    for (const obs of this.obstacles) {
      obs.update(dt, speed);
    }

    this.obstacles = this.obstacles.filter(o => !o.isOffScreen());
  }
}
