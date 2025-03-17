document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('game-board');
    const matchesDisplay = document.getElementById('matches');
    const attemptsDisplay = document.getElementById('attempts');
    const easyButton = document.getElementById('easy-level');
    const mediumButton = document.getElementById('medium-level');
    const hardButton = document.getElementById('hard-level');
    
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matches = 0;
    let attempts = 0;
    let difficulty = 'easy';
    
    // Division problems by difficulty
    const divisionProblems = {
        easy: [
            { problem: "6 ÷ 2 = ?", answer: "3", dividend: 6, divisor: 2 },
            { problem: "8 ÷ 4 = ?", answer: "2", dividend: 8, divisor: 4 },
            { problem: "10 ÷ 5 = ?", answer: "2", dividend: 10, divisor: 5 },
            { problem: "4 ÷ 2 = ?", answer: "2", dividend: 4, divisor: 2 },
            { problem: "9 ÷ 3 = ?", answer: "3", dividend: 9, divisor: 3 },
            { problem: "12 ÷ 4 = ?", answer: "3", dividend: 12, divisor: 4 }
        ],
        medium: [
            { problem: "12 ÷ 3 = ?", answer: "4", dividend: 12, divisor: 3 },
            { problem: "15 ÷ 5 = ?", answer: "3", dividend: 15, divisor: 5 },
            { problem: "14 ÷ 2 = ?", answer: "7", dividend: 14, divisor: 2 },
            { problem: "16 ÷ 4 = ?", answer: "4", dividend: 16, divisor: 4 },
            { problem: "18 ÷ 3 = ?", answer: "6", dividend: 18, divisor: 3 },
            { problem: "20 ÷ 5 = ?", answer: "4", dividend: 20, divisor: 5 }
        ],
        hard: [
            { problem: "24 ÷ 6 = ?", answer: "4", dividend: 24, divisor: 6 },
            { problem: "28 ÷ 4 = ?", answer: "7", dividend: 28, divisor: 4 },
            { problem: "32 ÷ 8 = ?", answer: "4", dividend: 32, divisor: 8 },
            { problem: "36 ÷ 9 = ?", answer: "4", dividend: 36, divisor: 9 },
            { problem: "27 ÷ 3 = ?", answer: "9", dividend: 27, divisor: 3 },
            { problem: "35 ÷ 5 = ?", answer: "7", dividend: 35, divisor: 5 }
        ]
    };
    
    // Function to create visual representation of division
    function createDivisionVisual(dividend, divisor) {
        const visualContainer = document.createElement('div');
        visualContainer.className = 'division-visual';
        
        // Create groups based on the divisor
        for (let i = 0; i < divisor; i++) {
            const group = document.createElement('div');
            group.className = 'division-group';
            
            // Calculate items per group
            const itemsPerGroup = dividend / divisor;
            
            for (let j = 0; j < itemsPerGroup; j++) {
                const item = document.createElement('span');
                item.className = 'division-item';
                item.textContent = '•';
                group.appendChild(item);
            }
            
            visualContainer.appendChild(group);
        }
        
        return visualContainer;
    }
    
    // Function to create a card
    function createCard(id, content, matchId, type) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = id;
        card.dataset.matchId = matchId;
        
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = '?';
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        // Different content based on card type
        if (type === 'problem') {
            const problemText = document.createElement('div');
            problemText.className = 'division-problem';
            problemText.textContent = content.problem;
            cardBack.appendChild(problemText);
        } else if (type === 'visual') {
            cardBack.appendChild(createDivisionVisual(content.dividend, content.divisor));
        } else if (type === 'answer') {
            const answerText = document.createElement('div');
            answerText.className = 'division-answer';
            answerText.textContent = content.answer;
            cardBack.appendChild(answerText);
        }
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        card.addEventListener('click', flipCard);
        
        return card;
    }
    
    // Function to check for matching cards
    function checkForMatch() {
        let isMatch = firstCard.dataset.matchId === secondCard.dataset.matchId;
        
        if (isMatch) {
            disableCards();
            matches++;
            matchesDisplay.textContent = matches;
        } else {
            unflipCards();
        }
        
        attempts++;
        attemptsDisplay.textContent = attempts;
        
        // Check if game is over
        const totalPairs = document.querySelectorAll('.card').length / 2;
        if (matches === totalPairs) {
            setTimeout(() => {
                alert(`Congratulations! You matched all pairs in ${attempts} attempts.`);
            }, 1000);
        }
    }
    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1500);
    }
    
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }
    
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flipped');
        
        if (!firstCard) {
            firstCard = this;
            return;
        }
        
        secondCard = this;
        checkForMatch();
    }
    
    function initializeGame() {
        // Reset game state
        matches = 0;
        attempts = 0;
        matchesDisplay.textContent = '0';
        attemptsDisplay.textContent = '0';
        gameBoard.innerHTML = '';
        
        // Get problems for current difficulty
        const problems = [...divisionProblems[difficulty]];
        
        // Create shuffled array of cards (problems and visuals)
        let cards = [];
        problems.forEach((problem, index) => {
            // Add problem card
            cards.push({
                id: `problem-${index}`,
                content: problem,
                matchId: `match-${index}`,
                type: 'problem'
            });
            
            // For easy mode: match with visual representation
            // For medium/hard mode: match with answer
            if (difficulty === 'easy') {
                cards.push({
                    id: `visual-${index}`,
                    content: problem,
                    matchId: `match-${index}`,
                    type: 'visual'
                });
            } else {
                cards.push({
                    id: `answer-${index}`,
                    content: problem,
                    matchId: `match-${index}`,
                    type: 'answer'
                });
            }
        });
        
        // Shuffle cards
        cards = shuffleArray(cards);
        
        // Create card elements
        cards.forEach(card => {
            gameBoard.appendChild(createCard(card.id, card.content, card.matchId, card.type));
        });
    }
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Event listeners for difficulty buttons
    easyButton.addEventListener('click', () => {
        difficulty = 'easy';
        easyButton.style.backgroundColor = '#16a085';
        mediumButton.style.backgroundColor = '#3498db';
        hardButton.style.backgroundColor = '#3498db';
        initializeGame();
    });
    
    mediumButton.addEventListener('click', () => {
        difficulty = 'medium';
        easyButton.style.backgroundColor = '#3498db';
        mediumButton.style.backgroundColor = '#16a085';
        hardButton.style.backgroundColor = '#3498db';
        initializeGame();
    });
    
    hardButton.addEventListener('click', () => {
        difficulty = 'hard';
        easyButton.style.backgroundColor = '#3498db';
        mediumButton.style.backgroundColor = '#3498db';
        hardButton.style.backgroundColor = '#16a085';
        initializeGame();
    });
    
    // Initialize the game
    initializeGame();
});