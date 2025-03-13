/**
 * Math Bingo Game
 * A bingo game using multiplication facts
 */

class MathBingoGame {
    constructor() {
        // Game settings
        this.difficulty = 'easy';
        this.boardSize = 4; // Default 4x4 board
        
        // Game state
        this.bingoBoard = [];
        this.calledFacts = [];
        this.currentFactIndex = -1;
        this.startTime = null;
        this.endTime = null;
        this.bingoAchieved = false;
        
        // DOM elements
        this.container = document.getElementById('bingo-game-container');
        this.settingsForm = {
            difficulty: document.getElementById('bingo-difficulty'),
            size: document.getElementById('bingo-size'),
            startButton: document.getElementById('start-bingo')
        };
        
        // Initialize the game
        this.init();
    }
    
    /**
     * Initialize event listeners and UI
     */
    init() {
        if (!this.container) return;
        
        // Set up event listeners for settings form
        if (this.settingsForm.startButton) {
            this.settingsForm.startButton.addEventListener('click', () => {
                this.loadSettings();
                this.startGame();
            });
        }
    }
    
    /**
     * Load settings from form
     */
    loadSettings() {
        if (this.settingsForm.difficulty) {
            this.difficulty = this.settingsForm.difficulty.value;
        }
        
        if (this.settingsForm.size) {
            this.boardSize = parseInt(this.settingsForm.size.value);
        }
    }
    
    /**
     * Start the game
     */
    startGame() {
        this.bingoBoard = [];
        this.calledFacts = [];
        this.currentFactIndex = -1;
        this.bingoAchieved = false;
        this.startTime = Date.now();
        
        // Generate bingo board
        this.generateBingoBoard();
        
        // Generate facts to be called
        this.generateCalledFacts();
        
        // Render the game UI
        this.renderGameUI();
        
        // Call first fact
        this.callNextFact();
    }
    
    /**
     * Generate the bingo board with random products
     */
    generateBingoBoard() {
        const maxNumber = GameUtils.getDifficultyRange(this.difficulty);
        const totalCells = this.boardSize * this.boardSize;
        const usedProducts = new Set();
        
        // Generate a pool of potential products based on difficulty
        const possibleProducts = [];
        for (let i = 1; i <= maxNumber; i++) {
            for (let j = 1; j <= maxNumber; j++) {
                possibleProducts.push(i * j);
            }
        }
        
        // Remove duplicates
        const uniqueProducts = [...new Set(possibleProducts)];
        
        // Shuffle and pick enough for the board
        const shuffledProducts = GameUtils.shuffleArray(uniqueProducts);
        const selectedProducts = shuffledProducts.slice(0, totalCells);
        
        // Create the board as a 2D array
        this.bingoBoard = [];
        for (let i = 0; i < this.boardSize; i++) {
            const row = [];
            for (let j = 0; j < this.boardSize; j++) {
                const index = i * this.boardSize + j;
                row.push({
                    value: selectedProducts[index],
                    marked: false
                });
            }
            this.bingoBoard.push(row);
        }
    }
    
    /**
     * Generate multiplication facts to be called
     */
    generateCalledFacts() {
        const maxNumber = GameUtils.getDifficultyRange(this.difficulty);
        const allProducts = new Set();
        
        // Get all products from the board
        for (let row of this.bingoBoard) {
            for (let cell of row) {
                allProducts.add(cell.value);
            }
        }
        
        // Generate facts for each product on the board
        const facts = [];
        allProducts.forEach(product => {
            // Find all factor pairs for this product
            for (let i = 1; i <= maxNumber; i++) {
                if (product % i === 0 && product / i <= maxNumber) {
                    facts.push({
                        factString: `${i} × ${product / i}`,
                        product: product
                    });
                }
            }
        });
        
        // Shuffle the facts
        this.calledFacts = GameUtils.shuffleArray(facts);
    }
    
    /**
     * Render the game UI
     */
    renderGameUI() {
        this.container.innerHTML = `
            <div class="bingo-game">
                <div class="bingo-info">
                    <h3>Called Fact:</h3>
                    <div class="bingo-call" id="bingo-call">Ready?</div>
                </div>
                
                <div class="bingo-board-container">
                    <div class="bingo-board" id="bingo-board" style="grid-template-columns: repeat(${this.boardSize}, 1fr);">
                        ${this.renderBoardHTML()}
                    </div>
                    
                    <div class="bingo-controls">
                        <button id="bingo-next" class="btn">Call Next</button>
                        <button id="bingo-claim" class="btn" disabled>Claim Bingo!</button>
                    </div>
                </div>
                
                <div id="bingo-message" style="display: none;"></div>
            </div>
        `;
        
        // Add event listeners for board cells
        const cells = document.querySelectorAll('.bingo-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                this.toggleCell(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
            });
            
