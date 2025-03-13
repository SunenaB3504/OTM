/**
 * Progress Tracker Module
 * Tracks user progress across lessons and games
 */

const ProgressTracker = {
    /**
     * Storage keys
     */
    STORAGE_KEYS: {
        LESSONS: 'mathFunLessonsProgress',
        GAMES: 'mathFunGamesProgress',
        ACHIEVEMENTS: 'mathFunAchievements'
    },

    /**
     * Lesson definitions - used to track progress
     */
    LESSONS: [
        { id: 'multiplication-intro', name: 'Multiplication Basics', category: 'basics' },
        { id: 'division-intro', name: 'Division Basics', category: 'basics' },
        { id: 'times-tables', name: 'Times Tables', category: 'basics' },
        { id: 'concrete', name: 'Concrete Learning', category: 'cra' },
        { id: 'representational', name: 'Representational Learning', category: 'cra' },
        { id: 'abstract', name: 'Abstract Learning', category: 'cra' }
    ],

    /**
     * Game definitions
     */
    GAMES: [
        { id: 'quiz', name: 'Math Quiz Challenge' },
        { id: 'match', name: 'Fact Match' },
        { id: 'bingo', name: 'Math Bingo' }
    ],

    /**
     * Achievement definitions
     */
    ACHIEVEMENTS: [
        { 
            id: 'multiplication-master', 
            name: 'Multiplication Master', 
            description: 'Complete all multiplication lessons',
            condition: 'lessons',
            required: ['multiplication-intro', 'times-tables']
        },
        { 
            id: 'division-pro', 
            name: 'Division Pro', 
            description: 'Complete all division lessons',
            condition: 'lessons',
            required: ['division-intro']
        },
        { 
            id: 'cra-expert', 
            name: 'Learning Method Expert', 
            description: 'Complete all C-R-A learning method lessons',
            condition: 'lessons',
            required: ['concrete', 'representational', 'abstract']
        },
        { 
            id: 'quiz-ace', 
            name: 'Quiz Ace', 
            description: 'Score 100% on Math Quiz',
            condition: 'game',
            game: 'quiz',
            criteria: 'percentage',
            required: 100
        },
        { 
            id: 'game-enthusiast', 
            name: 'Game Enthusiast', 
            description: 'Play all three games',
            condition: 'games-played',
            required: ['quiz', 'match', 'bingo']
        }
    ],

    /**
     * Mark a lesson as completed
     * @param {string} lessonId - ID of the completed lesson
     * @param {Object} data - Additional lesson data
     */
    completedLesson: function(lessonId, data = {}) {
        const lessons = this.getLessonsProgress();
        
        lessons[lessonId] = {
            completed: true,
            timestamp: new Date().toISOString(),
            ...data
        };
        
        localStorage.setItem(this.STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
        this.updateAchievements();
    },

    /**
     * Save game results
     * @param {string} gameId - ID of the game
     * @param {Object} results - Game results data
     */
    saveGameResults: function(gameId, results) {
        const games = this.getGamesProgress();
        
        if (!games[gameId]) {
            games[gameId] = {
                played: 0,
                lastPlayed: null,
                bestResults: null,
                history: []
            };
        }
        
        // Update game stats
        games[gameId].played++;
        games[gameId].lastPlayed = new Date().toISOString();
        
        // Keep track of best results
        if (!games[gameId].bestResults || 
            (results.score !== undefined && results.score > games[gameId].bestResults.score)) {
            games[gameId].bestResults = { ...results };
        }
        
        // Add to history (limit to 10 entries)
        games[gameId].history.unshift({
            timestamp: new Date().toISOString(),
            ...results
        });
        
        if (games[gameId].history.length > 10) {
            games[gameId].history = games[gameId].history.slice(0, 10);
        }
        
        localStorage.setItem(this.STORAGE_KEYS.GAMES, JSON.stringify(games));
        this.updateAchievements();
    },

    /**
     * Get lesson progress data
     * @returns {Object} Lesson progress data
     */
    getLessonsProgress: function() {
        const data = localStorage.getItem(this.STORAGE_KEYS.LESSONS);
        return data ? JSON.parse(data) : {};
    },

    /**
     * Get games progress data
     * @returns {Object} Games progress data
     */
    getGamesProgress: function() {
        const data = localStorage.getItem(this.STORAGE_KEYS.GAMES);
        return data ? JSON.parse(data) : {};
    },

    /**
     * Get achievement data
     * @returns {Object} Achievement data
     */
    getAchievements: function() {
        const data = localStorage.getItem(this.STORAGE_KEYS.ACHIEVEMENTS);
        return data ? JSON.parse(data) : {};
    },

    /**
     * Calculate overall progress percentage
     * @returns {number} Progress percentage (0-100)
     */
    getOverallProgress: function() {
        const lessons = this.getLessonsProgress();
        const totalLessons = this.LESSONS.length;
        let completedLessons = 0;
        
        this.LESSONS.forEach(lesson => {
            if (lessons[lesson.id] && lessons[lesson.id].completed) {
                completedLessons++;
            }
        });
        
        return Math.round((completedLessons / totalLessons) * 100);
    },

    /**
     * Update achievements based on current progress
     */
    updateAchievements: function() {
        const lessons = this.getLessonsProgress();
        const games = this.getGamesProgress();
        const achievements = this.getAchievements() || {};
        let updated = false;
        
        // Check each achievement
        this.ACHIEVEMENTS.forEach(achievement => {
            // Skip already unlocked achievements
            if (achievements[achievement.id] && achievements[achievement.id].unlocked) {
                return;
            }
            
            let unlocked = false;
            
            // Check lesson completion achievements
            if (achievement.condition === 'lessons') {
                unlocked = achievement.required.every(lessonId => 
                    lessons[lessonId] && lessons[lessonId].completed
                );
            }
            
            // Check game-specific achievements
            else if (achievement.condition === 'game' && games[achievement.game]) {
                const gameData = games[achievement.game];
                
                if (achievement.criteria === 'percentage' && 
                    gameData.bestResults && 
                    gameData.bestResults.percentage >= achievement.required) {
                    unlocked = true;
                }
            }
            
            // Check achievements for playing multiple games
            else if (achievement.condition === 'games-played') {
                unlocked = achievement.required.every(gameId => 
                    games[gameId] && games[gameId].played > 0
                );
            }
            
            // If achievement unlocked, record it
            if (unlocked) {
                achievements[achievement.id] = {
                    unlocked: true,
                    timestamp: new Date().toISOString()
                };
                updated = true;
            }
        });
        
        // Save updated achievements
        if (updated) {
            localStorage.setItem(this.STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        }
    },

    /**
     * Get recent activity (lessons completed and games played)
     * @param {number} limit - Maximum number of items to return
     * @returns {Array} Recent activity items
     */
    getRecentActivity: function(limit = 5) {
        const activities = [];
        const lessons = this.getLessonsProgress();
        const games = this.getGamesProgress();
        
        // Add completed lessons
        Object.keys(lessons).forEach(lessonId => {
            const lesson = lessons[lessonId];
            const lessonInfo = this.LESSONS.find(l => l.id === lessonId);
            
            if (lesson.completed && lessonInfo) {
                activities.push({
                    type: 'lesson',
                    id: lessonId,
                    name: lessonInfo.name,
                    timestamp: lesson.timestamp,
                    data: lesson
                });
            }
        });
        
        // Add game history
        Object.keys(games).forEach(gameId => {
            const game = games[gameId];
            const gameInfo = this.GAMES.find(g => g.id === gameId);
            
            if (game.history && game.history.length > 0 && gameInfo) {
                game.history.forEach(historyItem => {
                    activities.push({
                        type: 'game',
                        id: gameId,
                        name: gameInfo.name,
                        timestamp: historyItem.timestamp,
                        data: historyItem
                    });
                });
            }
        });
        
        // Sort by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Limit the number of activities
        return activities.slice(0, limit);
    },
    
    /**
     * Format a timestamp into a readable string
     * @param {string} timestamp - ISO timestamp
     * @returns {string} Formatted date string
     */
    formatTimestamp: function(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
};

// For testing - uncomment to add sample data
/*
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for testing
    ProgressTracker.completedLesson('multiplication-intro', { score: 95 });
    ProgressTracker.completedLesson('concrete', { score: 100 });
    ProgressTracker.saveGameResults('quiz', { score: 8, total: 10, percentage: 80 });
    ProgressTracker.saveGameResults('match', { pairs: 8, moves: 14, timeElapsed: 45 });
});
*/
