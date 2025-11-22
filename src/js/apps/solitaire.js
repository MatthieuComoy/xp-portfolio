export class Solitaire {
    constructor() {
        this.deck = [];
        this.piles = {
            stock: [],
            waste: [],
            foundations: [[], [], [], []],
            tableau: [[], [], [], [], [], [], []]
        };
        this.draggedCard = null;
        this.sourcePile = null;
    }

    getWindowOptions() {
        return {
            title: 'Solitaire',
            icon: 'solitaire',
            width: 800,
            height: 600,
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.startNewGame();
    }

    startNewGame() {
        this.createDeck();
        this.shuffleDeck();
        this.deal();
        this.render();
    }

    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    suit,
                    value,
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                    faceUp: false
                });
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    deal() {
        this.piles = {
            stock: [],
            waste: [],
            foundations: [[], [], [], []],
            tableau: [[], [], [], [], [], [], []]
        };

        // Deal to tableau
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                const card = this.deck.pop();
                if (j === i) card.faceUp = true;
                this.piles.tableau[i].push(card);
            }
        }

        // Rest to stock
        this.piles.stock = this.deck;
    }

    render() {
        this.container.innerHTML = `
            <div class="solitaire-board">
                <div class="top-row">
                    <div class="stock-pile" id="stock">
                        ${this.piles.stock.length > 0 ? '<div class="card back"></div>' : '<div class="empty-slot"></div>'}
                    </div>
                    <div class="waste-pile" id="waste">
                        ${this.renderCard(this.piles.waste[this.piles.waste.length - 1])}
                    </div>
                    <div class="spacer"></div>
                    <div class="foundations">
                        ${this.piles.foundations.map((pile, i) => `
                            <div class="foundation-pile" data-index="${i}">
                                ${pile.length > 0 ? this.renderCard(pile[pile.length - 1]) : '<div class="empty-slot"></div>'}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="tableau-row">
                    ${this.piles.tableau.map((pile, i) => `
                        <div class="tableau-pile" data-index="${i}">
                            ${pile.map((card, cardIndex) => `
                                <div class="card-wrapper" style="top: ${cardIndex * 20}px">
                                    ${this.renderCard(card)}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
            <style>
                .solitaire-board {
                    background-color: #008000;
                    height: 100%;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    user-select: none;
                }
                .top-row {
                    display: flex;
                    gap: 20px;
                    height: 100px;
                }
                .tableau-row {
                    display: flex;
                    gap: 20px;
                    flex: 1;
                }
                .card {
                    width: 70px;
                    height: 100px;
                    background: white;
                    border-radius: 4px;
                    border: 1px solid #999;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 5px;
                    font-family: Arial, sans-serif;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                }
                .card.red { color: red; }
                .card.black { color: black; }
                .card.back {
                    background: repeating-linear-gradient(
                        45deg,
                        #606dbc,
                        #606dbc 10px,
                        #465298 10px,
                        #465298 20px
                    );
                    border: 2px solid white;
                }
                .empty-slot {
                    width: 70px;
                    height: 100px;
                    border: 2px dashed rgba(255,255,255,0.3);
                    border-radius: 4px;
                }
                .tableau-pile {
                    position: relative;
                    width: 70px;
                    min-height: 100px;
                }
                .card-wrapper {
                    position: absolute;
                    width: 100%;
                }
                .spacer { flex: 1; }
                .foundations { display: flex; gap: 20px; }
            </style>
        `;

        this.attachListeners();
    }

    renderCard(card) {
        if (!card) return '';
        if (!card.faceUp) return '<div class="card back"></div>';
        return `
            <div class="card ${card.color}" draggable="true">
                <div class="card-top">${card.value} ${card.suit}</div>
                <div class="card-center" style="font-size: 24px; align-self: center;">${card.suit}</div>
                <div class="card-bottom" style="transform: rotate(180deg);">${card.value} ${card.suit}</div>
            </div>
        `;
    }

    attachListeners() {
        // Stock pile click
        const stock = this.container.querySelector('#stock');
        stock.addEventListener('click', () => {
            if (this.piles.stock.length > 0) {
                const card = this.piles.stock.pop();
                card.faceUp = true;
                this.piles.waste.push(card);
            } else {
                // Recycle waste to stock
                while (this.piles.waste.length > 0) {
                    const card = this.piles.waste.pop();
                    card.faceUp = false;
                    this.piles.stock.push(card);
                }
            }
            this.render();
        });

        // Drag and Drop
        const cards = this.container.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => this.handleDragStart(e));
            card.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        const dropZones = this.container.querySelectorAll('.tableau-pile, .foundation-pile');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }

    handleDragStart(e) {
        // Find the card object and its source
        const cardElement = e.target.closest('.card');
        if (!cardElement || cardElement.classList.contains('back')) {
            e.preventDefault();
            return;
        }

        // We need to identify which pile this card came from
        // This is a bit tricky with the current DOM structure, so let's rely on the data attributes we added or infer from DOM
        // Actually, let's pass the necessary info via data attributes in render

        // For now, let's try to find the card in our state
        const cardValue = cardElement.querySelector('.card-top').textContent.trim();
        // This is not robust enough. Let's improve render to include data attributes for identification.
        // But to avoid rewriting render right now, let's infer from DOM hierarchy

        let sourcePileType, sourcePileIndex, cardIndex;

        const tableauPile = cardElement.closest('.tableau-pile');
        const foundationPile = cardElement.closest('.foundation-pile');
        const wastePile = cardElement.closest('.waste-pile');

        if (wastePile) {
            sourcePileType = 'waste';
            sourcePileIndex = 0;
            cardIndex = this.piles.waste.length - 1;
        } else if (tableauPile) {
            sourcePileType = 'tableau';
            sourcePileIndex = parseInt(tableauPile.dataset.index);
            // Find index in the pile
            const wrapper = cardElement.closest('.card-wrapper');
            const allWrappers = Array.from(tableauPile.querySelectorAll('.card-wrapper'));
            cardIndex = allWrappers.indexOf(wrapper);
        } else if (foundationPile) {
            sourcePileType = 'foundation';
            sourcePileIndex = parseInt(foundationPile.dataset.index);
            cardIndex = this.piles.foundations[sourcePileIndex].length - 1;
        }

        if (sourcePileType) {
            this.draggedCard = {
                type: sourcePileType,
                pileIndex: sourcePileIndex,
                cardIndex: cardIndex
            };
            e.dataTransfer.effectAllowed = 'move';
            // e.dataTransfer.setData('text/plain', JSON.stringify(this.draggedCard)); // Not strictly needed if we use instance var
        } else {
            e.preventDefault();
        }
    }

    handleDragEnd(e) {
        this.draggedCard = null;
    }

    handleDragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();
        if (!this.draggedCard) return;

        const target = e.target.closest('.tableau-pile, .foundation-pile');
        if (!target) return;

        const targetType = target.classList.contains('foundation-pile') ? 'foundation' : 'tableau';
        const targetIndex = parseInt(target.dataset.index);

        if (this.isValidMove(this.draggedCard, targetType, targetIndex)) {
            this.executeMove(this.draggedCard, targetType, targetIndex);
            this.render();
        }

        this.draggedCard = null;
    }

    isValidMove(source, targetType, targetIndex) {
        const sourcePile = this.getPile(source.type, source.pileIndex);
        const cardToMove = sourcePile[source.cardIndex];

        // If moving a stack from tableau, ensure we can move the whole stack
        // (Already handled by logic: we only drag the top of a valid stack? No, in Windows Solitaire you can drag middle)
        // For simplicity, let's first check if we are dragging the top card or a valid substack

        // Check if we are dragging multiple cards (only valid from tableau)
        const cardsToMove = sourcePile.slice(source.cardIndex);

        if (targetType === 'foundation') {
            // Can only move one card at a time to foundation
            if (cardsToMove.length > 1) return false;

            const targetPile = this.piles.foundations[targetIndex];
            const topCard = targetPile[targetPile.length - 1];

            if (!topCard) {
                // Foundation empty: must be Ace
                return cardToMove.value === 'A';
            } else {
                // Must be same suit, one rank higher
                return cardToMove.suit === topCard.suit && this.getRank(cardToMove.value) === this.getRank(topCard.value) + 1;
            }
        } else if (targetType === 'tableau') {
            const targetPile = this.piles.tableau[targetIndex];
            const topCard = targetPile[targetPile.length - 1];

            if (!topCard) {
                // Tableau empty: must be King
                return cardToMove.value === 'K';
            } else {
                // Must be alternating color, one rank lower
                return cardToMove.color !== topCard.color && this.getRank(cardToMove.value) === this.getRank(topCard.value) - 1;
            }
        }

        return false;
    }

    executeMove(source, targetType, targetIndex) {
        const sourcePile = this.getPile(source.type, source.pileIndex);
        const cardsToMove = sourcePile.splice(source.cardIndex); // Remove from source

        // Add to target
        if (targetType === 'foundation') {
            this.piles.foundations[targetIndex].push(...cardsToMove);
        } else {
            this.piles.tableau[targetIndex].push(...cardsToMove);
        }

        // Flip the new top card of source pile if it was face down
        if (sourcePile.length > 0) {
            const newTop = sourcePile[sourcePile.length - 1];
            if (!newTop.faceUp) newTop.faceUp = true;
        }
    }

    getPile(type, index) {
        if (type === 'waste') return this.piles.waste;
        if (type === 'stock') return this.piles.stock;
        if (type === 'foundation') return this.piles.foundations[index];
        if (type === 'tableau') return this.piles.tableau[index];
        return [];
    }

    getRank(value) {
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        return ranks.indexOf(value) + 1;
    }

    cleanup() { }
}
