export class Minesweeper {
    constructor() {
        this.rows = 9;
        this.cols = 9;
        this.mines = 10;
        this.grid = [];
        this.gameOver = false;
        this.flags = 0;
    }

    getWindowOptions() {
        return {
            title: 'Minesweeper',
            icon: 'mine',
            width: 200,
            height: 300,
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.render();
        this.startNewGame();
    }

    render() {
        this.container.innerHTML = `
      <div class="minesweeper">
        <div class="mine-header">
          <div class="mine-counter">010</div>
          <button class="smiley-btn">😊</button>
          <div class="timer">000</div>
        </div>
        <div class="mine-grid"></div>
      </div>
      <style>
        .minesweeper {
          background: #C0C0C0;
          padding: 5px;
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 2px solid white;
          border-right-color: #808080;
          border-bottom-color: #808080;
        }
        .mine-header {
          border: 2px solid #808080;
          border-right-color: white;
          border-bottom-color: white;
          padding: 5px;
          margin-bottom: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mine-counter, .timer {
          background: black;
          color: red;
          font-family: 'Courier New', monospace;
          font-size: 20px;
          padding: 2px;
          border: 1px solid #808080;
        }
        .smiley-btn {
          width: 26px;
          height: 26px;
          font-size: 16px;
          padding: 0;
          cursor: pointer;
          border: 2px solid white;
          border-right-color: #808080;
          border-bottom-color: #808080;
        }
        .smiley-btn:active {
          border: 2px solid #808080;
          border-right-color: white;
          border-bottom-color: white;
        }
        .mine-grid {
          border: 3px solid #808080;
          border-right-color: white;
          border-bottom-color: white;
          display: grid;
          grid-template-columns: repeat(9, 16px);
          grid-template-rows: repeat(9, 16px);
        }
        .cell {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-right-color: #808080;
          border-bottom-color: #808080;
          background: #C0C0C0;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          font-weight: bold;
        }
        .cell.revealed {
          border: 1px solid #808080;
          border-top: none;
          border-left: none;
          background: #C0C0C0;
        }
        .cell.mine {
          background: red;
        }
        .cell.flagged {
          color: red;
        }
      </style>
    `;

        this.container.querySelector('.smiley-btn').addEventListener('click', () => this.startNewGame());
    }

    startNewGame() {
        this.gameOver = false;
        this.flags = 0;
        this.grid = [];
        this.updateCounter();

        // Initialize grid
        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push({ isMine: false, revealed: false, flagged: false, neighborMines: 0 });
            }
            this.grid.push(row);
        }

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (!this.grid[r][c].isMine) {
                this.grid[r][c].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate neighbors
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.grid[r][c].isMine) {
                    this.grid[r][c].neighborMines = this.countNeighborMines(r, c);
                }
            }
        }

        this.renderGrid();
    }

    countNeighborMines(r, c) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (r + i >= 0 && r + i < this.rows && c + j >= 0 && c + j < this.cols) {
                    if (this.grid[r + i][c + j].isMine) count++;
                }
            }
        }
        return count;
    }

    renderGrid() {
        const gridEl = this.container.querySelector('.mine-grid');
        gridEl.innerHTML = '';

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.r = r;
                cell.dataset.c = c;

                const cellData = this.grid[r][c];
                if (cellData.revealed) {
                    cell.classList.add('revealed');
                    if (cellData.isMine) {
                        cell.classList.add('mine');
                        cell.textContent = '💣';
                    } else if (cellData.neighborMines > 0) {
                        cell.textContent = cellData.neighborMines;
                        cell.style.color = this.getNumberColor(cellData.neighborMines);
                    }
                } else if (cellData.flagged) {
                    cell.classList.add('flagged');
                    cell.textContent = '🚩';
                }

                cell.addEventListener('mousedown', (e) => {
                    if (this.gameOver) return;
                    if (e.button === 2) {
                        this.toggleFlag(r, c);
                    } else {
                        this.revealCell(r, c);
                    }
                });

                cell.addEventListener('contextmenu', (e) => e.preventDefault());

                gridEl.appendChild(cell);
            }
        }
    }

    getNumberColor(n) {
        const colors = ['blue', 'green', 'red', 'darkblue', 'brown', 'cyan', 'black', 'gray'];
        return colors[n - 1] || 'black';
    }

    toggleFlag(r, c) {
        const cell = this.grid[r][c];
        if (cell.revealed) return;

        cell.flagged = !cell.flagged;
        this.flags += cell.flagged ? 1 : -1;
        this.updateCounter();
        this.renderGrid();
    }

    revealCell(r, c) {
        const cell = this.grid[r][c];
        if (cell.revealed || cell.flagged) return;

        cell.revealed = true;

        if (cell.isMine) {
            this.gameOver = true;
            this.revealAllMines();
            this.container.querySelector('.smiley-btn').textContent = '😵';
        } else if (cell.neighborMines === 0) {
            // Flood fill
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (r + i >= 0 && r + i < this.rows && c + j >= 0 && c + j < this.cols) {
                        this.revealCell(r + i, c + j);
                    }
                }
            }
        }

        this.renderGrid();
        this.checkWin();
    }

    revealAllMines() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isMine) {
                    this.grid[r][c].revealed = true;
                }
            }
        }
    }

    checkWin() {
        if (this.gameOver) return;

        let unrevealedSafeCells = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.grid[r][c].isMine && !this.grid[r][c].revealed) {
                    unrevealedSafeCells++;
                }
            }
        }

        if (unrevealedSafeCells === 0) {
            this.gameOver = true;
            this.container.querySelector('.smiley-btn').textContent = '😎';
        }
    }

    updateCounter() {
        const count = Math.max(0, this.mines - this.flags);
        this.container.querySelector('.mine-counter').textContent = count.toString().padStart(3, '0');
    }
}
