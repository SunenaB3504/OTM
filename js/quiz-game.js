/**
 * Math Quiz Game
 * An interactive quiz for practicing multiplication and division facts
 */

class MathQuizGame {
    constructor() {
        // Game settings
        this.difficulty = 'easy';
        this.questionType = 'multiplication';
        this.questionCount = 10;
        
        // Game state
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.startTime = null;
        this.endTime = null;
        this.selectedAnswer = null;
        
        // DOM elements
        this.container = document.getElementById('quiz-game-container');
        this.settingsForm = {
            difficulty: document.getElementById('quiz-difficulty'),
            type: document.getElementById('quiz-type'),
            questions: document.getElementById('quiz-questions'),
            startButton: document.getElementById('start-quiz')
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
        
        if (this.settingsForm.type) {
            this.questionType = this.settingsForm.type.value;
        }
        
        if (this.settingsForm.questions) {
            this.questionCount = parseInt(this.settingsForm.questions.value);
        }
    }
    
    /**
     * Start the game
     */
    startGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = Date.now();
        
        // Generate questions
        this.generateQuestions();
        
        // Render the game UI
        this.renderGameUI();
        
        // Show first question
        this.showQuestion();
    }
    
    /**
     * Generate questions based on settings
     */
    generateQuestions() {
        this.questions = [];
        
        if (this.questionType === 'multiplication' || this.questionType === 'mixed') {
            // Generate multiplication questions
            const multCount = this.questionType === 'mixed' ? 
                Math.ceil(this.questionCount / 2) : this.questionCount;
            
            const multFacts = GameUtils.generateMultiplicationFacts(this.difficulty, multCount);
            
            multFacts.forEach(fact => {
                this.questions.push({
                    question: fact.factString + ' = ?',
                    answer: fact.product,
                    options: this.generateOptions(fact.product),
                    type: 'multiplication'
                });
            });
        }
        
        if (this.questionType === 'division' || this.questionType === 'mixed') {
            // Generate division questions
            const divCount = this.questionType === 'mixed' ? 
                Math.floor(this.questionCount / 2) : this.questionCount;
            
            const divFacts = GameUtils.generateDivisionFacts(this.difficulty, divCount);
            
            divFacts.forEach(fact => {
                this.questions.push({
                    question: fact.factString + ' = ?',
                    answer: fact.quotient,
                    options: this.generateOptions(fact.quotient),
                    type: 'division'
                });
            });
        }
        
        // Shuffle questions
        this.questions = GameUtils.shuffleArray(this.questions);
        
        // Limit to questionCount
        this.questions = this.questions.slice(0, this.questionCount);
    }
    
    /**
     * Generate answer options for a question (1 correct, 3 incorrect)
     * @param {number} correctAnswer - The correct answer
     * @returns {Array} Array of options including the correct answer
     */
    generateOptions(correctAnswer) {
        const options = [correctAnswer];
        const maxDiff = Math.max(5, Math.floor(correctAnswer / 2)); // Adaptive difficulty
        
        // Generate wrong options that are close but not equal to correct answer
        while (options.length < 4) {
            const diff = GameUtils.getRandomNumber(1, maxDiff);
            const isAdd = GameUtils.getRandomNumber(0, 1) === 1;
            
            const wrongOption = isAdd ? correctAnswer + diff : Math.max(1, correctAnswer - diff);
            
            // Ensure no duplicates
            if (!options.includes(wrongOption)) {
                options.push(wrongOption);
            }
        }
        
        return GameUtils.shuffleArray(options);
    }
    
