import type { GameState, GameCallbacks, PlayerSpriteConfig } from './types';
import {
  VIRTUAL_WIDTH, VIRTUAL_HEIGHT,
  BASE_SPEED, MAX_SPEED, SPEED_INCREMENT,
  SCORE_PER_SECOND,
} from './constants';
import { Player } from './Player';
import { ObstacleManager } from './Obstacle';
import { Ground } from './Ground';
import { Background } from './Background';
import { getPlayerHitbox, getObstacleHitbox, checkAABB } from './physics';
import { drawPlayer, drawObstacle } from './sprites';
import { drawPokemonPlayer } from '../pokemon/spriteRenderer';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId = 0;
  private lastTime = 0;
  private callbacks: GameCallbacks;

  state: GameState = 'start';
  player = new Player();
  obstacles = new ObstacleManager();
  ground = new Ground();
  background = new Background();
  score = 0;
  speed = BASE_SPEED;
  elapsedTime = 0;
  spriteConfig: PlayerSpriteConfig = { mode: 'pixelart' };

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
  }

  start() {
    this.state = 'playing';
    this.player.reset();
    this.obstacles.reset();
    this.ground.reset();
    this.background.reset();
    this.score = 0;
    this.speed = BASE_SPEED;
    this.elapsedTime = 0;
    this.lastTime = performance.now();
    this.callbacks.onStateChange('playing');
    this.callbacks.onScoreChange(0);
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.animFrameId);
  }

  destroy() {
    this.stop();
  }

  jumpPress() {
    if (this.state !== 'playing') return;
    this.player.startCharge();
  }

  jumpRelease() {
    if (this.state !== 'playing') return;
    this.player.releaseCharge();
  }

  getChargeRatio(): number {
    return this.player.getChargeRatio();
  }

  private loop = () => {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05); // cap at 50ms
    this.lastTime = now;

    if (this.state === 'playing') {
      this.update(dt);
      this.checkCollisions();
    }

    this.render();

    if (this.state === 'playing') {
      this.animFrameId = requestAnimationFrame(this.loop);
    }
  };

  private update(dt: number) {
    this.elapsedTime += dt;

    // Increase speed
    this.speed = Math.min(BASE_SPEED + this.elapsedTime * SPEED_INCREMENT, MAX_SPEED);

    // Update score
    this.score = Math.floor(this.elapsedTime * SCORE_PER_SECOND);
    this.callbacks.onScoreChange(this.score);

    // Update entities
    this.player.update(dt);
    this.obstacles.update(dt, this.speed);
    this.ground.update(dt, this.speed);
    this.background.update(dt, this.speed);
  }

  private checkCollisions() {
    const pBox = getPlayerHitbox(
      this.player.x, this.player.y,
      this.player.width, this.player.height,
    );

    for (const obs of this.obstacles.obstacles) {
      const oBox = getObstacleHitbox(obs.x, obs.y, obs.width, obs.height);
      if (checkAABB(pBox, oBox)) {
        this.gameOver();
        return;
      }
    }
  }

  private gameOver() {
    this.state = 'gameover';
    this.callbacks.onStateChange('gameover');
    this.callbacks.onGameOver(this.score);
  }

  renderIdle() {
    // Render a static scene for start screen
    this.background.render(this.ctx);
    this.ground.render(this.ctx);
    this.drawPlayerSprite('running', 0, 0);
  }

  private render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Background and ground
    this.background.render(ctx);
    this.ground.render(ctx);

    // Obstacles
    for (const obs of this.obstacles.obstacles) {
      drawObstacle(ctx, obs.x, obs.y, obs.width, obs.height, obs.size);
    }

    // Player
    this.drawPlayerSprite(this.player.state, this.player.animFrame, this.elapsedTime);

    // Charge indicator
    if (this.player.state === 'charging') {
      const ratio = this.player.getChargeRatio();
      const barW = 40;
      const barH = 6;
      const bx = this.player.x + (this.player.width - barW) / 2;
      const by = this.player.y - 12;

      ctx.fillStyle = '#333';
      ctx.fillRect(bx, by, barW, barH);
      ctx.fillStyle = ratio < 0.5 ? '#FFD700' : ratio < 0.8 ? '#FFA500' : '#FF4444';
      ctx.fillRect(bx + 1, by + 1, (barW - 2) * ratio, barH - 2);
    }
  }

  private drawPlayerSprite(state: 'running' | 'charging' | 'jumping', animFrame: number, elapsed: number) {
    const { ctx, player } = this;
    if (this.spriteConfig.mode === 'pokemon') {
      drawPokemonPlayer(
        ctx, this.spriteConfig.image,
        player.x, player.y,
        player.width, player.height,
        state, elapsed,
      );
    } else {
      drawPlayer(
        ctx, player.x, player.y,
        player.width, player.height,
        state, animFrame,
      );
    }
  }

  resizeCanvas(clientWidth: number, clientHeight: number) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = clientWidth * dpr;
    this.canvas.height = clientHeight * dpr;
    this.canvas.style.width = `${clientWidth}px`;
    this.canvas.style.height = `${clientHeight}px`;

    // Scale to virtual coordinates
    const scaleX = (clientWidth * dpr) / VIRTUAL_WIDTH;
    const scaleY = (clientHeight * dpr) / VIRTUAL_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = ((clientWidth * dpr) - VIRTUAL_WIDTH * scale) / 2;
    const offsetY = ((clientHeight * dpr) - VIRTUAL_HEIGHT * scale) / 2;

    this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  }
}
