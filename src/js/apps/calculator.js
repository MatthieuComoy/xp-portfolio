export class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.newNumber = true;
    }

    getWindowOptions() {
        return {
            title: 'Calculator',
            icon: 'calc',
            width: 250,
            height: 300,
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.render();
        this.attachListeners();
    }

    render() {
        this.container.innerHTML = `
      <div class="calculator">
        <div class="calc-display-container">
          <input type="text" class="calc-display" value="0" readonly>
        </div>
        <div class="calc-buttons">
          <div class="calc-row">
            <button class="calc-btn memory">MC</button>
            <button class="calc-btn memory">MR</button>
            <button class="calc-btn memory">MS</button>
            <button class="calc-btn memory">M+</button>
          </div>
          <div class="calc-row">
            <button class="calc-btn action" data-action="backspace">←</button>
            <button class="calc-btn action" data-action="ce">CE</button>
            <button class="calc-btn action" data-action="c">C</button>
            <button class="calc-btn action" data-action="pm">±</button>
            <button class="calc-btn operator" data-op="sqrt">√</button>
          </div>
          <div class="calc-row">
            <button class="calc-btn number">7</button>
            <button class="calc-btn number">8</button>
            <button class="calc-btn number">9</button>
            <button class="calc-btn operator" data-op="/">/</button>
            <button class="calc-btn operator" data-op="%">%</button>
          </div>
          <div class="calc-row">
            <button class="calc-btn number">4</button>
            <button class="calc-btn number">5</button>
            <button class="calc-btn number">6</button>
            <button class="calc-btn operator" data-op="*">*</button>
            <button class="calc-btn operator" data-op="recip">1/x</button>
          </div>
          <div class="calc-row">
            <button class="calc-btn number">1</button>
            <button class="calc-btn number">2</button>
            <button class="calc-btn number">3</button>
            <button class="calc-btn operator" data-op="-">-</button>
            <button class="calc-btn equals" data-action="equals">=</button>
          </div>
          <div class="calc-row">
            <button class="calc-btn number zero">0</button>
            <button class="calc-btn number">.</button>
            <button class="calc-btn operator" data-op="+">+</button>
          </div>
        </div>
      </div>
      <style>
        .calculator {
          padding: 10px;
          background: #ECE9D8;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .calc-display-container {
          margin-bottom: 10px;
        }
        .calc-display {
          width: 100%;
          text-align: right;
          padding: 5px;
          font-family: monospace;
          font-size: 20px;
          border: 1px solid #7F9DB9;
        }
        .calc-buttons {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .calc-row {
          display: flex;
          gap: 5px;
        }
        .calc-btn {
          flex: 1;
          padding: 5px;
          font-size: 12px;
          min-width: 30px;
          cursor: pointer;
          border: 1px solid #7F9DB9;
          background: linear-gradient(to bottom, #FFF 0%, #ECE9D8 100%);
          border-radius: 3px;
        }
        .calc-btn:active {
          background: #D2D2D2;
          box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
        }
        .calc-btn.memory { color: red; }
        .calc-btn.action { color: blue; }
        .calc-btn.operator { color: blue; }
        .calc-btn.equals { height: 100%; grid-row: span 2; }
        .calc-btn.zero { flex: 2; }
      </style>
    `;
    }

    attachListeners() {
        const display = this.container.querySelector('.calc-display');

        this.container.querySelectorAll('.number').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.newNumber) {
                    this.currentValue = btn.innerText;
                    this.newNumber = false;
                } else {
                    this.currentValue = this.currentValue === '0' ? btn.innerText : this.currentValue + btn.innerText;
                }
                display.value = this.currentValue;
            });
        });

        this.container.querySelectorAll('.operator').forEach(btn => {
            btn.addEventListener('click', () => {
                const op = btn.dataset.op;
                if (['sqrt', '%', 'recip'].includes(op)) {
                    this.handleUnaryOp(op);
                } else {
                    this.handleBinaryOp(op);
                }
                display.value = this.currentValue;
            });
        });

        this.container.querySelector('[data-action="equals"]').addEventListener('click', () => {
            this.calculate();
            display.value = this.currentValue;
            this.newNumber = true;
            this.operation = null;
            this.previousValue = null;
        });

        this.container.querySelector('[data-action="c"]').addEventListener('click', () => {
            this.currentValue = '0';
            this.previousValue = null;
            this.operation = null;
            this.newNumber = true;
            display.value = this.currentValue;
        });
    }

    handleBinaryOp(op) {
        if (this.operation && !this.newNumber) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operation = op;
        this.newNumber = true;
    }

    handleUnaryOp(op) {
        let val = parseFloat(this.currentValue);
        if (op === 'sqrt') val = Math.sqrt(val);
        if (op === 'recip') val = 1 / val;
        if (op === '%') val = val / 100;
        this.currentValue = val.toString();
        this.newNumber = true;
    }

    calculate() {
        if (!this.operation || !this.previousValue) return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result = 0;

        switch (this.operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '*': result = prev * current; break;
            case '/': result = prev / current; break;
        }

        this.currentValue = result.toString();
    }
}
