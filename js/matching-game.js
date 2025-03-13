/**
 * Matching Game
 * A memory-style game matching multiplication facts with their answers
 */

class MatchingGame {
    constructor() {
        // Game settings
        this.difficulty = 'easy';
        this.pairsCount = 8;
        
        // Game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.endTime = null;
        this.isLocked = false; // Lock board during card flip animations
        
        // DOM elements
        this.container = document.getElementById('match-game-container');
        this.settingsForm = {
            difficulty: document.getElementById('match-difficulty'),
            pairs: document.getElementById('match-pairs'),
            startButton: document.getElementById('start-match')
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
        
        if (this.settingsForm.pairs) {
            this.pairsCount = parseInt(this.settingsForm.pairs.value);
        }
    }
    
    /**
     * Start the game
     */
    startGame() {
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = Date.now();
        
        // Generate cards
        this.generateCards();
        
        // Render the game UI
        this.renderGameUI();
    }
    
    /**
     * Generate cards based on settings
     */
    generateCards() {
        this.cards = [];
        
        // Generate multiplication facts
        const facts = GameUtils.generateMultiplicationFacts(this.difficulty, this.pairsCount);
        
        // Create pairs of cards
        facts.forEach((fact, index) => {
            this.cards.push({
                id: index * 2,
                value: fact.product,
                display: fact.factString,
                isFlipped: false,
                isMatched: false
            });
            this.cards.push({
                id: index * 2 + 1,
                value: fact.product,
                display: fact.product,
                isFlipped: false,
                isMatched: false
            });
        });
        
        // Shuffle cards
        this.cards = GameUtils.shuffleArray(this.cards);
    }
    
    /**
     * Render the game UI
     */
    renderGameUI() {
        this.container.innerHTML = `
            <div class="matching-board">
                ${this.cards.map(card => `
                    <div class="matching-card" id="card-${card.id}" data-id="${card.id}">
                        <div class="matching-card-inner">
                            <div class="matching-card-front">${card.display}</div>
                            <div class="matching-card-back"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add event listeners for the new elements
        const cardElements = document.querySelectorAll('.matching-card');
        cardElements.forEach(cardElement => {
            cardElement.addEventListener('click', () => {
                this.flipCard(cardElement);
            });
        });
    }
    
    /**
     * Flip a card
     * @param {HTMLElement} cardElement - The card element to flip
     */
    flipCard(cardElement) {
        if (this.isLocked) return;
        
        const cardId = parseInt(cardElement.dataset.id);
        const card = this.cards.find(c => c.id === cardId);
        
        if (card.isFlipped || card.isMatched) return;
        
        card.isFlipped = true;
        cardElement.classList.add('flipped');
        
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.checkForMatch();
        }
    }
    
    /**
     * Check if the two flipped cards match
     */
    checkForMatch() {
        this.isLocked = true;
        
        const [firstCard, secondCard] = this.flippedCards;
        const isMatch = firstCard.value === secondCard.value;
        
        if (isMatch) {
            // Mark cards as matched
            firstCard.isMatched = true;
            secondCard.isMatched = true;
            
            // Update matched pairs count
            this.matchedPairs++;
            document.getElementById('match-pairs').textContent = this.matchedPairs;
            
            // Add matched class to cards
            document.getElementById(`card-${firstCard.id}`).classList.add('matched');
            document.getElementById(`card-${secondCard.id}`).classList.add('matched');
            
            // Play sound
            GameUtils.playSound('correct');
            
            // Reset flipped cards
            this.flippedCards = [];
            this.isLocked = false;
            
            // Check if game is over
            if (this.matchedPairs === this.pairsCount) {
                setTimeout(() => this.endGame(), 1000);
            }
        } else {
            // Play sound
            GameUtils.playSound('incorrect');
            
            // Flip cards back after a short delay
            setTimeout(() => {
                document.getElementById(`card-${firstCard.id}`).classList.remove('flipped');
                document.getElementById(`card-${secondCard.id}`).classList.remove('flipped');
                
                firstCard.isFlipped = false;
                secondCard.isFlipped = false;
                
                this.flippedCards = [];
                this.isLocked = false;
            }, 1500);
        }
    }
    
    /**
     * End the game and show results
     */
    endGame() {
        this.endTime = Date.now();
        const timeElapsed = Math.floor((this.endTime - this.startTime) / 1000); // seconds
        
        // Save progress
        GameUtils.saveGameProgress('match', {
            pairs: this.pairsCount,
            moves: this.moves,
            timeElapsed: timeElapsed,
            difficulty: this.difficulty
        });
        
        // Show results
        this.container.innerHTML = `
            <div class="game-result">
                <h3>Memory Match Complete!</h3>
                <p>You matched all ${this.pairsCount} pairs!</p>
                
                <div class="result-stats">
                    <div class="stat-item">
                        <h4>Moves</h4>
                        <div class="stat-value">${this.moves}</div>
                    </div>
                    <div class="stat-item">
                        <h4>Time</h4>
                        <div class="stat-value">${GameUtils.formatTime(timeElapsed)}</div>
                    </div>
                </div>
                
                <button id="restart-match" class="btn btn-large">Play Again</button>
            </div>
        `;
        
        // Play win sound
        GameUtils.playSound('win');
        
        // Add event listener for restart button
        const restartButton = document.getElementById('restart-match');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.startGame();
            });
        }
    }
}

// Initialize the matching game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const matchingGame = new MatchingGame();
});