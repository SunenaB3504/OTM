document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables from localStorage
    let points = parseInt(localStorage.getItem('points')) || 0;
    let badges = JSON.parse(localStorage.getItem('badges')) || [];
    const userName = localStorage.getItem('userName');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Enhanced points system
    let pointsHistory = JSON.parse(localStorage.getItem('pointsHistory')) || [];
    const pointsThresholds = [100, 250, 500, 1000, 2000];

    function addPoints(amount, reason) {
        points += amount;
        
        // Add to points history
        const historyItem = {
            date: new Date().toISOString(),
            amount: amount,
            reason: reason,
            total: points
        };
        pointsHistory.push(historyItem);
        
        // Limit history to last 20 entries
        if (pointsHistory.length > 20) {
            pointsHistory.shift();
        }
        
        // Save to localStorage
        localStorage.setItem('pointsHistory', JSON.stringify(pointsHistory));
        
        // Update displays
        updateProgress();
        
        // Show notification
        showPointsNotification(amount);
        
        // Animate points counter
        animatePointsCounter();
        
        // Check for point threshold rewards
        checkPointsThresholds();
    }

    function showPointsNotification(amount) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.textContent = `+${amount} points!`;
        document.body.appendChild(notification);
        
        // Remove notification after animation completes
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    function animatePointsCounter() {
        const pointsElements = [
            document.getElementById('points'),
            document.getElementById('points-sidebar')
        ];
        
        pointsElements.forEach(el => {
            if (el) {
                el.classList.add('point-increment');
                setTimeout(() => {
                    el.classList.remove('point-increment');
                }, 600);
            }
        });
    }

    function updateProgressBars() {
        // Find the next threshold
        let nextThreshold = pointsThresholds.find(t => t > points) || pointsThresholds[pointsThresholds.length - 1];
        let previousThreshold = pointsThresholds[pointsThresholds.indexOf(nextThreshold) - 1] || 0;
        
        // Calculate progress percentage
        const range = nextThreshold - previousThreshold;
        const progress = ((points - previousThreshold) / range) * 100;
        
        // Update progress bars
        const pointsBar = document.getElementById('points-bar');
        const sidebarPointsBar = document.getElementById('sidebar-points-bar');
        
        if (pointsBar) pointsBar.style.width = `${Math.min(progress, 100)}%`;
        if (sidebarPointsBar) sidebarPointsBar.style.width = `${Math.min(progress, 100)}%`;
        
        // Update next reward text
        const nextRewardElement = document.getElementById('next-reward-points');
        if (nextRewardElement) nextRewardElement.textContent = nextThreshold;
    }

    function updatePointsHistory() {
        const pointsLog = document.getElementById('points-log');
        if (!pointsLog) return;
        
        // Clear previous entries
        pointsLog.innerHTML = '';
        
        // Add history entries in reverse order (newest first)
        const recentHistory = [...pointsHistory].reverse();
        
        recentHistory.forEach(item => {
            const entry = document.createElement('li');
            const date = new Date(item.date);
            const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
            entry.innerHTML = `
                <span>${item.reason}</span>
                <span>+${item.amount} (${formattedDate})</span>
            `;
            pointsLog.appendChild(entry);
        });
    }

    function checkPointsThresholds() {
        pointsThresholds.forEach(threshold => {
            if (points >= threshold) {
                const badgeName = `${threshold} Points Club`;
                checkBadge(badgeName);
            }
        });
    }

    // Update progress display
    updateProgress();

    // Handle login
    if (userName) {
        showWelcome(userName);
    }
    document.getElementById('start-button').addEventListener('click', function() {
        const name = document.getElementById('name-input').value.trim();
        if (name) {
            localStorage.setItem('userName', name);
            showWelcome(name);
        }
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            sections.forEach(section => section.style.display = 'none');
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // Quick links to games
    document.querySelectorAll('.game-link').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            sections.forEach(s => s.style.display = 'none');
            document.getElementById(section).style.display = 'block';
            // Placeholder for game-specific logic
            document.getElementById('game-area').textContent = `Playing ${this.getAttribute('data-game')} (Coming soon!)`;
        });
    });

    // Font size adjustment
    let fontSize = 16;
    document.getElementById('increase-font').addEventListener('click', function() {
        fontSize += 2;
        document.body.style.fontSize = `${fontSize}px`;
    });
    document.getElementById('decrease-font').addEventListener('click', function() {
        if (fontSize > 10) {
            fontSize -= 2;
            document.body.style.fontSize = `${fontSize}px`;
        }
    });

    // Multiplication Quiz
    document.getElementById('submit-mult-quiz').addEventListener('click', function() {
        const answer = parseInt(document.getElementById('mult-answer').value);
        if (answer === 12) {
            points += 10;
            document.getElementById('mult-result').textContent = 'Correct! You earned 10 points!';
            checkBadge('Multiplication Star');
        } else {
            document.getElementById('mult-result').textContent = 'Try again! 3 × 4 = 12';
        }
        updateProgress();
    });

    // Basic Division Practice
    document.getElementById('check-basic').addEventListener('click', function() {
        const answer = parseInt(document.getElementById('basic-answer').value);
        if (answer === 4) {
            addPoints(10, "Basic Division: Correct answer for 12 ÷ 3");
            document.getElementById('basic-result').textContent = 'Great job! You earned 10 points!';
            checkBadge('Division Beginner');
        } else {
            document.getElementById('basic-result').textContent = 'Not quite! 12 ÷ 3 = 4';
        }
    });

    // Division with Remainders
    document.getElementById('check-remainder').addEventListener('click', function() {
        const answer = parseInt(document.getElementById('remainder-answer').value);
        const remainder = parseInt(document.getElementById('remainder-left').value);
        if (answer === 3 && remainder === 1) {
            addPoints(15, "Division with Remainders: Correct answer for 13 ÷ 4");
            document.getElementById('remainder-result').textContent = 'Awesome! You earned 15 points!';
            checkBadge('Remainder Rookie');
        } else {
            document.getElementById('remainder-result').textContent = 'Oops! 13 ÷ 4 = 3 with 1 left';
        }
    });

    // Advanced Division Practice
    document.getElementById('check-advanced').addEventListener('click', function() {
        const answer = parseInt(document.getElementById('advanced-answer').value);
        if (answer === 4) {
            addPoints(20, "Advanced Division: Correct answer for 24 ÷ 6");
            document.getElementById('advanced-result').textContent = 'Well done! You earned 20 points!';
            checkBadge('Division Pro');
        } else {
            document.getElementById('advanced-result').textContent = 'Keep trying! 24 ÷ 6 = 4';
        }
    });

    // Functions
    function showWelcome(name) {
        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('user-name').textContent = name;
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('start-button').style.display = 'none';
    }

    // Update the existing updateProgress function
    function updateProgress() {
        localStorage.setItem('points', points);
        document.getElementById('points').textContent = points;
        document.getElementById('points-sidebar').textContent = points;
        
        updateProgressBars();
        updatePointsHistory();
        displayBadges();
    }

    function checkBadge(badgeName) {
        if (!badges.includes(badgeName)) {
            badges.push(badgeName);
            localStorage.setItem('badges', JSON.stringify(badges));
            displayBadges();
        }
    }

    function displayBadges() {
        const badgesList = document.getElementById('badges');
        const badgesSidebar = document.getElementById('badges-sidebar');
        badgesList.innerHTML = '';
        badgesSidebar.innerHTML = '';
        badges.forEach(badge => {
            const li = document.createElement('li');
            li.textContent = badge;
            badgesList.appendChild(li.cloneNode(true));
            badgesSidebar.appendChild(li);
        });
    }

    // Text-to-speech
    window.readText = function(elementId) {
        if ('speechSynthesis' in window) {
            const text = document.getElementById(elementId).textContent;
            const utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
        } else {
            alert('Sorry, text-to-speech is not supported in your browser.');
        }
    };
});

