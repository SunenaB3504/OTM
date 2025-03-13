/**
 * Progress Page Script
 * Handles the display of user progress
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the progress page
    initProgressPage();
    
    // Add event listeners
    setupEventListeners();
});

/**
 * Initialize the progress page content
 */
function initProgressPage() {
    updateOverallProgress();
    populateLessonProgress();
    populateGameStats();
    populateAchievements();
    populateRecentActivity();
}

/**
 * Update the overall progress display
 */
function updateOverallProgress() {
    const progressBar = document.getElementById('overall-progress-bar');
    const progressMessage = document.getElementById('progress-message');
    
    if (!progressBar || !progressMessage) return;
    
    const progress = ProgressTracker.getOverallProgress();
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${progress}%`;
    
    // Update message based on progress
    if (progress === 0) {
        progressMessage.textContent = "You haven't started any lessons yet. Let's begin!";
    } else if (progress < 25) {
        progressMessage.textContent = "You're just getting started. Keep going!";
    } else if (progress < 50) {
        progressMessage.textContent = "You're making good progress!";
    } else if (progress < 75) {
        progressMessage.textContent = "Great work! You've completed most of the lessons.";
    } else if (progress < 100) {
        progressMessage.textContent = "Almost there! Just a few more lessons to go.";
    } else {
        progressMessage.textContent = "You've completed all lessons! Amazing work!";
    }
}

/**
 * Populate the lesson progress section
 */
function populateLessonProgress() {
    const basicsList = document.getElementById('basics-lessons');
    const craList = document.getElementById('cra-lessons');
    
    if (!basicsList || !craList) return;
    
    const lessons = ProgressTracker.getLessonsProgress();
    
    // Clear existing content
    basicsList.innerHTML = '';
    craList.innerHTML = '';
    
    // Process each lesson by category
    ProgressTracker.LESSONS.forEach(lesson => {
        const isCompleted = lessons[lesson.id] && lessons[lesson.id].completed;
        const lessonItem = createLessonItem(lesson, isCompleted);
        
        if (lesson.category === 'basics') {
            basicsList.appendChild(lessonItem);
        } else if (lesson.category === 'cra') {
            craList.appendChild(lessonItem);
        }
    });
}

/**
 * Create a lesson list item
 * @param {Object} lesson - Lesson data
 * @param {boolean} isCompleted - Whether the lesson is completed
 * @returns {HTMLElement} The lesson list item
 */
function createLessonItem(lesson, isCompleted) {
    const item = document.createElement('div');
    item.className = `progress-item ${isCompleted ? 'completed' : ''}`;
    
    const iconClass = isCompleted ? 'fa-check-circle' : 'fa-circle';
    const iconColor = isCompleted ? 'completed' : '';
    
    item.innerHTML = `
        <i class="fas ${iconClass} ${iconColor}"></i>
        <span>${lesson.name}</span>
        ${isCompleted ? '<span class="status">Completed</span>' : '<span class="status">Not started</span>'}
    `;
    
    return item;
}

/**
 * Populate the game statistics section
 */
function populateGameStats() {
    const gamesStats = document.getElementById('games-stats');
    
    if (!gamesStats) return;
    
    const games = ProgressTracker.getGamesProgress();
    
    // Clear existing content
    gamesStats.innerHTML = '';
    
    // Process each game
    ProgressTracker.GAMES.forEach(game => {
        const gameData = games[game.id];
        const gameItem = document.createElement('div');
        gameItem.className = 'progress-game-item';
        
        if (gameData && gameData.played > 0) {
            let bestResult = '';
            
            // Format best result based on game type
            if (game.id === 'quiz' && gameData.bestResults) {
                bestResult = `Best Score: ${gameData.bestResults.percentage}%`;
            } else if (game.id === 'match' && gameData.bestResults) {
                bestResult = `Best: ${gameData.bestResults.moves} moves`;
            } else if (game.id === 'bingo' && gameData.bestResults) {
                bestResult = `Best Time: ${GameUtils ? GameUtils.formatTime(gameData.bestResults.timeElapsed) : gameData.bestResults.timeElapsed + 's'}`;
            }
            
            gameItem.innerHTML = `
                <div class="game-icon"><i class="fas fa-gamepad"></i></div>
                <div class="game-info">
                    <h4>${game.name}</h4>
                    <p>Played ${gameData.played} times</p>
                    <p class="best-result">${bestResult}</p>
                </div>
            `;
        } else {
            gameItem.innerHTML = `
                <div class="game-icon"><i class="fas fa-gamepad"></i></div>
                <div class="game-info">
                    <h4>${game.name}</h4>
                    <p>Not played yet</p>
                </div>
            `;
        }
        
        gamesStats.appendChild(gameItem);
    });
}

/**
 * Populate the achievements section
 */
function populateAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    
    if (!achievementsContainer) return;
    
    const achievements = ProgressTracker.getAchievements();
    
    // Clear existing content
    achievementsContainer.innerHTML = '';
    
    // Add heading
    const heading = document.createElement('h3');
    heading.innerHTML = '<i class="fas fa-trophy"></i> Achievements';
    achievementsContainer.appendChild(heading);
    
    // Process each achievement
    ProgressTracker.ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = achievements[achievement.id] && achievements[achievement.id].unlocked;
        
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-card ${isUnlocked ? '' : 'locked'}`;
        
        const icon = isUnlocked ? 'fa-trophy achievement-icon completed' : 'fa-lock achievement-icon';
        
        achievementCard.innerHTML = `
            <i class="fas ${icon}"></i>
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
        `;
        
        achievementsContainer.appendChild(achievementCard);
    });
}

