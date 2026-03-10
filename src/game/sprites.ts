// Pikachu-style pixel art character (12x16 grid)
// 0=transparent, 1=brown outline, 2=yellow body, 3=dark yellow, 4=white eye, 5=black pupil, 6=red mouth, 7=ear tip black

const PLAYER_PALETTE: Record<number, string> = {
  1: '#8B5E3C',  // brown outline
  2: '#FFD700',  // yellow body
  3: '#DAA520',  // dark yellow shadow
  4: '#FFFFFF',  // white eye
  5: '#000000',  // black pupil
  6: '#CC3333',  // red cheek/mouth
  7: '#000000',  // ear tip
};

// Run frame 1
const RUN_FRAME_0: number[][] = [
  [0,0,0,1,1,0,0,0,0,1,1,0],
  [0,0,0,1,2,1,0,0,1,2,1,0],
  [0,0,0,7,2,1,0,0,1,2,7],
  [0,0,1,2,2,2,1,1,2,2,2,0],
  [0,1,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,2,2,6,6,2,2,2,2,1],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,0,1,2,2,2,2,2,1,0,0],
  [0,0,1,3,2,2,2,2,2,3,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,0,1,2,2,2,2,2,1,0,0],
  [0,0,1,1,0,1,1,0,1,1,0,0],
  [0,1,1,0,0,0,0,0,0,1,1,0],
];

// Run frame 2 (legs apart)
const RUN_FRAME_1: number[][] = [
  [0,0,0,1,1,0,0,0,0,1,1,0],
  [0,0,0,1,2,1,0,0,1,2,1,0],
  [0,0,0,7,2,1,0,0,1,2,7],
  [0,0,1,2,2,2,1,1,2,2,2,0],
  [0,1,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,2,2,6,6,2,2,2,2,1],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,0,1,2,2,2,2,2,1,0,0],
  [0,0,1,3,2,2,2,2,2,3,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,0,1,2,1,1,2,1,0,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
  [0,1,1,0,0,0,0,0,0,1,1,0],
];

// Run frame 3 (other legs)
const RUN_FRAME_2: number[][] = [
  [0,0,0,1,1,0,0,0,0,1,1,0],
  [0,0,0,1,2,1,0,0,1,2,1,0],
  [0,0,0,7,2,1,0,0,1,2,7],
  [0,0,1,2,2,2,1,1,2,2,2,0],
  [0,1,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,2,2,6,6,2,2,2,2,1],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,0,1,2,2,2,2,2,1,0,0],
  [0,0,1,3,2,2,2,2,2,3,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,0,1,2,1,1,2,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,0,0,1,1,0,0,0],
];

// Jump frame (arms up, legs tucked)
const JUMP_FRAME: number[][] = [
  [0,0,0,1,1,0,0,0,0,1,1,0],
  [0,0,1,2,2,1,0,0,1,2,2,0],
  [0,0,7,2,2,1,0,0,1,2,7,0],
  [0,0,1,2,2,2,1,1,2,2,2,0],
  [0,1,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [1,2,2,2,2,6,6,2,2,2,2,1],
  [1,2,1,2,2,2,2,2,2,2,1,2],
  [0,1,0,1,2,2,2,2,2,1,0,1],
  [0,0,0,1,3,2,2,2,3,1,0,0],
  [0,0,0,1,2,2,2,2,2,1,0,0],
  [0,0,0,1,2,2,2,2,2,1,0,0],
  [0,0,0,1,1,2,2,1,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// Charging frame (crouched)
const CHARGE_FRAME: number[][] = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,0,0,0,0,1,1,0],
  [0,0,0,1,2,1,0,0,1,2,1,0],
  [0,0,0,7,2,1,0,0,1,2,7],
  [0,0,1,2,2,2,1,1,2,2,2,0],
  [0,1,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,4,5,2,2,2,4,5,2,1],
  [0,1,2,2,2,6,6,2,2,2,2,1],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,1,3,2,2,2,2,2,3,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0],
  [0,0,1,1,1,0,0,1,1,1,0,0],
  [0,1,1,0,1,1,1,1,0,1,1,0],
];

