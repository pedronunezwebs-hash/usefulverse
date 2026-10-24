export const TABLE_WIDTH = 720;
export const TABLE_HEIGHT = 420;
const PADDLE_HEIGHT = 82;
const PADDLE_WIDTH = 12;
const WIN_SCORE = 7;

export function newTableTennisGame() {
  return { playerY: TABLE_HEIGHT / 2, cpuY: TABLE_HEIGHT / 2, ballX: TABLE_WIDTH / 2, ballY: TABLE_HEIGHT / 2, ballVX: 4, ballVY: 2.1, playerScore: 0, cpuScore: 0, rally: 0, running: true, winner: null };
}

export function moveTableTennisPaddle(state, direction) {
  if (![-1, 1].includes(direction)) throw new TypeError('Paddle direction must be -1 or 1.');
  return { ...state, playerY: Math.max(PADDLE_HEIGHT / 2, Math.min(TABLE_HEIGHT - PADDLE_HEIGHT / 2, state.playerY + direction * 28)) };
}

export function stepTableTennisGame(state) {
  if (!state.running || state.winner) return state;
  let { ballX, ballY, ballVX, ballVY, playerY, cpuY, playerScore, cpuScore, rally } = state;
  cpuY += Math.max(-3.3, Math.min(3.3, ballY - cpuY)) * 0.62;
  ballX += ballVX; ballY += ballVY;
  if (ballY < 7 || ballY > TABLE_HEIGHT - 7) ballVY *= -1;
  if (ballVX < 0 && ballX <= 42 + PADDLE_WIDTH && Math.abs(ballY - playerY) <= PADDLE_HEIGHT / 2 + 7) { ballX = 42 + PADDLE_WIDTH; ballVX = Math.min(8, Math.abs(ballVX) + 0.18); ballVY += (ballY - playerY) / 22; rally++; }
  if (ballVX > 0 && ballX >= TABLE_WIDTH - 42 - PADDLE_WIDTH && Math.abs(ballY - cpuY) <= PADDLE_HEIGHT / 2 + 7) { ballX = TABLE_WIDTH - 42 - PADDLE_WIDTH; ballVX = -Math.min(8, Math.abs(ballVX) + 0.12); ballVY += (ballY - cpuY) / 26; rally++; }
  if (ballX < 0) { cpuScore++; ballX = TABLE_WIDTH / 2; ballY = TABLE_HEIGHT / 2; ballVX = 4; ballVY = 2.1; rally = 0; }
  if (ballX > TABLE_WIDTH) { playerScore++; ballX = TABLE_WIDTH / 2; ballY = TABLE_HEIGHT / 2; ballVX = -4; ballVY = -2.1; rally = 0; }
  const winner = (playerScore >= WIN_SCORE && playerScore - cpuScore >= 2) ? 'player' : (cpuScore >= WIN_SCORE && cpuScore - playerScore >= 2) ? 'cpu' : null;
  return { ...state, playerY, cpuY, ballX, ballY, ballVX, ballVY, playerScore, cpuScore, rally, winner, running: !winner };
}
