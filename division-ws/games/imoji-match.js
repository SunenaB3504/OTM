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
            { problem: "2 ÷ 1 = ?", answer: "2", dividend: 2, divisor: 1 },
            { problem: "4 ÷ 2 = ?", answer: "2", dividend: 4, divisor: 2 },
            { problem: "6 ÷ 2 = ?", answer: "3", dividend: 6, divisor: 2 },
            { problem: "8 ÷ 4 = ?", answer: "2", dividend: 8, divisor: 4 },
            { problem: "10 ÷ 2 = ?", answer: "5", dividend: 10, divisor: 2 },
            { problem: "12 ÷ 6 = ?", answer: "2", dividend: 12, divisor: 6 }
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
    
    // Completely revamped card creation function
    function createCard(id, content, matchId, type) {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = id;
        card.dataset.id = id;
        card.dataset.matchId = matchId;
        card.dataset.type = type; // Store card type for debugging
        
        // Add additional data attributes to make matching more reliable
        if (type === 'problem') {
            card.dataset.dividend = content.dividend;
            card.dataset.divisor = content.divisor;
            card.dataset.answer = content.answer;
        } else if (type === 'answer') {
            card.dataset.answer = content.answer;
        } else if (type === 'visual') {
            card.dataset.dividend = content.dividend;
            card.dataset.divisor = content.divisor;
        }
        
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
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        // Use a click event listener instead of inline attribute for better control
        card.addEventListener('click', function() {
            handleCardClickInternal(this);
        });
        
        return card;
    }
    
    // Internal function to handle card clicks (not exposed to window)
    function handleCardClickInternal(clickedCard) {
        // Don't do anything if the board is locked
        if (lockBoard) return;
        
        // Don't do anything if the card is already matched
        if (clickedCard.classList.contains('matched')) return;
        
        // Don't allow clicking the same card
        if (clickedCard === firstCard) return;
        
        // Toggle the flipped class
        clickedCard.classList.toggle('flipped');
        
        if (!firstCard) {
            // First card selection
            firstCard = clickedCard;
            console.log('First card selected:', firstCard.id, 'with matchId:', firstCard.dataset.matchId);
        } else {
            // Second card selection
            secondCard = clickedCard;
            console.log('Second card selected:', secondCard.id, 'with matchId:', secondCard.dataset.matchId);
            
            // Lock the board immediately to prevent further selection
            lockBoard = true;
            
            // Check for match after a short delay to let the card flip complete
            setTimeout(() => {
                checkForMatchFixed();
            }, 500);
        }
    }
    
    // Improved match checking function
    function checkForMatchFixed() {
        let isMatch = false;
        
        console.log(`Checking match between ${firstCard.dataset.type} and ${secondCard.dataset.type}`);
        
        // Different matching logic based on difficulty
        if (difficulty === 'easy') {
            // In easy mode, match problem with visual representation
            if (firstCard.dataset.type === 'problem' && secondCard.dataset.type === 'visual') {
                isMatch = firstCard.dataset.dividend === secondCard.dataset.dividend && 
                          firstCard.dataset.divisor === secondCard.dataset.divisor;
            } 
            else if (firstCard.dataset.type === 'visual' && secondCard.dataset.type === 'problem') {
                isMatch = firstCard.dataset.dividend === secondCard.dataset.dividend && 
                          firstCard.dataset.divisor === secondCard.dataset.divisor;
            }
        } else {
            // In medium/hard mode, match problem with answer
            if (firstCard.dataset.type === 'problem' && secondCard.dataset.type === 'answer') {
                console.log(`Comparing problem answer: ${firstCard.dataset.answer} with answer: ${secondCard.dataset.answer}`);
                isMatch = firstCard.dataset.answer === secondCard.dataset.answer;
            } 
            else if (firstCard.dataset.type === 'answer' && secondCard.dataset.type === 'problem') {
                console.log(`Comparing answer: ${firstCard.dataset.answer} with problem answer: ${secondCard.dataset.answer}`);
                isMatch = firstCard.dataset.answer === secondCard.dataset.answer;
            }
        }
        
        console.log('Match result:', isMatch);
        
        // For debugging to see why cards with same answer might match incorrectly
        if (difficulty !== 'easy' && firstCard.dataset.type !== secondCard.dataset.type) {
            if (firstCard.dataset.type === 'problem') {
                console.log('Problem:', firstCard.querySelector('.division-problem').textContent);
            } else {
                console.log('Answer:', firstCard.querySelector('.division-answer').textContent);
            }
            
            if (secondCard.dataset.type === 'problem') {
                console.log('Problem:', secondCard.querySelector('.division-problem').textContent);
            } else {
                console.log('Answer:', secondCard.querySelector('.division-answer').textContent);
            }
        }
        
        if (isMatch) {
            // Mark both cards as matched and disable them
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            firstCard.style.pointerEvents = 'none';
            secondCard.style.pointerEvents = 'none';
            
            matches++;
            matchesDisplay.textContent = matches;
            
            // Check if game is complete
            if (matches === document.querySelectorAll('.card').length / 2) {
                setTimeout(() => {
                    alert(`Congratulations! You found all ${matches} matches in ${attempts} attempts.`);
                }, 500);
            }
            
            // Reset the board state without flipping back
            resetBoard();
        } else {
            // Flip both cards back after a delay
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 1000);
        }
        
        // Increment attempts
        attempts++;
        attemptsDisplay.textContent = attempts;
    }
    
    // Simple reset board function
    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }
    
    // Make handleCardClick available for test card
    window.handleCardClick = function(clickedCard) {
        handleCardClickInternal(clickedCard);
    };
    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            if (firstCard) {
                firstCard.classList.remove('flipped');
                console.log('Removed flipped class from first card');
            }
            if (secondCard) {
                secondCard.classList.remove('flipped');
                console.log('Removed flipped class from second card');
            }
            
            resetBoard();
        }, 1500);
    }
    
    function initializeGame() {
        console.log('Initializing game with difficulty:', difficulty);
        // Reset game state
        matches = 0;
        attempts = 0;
        matchesDisplay.textContent = '0';
        attemptsDisplay.textContent = '0';
        gameBoard.innerHTML = '';
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        
        // Highlight the selected difficulty button
        easyButton.style.backgroundColor = difficulty === 'easy' ? '#16a085' : '#3498db';
        mediumButton.style.backgroundColor = difficulty === 'medium' ? '#16a085' : '#3498db';
        hardButton.style.backgroundColor = difficulty === 'hard' ? '#16a085' : '#3498db';
        
        // Get problems for current difficulty
        const problems = [...divisionProblems[difficulty]];
        
        // Create shuffled array of cards (problems and visuals/answers)
        let cards = [];
        problems.forEach((problem, index) => {
            // Create a truly unique match ID for each pair that includes problem details
            const pairMatchId = `match-${difficulty}-${index}-${problem.dividend}-${problem.divisor}`;
            
            // Add problem card
            cards.push({
                id: `problem-${index}`,
                content: problem,
                matchId: pairMatchId,
                type: 'problem'
            });
            
            // Add matching card based on difficulty
            if (difficulty === 'easy') {
                cards.push({
                    id: `visual-${index}`,
                    content: problem,
                    matchId: pairMatchId,
                    type: 'visual'
                });
            } else {
                cards.push({
                    id: `answer-${index}`,
                    content: problem,
                    matchId: pairMatchId,
                    type: 'answer'
                });
            }
        });
        
        // Shuffle cards
        cards = shuffleArray(cards);
        
        // Create card elements
        cards.forEach(card => {
            const cardElement = createCard(card.id, card.content, card.matchId, card.type);
            gameBoard.appendChild(cardElement);
            console.log('Created card:', card.id, 'with match ID:', card.matchId);
        });
        
        console.log('Game initialized with', cards.length, 'cards');
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
        initializeGame();
    });
    
    mediumButton.addEventListener('click', () => {
        difficulty = 'medium';
        initializeGame();
    });
    
    hardButton.addEventListener('click', () => {
        difficulty = 'hard';
        initializeGame();
    });
    
    // Initialize the game
    setTimeout(initializeGame, 100); // Short delay to ensure DOM is ready
    
    // Add helpful console messages on page load
    console.log('Division Matching Game loaded');
    console.log('Try clicking the test card to verify flip animation works');
});