// Multiplication Quiz Functionality
document.addEventListener('DOMContentLoaded', function() {
    const submitMultQuizBtn = document.getElementById('submit-mult-quiz');
    const multResult = document.getElementById('mult-result');
    
    if (submitMultQuizBtn) {
        submitMultQuizBtn.addEventListener('click', function() {
            const quizAnswers = document.querySelectorAll('.quiz-answer');
            let correctAnswers = 0;
            let totalQuestions = quizAnswers.length;
            
            quizAnswers.forEach(answer => {
                const userAnswer = parseInt(answer.value);
                const correctAnswer = parseInt(answer.dataset.correct);
                
                if (userAnswer === correctAnswer) {
                    correctAnswers++;
                    answer.style.backgroundColor = '#d4edda';
                    answer.style.borderColor = '#c3e6cb';
                } else {
                    answer.style.backgroundColor = '#f8d7da';
                    answer.style.borderColor = '#f5c6cb';
                }
            });
            
            // Calculate points based on correct answers
            const earnedPoints = correctAnswers * 5;
            
            // Display result and add points
            const percentage = Math.round((correctAnswers / totalQuestions) * 100);
            multResult.innerHTML = `You got ${correctAnswers} out of ${totalQuestions} correct (${percentage}%)!`;
            
            if (correctAnswers > 0) {
                addPoints(earnedPoints, `Multiplication Quiz: ${correctAnswers} correct answers`);
                
                if (percentage >= 80) {
                    checkBadge('Multiplication Star');
                }
            }
            
            if (percentage >= 80) {
                multResult.style.color = '#28a745';
            } else if (percentage >= 60) {
                multResult.style.color = '#ffc107';
            } else {
                multResult.style.color = '#dc3545';
            }
        });
    }
});