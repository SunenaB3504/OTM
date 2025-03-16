var score = 0;
var correctAnswer;

function generateTable(tableNumber) {
    var tableHTML = '<table><tr>';
    for (var i = 1; i <= 6; i++) {
        tableHTML += '<td>' + tableNumber + ' x ' + i + ' = ' + (tableNumber * i) + '</td>';
    }
    tableHTML += '</tr><tr>';
    for (var i = 7; i <= 12; i++) {
        tableHTML += '<td>' + tableNumber + ' x ' + i + ' = ' + (tableNumber * i) + '</td>';
    }
    tableHTML += '</tr></table>';
    document.getElementById('tableDisplay').innerHTML = tableHTML;
}

function generateProblem(specificTable) {
    var tableNum = specificTable || Math.floor(Math.random() * 10) + 2; // 2 to 11
    var multiplier = Math.floor(Math.random() * 12) + 1; // 1 to 12
    document.getElementById('problem').innerText = tableNum + ' x ' + multiplier + ' = ?';
    correctAnswer = tableNum * multiplier;
}

function checkAnswer() {
    var userAnswer = parseInt(document.getElementById('userAnswer').value);
    if (isNaN(userAnswer)) {
        document.getElementById('feedback').innerText = 'Please enter a number.';
        document.getElementById('feedback').style.color = 'black';
        return;
    }
    if (userAnswer === correctAnswer) {
        document.getElementById('feedback').innerText = '✅ Correct!';
        document.getElementById('feedback').style.color = 'green';
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
    } else {
        document.getElementById('feedback').innerText = '❌ Incorrect. The correct answer is ' + correctAnswer;
        document.getElementById('feedback').style.color = 'red';
    }
}

function nextProblem() {
    document.getElementById('feedback').innerText = '';
    document.getElementById('userAnswer').value = '';
    if (typeof tableNumber !== 'undefined') {
        generateProblem(tableNumber);
    } else {
        generateProblem();
    }
    document.getElementById('userAnswer').focus();
}

// Add event listeners
document.getElementById('checkButton').addEventListener('click', checkAnswer);
document.getElementById('nextButton').addEventListener('click', nextProblem);