            // Add keyboard navigation
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleCell(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
                }
            });
        });
        
        // Add event listeners for buttons
        const nextButton = document.getElementById('bingo-next');
        const claimButton = document.getElementById('bingo-claim');
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.callNextFact());
        }
        
        if (claimButton) {
            claimButton.addEventListener('click', () => this.checkBingo());
        }
    }
    
    /**
     * Render the HTML for the bingo board
     * @returns {string} HTML for the bingo board
     */
    renderBoardHTML() {
        let html = '';
        
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = this.bingoBoard[i][j];
                html += `
                    <div class="bingo-cell ${cell.marked ? 'marked' : ''}" 
                         data-row="${i}" 
                         data-col="${j}" 
                         tabindex="0" 
                         role="button"
                         aria-label="Bingo cell with value ${cell.value}${cell.marked ? ', marked' : ''}">
                        ${cell.value}
                    </div>
                `;
            }
        }
        
        return html;
    }
    
    /**
     * Call the next fact
     */
    callNextFact() {
        this.currentFactIndex++;
        
        if (this.currentFactIndex >= this.calledFacts.length) {
            // No more facts to call, shuffle and start over
            this.calledFacts = GameUtils.shuffleArray(this.calledFacts);
            this.currentFactIndex = 0;
        }
        
        const fact = this.calledFacts[this.currentFactIndex];
        const callElement = document.getElementById('bingo-call');
        
        if (callElement) {
            callElement.textContent = fact.factString;
            GameUtils.playSound('click');
        }
    }
    
    /**
     * Toggle marking of a cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    toggleCell(row, col) {
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
            return;
        }
        
        const cell = this.bingoBoard[row][col];
        cell.marked = !cell.marked;
        
        // Update UI
        const cellElement = document.querySelector(`.bingo-cell[data-row="${row}"][data-col="${col}"]`);
        if (cellElement) {
            cellElement.classList.toggle('marked');
            
            // Play sound
            if (cell.marked) {
                GameUtils.playSound('click');
            }
        }
        
        // Enable the claim button if at least one cell is marked
        const claimButton = document.getElementById('bingo-claim');
        if (claimButton) {
            claimButton.disabled = !this.hasMarkedCells();
        }
    }
    
    /**
     * Check if there are any marked cells
     * @returns {boolean} Whether any cells are marked
     */
    hasMarkedCells() {
        for (let row of this.bingoBoard) {
            for (let cell of row) {
                if (cell.marked) {
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Check if the player has achieved bingo
     */
    checkBingo() {
        // Check rows
        for (let i = 0; i < this.boardSize; i++) {
            let rowBingo = true;
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.bingoBoard[i][j].marked) {
                    rowBingo = false;
                    break;
                }
            }
            if (rowBingo) {
                this.winBingo('row', i);
                return;
            }
        }
        
        // Check columns
        for (let j = 0; j < this.boardSize; j++) {
            let colBingo = true;
            for (let i = 0; i < this.boardSize; i++) {
                if (!this.bingoBoard[i][j].marked) {
                    colBingo = false;
                    break;
                }
            }
            if (colBingo) {
                this.winBingo('column', j);
                return;
            }
        }
        
        // Check diagonal (top-left to bottom-right)
        let diag1Bingo = true;
        for (let i = 0; i < this.boardSize; i++) {
            if (!this.bingoBoard[i][i].marked) {
                diag1Bingo = false;
                break;
            }
        }
        if (diag1Bingo) {
            this.winBingo('diagonal', 1);
            return;
        }
        
        // Check diagonal (top-right to bottom-left)
        let diag2Bingo = true;
        for (let i = 0; i < this.boardSize; i++) {
            if (!this.bingoBoard[i][this.boardSize - 1 - i].marked) {
                diag2Bingo = false;
                break;
            }
        }
        if (diag2Bingo) {
            this.winBingo('diagonal', 2);
            return;
        }
        
        // No bingo yet
        const messageElement = document.getElementById('bingo-message');
        if (messageElement) {
            messageElement.className = 'game-message game-incorrect';
            messageElement.textContent = 'Not a bingo yet! Keep trying!';
            messageElement.style.display = 'block';
            
            // Hide after a few seconds
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
            
            GameUtils.playSound('incorrect');
        }
    }
    
    /**
     * Handle winning bingo
     * @param {string} type - Type of bingo: 'row', 'column', or 'diagonal'
     * @param {number} index - Index of the winning line
     */
    winBingo(type, index) {
        if (this.bingoAchieved) return;
        
        this.bingoAchieved = true;
        this.endTime = Date.now();
        const timeElapsed = Math.floor((this.endTime - this.startTime) / 1000); // seconds
        
        // Save progress
        GameUtils.saveGameProgress('bingo', {
            boardSize: this.boardSize,
            timeElapsed: timeElapsed,
            difficulty: this.difficulty,
            bingoType: type
        });
        
        // Show winning message
        const messageElement = document.getElementById('bingo-message');
        if (messageElement) {
            messageElement.className = 'bingo-win';
            messageElement.innerHTML = `
                <h3>BINGO!</h3>
                <p>You got a bingo in ${GameUtils.formatTime(timeElapsed)}!</p>
                <button id="bingo-restart" class="btn btn-large">Play Again</button>
            `;
            messageElement.style.display = 'block';
            
            const restartButton = document.getElementById('bingo-restart');
            if (restartButton) {
                restartButton.addEventListener('click', () => {
                    this.startGame();
                });
            }
            
            GameUtils.playSound('win');
        }
        
        // Disable the buttons
        const nextButton = document.getElementById('bingo-next');
        const claimButton = document.getElementById('bingo-claim');
        
        if (nextButton) nextButton.disabled = true;
        if (claimButton) claimButton.disabled = true;
    }
}

// Initialize the bingo game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const bingoGame = new MathBingoGame();
});
