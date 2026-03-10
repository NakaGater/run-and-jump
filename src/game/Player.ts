import type { PlayerState } from './types';
import {
  PLAYER_X, PLAYER_WIDTH, PLAYER_HEIGHT,
  MIN_JUMP_VELOCITY, MAX_JUMP_VELOCITY, MAX_CHARGE_TIME,
  GROUND_Y, RUN_FRAME_DURATION, RUN_FRAMES,
} from './constants';
import { applyGravity, clampToGround, isOnGround } from './physics';

export class Player {
  x = PLAYER_X;
  y = GROUND_Y - PLAYER_HEIGHT;
  width = PLAYER_WIDTH;
  height = PLAYER_HEIGHT;
  velocityY = 0;
  state: PlayerState = 'running';
  chargeStartTime = 0;
  animFrame = 0;
  animTimer = 0;

  reset() {
    this.x = PLAYER_X;
    this.y = GROUND_Y - PLAYER_HEIGHT;
    this.velocityY = 0;
    this.state = 'running';
    this.chargeStartTime = 0;
    this.animFrame = 0;
    this.animTimer = 0;
  }

  startCharge() {
    if (!isOnGround(this.y, this.height)) return;
    this.state = 'charging';
    this.chargeStartTime = performance.now();
  }

  releaseCharge() {
    if (this.state !== 'charging') return;
    const holdTime = Math.min(performance.now() - this.chargeStartTime, MAX_CHARGE_TIME);
    const ratio = holdTime / MAX_CHARGE_TIME;
    this.velocityY = MIN_JUMP_VELOCITY + (MAX_JUMP_VELOCITY - MIN_JUMP_VELOCITY) * ratio;
    this.state = 'jumping';
  }

  getChargeRatio(): number {
    if (this.state !== 'charging') return 0;
    const holdTime = Math.min(performance.now() - this.chargeStartTime, MAX_CHARGE_TIME);
    return holdTime / MAX_CHARGE_TIME;
  }

  update(dt: number) {
    if (this.state === 'jumping' || !isOnGround(this.y, this.height)) {
      this.velocityY = applyGravity(this.velocityY, dt);
      this.y += this.velocityY * dt;
      this.y = clampToGround(this.y, this.height);

      if (isOnGround(this.y, this.height)) {
        this.velocityY = 0;
        this.state = 'running';
      }
    }

    // Run animation
    if (this.state === 'running') {
      this.animTimer += dt;
      if (this.animTimer >= RUN_FRAME_DURATION) {
        this.animTimer -= RUN_FRAME_DURATION;
        this.animFrame = (this.animFrame + 1) % RUN_FRAMES;
      }
    }
  }
}
