document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables from localStorage
    let points = parseInt(localStorage.getItem('points')) || 0;
    let badges = JSON.parse(localStorage.getItem('badges')) || [];
    const userName = localStorage.getItem('userName');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

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
            points += 10;
            document.getElementById('basic-result').textContent = 'Great job! You earned 10 points!';
            checkBadge('Division Beginner');
        } else {
            document.getElementById('basic-result').textContent = 'Not quite! 12 ÷ 3 = 4';
        }
        updateProgress();
    });

    // Division with Remainders
    document.getElementById('check-remainder').addEventListener('click', function() {
        const answer = parseInt(document.getElementById('remainder-answer').value);
        const remainder = parseInt(document.getElementById('remainder-left').value);
        if (answer === 3 && remainder === 1) {
            points += 10;
            document.getElementById('remainder-result').textContent = 'Awesome! You earned 10 points!';
            checkBadge('Remainder Rookie');
        } else {
            document.getElementById('remainder-result').textContent = 'Oops! 13 ÷ 4 = 3 with 1 left';
        }
        updateProgress();
    });

    // Advanced Division Practice
    document.getElementById('check-advanced').addEventListener('click', function() {
        const answer = parseInt(document.getElementById('advanced-answer').value);
        if (answer === 4) {
            points += 10;
            document.getElementById('advanced-result').textContent = 'Well done! You earned 10 points!';
            checkBadge('Division Pro');
        } else {
            document.getElementById('advanced-result').textContent = 'Keep trying! 24 ÷ 6 = 4';
        }
        updateProgress();
    });

    // Functions
    function showWelcome(name) {
        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('user-name').textContent = name;
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('start-button').style.display = 'none';
    }

    function updateProgress() {
        localStorage.setItem('points', points);
        document.getElementById('points').textContent = points;
        document.getElementById('points-sidebar').textContent = points;
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