/**
 * Populate the recent activity section
 */
function populateRecentActivity() {
    const activityTimeline = document.getElementById('activity-timeline');
    
    if (!activityTimeline) return;
    
    const activities = ProgressTracker.getRecentActivity(5);
    
    // Clear existing content
    activityTimeline.innerHTML = '';
    
    if (activities.length === 0) {
        activityTimeline.innerHTML = `
            <div class="activity-empty">
                <p>No activities recorded yet. Start learning and playing to see your activity here!</p>
            </div>
        `;
        return;
    }
    
    // Process each activity
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        let icon, title, details;
        
        if (activity.type === 'lesson') {
            icon = 'fa-check-circle';
            title = `Completed "${activity.name}"`;
            details = activity.data.score ? `Score: ${activity.data.score}%` : '';
        } else if (activity.type === 'game') {
            icon = 'fa-gamepad';
            title = `Played "${activity.name}"`;
            
            if (activity.id === 'quiz') {
                details = `Score: ${activity.data.score}/${activity.data.total}`;
            } else if (activity.id === 'match') {
                details = `Pairs: ${activity.data.pairs}, Moves: ${activity.data.moves}`;
            } else if (activity.id === 'bingo') {
                details = `Board Size: ${activity.data.boardSize}×${activity.data.boardSize}`;
            }
        }
        
        activityItem.innerHTML = `
            <i class="fas ${icon} activity-icon"></i>
            <div class="activity-content">
                <h4>${title}</h4>
                ${details ? `<p>${details}</p>` : ''}
                <p>${ProgressTracker.formatTimestamp(activity.timestamp)}</p>
            </div>
        `;
        
        activityTimeline.appendChild(activityItem);
    });
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    const resetButton = document.getElementById('reset-progress');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all progress data? This cannot be undone.')) {
                localStorage.removeItem(ProgressTracker.STORAGE_KEYS.LESSONS);
                localStorage.removeItem(ProgressTracker.STORAGE_KEYS.GAMES);
                localStorage.removeItem(ProgressTracker.STORAGE_KEYS.ACHIEVEMENTS);
                initProgressPage();
                alert('Progress data has been reset.');
            }
        });
    }
    
    const detailsButton = document.getElementById('view-details');
    if (detailsButton) {
        detailsButton.addEventListener('click', function() {
            alert('Detailed statistics feature coming soon!');
            // Future expansion: Add modal with detailed progress charts and statistics
        });
    }
}
