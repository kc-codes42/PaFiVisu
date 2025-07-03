export class UIController {
  constructor(gridManager) {
    this.gridManager = gridManager;
    this.mode = null; // 'start', 'end', or null
    this.gridContainer = document.getElementById('grid-container');
    this.attachCellHandler();
  }

  init() {
    this.attachCellHandler();
  }

  setMode(mode) {
    this.mode = this.mode === mode ? null : mode;
    document.getElementById('set-start').classList.toggle('ring-2', this.mode === 'start');
    document.getElementById('set-end').classList.toggle('ring-2', this.mode === 'end');
  }

  lockUI(lock) {
    const controls = document.querySelectorAll('.controls button, .controls select, .controls input');
    controls.forEach(el => { el.disabled = lock; el.classList.toggle('opacity-60', lock); });
  }

  attachCellHandler() {
    this.gridContainer.onclick = (e) => {
      if (!e.target.classList.contains('cell')) return;
      if (window.isRunning) return;
      const row = +e.target.dataset.row;
      const col = +e.target.dataset.col;
      if (this.mode === 'start') {
        this.gridManager.setStart(row, col);
        this.setMode(null);
      } else if (this.mode === 'end') {
        this.gridManager.setEnd(row, col);
        this.setMode(null);
      } else {
        this.gridManager.toggleWall(row, col);
      }
      this.render();
    };
  }

  render() {
    // Only create cells if not already present
    if (this.gridContainer.childNodes.length !== this.gridManager.rows * this.gridManager.cols) {
      this.gridContainer.innerHTML = '';
      for (let row = 0; row < this.gridManager.rows; row++) {
        for (let col = 0; col < this.gridManager.cols; col++) {
          const cell = document.createElement('div');
          cell.className = this.getCellClass(this.gridManager.getState(row, col));
          cell.dataset.row = row;
          cell.dataset.col = col;
          cell.dataset.state = this.gridManager.getState(row, col);
          this.gridContainer.appendChild(cell);
        }
      }
    } else {
      // Just update classes
      let idx = 0;
      for (let row = 0; row < this.gridManager.rows; row++) {
        for (let col = 0; col < this.gridManager.cols; col++) {
          const cell = this.gridContainer.childNodes[idx++];
          cell.className = this.getCellClass(this.gridManager.getState(row, col));
          cell.dataset.state = this.gridManager.getState(row, col);
        }
      }
    }
  }

  renderCell(row, col, overrideState = null, animate = false) {
    const idx = row * this.gridManager.cols + col;
    const cell = this.gridContainer.childNodes[idx];
    // Always keep start/end node colors
    const baseState = this.gridManager.getState(row, col);
    let state = overrideState || baseState;
    if (baseState === 'start' || baseState === 'end') {
      state = baseState;
      animate = false;
    }
    cell.className = this.getCellClass(state, animate);
    cell.dataset.state = state;
  }

  getCellClass(state, animate = false) {
    let base = 'cell w-6 h-6 rounded-md border border-[#e0e0e0] transition-colors duration-200 ease-in-out inline-block ';
    let color = '';
    if (state === 'empty') color = 'bg-[#e0e0e0]';
    else if (state === 'wall') color = 'bg-[#475569]';
    else if (state === 'start') color = 'bg-[#6ee7b7]';
    else if (state === 'end') color = 'bg-[#fb7185]';
    // Use a more distinctive blue for visited, no animation
    else if (state === 'visited') color = 'bg-[#7dd3fc]';
    // Use a solid yellow for path, no animation
    else if (state === 'path') color = 'bg-[#fde68a]';
    return base + color;
  }
} 