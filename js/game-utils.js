/**
 * Math Fun - Game Utilities
 * Shared functionality and helpers for games
 */

const GameUtils = {
    /**
     * Audio elements for game sounds
     */
    sounds: {
        correct: document.getElementById('correct-sound'),
        incorrect: document.getElementById('incorrect-sound'),
        win: document.getElementById('win-sound'),
        click: document.getElementById('click-sound')
    },
    
    /**
     * Play a sound effect with fallbacks for accessibility
     * @param {string} sound - The sound to play: 'correct', 'incorrect', 'win', 'click'
     */
    playSound: function(sound) {
        // Check if audio is enabled in settings
        const settings = this.getSettings();
        
        if (!settings.audioEnabled) {
            return; // Exit if audio is disabled
        }
        
        const audioElement = this.sounds[sound];
        if (audioElement) {
            // Reset and play
            audioElement.currentTime = 0;
            
            // Handle playback errors silently
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio playback error:', error);
                    // Silently fail - audio is enhancement, not critical
                });
            }
        }
    },
    
    /**
     * Get user settings from localStorage
     * @returns {Object} User settings object
     */
    getSettings: function() {
        const defaultSettings = {
            fontSize: 'normal',
            theme: 'default',
            difficulty: 'beginner',
            audioEnabled: true,
            animationsEnabled: true
        };
        
        const savedSettings = localStorage.getItem('mathFunSettings');
        if (savedSettings) {
            return {...defaultSettings, ...JSON.parse(savedSettings)};
        }
        
        return defaultSettings;
    },
    
    /**
     * Save game progress to localStorage
     * @param {string} gameType - Type of game: 'quiz', 'match', 'bingo'
     * @param {Object} stats - Game statistics to save
     */
    saveGameProgress: function(gameType, stats) {
        const progress = this.getGameProgress();
        
        // Add timestamp to the stats
        stats.timestamp = new Date().toISOString();
        
        // Add to beginning of array
        progress[gameType].unshift(stats);
        
        // Keep only latest 10 entries
        progress[gameType] = progress[gameType].slice(0, 10);
        
        // Save back to localStorage
        localStorage.setItem('mathFunGameProgress', JSON.stringify(progress));
    },
    
    /**
     * Get saved game progress from localStorage
     * @returns {Object} Object containing game progress data
     */
    getGameProgress: function() {
        const defaultProgress = {
            quiz: [],
            match: [],
            bingo: []
        };
        
        const savedProgress = localStorage.getItem('mathFunGameProgress');
        if (savedProgress) {
            return JSON.parse(savedProgress);
        }
        
        return defaultProgress;
    },
    
    /**
     * Generate a random number within a range
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    getRandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Shuffle an array (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Generate multiplication facts based on difficulty
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @param {number} count - Number of facts to generate
     * @returns {Array} Array of fact objects {factString, product}
     */
    generateMultiplicationFacts: function(difficulty, count) {
        const maxNumber = this.getDifficultyRange(difficulty);
        const facts = [];
        const usedFacts = new Set();
        
        while (facts.length < count) {
            const num1 = this.getRandomNumber(1, maxNumber);
            const num2 = this.getRandomNumber(1, maxNumber);
            const factKey = `${num1}×${num2}`;
            
            // Skip duplicates
            if (usedFacts.has(factKey)) {
                continue;
            }
            
            usedFacts.add(factKey);
            facts.push({
                num1: num1,
                num2: num2,
                factString: `${num1} × ${num2}`,
                product: num1 * num2
            });
        }
        
        return facts;
    },
    
    /**
     * Generate division facts based on difficulty
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @param {number} count - Number of facts to generate
     * @returns {Array} Array of fact objects {factString, quotient}
     */
    generateDivisionFacts: function(difficulty, count) {
        const maxNumber = this.getDifficultyRange(difficulty);
        const facts = [];
        const usedFacts = new Set();
        
        while (facts.length < count) {
            const divisor = this.getRandomNumber(1, maxNumber);
            const quotient = this.getRandomNumber(1, maxNumber);
            const dividend = divisor * quotient;
            const factKey = `${dividend}÷${divisor}`;
            
            // Skip duplicates
            if (usedFacts.has(factKey)) {
                continue;
            }
            
            usedFacts.add(factKey);
            facts.push({
                dividend: dividend,
                divisor: divisor,
                factString: `${dividend} ÷ ${divisor}`,
                quotient: quotient
            });
        }
        
        return facts;
    },
    
    /**
     * Get the maximum number based on difficulty
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @returns {number} Maximum number for multiplication tables
     */
    getDifficultyRange: function(difficulty) {
        switch (difficulty) {
            case 'easy':
                return 5; // 1-5 times tables
            case 'medium':
                return 10; // 1-10 times tables
            case 'hard':
                return 12; // 1-12 times tables
            default:
                return 5;
        }
    },
    
    /**
     * Add leading zeros to a number
     * @param {number} num - Number to format
     * @param {number} size - Desired length
     * @returns {string} Formatted number
     */
    padNumber: function(num, size) {
        let s = num.toString();
        while (s.length < size) s = "0" + s;
        return s;
    },
    
    /**
     * Format time in minutes and seconds
     * @param {number} seconds - Total seconds
     * @returns {string} Formatted time string (MM:SS)
     */
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${this.padNumber(mins, 2)}:${this.padNumber(secs, 2)}`;
    },
    
    /**
     * Create a modal dialog for fullscreen games
     * @param {string} gameId - ID of the game container to display in modal
     * @param {Function} onClose - Callback function when modal is closed
     */
    openGameModal: function(gameId, onClose) {
        const modal = document.getElementById('game-modal');
        const modalContent = document.getElementById('modal-game-container');
        const closeButton = document.querySelector('.close-modal');
        const gameContainer = document.getElementById(gameId);
        
        if (modal && modalContent && gameContainer) {
            // Clone the game container into the modal
            modalContent.innerHTML = '';
            const gameClone = gameContainer.cloneNode(true);
            gameClone.id = `modal-${gameId}`;
            modalContent.appendChild(gameClone);
            
            // Show the modal
            modal.style.display = 'block';
            
            // Handle close button
            closeButton.onclick = function() {
                modal.style.display = 'none';
                if (typeof onClose === 'function') {
                    onClose();
                }
            };
            
            // Close when clicking outside the modal content
            window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    if (typeof onClose === 'function') {
                        onClose();
                    }
                }
            };
        }
    }
};

// Initialize modal handlers when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const openModalButtons = document.querySelectorAll('[id^="open-"]');
    openModalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const gameId = this.id.replace('open-', '');
            const targetSection = document.getElementById(gameId);
            
            if (targetSection) {
                // Scroll to the section first
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Optional: Expand to fullscreen modal
                // GameUtils.openGameModal(`${gameId}-game-container`, null);
            }
        });
    });
});
