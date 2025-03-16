var score = 0;
var correctAnswer;

function generateProblem() {
    var tableNum = Math.floor(Math.random() * 10) + 2; // Random table from 2 to 11
    var multiplier = Math.floor(Math.random() * 12) + 1; // Random multiplier from 1 to 12
    document.getElementById('problem').innerText = tableNum + ' x ' + multiplier + ' = ?';
    correctAnswer = tableNum * multiplier;
    generateOptions();
}

function generateOptions() {
    var options = [correctAnswer];
    while (options.length < 3) {
        var wrongAnswer = Math.floor(Math.random() * 144) + 1; // Random number between 1 and 144
        if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    shuffle(options);
    displayOptions(options);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayOptions(options) {
    var optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    options.forEach(function(option) {
        var button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', function() {
            checkAnswer(option);
        });
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selected) {
    if (selected === correctAnswer) {
        document.getElementById('feedback').innerText = '✅ Correct!';
        document.getElementById('feedback').style.color = 'green';
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
    } else {
        document.getElementById('feedback').innerText = '❌ Incorrect. The correct answer is ' + correctAnswer;
        document.getElementById('feedback').style.color = 'red';
    }
    setTimeout(function() {
        document.getElementById('feedback').innerText = '';
        generateProblem();
    }, 2000); // Wait 2 seconds before next problem
}

// Start the game
generateProblem();