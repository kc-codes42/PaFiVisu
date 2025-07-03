// --- Grid and State Management ---
const ROWS = 25;
const COLS = 50;
const gridContainer = document.getElementById('grid-container');
const stepsInfo = document.getElementById('steps-info');

const CELL_STATE = {
  EMPTY: 'empty',
  WALL: 'wall',
  START: 'start',
  END: 'end',
  VISITED: 'visited',
  PATH: 'path',
};

let grid = [];
let startNode = { row: 12, col: 10 };
let endNode = { row: 12, col: 40 };
let isSettingStart = false;
let isSettingEnd = false;
let isVisualizing = false;
let animationSpeed = 50;

function createGrid() {
  grid = [];
  gridContainer.innerHTML = '';
  for (let row = 0; row < ROWS; row++) {
    const rowArr = [];
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      let state = CELL_STATE.EMPTY;
      if (row === startNode.row && col === startNode.col) {
        state = CELL_STATE.START;
        cell.classList.add('start');
      } else if (row === endNode.row && col === endNode.col) {
        state = CELL_STATE.END;
        cell.classList.add('end');
      }
      cell.dataset.state = state;
      cell.addEventListener('click', onCellClick);
      gridContainer.appendChild(cell);
      rowArr.push({ state, cell });
    }
    grid.push(rowArr);
  }
}

function onCellClick(e) {
  if (isVisualizing) return;
  const cell = e.target;
  const row = +cell.dataset.row;
  const col = +cell.dataset.col;
  if (isSettingStart) {
    setStartNode(row, col);
    isSettingStart = false;
    document.getElementById('set-start').classList.remove('active');
    return;
  }
  if (isSettingEnd) {
    setEndNode(row, col);
    isSettingEnd = false;
    document.getElementById('set-end').classList.remove('active');
    return;
  }
  // Toggle wall
  if (grid[row][col].state === CELL_STATE.EMPTY) {
    setCellState(row, col, CELL_STATE.WALL);
  } else if (grid[row][col].state === CELL_STATE.WALL) {
    setCellState(row, col, CELL_STATE.EMPTY);
  }
}

function setCellState(row, col, state) {
  const cellObj = grid[row][col];
  cellObj.state = state;
  const cell = cellObj.cell;
  cell.className = 'cell';
  cell.dataset.state = state;
  if (state !== CELL_STATE.EMPTY) cell.classList.add(state);
}

function setStartNode(row, col) {
  // Remove old start
  setCellState(startNode.row, startNode.col, CELL_STATE.EMPTY);
  startNode = { row, col };
  setCellState(row, col, CELL_STATE.START);
}

function setEndNode(row, col) {
  // Remove old end
  setCellState(endNode.row, endNode.col, CELL_STATE.EMPTY);
  endNode = { row, col };
  setCellState(row, col, CELL_STATE.END);
}

// --- Control Handlers ---
document.getElementById('set-start').onclick = () => {
  isSettingStart = !isSettingStart;
  document.getElementById('set-start').classList.toggle('active');
  isSettingEnd = false;
  document.getElementById('set-end').classList.remove('active');
};
document.getElementById('set-end').onclick = () => {
  isSettingEnd = !isSettingEnd;
  document.getElementById('set-end').classList.toggle('active');
  isSettingStart = false;
  document.getElementById('set-start').classList.remove('active');
};
document.getElementById('clear-board').onclick = () => {
  if (isVisualizing) return;
  startNode = { row: 12, col: 10 };
  endNode = { row: 12, col: 40 };
  createGrid();
};
document.getElementById('clear-path').onclick = () => {
  if (isVisualizing) return;
  clearPath();
};
document.getElementById('random-maze').onclick = () => {
  if (isVisualizing) return;
  randomizeWalls();
};
document.getElementById('speed-range').oninput = (e) => {
  animationSpeed = +e.target.value;
};
document.getElementById('visualize').onclick = () => {
  if (isVisualizing) return;
  visualize();
};

// --- Visualization and Algorithms (Placeholders) ---
function clearPath() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (
        grid[row][col].state === CELL_STATE.VISITED ||
        grid[row][col].state === CELL_STATE.PATH
      ) {
        setCellState(row, col, CELL_STATE.EMPTY);
      }
      if (
        row === startNode.row && col === startNode.col
      ) setCellState(row, col, CELL_STATE.START);
      if (
        row === endNode.row && col === endNode.col
      ) setCellState(row, col, CELL_STATE.END);
    }
  }
  stepsInfo.textContent = '';
}

function randomizeWalls() {
  clearPath();
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (
        (row === startNode.row && col === startNode.col) ||
        (row === endNode.row && col === endNode.col)
      ) continue;
      setCellState(row, col, Math.random() < 0.25 ? CELL_STATE.WALL : CELL_STATE.EMPTY);
    }
  }
}

function visualize() {
  clearPath();
  const algorithm = document.getElementById('algorithm-select').value;
  isVisualizing = true;
  stepsInfo.textContent = 'Visualizing...';
  let result;
  switch (algorithm) {
    case 'bfs':
      result = bfs();
      break;
    case 'dfs':
      result = dfs();
      break;
    case 'dijkstra':
      result = dijkstra();
      break;
    case 'astar':
      result = astar();
      break;
  }
  if (result) {
    animatePath(result.visited, result.path, () => {
      isVisualizing = false;
      stepsInfo.textContent = `Steps: ${result.visited.length}, Path: ${result.path.length}`;
    });
  } else {
    isVisualizing = false;
    stepsInfo.textContent = 'No path found.';
  }
}

