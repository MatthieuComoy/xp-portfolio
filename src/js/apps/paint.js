export class Paint {
    constructor() {
        this.isDrawing = false;
        this.color = '#000000';
        this.tool = 'pencil';
        this.lineWidth = 2;
    }

    getWindowOptions() {
        return {
            title: 'Untitled - Paint',
            icon: 'paint',
            width: 600,
            height: 450,
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.render();
        this.setupCanvas();
        this.attachListeners();
    }

    render() {
        this.container.innerHTML = `
      <div class="paint-app">
        <div class="paint-sidebar">
          <div class="tools-panel">
            <button class="tool-btn active" data-tool="pencil">✎</button>
            <button class="tool-btn" data-tool="eraser">⌫</button>
            <button class="tool-btn" data-tool="fill">🪣</button>
          </div>
          <div class="colors-panel">
            <div class="color-box" style="background: #000" data-color="#000000"></div>
            <div class="color-box" style="background: #FFF" data-color="#FFFFFF"></div>
            <div class="color-box" style="background: #F00" data-color="#FF0000"></div>
            <div class="color-box" style="background: #0F0" data-color="#00FF00"></div>
            <div class="color-box" style="background: #00F" data-color="#0000FF"></div>
            <div class="color-box" style="background: #FF0" data-color="#FFFF00"></div>
            <div class="color-box" style="background: #0FF" data-color="#00FFFF"></div>
            <div class="color-box" style="background: #F0F" data-color="#FF00FF"></div>
          </div>
        </div>
        <div class="canvas-container">
          <canvas id="paint-canvas"></canvas>
        </div>
      </div>
      <style>
        .paint-app {
          display: flex;
          height: 100%;
          background: #C0C0C0;
        }
        .paint-sidebar {
          width: 60px;
          padding: 5px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-right: 1px solid #808080;
        }
        .tools-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        .tool-btn {
          width: 24px;
          height: 24px;
          border: 1px solid #FFF;
          border-right-color: #808080;
          border-bottom-color: #808080;
          background: #C0C0C0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tool-btn.active {
          border: 1px solid #808080;
          border-right-color: #FFF;
          border-bottom-color: #FFF;
          background: #E0E0E0;
        }
        .colors-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          margin-top: auto;
        }
        .color-box {
          width: 20px;
          height: 20px;
          border: 1px solid #808080;
          cursor: pointer;
        }
        .canvas-container {
          flex: 1;
          padding: 10px;
          overflow: auto;
          background: #808080;
        }
        canvas {
          background: white;
          cursor: crosshair;
        }
      </style>
    `;
    }

    setupCanvas() {
        this.canvas = this.container.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        const container = this.container.querySelector('.canvas-container');
        this.canvas.width = Math.max(800, container.clientWidth - 20);
        this.canvas.height = Math.max(600, container.clientHeight - 20);

        // White background
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    attachListeners() {
        // Tools
        this.container.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.tool = btn.dataset.tool;
            });
        });

        // Colors
        this.container.querySelectorAll('.color-box').forEach(box => {
            box.addEventListener('click', () => {
                this.color = box.dataset.color;
            });
        });

        // Drawing
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
    }

    getPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getPos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;

        if (this.tool === 'fill') {
            this.fill(pos.x, pos.y, this.color);
            this.isDrawing = false;
        } else {
            this.draw(e);
        }
    }

    draw(e) {
        if (!this.isDrawing) return;
        const pos = this.getPos(e);

        this.ctx.beginPath();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        if (this.tool === 'eraser') {
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 10;
        } else {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.lineWidth;
        }

        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    fill(x, y, color) {
        // Simple fill implementation could go here
        // For now, just fill rect as placeholder for complex flood fill
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
