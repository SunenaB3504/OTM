/**
 * Simple Math Game Component
 * A basic implementation for multiplication and division practice
 */

class MathGame {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        // Default options
        this.options = {
            gameType: options.gameType || 'multiplication', // multiplication or division
            difficulty: options.difficulty || 'beginner',
            questionsCount: options.questionsCount || 10,
            timeLimit: options.timeLimit || 60 // seconds
        };
        
        this.currentQuestion = 0;
        this.score = 0;
        this.timeRemaining = this.options.timeLimit;
        this.timerInterval = null;
        this.questions = [];
        
        // Initialize the game
        this.init();
    }
    
    init() {
        // Create game UI
        this.render();
        
        // Generate questions based on game type and difficulty
        this.generateQuestions();
        
        // Add event listeners
        this.addEventListeners();
        
        // Show first question
        this.showQuestion(0);
    }
    
    render() {
        // Create basic game UI
        this.container.innerHTML = `
            <div class="game-ui">
                <div class="game-header">
                    <div class="score">Score: <span id="score">0</span></div>
                    <div class="timer">Time: <span id="timer">${this.timeRemaining}</span>s</div>
                </div>
                <div class="question-container">
                    <h3 id="question"></h3>
                    <div class="answer-options" id="answer-options"></div>
                </div>
                <div class="feedback" id="feedback"></div>
                <button class="btn" id="start-btn">Start Game</button>
                <button class="btn" id="next-btn" style="display:none;">Next Question</button>
            </div>
        `;
    }
    
    generateQuestions() {
        const maxNumber = this.getDifficultyRange();
        
        for (let i = 0; i < this.options.questionsCount; i++) {
            let num1, num2, answer, question;
            
            if (this.options.gameType === 'multiplication') {
                num1 = Math.floor(Math.random() * maxNumber) + 1;
                num2 = Math.floor(Math.random() * maxNumber) + 1;
                answer = num1 * num2;
                question = `${num1} × ${num2} = ?`;
            } else {
                // For division, ensure we get whole number answers
                num2 = Math.floor(Math.random() * maxNumber) + 1;
                answer = Math.floor(Math.random() * maxNumber) + 1;
                num1 = num2 * answer;
                question = `${num1} ÷ ${num2} = ?`;
            }
            
            // Generate wrong answers that are close to correct answer
            const wrongAnswers = this.generateWrongAnswers(answer, maxNumber);
            
            this.questions.push({
                question,
                answer,
                options: this.shuffleArray([answer, ...wrongAnswers])
            });
        }
    }
    
    getDifficultyRange() {
        switch(this.options.difficulty) {
            case 'beginner':
                return 5; // 1-5 times tables
            case 'intermediate':
                return 10; // 1-10 times tables
            case 'advanced':
                return 12; // 1-12 times tables
            default:
                return 5;
        }
    }
    
    generateWrongAnswers(correctAnswer, maxNumber) {
        const wrongAnswers = [];
        // Generate 3 wrong answers
        while (wrongAnswers.length < 3) {
            // Create answers that are close to the correct one for more challenge
            const offset = Math.floor(Math.random() * 5) + 1;
            const isAdd = Math.random() > 0.5;
            
            let wrongAnswer;
            if (isAdd) {
                wrongAnswer = correctAnswer + offset;
            } else {
                wrongAnswer = Math.max(1, correctAnswer - offset); // Don't go below 1
            }
            
            // Don't add duplicates
            if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer)) {
                wrongAnswers.push(wrongAnswer);
            }
        }
        return wrongAnswers;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    showQuestion(index) {
        if (index >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const questionEl = document.getElementById('question');
        const optionsEl = document.getElementById('answer-options');
        
        questionEl.textContent = this.questions[index].question;
        optionsEl.innerHTML = '';
        
        // Create answer buttons
        this.questions[index].options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = option;
            button.dataset.value = option;
            optionsEl.appendChild(button);
        });
        
        this.currentQuestion = index;
        document.getElementById('feedback').textContent = '';
        document.getElementById('next-btn').style.display = 'none';
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            document.getElementById('timer').textContent = this.timeRemaining;
            
            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    checkAnswer(selectedAnswer) {
        const correctAnswer = this.questions[this.currentQuestion].answer;
        const feedback = document.getElementById('feedback');
        const isCorrect = parseInt(selectedAnswer) === correctAnswer;
        
        if (isCorrect) {
            this.score++;
            document.getElementById('score').textContent = this.score;
            feedback.textContent = 'Correct! Great job!';
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = `Sorry, the correct answer is ${correctAnswer}.`;
            feedback.className = 'feedback incorrect';
        }
        
        // Disable all answer buttons
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.dataset.value) === correctAnswer) {
                btn.classList.add('correct-answer');
            } else if (btn.dataset.value === selectedAnswer) {
                btn.classList.add('wrong-answer');
            }
        });
        
        // Show next button
        document.getElementById('next-btn').style.display = 'block';
    }
    
    nextQuestion() {
        this.showQuestion(this.currentQuestion + 1);
    }
    
    startGame() {
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('score').textContent = '0';
        this.score = 0;
        this.timeRemaining = this.options.timeLimit;
        document.getElementById('timer').textContent = this.timeRemaining;
        this.startTimer();
        this.showQuestion(0);
    }
    
    endGame() {
        clearInterval(this.timerInterval);
        
        const gameOverMessage = this.score === this.questions.length ? 
            'Perfect score! You are a math superstar!' : 
            `Game over! Your score is ${this.score} out of ${this.questions.length}.`;
        
        this.container.innerHTML = `
            <div class="game-over">
                <h3>Game Over</h3>
                <p>${gameOverMessage}</p>
                <button class="btn" id="play-again-btn">Play Again</button>
            </div>
        `;
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.questions = [];
            this.init();
        });
    }
    
    addEventListeners() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Next button
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });
        
        // Answer buttons (using event delegation)
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-btn') && !e.target.disabled) {
                this.checkAnswer(e.target.dataset.value);
            }
        });
    }
}

// Initialize games when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the games page
    const mathRaceContainer = document.getElementById('math-race-game');
    if (mathRaceContainer) {
        new MathGame('math-race-game', {
            gameType: 'multiplication',
            difficulty: 'beginner'
        });
    }
    
    const numberMatchContainer = document.getElementById('number-match-game');
    if (numberMatchContainer) {
        new MathGame('number-match-game', {
            gameType: 'division',
            difficulty: 'beginner'
        });
    }
});