function animatePath(visited, path, onDone) {
  let i = 0;
  function visitNext() {
    if (i < visited.length) {
      const { row, col } = visited[i++];
      if (
        grid[row][col].state !== CELL_STATE.START &&
        grid[row][col].state !== CELL_STATE.END
      ) setCellState(row, col, CELL_STATE.VISITED);
      setTimeout(visitNext, animationSpeed);
    } else {
      let j = 0;
      function showPath() {
        if (j < path.length) {
          const { row, col } = path[j++];
          if (
            grid[row][col].state !== CELL_STATE.START &&
            grid[row][col].state !== CELL_STATE.END
          ) setCellState(row, col, CELL_STATE.PATH);
          setTimeout(showPath, animationSpeed);
        } else {
          onDone();
        }
      }
      showPath();
    }
  }
  visitNext();
}

// --- Algorithm Implementations ---
function bfs() {
  const visited = [];
  const prev = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const queue = [];
  const visitedSet = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  queue.push({ row: startNode.row, col: startNode.col });
  visitedSet[startNode.row][startNode.col] = true;
  let found = false;
  while (queue.length) {
    const { row, col } = queue.shift();
    visited.push({ row, col });
    if (row === endNode.row && col === endNode.col) {
      found = true;
      break;
    }
    for (const [dr, dc] of [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ]) {
      const nr = row + dr, nc = col + dc;
      if (
        nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
        !visitedSet[nr][nc] &&
        grid[nr][nc].state !== CELL_STATE.WALL
      ) {
        queue.push({ row: nr, col: nc });
        visitedSet[nr][nc] = true;
        prev[nr][nc] = { row, col };
      }
    }
  }
  const path = found ? reconstructPath(prev, endNode) : [];
  return { visited, path };
}

function dfs() {
  const visited = [];
  const prev = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const stack = [];
  const visitedSet = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  stack.push({ row: startNode.row, col: startNode.col });
  visitedSet[startNode.row][startNode.col] = true;
  let found = false;
  while (stack.length) {
    const { row, col } = stack.pop();
    visited.push({ row, col });
    if (row === endNode.row && col === endNode.col) {
      found = true;
      break;
    }
    for (const [dr, dc] of [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ]) {
      const nr = row + dr, nc = col + dc;
      if (
        nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
        !visitedSet[nr][nc] &&
        grid[nr][nc].state !== CELL_STATE.WALL
      ) {
        stack.push({ row: nr, col: nc });
        visitedSet[nr][nc] = true;
        prev[nr][nc] = { row, col };
      }
    }
  }
  const path = found ? reconstructPath(prev, endNode) : [];
  return { visited, path };
}

function dijkstra() {
  const visited = [];
  const prev = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const dist = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const visitedSet = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  dist[startNode.row][startNode.col] = 0;
  const pq = [{ row: startNode.row, col: startNode.col, dist: 0 }];
  function pqSort() { pq.sort((a, b) => a.dist - b.dist); }
  let found = false;
  while (pq.length) {
    pqSort();
    const { row, col, dist: d } = pq.shift();
    if (visitedSet[row][col]) continue;
    visitedSet[row][col] = true;
    visited.push({ row, col });
    if (row === endNode.row && col === endNode.col) {
      found = true;
      break;
    }
    for (const [dr, dc] of [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ]) {
      const nr = row + dr, nc = col + dc;
      if (
        nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
        !visitedSet[nr][nc] &&
        grid[nr][nc].state !== CELL_STATE.WALL
      ) {
        const newDist = d + 1; // All weights = 1
        if (newDist < dist[nr][nc]) {
          dist[nr][nc] = newDist;
          prev[nr][nc] = { row, col };
          pq.push({ row: nr, col: nc, dist: newDist });
        }
      }
    }
  }
  const path = found ? reconstructPath(prev, endNode) : [];
  return { visited, path };
}

function astar() {
  const visited = [];
  const prev = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const gScore = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const fScore = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const visitedSet = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  gScore[startNode.row][startNode.col] = 0;
  fScore[startNode.row][startNode.col] = manhattan(startNode, endNode);
  const openSet = [{ row: startNode.row, col: startNode.col, f: fScore[startNode.row][startNode.col] }];
  function openSort() { openSet.sort((a, b) => a.f - b.f); }
  let found = false;
  while (openSet.length) {
    openSort();
    const { row, col } = openSet.shift();
    if (visitedSet[row][col]) continue;
    visitedSet[row][col] = true;
    visited.push({ row, col });
    if (row === endNode.row && col === endNode.col) {
      found = true;
      break;
    }
    for (const [dr, dc] of [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ]) {
      const nr = row + dr, nc = col + dc;
      if (
        nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
        !visitedSet[nr][nc] &&
        grid[nr][nc].state !== CELL_STATE.WALL
      ) {
        const tentativeG = gScore[row][col] + 1;
        if (tentativeG < gScore[nr][nc]) {
          gScore[nr][nc] = tentativeG;
          fScore[nr][nc] = tentativeG + manhattan({ row: nr, col: nc }, endNode);
          prev[nr][nc] = { row, col };
          openSet.push({ row: nr, col: nc, f: fScore[nr][nc] });
        }
      }
    }
  }
  const path = found ? reconstructPath(prev, endNode) : [];
  return { visited, path };
}

function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function reconstructPath(prev, end) {
  const path = [];
  let curr = { row: end.row, col: end.col };
  while (prev[curr.row][curr.col]) {
    path.push(curr);
    curr = prev[curr.row][curr.col];
  }
  path.reverse();
  return path;
}

// --- Init ---
window.onload = () => {
  createGrid();
  randomizeWalls();
}; 