const HIGH_SCORE_KEY = 'run-and-jump-highscore';

export function getHighScore(): number {
  try {
    const val = localStorage.getItem(HIGH_SCORE_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): boolean {
  const prev = getHighScore();
  if (score > prev) {
    try {
      localStorage.setItem(HIGH_SCORE_KEY, String(score));
    } catch {
      // Private browsing or quota exceeded
    }
    return true;
  }
  return false;
}