const RUN_FRAMES = [RUN_FRAME_0, RUN_FRAME_1, RUN_FRAME_2];

// Rock obstacle (8x8 grid)
const ROCK_SPRITE: number[][] = [
  [0,0,0,1,1,0,0,0],
  [0,0,1,8,8,1,0,0],
  [0,1,8,9,8,8,1,0],
  [1,8,9,8,8,8,8,1],
  [1,8,8,8,8,9,8,1],
  [1,8,8,9,8,8,8,1],
  [0,1,8,8,8,8,1,0],
  [0,0,1,1,1,1,0,0],
];

// Crate obstacle (8x10 grid)
const CRATE_SPRITE: number[][] = [
  [1,1,1,1,1,1,1,1],
  [1,10,10,1,1,10,10,1],
  [1,10,10,1,1,10,10,1],
  [1,1,1,10,10,1,1,1],
  [1,1,1,10,10,1,1,1],
  [1,10,10,1,1,10,10,1],
  [1,10,10,1,1,10,10,1],
  [1,1,1,10,10,1,1,1],
  [1,1,1,10,10,1,1,1],
  [1,1,1,1,1,1,1,1],
];

// Pillar obstacle (8x14 grid)
const PILLAR_SPRITE: number[][] = [
  [0,1,1,1,1,1,1,0],
  [1,11,11,11,11,11,11,1],
  [0,1,11,11,11,11,1,0],
  [0,1,11,12,11,11,1,0],
  [0,1,11,12,11,11,1,0],
  [0,1,11,11,11,12,1,0],
  [0,1,11,11,11,12,1,0],
  [0,1,11,12,11,11,1,0],
  [0,1,11,12,11,11,1,0],
  [0,1,11,11,11,12,1,0],
  [0,1,11,11,11,12,1,0],
  [0,1,11,11,11,11,1,0],
  [1,11,11,11,11,11,11,1],
  [0,1,1,1,1,1,1,0],
];

const OBSTACLE_PALETTE: Record<number, string> = {
  1: '#555555',   // outline
  8: '#888888',   // rock gray
  9: '#AAAAAA',   // rock highlight
  10: '#C68E17',  // crate wood
  11: '#D4D4D4',  // pillar stone
  12: '#B0B0B0',  // pillar shadow
};

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: number[][],
  palette: Record<number, string>,
  x: number,
  y: number,
  targetWidth: number,
  targetHeight: number,
) {
  const rows = sprite.length;
  const cols = sprite[0].length;
  const cellW = targetWidth / cols;
  const cellH = targetHeight / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const val = sprite[row][col];
      if (val === 0) continue;
      const color = palette[val];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.floor(x + col * cellW),
        Math.floor(y + row * cellH),
        Math.ceil(cellW),
        Math.ceil(cellH),
      );
    }
  }
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  state: 'running' | 'charging' | 'jumping',
  animFrame: number,
) {
  let sprite: number[][];
  if (state === 'jumping') {
    sprite = JUMP_FRAME;
  } else if (state === 'charging') {
    sprite = CHARGE_FRAME;
  } else {
    sprite = RUN_FRAMES[animFrame % RUN_FRAMES.length];
  }
  drawSprite(ctx, sprite, PLAYER_PALETTE, x, y, width, height);
}

export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  size: 'small' | 'medium' | 'large',
) {
  let sprite: number[][];
  if (size === 'small') {
    sprite = ROCK_SPRITE;
  } else if (size === 'medium') {
    sprite = CRATE_SPRITE;
  } else {
    sprite = PILLAR_SPRITE;
  }
  drawSprite(ctx, sprite, OBSTACLE_PALETTE, x, y, width, height);
}
