import { UIController } from './UIController.js';
import { GridManager } from './GridManager.js';
import { AlgorithmEngine } from './AlgorithmEngine.js';

let isRunning = false;
// let animationSpeed = 50; // No longer needed

const gridManager = new GridManager(25, 50);
const ui = new UIController(gridManager);
const algo = new AlgorithmEngine(gridManager);

document.getElementById('set-start').onclick = () => ui.setMode('start');
document.getElementById('set-end').onclick = () => ui.setMode('end');
document.getElementById('clear-board').onclick = () => { if (!isRunning) { gridManager.resetBoard(); ui.render(); } };
document.getElementById('clear-path').onclick = () => { if (!isRunning) { gridManager.clearPath(); ui.render(); } };
document.getElementById('random-maze').onclick = () => { if (!isRunning) { gridManager.randomMaze(); ui.render(); } };
// document.getElementById('speed-range').oninput = (e) => { animationSpeed = +e.target.value; };
document.getElementById('visualize').onclick = async () => {
  if (isRunning) return;
  isRunning = true;
  ui.lockUI(true);
  showOverlay(true);
  const algoType = document.getElementById('algorithm-select').value;
  const { visited, path } = algo.run(algoType);
  await animate(visited, path);
  isRunning = false;
  ui.lockUI(false);
  showOverlay(false);
};

function showOverlay(show) {
  document.getElementById('overlay').classList.toggle('hidden', !show);
}

async function animate(visited, path) {
  for (let i = 0; i < visited.length; i++) {
    const { row, col } = visited[i];
    gridManager.setVisited(row, col);
    ui.renderCell(row, col, 'visited', true);
    await sleep(document.getElementById('speed-range').valueAsNumber);
  }
  for (let i = 0; i < path.length; i++) {
    const { row, col } = path[i];
    gridManager.setPath(row, col);
    ui.renderCell(row, col, 'path', true);
    await sleep(document.getElementById('speed-range').valueAsNumber);
  }
  document.getElementById('steps-info').textContent = `Steps: ${visited.length}, Path: ${path.length}`;
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// Initial setup
window.onload = () => {
  gridManager.init();
  ui.init();
  gridManager.randomMaze();
  ui.render();
}; 