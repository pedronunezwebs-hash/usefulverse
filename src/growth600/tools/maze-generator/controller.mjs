import { createMazeGame, generateMaze, mazeToSvg, moveMazePlayer, solveMaze, validateMazeSettings } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="maze-generator"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  const widthInput = root.querySelector('[data-width]');
  const heightInput = root.querySelector('[data-height]');
  const seedInput = root.querySelector('[data-seed]');
  const stepsOutput = root.querySelector('[data-steps]');
  const solutionNote = root.querySelector('[data-solution-note]');
  const solveButton = root.querySelector('[data-action="solve"]');
  const hideSolutionButton = root.querySelector('[data-action="hide-solution"]');
  let maze = generateMaze({ width: 21, height: 15, seed: randomSeed() });
  let game = createMazeGame(maze);
  let route = null;

  function randomSeed() {
    const values = new Uint32Array(2);
    if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(values);
    else { values[0] = Math.floor(Math.random() * 0xffffffff); values[1] = Date.now() >>> 0; }
    return Array.from(values, (value) => value.toString(36)).join('');
  }

  function render() {
    board.replaceChildren();
    board.style.setProperty('--maze-columns', String(maze.width));
    board.style.setProperty('--maze-rows', String(maze.height));
    const routeKeys = new Set((route ?? []).map(({ x, y }) => x + ',' + y));
    for (let y = 0; y < maze.height; y += 1) {
      const row = document.createElement('div');
      row.className = 'maze-row';
      row.setAttribute('role', 'row');
      for (let x = 0; x < maze.width; x += 1) {
        const tile = maze.grid[y][x];
        const cell = document.createElement('div');
        const isPlayer = game.player.x === x && game.player.y === y;
        const isRoute = routeKeys.has(x + ',' + y) && !isPlayer;
        cell.className = 'maze-cell maze-cell--' + (tile === '#' ? 'wall' : tile === 'S' ? 'start' : tile === 'E' ? 'finish' : 'path') + (isRoute ? ' is-solution' : '') + (isPlayer ? ' is-player' : '');
        cell.setAttribute('role', 'gridcell');
        const label = tile === '#' ? copy.fields.wall : tile === 'S' ? copy.fields.start : tile === 'E' ? copy.fields.finish : copy.fields.path;
        cell.setAttribute('aria-label', (x + 1) + ', ' + (y + 1) + ': ' + label + (isPlayer ? ', ' + copy.fields.player : ''));
        if (tile === 'S') cell.textContent = 'S';
        if (tile === 'E') cell.textContent = 'E';
        if (isPlayer) cell.textContent = '●';
        row.append(cell);
      }
      board.append(row);
    }
    stepsOutput.textContent = String(game.steps);
    solveButton.hidden = Boolean(route);
    hideSolutionButton.hidden = !route;
    solutionNote.hidden = !route;
  }

  function move(direction) {
    const next = moveMazePlayer(game, direction);
    if (next === game) {
      announce(root, copy.messages.blocked, 'info');
      return;
    }
    game = next;
    render();
    announce(root, game.solved ? copy.messages.solved.replace('{moves}', String(game.steps)) : copy.messages.moved.replace('{moves}', String(game.steps)), game.solved ? 'success' : 'info');
  }

  function generate() {
    const settings = { width: Number(widthInput.value), height: Number(heightInput.value), seed: seedInput.value || randomSeed() };
    if (!validateMazeSettings(settings).ok) {
      announce(root, copy.messages.invalidSettings, 'error');
      return;
    }
    maze = generateMaze(settings);
    seedInput.value = maze.seed;
    game = createMazeGame(maze);
    route = null;
    render();
    announce(root, copy.messages.generated, 'success');
    board.focus();
  }

  root.querySelector('[data-action="generate"]')?.addEventListener('click', generate);
  solveButton.addEventListener('click', () => {
    route = solveMaze(maze);
    render();
    announce(root, copy.messages.routeShown, 'success');
  });
  hideSolutionButton.addEventListener('click', () => {
    route = null;
    render();
    announce(root, copy.messages.routeHidden, 'info');
  });
  root.querySelector('[data-action="restart"]')?.addEventListener('click', () => {
    game = createMazeGame(maze);
    render();
    announce(root, copy.messages.restarted, 'success');
    board.focus();
  });
  root.querySelector('[data-action="export-svg"]')?.addEventListener('click', () => {
    const blob = new Blob([mazeToSvg(maze)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'maze-' + maze.width + 'x' + maze.height + '-' + maze.seed.replace(/[^a-z0-9_-]/giu, '').slice(0, 20) + '.svg';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    announce(root, copy.messages.downloaded, 'success');
  });
  root.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-move]');
    if (button && root.contains(button)) move(button.dataset.move);
  });
  board.addEventListener('keydown', (event) => {
    const direction = ({ ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' })[event.key.length === 1 ? event.key.toLowerCase() : event.key];
    if (!direction) return;
    event.preventDefault();
    move(direction);
  });
  render();
  announce(root, copy.messages.ready, 'info');
}
