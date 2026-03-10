import { GEN1_COUNT, GACHA_SCORE_THRESHOLD } from '../game/constants';

export interface GachaResult {
  pokemonId: number;
  isNew: boolean;
}

export function rollGacha(): number {
  return Math.floor(Math.random() * GEN1_COUNT) + 1;
}

export function calculateGachaPulls(score: number, isNewHighScore: boolean): number {
  let pulls = 0;
  if (score >= GACHA_SCORE_THRESHOLD) {
    pulls += 1;
  }
  if (isNewHighScore) {
    pulls += 1;
  }
  return pulls;
}