    /**
     * Render the game UI
     */
    renderGameUI() {
        this.container.innerHTML = `
            <div class="quiz-container">
                <div class="game-header">
                    <div class="game-score">Score: <span id="quiz-score">0</span>/${this.questionCount}</div>
                </div>
                
                <div class="game-progress">
                    <div class="progress-fill" id="quiz-progress" style="width: 0%"></div>
                </div>
                
                <div id="quiz-content">
                    <div class="quiz-question" id="quiz-question"></div>
                    <div class="quiz-options" id="quiz-options"></div>
                    <div class="game-message" id="quiz-message" style="display: none;"></div>
                </div>
                
                <div class="game-options">
                    <button id="quiz-next" class="btn" style="display: none;">Next Question</button>
                </div>
            </div>
        `;
        
        // Add event listeners for the new elements
        const nextButton = document.getElementById('quiz-next');
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextQuestion());
        }
    }
    
    /**
     * Show the current question
     */
    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        const questionElement = document.getElementById('quiz-question');
        const optionsElement = document.getElementById('quiz-options');
        const messageElement = document.getElementById('quiz-message');
        const nextButton = document.getElementById('quiz-next');
        
        if (!questionElement || !optionsElement) return;
        
        // Update progress indicator
        const progressElement = document.getElementById('quiz-progress');
        if (progressElement) {
            const progressPercent = (this.currentQuestion / this.questionCount) * 100;
            progressElement.style.width = `${progressPercent}%`;
        }
        
        // Reset state
        this.selectedAnswer = null;
        if (messageElement) messageElement.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
        
        // Show question
        questionElement.textContent = question.question;
        
        // Create answer options
        optionsElement.innerHTML = '';
        question.options.forEach(option => {
            const optionButton = document.createElement('div');
            optionButton.className = 'quiz-option';
            optionButton.textContent = option;
            optionButton.dataset.value = option;
            optionButton.setAttribute('role', 'button');
            optionButton.setAttribute('tabindex', '0');
            
            // Add keyboard navigation
            optionButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.checkAnswer(option);
                }
            });
            
            // Add click handler
            optionButton.addEventListener('click', () => {
                this.checkAnswer(option);
            });
            
            optionsElement.appendChild(optionButton);
        });
    }
    
    /**
     * Check if the selected answer is correct
     * @param {number} selectedAnswer - The user's answer
     */
    checkAnswer(selectedAnswer) {
        // Prevent multiple selections
        if (this.selectedAnswer !== null) return;
        
        this.selectedAnswer = selectedAnswer;
        const question = this.questions[this.currentQuestion];
        const isCorrect = parseInt(selectedAnswer) === question.answer;
        const messageElement = document.getElementById('quiz-message');
        const nextButton = document.getElementById('quiz-next');
        const optionsElements = document.querySelectorAll('.quiz-option');
        
        // Highlight correct and wrong answers
        optionsElements.forEach(option => {
            const optionValue = parseInt(option.dataset.value);
            
            if (optionValue === question.answer) {
                option.classList.add('correct');
            } else if (optionValue === parseInt(selectedAnswer)) {
                option.classList.add('incorrect');
            }
        });
        
        // Update score and show feedback
        if (isCorrect) {
            this.score++;
            document.getElementById('quiz-score').textContent = this.score;
            
            if (messageElement) {
                messageElement.textContent = 'Correct! Great job!';
                messageElement.className = 'game-message game-correct';
                messageElement.style.display = 'block';
            }
            
            GameUtils.playSound('correct');
        } else {
            if (messageElement) {
                messageElement.textContent = `Sorry, the correct answer is ${question.answer}.`;
                messageElement.className = 'game-message game-incorrect';
                messageElement.style.display = 'block';
            }
            
            GameUtils.playSound('incorrect');
        }
        
        // Show next button
        if (nextButton) {
            nextButton.style.display = 'block';
            nextButton.focus(); // Accessibility: move focus to the next button
        }
    }
    
    /**
     * Move to the next question
     */
    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
    }
    
    /**
     * End the game and show results
     */
    endGame() {
        this.endTime = Date.now();
        const timeElapsed = Math.floor((this.endTime - this.startTime) / 1000); // seconds
        
        // Calculate percentage score
        const percentage = Math.round((this.score / this.questionCount) * 100);
        
        // Save progress
        GameUtils.saveGameProgress('quiz', {
            score: this.score,
            total: this.questionCount,
            percentage: percentage,
            timeElapsed: timeElapsed,
            difficulty: this.difficulty,
            questionType: this.questionType
        });
        
        // Show results
        this.container.innerHTML = `
            <div class="game-result">
                <h3>Quiz Complete!</h3>
                <p>You got ${this.score} out of ${this.questionCount} questions correct.</p>
                
                <div class="result-stats">
                    <div class="stat-item">
                        <h4>Score</h4>
                        <div class="stat-value">${percentage}%</div>
                    </div>
                    <div class="stat-item">
                        <h4>Time</h4>
                        <div class="stat-value">${GameUtils.formatTime(timeElapsed)}</div>
                    </div>
                </div>
                
                <button id="restart-quiz" class="btn btn-large">Play Again</button>
            </div>
        `;
        
        // Play win sound if score is good
        if (percentage >= 80) {
            GameUtils.playSound('win');
        }
        
        // Add event listener for restart button
        const restartButton = document.getElementById('restart-quiz');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.startGame();
            });
        }
    }
}

// Initialize the quiz game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const quizGame = new MathQuizGame();
});
