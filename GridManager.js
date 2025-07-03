export class GridManager {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.start = { row: Math.floor(rows/2), col: 10 };
    this.end = { row: Math.floor(rows/2), col: cols-10 };
  }

  init() {
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        let state = 'empty';
        if (r === this.start.row && c === this.start.col) state = 'start';
        else if (r === this.end.row && c === this.end.col) state = 'end';
        row.push({ state });
      }
      this.grid.push(row);
    }
  }

  getState(row, col) {
    return this.grid[row][col].state;
  }

  setState(row, col, state) {
    this.grid[row][col].state = state;
  }

  setStart(row, col) {
    this.setState(this.start.row, this.start.col, 'empty');
    this.start = { row, col };
    this.setState(row, col, 'start');
  }

  setEnd(row, col) {
    this.setState(this.end.row, this.end.col, 'empty');
    this.end = { row, col };
    this.setState(row, col, 'end');
  }

  toggleWall(row, col) {
    const state = this.getState(row, col);
    if (state === 'empty') this.setState(row, col, 'wall');
    else if (state === 'wall') this.setState(row, col, 'empty');
  }

  setVisited(row, col) {
    if (!['start','end','wall'].includes(this.getState(row, col)))
      this.setState(row, col, 'visited');
  }

  setPath(row, col) {
    if (!['start','end','wall'].includes(this.getState(row, col)))
      this.setState(row, col, 'path');
  }

  resetBoard() {
    this.start = { row: Math.floor(this.rows/2), col: 10 };
    this.end = { row: Math.floor(this.rows/2), col: this.cols-10 };
    this.init();
  }

  clearPath() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (['visited','path'].includes(this.getState(r, c)))
          this.setState(r, c, 'empty');
        if (r === this.start.row && c === this.start.col) this.setState(r, c, 'start');
        if (r === this.end.row && c === this.end.col) this.setState(r, c, 'end');
      }
    }
  }

  randomMaze() {
    this.clearPath();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if ((r === this.start.row && c === this.start.col) || (r === this.end.row && c === this.end.col)) continue;
        this.setState(r, c, Math.random() < 0.25 ? 'wall' : 'empty');
      }
    }
  }
} 