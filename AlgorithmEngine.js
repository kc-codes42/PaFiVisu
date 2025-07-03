export class AlgorithmEngine {
  constructor(gridManager) {
    this.gridManager = gridManager;
  }

  run(type) {
    switch(type) {
      case 'bfs': return this.bfs();
      case 'dfs': return this.dfs();
      case 'dijkstra': return this.dijkstra();
      case 'astar': return this.astar();
      default: return { visited: [], path: [] };
    }
  }

  bfs() {
    const { rows, cols, start, end, grid } = this.gridManager;
    const visited = [];
    const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
    const queue = [];
    const visitedSet = Array.from({ length: rows }, () => Array(cols).fill(false));
    queue.push({ row: start.row, col: start.col });
    visitedSet[start.row][start.col] = true;
    let found = false;
    while (queue.length) {
      const { row, col } = queue.shift();
      visited.push({ row, col });
      if (row === end.row && col === end.col) { found = true; break; }
      for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
        const nr = row+dr, nc = col+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && !visitedSet[nr][nc] && grid[nr][nc].state !== 'wall') {
          queue.push({ row: nr, col: nc });
          visitedSet[nr][nc] = true;
          prev[nr][nc] = { row, col };
        }
      }
    }
    const path = found ? this.reconstructPath(prev, end) : [];
    return { visited, path };
  }

  dfs() {
    const { rows, cols, start, end, grid } = this.gridManager;
    const visited = [];
    const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
    const stack = [];
    const visitedSet = Array.from({ length: rows }, () => Array(cols).fill(false));
    stack.push({ row: start.row, col: start.col });
    visitedSet[start.row][start.col] = true;
    let found = false;
    while (stack.length) {
      const { row, col } = stack.pop();
      visited.push({ row, col });
      if (row === end.row && col === end.col) { found = true; break; }
      for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
        const nr = row+dr, nc = col+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && !visitedSet[nr][nc] && grid[nr][nc].state !== 'wall') {
          stack.push({ row: nr, col: nc });
          visitedSet[nr][nc] = true;
          prev[nr][nc] = { row, col };
        }
      }
    }
    const path = found ? this.reconstructPath(prev, end) : [];
    return { visited, path };
  }

  dijkstra() {
    const { rows, cols, start, end, grid } = this.gridManager;
    const visited = [];
    const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
    const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const visitedSet = Array.from({ length: rows }, () => Array(cols).fill(false));
    dist[start.row][start.col] = 0;
    const pq = [{ row: start.row, col: start.col, dist: 0 }];
    function pqSort() { pq.sort((a, b) => a.dist - b.dist); }
    let found = false;
    while (pq.length) {
      pqSort();
      const { row, col, dist: d } = pq.shift();
      if (visitedSet[row][col]) continue;
      visitedSet[row][col] = true;
      visited.push({ row, col });
      if (row === end.row && col === end.col) { found = true; break; }
      for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
        const nr = row+dr, nc = col+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && !visitedSet[nr][nc] && grid[nr][nc].state !== 'wall') {
          const newDist = d + 1;
          if (newDist < dist[nr][nc]) {
            dist[nr][nc] = newDist;
            prev[nr][nc] = { row, col };
            pq.push({ row: nr, col: nc, dist: newDist });
          }
        }
      }
    }
    const path = found ? this.reconstructPath(prev, end) : [];
    return { visited, path };
  }

  astar() {
    const { rows, cols, start, end, grid } = this.gridManager;
    const visited = [];
    const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
    const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const visitedSet = Array.from({ length: rows }, () => Array(cols).fill(false));
    gScore[start.row][start.col] = 0;
    fScore[start.row][start.col] = this.manhattan(start, end);
    const openSet = [{ row: start.row, col: start.col, f: fScore[start.row][start.col] }];
    function openSort() { openSet.sort((a, b) => a.f - b.f); }
    let found = false;
    while (openSet.length) {
      openSort();
      const { row, col } = openSet.shift();
      if (visitedSet[row][col]) continue;
      visitedSet[row][col] = true;
      visited.push({ row, col });
      if (row === end.row && col === end.col) { found = true; break; }
      for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
        const nr = row+dr, nc = col+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && !visitedSet[nr][nc] && grid[nr][nc].state !== 'wall') {
          const tentativeG = gScore[row][col] + 1;
          if (tentativeG < gScore[nr][nc]) {
            gScore[nr][nc] = tentativeG;
            fScore[nr][nc] = tentativeG + this.manhattan({ row: nr, col: nc }, end);
            prev[nr][nc] = { row, col };
            openSet.push({ row: nr, col: nc, f: fScore[nr][nc] });
          }
        }
      }
    }
    const path = found ? this.reconstructPath(prev, end) : [];
    return { visited, path };
  }

  manhattan(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }

  reconstructPath(prev, end) {
    const path = [];
    let curr = { row: end.row, col: end.col };
    while (prev[curr.row][curr.col]) {
      path.push(curr);
      curr = prev[curr.row][curr.col];
    }
    path.reverse();
    return path;
  }
} 